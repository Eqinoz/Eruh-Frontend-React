import { jwtDecode } from "jwt-decode";

export function getUserNameFromToken(): string {
  const token = localStorage.getItem("token");
  if (!token) return "Misafir";

  try {
    const decoded: any = jwtDecode(token);
    return decoded[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
    ];
  } catch {
    return "Kullanıcı";
  }
}
