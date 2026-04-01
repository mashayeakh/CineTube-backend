import { AppError } from "@/app/errorHelpers/AppError";
import { prisma } from "@/app/lib/prisma";
import status from "http-status";
import { PaymentStatus, SubscriptionStatus, SubscriptionType, UserRole } from "prisma/generated/prisma/enums";
import Stripe from "stripe";
import { stripe } from "@/app/config/stripe.config";
import { envVars } from "@/app/config/env";

const SUBSCRIPTION_PRICE = {
    MONTHLY: { amount: 9.99, amountInCents: 999, label: "Monthly" },
    YEARLY: { amount: 99.99, amountInCents: 9999, label: "Yearly" }
};

const calculateSubscriptionEndDate = (startDate: Date, type: SubscriptionType) => {
    const endDate = new Date(startDate);

    if (type === SubscriptionType.YEARLY) {
        endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
        endDate.setMonth(endDate.getMonth() + 1);
    }

    return endDate;
};

export const PaymentService = {
    async createSubscriptionCheckoutSession(userId: string, type: SubscriptionType = SubscriptionType.MONTHLY) {
        const plan = SUBSCRIPTION_PRICE[type as keyof typeof SUBSCRIPTION_PRICE];
        if (!plan) {
            throw new AppError(status.BAD_REQUEST, "Invalid subscription type");
        }

        const now = new Date();
        const endDate = calculateSubscriptionEndDate(now, type);
        const pendingTransactionId = `pending_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

        const { paymentId, subscriptionId } = await prisma.$transaction(async (tx) => {
            const subscription = await tx.subscription.create({
                data: {
                    userId,
                    type,
                    status: SubscriptionStatus.PENDING,
                    startDate: now,
                    endDate
                }
            });

            const payment = await tx.payment.create({
                data: {
                    userId,
                    subscriptionId: subscription.id,
                    amount: plan.amount,
                    status: PaymentStatus.PENDING,
                    transactionId: pendingTransactionId
                }
            });

            return { paymentId: payment.id, subscriptionId: subscription.id };
        });

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `CineTube ${plan.label} Subscription`
                        },
                        unit_amount: plan.amountInCents
                    },
                    quantity: 1
                }
            ],
            success_url: `${envVars.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${envVars.FRONTEND_URL}/payment/cancel`,
            metadata: {
                userId,
                paymentId,
                subscriptionId,
                subscriptionType: type
            }
        });

        await prisma.payment.update({
            where: { id: paymentId },
            data: {
                transactionId: session.id
            }
        });

        return {
            checkoutUrl: session.url,
            paymentId,
            subscriptionId
        };
    },

    constructWebhookEvent(rawBody: Buffer, signature: string) {
        return stripe.webhooks.constructEvent(
            rawBody,
            signature,
            envVars.STRIPE.STRIPE_WEBHOOK_SECRET
        );
    },

    async verifyCheckoutSession(sessionId: string) {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== "paid") {
            throw new AppError(status.BAD_REQUEST, "Payment not completed");
        }

        const paymentId = session.metadata?.paymentId;
        const subscriptionId = session.metadata?.subscriptionId;

        if (!paymentId || !subscriptionId) {
            throw new AppError(status.BAD_REQUEST, "Missing payment or subscription metadata");
        }

        const existingPayment = await prisma.payment.findUnique({
            where: { id: paymentId }
        });

        if (!existingPayment) {
            throw new AppError(status.NOT_FOUND, "Payment not found");
        }

        if (existingPayment.status === PaymentStatus.COMPLETED) {
            return { message: "Payment already verified" };
        }

        await prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: PaymentStatus.COMPLETED,
                transactionId: session.id
            }
        });

        return { message: "Payment verified. Subscription will be activated by admin." };
    },

    async handleStripeWebhookEvent(event: Stripe.Event) {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            const paymentId = session.metadata?.paymentId;
            const subscriptionId = session.metadata?.subscriptionId;

            if (!paymentId || !subscriptionId) {
                return { message: "Missing payment or subscription metadata" };
            }

            const existingPayment = await prisma.payment.findUnique({
                where: { id: paymentId }
            });

            if (!existingPayment) {
                return { message: "Payment not found" };
            }

            if (existingPayment.status === PaymentStatus.COMPLETED) {
                return { message: "Event already processed" };
            }

            await prisma.payment.update({
                where: { id: paymentId },
                data: {
                    status: PaymentStatus.COMPLETED,
                    transactionId: session.id
                }
            });

            return { message: "checkout.session.completed processed" };
        }

        if (event.type === "checkout.session.expired") {
            const session = event.data.object as Stripe.Checkout.Session;
            const paymentId = session.metadata?.paymentId;

            if (paymentId) {
                await prisma.payment.updateMany({
                    where: { id: paymentId, status: PaymentStatus.PENDING },
                    data: { status: PaymentStatus.FAILED }
                });
            }

            return { message: "checkout.session.expired processed" };
        }

        return { message: `Unhandled event: ${event.type}` };
    }
};