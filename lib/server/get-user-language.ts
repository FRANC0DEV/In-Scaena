import "server-only";

import { cookies } from "next/headers";

export async function getUserLanguageISO639_1() {
  const cookieStore = await cookies();

  // Obteniendo desde cookies
  const cached = cookieStore.get("language");

  if (!cached) {
    console.log("ERROR: language no en cookies, chequear proxy");
    throw new Error("ERROR: language no en cookies, chequear proxy");
  }
  return cached.value;
}
