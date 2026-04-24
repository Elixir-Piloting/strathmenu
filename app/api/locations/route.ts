import { NextResponse } from "next/server";

const LOCATIONS = [
  { id: "phase-one", name: "Phase 1 Cafeteria" },
  { id: "stc", name: "STC Cafeteria" },
] as const;

export async function GET() {
  return NextResponse.json(LOCATIONS);
}