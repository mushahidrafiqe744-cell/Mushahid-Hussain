import { NextRequest, NextResponse } from "next/server";
import { sendDealNotification } from "@/lib/dealNotifier";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await sendDealNotification(body);

    return NextResponse.json({
      success: true,
      emailSent: result.emailSent,
      emailError: result.emailError,
      message: "Deal notification processed successfully.",
    });
  } catch (err: any) {
    console.warn("[DEAL NOTIFY ROUTE WARNING]", err?.message || String(err));
    return NextResponse.json(
      { error: err.message || "Failed to notify deal", success: false },
      { status: 200 }
    );
  }
}
