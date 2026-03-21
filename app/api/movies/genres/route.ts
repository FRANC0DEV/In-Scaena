import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list",
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "Error fetching genres",
      },
      { status: 500 }
    );
  }

  const data = await response.json();

  return NextResponse.json(data, { status: 200 });
}
