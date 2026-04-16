import { NextResponse } from "next/server";
import { getMovieGenres } from "@/lib/server/browse/get-movie-genres";
export async function GET() {
  try {
    const data = await getMovieGenres();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error fetching genres" },
      { status: 500 }
    );
  }
}