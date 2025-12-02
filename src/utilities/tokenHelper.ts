// src/utilities/tokenHelper.ts
import { jwtDecode } from "jwt-decode";

// Sabit Claim Adresleri (Hata yapmamak için değişkene aldık)
const CLAIM_ROLE = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const CLAIM_NAME = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";

// 1. İsim Çekme Fonksiyonu (Senin yazdığının gelişmiş hali)
export function getUserNameFromToken(token?: string | null): string {
  // Eğer parametre olarak token gelmediyse localStorage'dan bak
  const t = token || localStorage.getItem("token");
  if (!t) return "Misafir";

  try {
    const decoded: any = jwtDecode(t);
    return decoded[CLAIM_NAME] || decoded.unique_name || "Kullanıcı";
  } catch {
    return "Kullanıcı";
  }
}

// 2. Rol Çekme Fonksiyonu (YENİ)
export function getUserRoleFromToken(token?: string | null): string | string[] | null {
  const t = token || localStorage.getItem("token");
  if (!t) return null;

  try {
    const decoded: any = jwtDecode(t);
    // Role claim'ini bul (Uzun isim veya kısa 'role')
    return decoded[CLAIM_ROLE] || decoded.role || null;
  } catch {
    return null;
  }
}