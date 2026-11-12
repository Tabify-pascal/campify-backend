/**
 * @file mailService.ts
 * @author Pascal Thomasse Mol
 * @since 2026-09-15
 */

import nodemailer from "nodemailer";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

type SendMailOptions = {
    to: string | string[];
    subject: string;
    text: string;
    html?: string;
};

const mailEnabled = process.env.MAIL_ENABLED === "true";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const mailFrom = process.env.MAIL_FROM;

const transporter = mailEnabled
    ? nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth:
              smtpUser && smtpPassword
                  ? {
                        user: smtpUser,
                        pass: smtpPassword,
                    }
                  : undefined,
      })
    : null;

/**
 * Appends mail delivery information to the mail log file.
 *
 * @param message - Description of the mail delivery event.
 * @param data - Additional information about the event.
 * @returns A promise that resolves when the log entry is written.
 */
async function logMail(message: string, data: unknown): Promise<void> {
    const logDirectory = path.join(process.cwd(), "logs");

    await mkdir(logDirectory, { recursive: true });

    const logPath = path.join(logDirectory, "mail.log");

    await appendFile(
        logPath,
        `${new Date().toISOString()} ${message} ${JSON.stringify(data)}\n`,
    );
}

/**
 * Sends an email using the configured SMTP server.
 *
 * @param options - Email details, including recipients, subject and content.
 * @returns A promise that resolves when the email is sent or mail delivery is disabled.
 */
export async function sendMail(options: SendMailOptions): Promise<void> {
    if (!mailEnabled) {
        console.log("MAIL DISABLED", {
            to: options.to,
            subject: options.subject,
        });

        return;
    }

    if (!transporter || !mailFrom) {
        throw new Error("Mail is enabled but SMTP is not configured");
    }

    try {
        const info = await transporter.sendMail({
            from: mailFrom,
            to: options.to,
            subject: options.subject,
            text: options.text,
            ...(options.html ? { html: options.html } : {}),
        });

        await logMail("MAIL SENT", {
            to: options.to,
            subject: options.subject,
            messageId: info.messageId,
            accepted: info.accepted,
            rejected: info.rejected,
            response: info.response,
        });
    } catch (error) {
        await logMail("MAIL FAILED", {
            to: options.to,
            subject: options.subject,
            error: error instanceof Error ? error.message : String(error),
        });

        throw error;
    }
}
