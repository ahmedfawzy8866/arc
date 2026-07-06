import { NextResponse } from "next/server";
import { runAdvisoryProtocol } from "@/lib/advisory";

/**
 * Advisory AI Lead Tracking Protocol
 * Cron job triggered daily to optimize CRM inventory performance.
 */
export async function GET(request: Request) {
  try {
    // 1. Authenticate Cron request
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("[Advisory AI] Starting Lead Analysis Protocol...");

    // 2. Perform automated tracking analysis
    const results = await runAdvisoryProtocol();
    const unpublishedCount = results.filter(r => r.status === "Unpublished").length;

    console.log(`[Advisory AI] Protocol Complete. Analyzed ${results.length}, Unpublished: ${unpublishedCount}`);

    return NextResponse.json({
      status: "success",
      message: `Analyzed ${results.length} properties. Unpublished ${unpublishedCount}.`,
      ranked_report: results.map((result) => {
        const { action, ...rest } = result;
        void action;
        return rest;
      }),
      actions: results.map(r => r.action),
    }, { status: 200 });


  } catch (error) {
    console.error("[Advisory AI] Critical Error in Protocol:", error);
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
