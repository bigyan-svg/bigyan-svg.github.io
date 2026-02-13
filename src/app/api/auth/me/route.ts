import { apiOk } from "@/lib/http";
import { getCurrentUserFromCookies } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUserFromCookies();
  return apiOk({ user });
}
