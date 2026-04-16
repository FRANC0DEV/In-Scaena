import { getTvSeriesGenres } from "@/lib/server/browse/get-tvseries-genres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getTvSeriesGenres();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error fetching genres" },
      { status: 500 }
    );
  }
}
