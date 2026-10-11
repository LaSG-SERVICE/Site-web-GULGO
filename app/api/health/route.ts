import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    application: "GULGO Web V1",
    model_version: "V1.0",
  });
}