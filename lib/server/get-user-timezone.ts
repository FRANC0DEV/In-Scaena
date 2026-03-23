import "server-only";

import { cookies } from "next/headers";

export async function getUserTimezone() {
  const cookieStore = await cookies();

  // Obteniendo desde cookies
  const cached = cookieStore.get("timezone");
  if (!cached) {
    console.log("ERROR: timezone no en cookies, chequear proxy");
    throw new Error("ERROR: timezone no en cookies, chequear proxy");
  }
  return cached.value;
}
