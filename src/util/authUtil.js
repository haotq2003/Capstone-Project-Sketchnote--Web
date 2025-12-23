import { jwtDecode } from "jwt-decode";

export function decodeUserFromToken(token) {
  try {
    const decoded = jwtDecode(token);

    const email = decoded?.email || decoded?.preferred_username || "";
    const name =
      decoded?.name ||
      `${decoded?.given_name || ""} ${decoded?.family_name || ""}`.trim();
    const roles = decoded?.realm_access?.roles || [];
    const id = decoded?.sub;

    return { id, email, name, roles };
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

export function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    // Trừ 60 giây để refresh trước khi hết hạn
    return decoded.exp < currentTime + 60;
  } catch {
    return true;
  }
}

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

export function getRoles() {
  try {
    const roles = localStorage.getItem("roles");
    return roles ? JSON.parse(roles) : [];
  } catch {
    return [];
  }
}

export function getUserInfo() {
  try {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  const token = getAccessToken();
  if (!token) return false;
  return !isTokenExpired(token);
}

export function hasRole(role) {
  const roles = getRoles();
  return roles.includes(role);
}

export function isAdmin() {
  return hasRole("ADMIN");
}

export function isStaff() {
  return hasRole("STAFF");
}

export function isCustomer() {
  const roles = getRoles();
  return (
    roles.includes("CUSTOMER") &&
    !roles.includes("ADMIN") &&
    !roles.includes("STAFF")
  );
}
