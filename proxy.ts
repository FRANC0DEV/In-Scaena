import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_LANGUAGE = "es";
const DEFAULT_REGION = "PE";
const DEFAULT_TIMEZONE = "America/Lima";
async function proxyProduction(request: NextRequest) {
  const response = NextResponse.next();

  const languageCookie = request.cookies.get("language");
  const regionCookie = request.cookies.get("region");

  // Detect language
  if (!languageCookie) {
    let language = request.headers.get("accept-language");
    if (language) {
      // Ej: "es-PE,es;q=0.9,en;q=0.8"
      const primary = language.split(",")[0];
      const iso639 = primary.split("-")[0];
      language = iso639;
    } else {
      language = DEFAULT_LANGUAGE;
    }
    response.cookies.set("language", language, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 días
    });
  }

  // Detect region
  if (!regionCookie) {
    let region = request.headers.get("x-vercel-ip-country");

    if (!region) {
      try {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "";

        const res = await fetch(`https://ipapi.co/${ip}/json/`, {
          cache: "no-store",
        });

        const data = (await res.json()) as IPApiCOResponse;

        region = data.country_code; //country-code ISO 3166-1 alpha-2 (used for TMDB)
      } catch (error) {
        console.error("ipapi fallback failed:", error);
      }
    }

    // 4️⃣ Default final
    if (!region) {
      region = DEFAULT_REGION;
    }

    response.cookies.set("region", region, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 días
    });
  }

  return response;
}

export interface IPApiCOResponse {
  ip: string;
  network: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  country_code: string;
  country_code_iso3: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
}

async function proxyDevelopment(request: NextRequest) {
  const response = NextResponse.next();
  response.cookies.set("region", DEFAULT_REGION, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 días
  });
  response.cookies.set("language", DEFAULT_LANGUAGE, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 días
  });
  response.cookies.set("timezone", DEFAULT_TIMEZONE, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 días
  });

  return response;
}

const proxyFunction =
  process.env.NODE_ENV === "production" ? proxyProduction : proxyDevelopment;

export default proxyFunction;

// Solo ejecutar proxy en rutas que comiencen con /browse
export const config = {
  matcher: "/browse/:path*",
};
