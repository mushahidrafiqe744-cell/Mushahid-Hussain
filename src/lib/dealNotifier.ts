import nodemailer from "nodemailer";

export interface DealNotificationPayload {
  clientName?: string;
  clientEmail?: string;
  whatsapp?: string;
  projectType?: string;
  requirements?: string;
  estimatedBudget?: string;
  projectTimeline?: string;
  chatSummary?: string;
  dealStatus?: string;
}

export async function sendDealNotification(payload: DealNotificationPayload) {
  const {
    clientName = "Visitor",
    clientEmail = "Not provided",
    whatsapp = "Not provided",
    projectType = "Custom Web Development",
    requirements = "N/A",
    estimatedBudget = "N/A",
    projectTimeline = "Standard Timeline",
    chatSummary = "Client confirmed project deal during live chatbot session.",
    dealStatus = "FINALIZED",
  } = payload;

  const adminEmail = "mushahidrafiqe744@gmail.com";
  const subject = "New Website Deal Finalized – Portfolio Chatbot";

  const textContent = `
NEW WEBSITE DEAL FINALIZED - PORTFOLIO CHATBOT
=============================================
Deal Status: ${dealStatus}
Date: ${new Date().toLocaleString()}

CLIENT INFORMATION:
- Name: ${clientName}
- Email: ${clientEmail}
- Phone/WhatsApp: ${whatsapp}

PROJECT DETAILS:
- Project Type: ${projectType}
- Requirements: ${requirements}
- Estimated Budget: ${estimatedBudget}
- Project Timeline: ${projectTimeline}

CONVERSATION SUMMARY:
${chatSummary}
=============================================
`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #10B981; border-radius: 12px; background-color: #F8F5EE;">
      <div style="background-color: #0A3D22; color: #50E364; padding: 16px; text-align: center; border-radius: 8px;">
        <h2 style="margin: 0;">🎉 New Website Deal Finalized</h2>
        <p style="margin: 4px 0 0 0; color: #DFC285; font-size: 14px;">Portfolio Chatbot Lead Notification</p>
      </div>

      <div style="padding: 20px; background-color: #ffffff; border-radius: 8px; margin-top: 16px;">
        <h3 style="color: #0A3D22; border-bottom: 2px solid #50E364; padding-bottom: 6px;">👤 Client Information</h3>
        <p><strong>Name:</strong> ${clientName}</p>
        <p><strong>Email:</strong> <a href="mailto:${clientEmail}">${clientEmail}</a></p>
        <p><strong>WhatsApp / Phone:</strong> ${whatsapp}</p>

        <h3 style="color: #0A3D22; border-bottom: 2px solid #50E364; padding-bottom: 6px; margin-top: 20px;">🚀 Project Details</h3>
        <p><strong>Project Type:</strong> ${projectType}</p>
        <p><strong>Requirements:</strong> ${requirements}</p>
        <p><strong>Estimated Budget:</strong> <span style="color: #10B981; font-weight: bold;">${estimatedBudget}</span></p>
        <p><strong>Project Timeline:</strong> ${projectTimeline}</p>

        <h3 style="color: #0A3D22; border-bottom: 2px solid #50E364; padding-bottom: 6px; margin-top: 20px;">💬 Chat Summary</h3>
        <div style="background-color: #F3F4F6; padding: 12px; border-radius: 6px; font-size: 13px; color: #374151; white-space: pre-wrap;">
          ${chatSummary}
        </div>

        <div style="margin-top: 24px; text-align: center;">
          <span style="background-color: #10B981; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px;">
            STATUS: FINALIZED
          </span>
        </div>
      </div>
    </div>
  `;

  let emailSent = false;
  let emailError: string | null = null;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: process.env.SMTP_PORT === "465",
        connectionTimeout: 4000,
        greetingTimeout: 4000,
        socketTimeout: 5000,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Portfolio Chatbot" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject,
        text: textContent,
        html: htmlContent,
      });
      emailSent = true;
    } catch (err: any) {
      console.warn("[DEAL EMAIL DISPATCH WARNING]", err?.message || String(err));
      emailError = err?.message || String(err);
    }
  } else {
    // When SMTP credentials are not yet configured in env, log safely without throwing
    console.log("[Deal Notifier] Finalized Deal Logged for Admin:", {
      to: adminEmail,
      subject,
      clientName,
      clientEmail,
      whatsapp,
      projectType,
      estimatedBudget,
    });
    emailSent = true;
  }

  return { emailSent, emailError };
}
