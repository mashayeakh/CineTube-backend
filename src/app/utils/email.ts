import { Resend } from 'resend';
import { envVars } from '../config/env';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ejs from 'ejs';
import { AppError } from '../errorHelpers/AppError';
import status from 'http-status';

const resend = new Resend(envVars.RESEND_API_KEY);

interface sendEmailOptions {
    to: string;
    subject: string;
    templateName: string;
    templateData?: Record<string, any>;
    attachments?: {
        filename: string;
        content: Buffer | string;
        contentType: string;
    }[];
}

export const sendEmail = async ({
    to,
    subject,
    templateName,
    templateData,
    attachments,
}: sendEmailOptions) => {
    try {
        // ── Resolve template path ────────────────────────────────────────
        const builtPath = path.resolve(process.cwd(), "dist/src/app/templates", `${templateName}.ejs`);
        const sourcePath = path.resolve(process.cwd(), "src/app/templates", `${templateName}.ejs`);
        const currentFileDir = path.dirname(fileURLToPath(import.meta.url));
        const relativeTemplatePath = path.resolve(currentFileDir, "../templates", `${templateName}.ejs`);

        let templatePath = "";
        if (fs.existsSync(builtPath)) templatePath = builtPath;
        else if (fs.existsSync(sourcePath)) templatePath = sourcePath;
        else if (fs.existsSync(relativeTemplatePath)) templatePath = relativeTemplatePath;

        if (!templatePath) {
            console.error(`[Email] ❌ Template not found: ${templateName}`, { builtPath, sourcePath });
            throw new AppError(status.INTERNAL_SERVER_ERROR, `Email template ${templateName} not found`);
        }

        console.log(`[Email] Using template: ${templatePath}`);

        const html = await ejs.renderFile(templatePath, templateData);

        // ── Send via Resend HTTP API ──────────────────────────────────────
        console.log(`[Email] Sending to ${to} via Resend...`);

        const { data, error } = await resend.emails.send({
            from: envVars.RESEND_FROM_EMAIL, // e.g. "CineTube <noreply@yourdomain.com>"
            to,
            subject,
            html,
            attachments: attachments?.map((a) => ({
                filename: a.filename,
                content: a.content as string,
            })),
        });

        if (error) {
            console.error(`[Email] ❌ Resend API error:`, error);
            throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email");
        }

        console.log(`[Email] ✅ Email sent to ${to} — id=${data?.id}`);

    } catch (error: any) {
        console.error("[Email] ❌ sendEmail failed:", {
            message: error?.message,
            stack: error?.stack,
            templateName,
        });
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email");
    }
};