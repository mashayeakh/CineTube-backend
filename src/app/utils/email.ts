import nodemailer from 'nodemailer';
import { envVars } from '../config/env';
import fs from 'node:fs';
import path from 'node:path';
import ejs from 'ejs'
import { AppError } from '../errorHelpers/AppError';
import status from 'http-status';

//transporter 
const transporter = nodemailer.createTransport({
    host: envVars.EMAIL_SENDER.SMTP_HOST,
    port: parseInt(envVars.EMAIL_SENDER.SMTP_PORT),
    secure: parseInt(envVars.EMAIL_SENDER.SMTP_PORT) === 465,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
})

//interface for email options
interface sendEmailOptions {
    to: string,
    subject: string,
    templateName: string,
    templateData?: Record<string, any>
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string;
    }[]
}

//send email
export const sendEmail = async ({
    to,
    subject,
    templateName,
    templateData,
    attachments
}: sendEmailOptions) => {
    try {
        //set the template path - support both source and built output locations
        const sourcePath = path.resolve(process.cwd(), "src/app/templates", `${templateName}.ejs`);
        const builtPath = path.resolve(process.cwd(), "dist/src/app/templates", `${templateName}.ejs`);
        const templatePath = fs.existsSync(builtPath) ? builtPath : sourcePath;

        console.log(`Attempting to render email template from: ${builtPath}`);
        console.log(`Fallback source template path: ${sourcePath}`);
        console.log(`Using template path: ${templatePath}`);

        const html = await ejs.renderFile(templatePath, templateData)

        //send the email now
        const info = await transporter.sendMail({
            from: envVars.EMAIL_SENDER.SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map((attachment) => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType
            }))
        })

        console.log(`----Email sent to ${to} :${info.messageId}`)

        console.log(`----Email sent to ${to} with subject "${subject}" using template "${templateName}"`)

    } catch (error: any) {
        console.error("Email sending error", {
            message: error?.message,
            stack: error?.stack,
            code: error?.code ?? null,
            response: error?.response ?? null,
        });
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email")
    }
}