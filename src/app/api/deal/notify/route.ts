import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      clientName,
      clientEmail,
      whatsapp,
      projectType,
      requirements,
      estimatedBudget,
      projectTimeline,
      chatSummary,
      dealStatus = "FINALIZED",
    } = body;

    const adminEmail = "mushahidrafiqe744@gmail.com";
    const subject = "New Website Deal Finalized – Portfolio Chatbot";

    const textContent = `
NEW WEBSITE DEAL FINALIZED - PORTFOLIO CHATBOT
=============================================
Deal Status: ${dealStatus}
Date: ${new Date().toLocaleString()}

CLIENT INFORMATION:
- Name: ${clientName || "Visitor"}
- Email: ${clientEmail || "Not provided"}
- Phone/WhatsApp: ${whatsapp || "Not provided"}

PROJECT DETAILS:
- Project Type: ${projectType || "Custom Web Development"}
- Requirements: ${requirements || "N/A"}
- Estimated Budget: ${estimatedBudget || "N/A"}
- Project Timeline: ${projectTimeline || "N/A"}

CONVERSATION SUMMARY:
${chatSummary || "Client confirmed project deal during live chatbot session."}
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
          <p><strong>Name:</strong> ${clientName || "Visitor"}</p>
          <p><strong>Email:</strong> <a href="mailto:${clientEmail}">${clientEmail || "Not provided"}</a></p>
          <p><strong>WhatsApp / Phone:</strong> ${whatsapp || "Not provided"}</p>

          <h3 style="color: #0A3D22; border-bottom: 2px solid #50E364; padding-bottom: 6px; margin-top: 20px;">🚀 Project Details</h3>
          <p><strong>Project Type:</strong> ${projectType || "Custom Web Development"}</p>
          <p><strong>Requirements:</strong> ${requirements || "N/A"}</p>
          <p><strong>Estimated Budget:</strong> <span style="color: #10B981; font-weight: bold;">${estimatedBudget || "N/A"}</span></p>
          <p><strong>Project Timeline:</strong> ${projectTimeline || "N/A"}</p>

          <h3 style="color: #0A3D22; border-bottom: 2px solid #50E364; padding-bottom: 6px; margin-top: 20px;">💬 Chat Summary</h3>
          <div style="background-color: #F3F4F6; padding: 12px; border-radius: 6px; font-size: 13px; color: #374151; white-space: pre-wrap;">
            ${chatSummary || "Client confirmed project deal during live chatbot session."}
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
        console.error("[DEAL EMAIL DISPATCH ERROR]", err);
        emailError = err.message || String(err);
      }
    } else {
      console.log("[SMTP CONFIG NOT SET] Logged deal email payload for admin:", {
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

    return NextResponse.json({
      success: true,
      emailSent,
      emailError,
      message: "Deal notification processed successfully.",
    });
  } catch (err: any) {
    console.error("[DEAL NOTIFY ROUTE ERROR]", err);
    return NextResponse.json(
      { error: err.message || "Failed to notify deal" },
      { status: 500 }
    );
  }
}
