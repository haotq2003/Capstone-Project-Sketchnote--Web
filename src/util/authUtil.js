import { jwtDecode } from "jwt-decode";

export function decodeUserFromToken(token) {
  try {
    const decoded = jwtDecode(token);

    const email = decoded?.email || decoded?.preferred_username || "";
    const name = decoded?.name || `${decoded?.given_name || ""} ${decoded?.family_name || ""}`.trim();
    const roles = decoded?.realm_access?.roles || [];

    const id = decoded?.sub;
    return { id, email, name, roles };
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
