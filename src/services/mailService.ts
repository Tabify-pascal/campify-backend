import nodemailer from "nodemailer";

type SendMailOptions = {
    to: string | string[];
    subject: string;
    text: string;
    html?: string;
};

const mailEnabled =
    process.env.MAIL_ENABLED === "true";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(
    process.env.SMTP_PORT ?? 587
);
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const mailFrom = process.env.MAIL_FROM;

const transporter =
    mailEnabled
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

export async function sendMail(
    options: SendMailOptions
): Promise<void> {
    if (!mailEnabled) {
        console.log("MAIL DISABLED", {
            to: options.to,
            subject: options.subject,
        });

        return;
    }

    if (!transporter || !mailFrom) {
        throw new Error(
            "Mail is enabled but SMTP is not configured"
        );
    }

    await transporter.sendMail({
        from: mailFrom,
        to: options.to,
        subject: options.subject,
        text: options.text,
        ...(options.html
            ? { html: options.html }
            : {}),
    });
}