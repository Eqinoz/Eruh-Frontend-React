// src/utils/formatters.ts

// Angular'daki 'number' pipe'ımızın React karşılığı
export const formatNumber = (
  value: number | undefined | null,
  locale: string = "tr-TR" // Varsayılan olarak Türkçe formatı
) => {
  // Eğer değer 0, null veya undefined ise "0" döndür
  if (!value) {
    return "0";
  }

  try {
    return new Intl.NumberFormat(locale).format(value);
  } catch (error) {
    console.error("Formatlama hatası:", error);
    return value.toString(); // Hata olursa sayının kendisini string olarak bas
  }
};

// Bonus: İleride para birimi için de lazım olacak
export const formatCurrency = (
  value: number | undefined | null,
  locale: string = "tr-TR",
  currency: string = "TRY"
) => {
  if (!value) {
    return "0,00 TL"; // Veya istediğin bir varsayılan
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(value);
  } catch (error) {
    console.error("Para formatlama hatası:", error);
    return value.toString();
  }
};

// --- TARİH FORMATLAMA FONKSİYONLARI ---

/**
 * Gelen ISO tarih string'ini (örn: 2025-11-11T12:46:17...)
 * 'tr-TR' formatına (örn: 11.11.2025) çevirir.
 * @param dateString Gelen tarih string'i
 * @param options Opsiyonel formatlama ayarları
 */
export const formatDate = (
  dateString: string | undefined | null,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit", // '11'
    month: "2-digit", // '11'
    year: "numeric", // '2025'
  }
) => {
  // Gelen tarih string'i boşsa veya yoksa boş string döndür
  // (Formlarda "Geçerli bir tarih girin" hatası almamak için)
  if (!dateString) {
    return "";
  }

  try {
    const date = new Date(dateString);
    // 'tr-TR' lokalizasyonuna göre formatla
    return date.toLocaleDateString("tr-TR", options);
  } catch (error) {
    console.error("Tarih formatlama hatası:", error);
    return "Geçersiz Tarih"; // Hata olursa bunu göster
  }
};

/**
 * Tarihi '11 Kasım 2025' gibi uzun formatta gösterir.
 * @param dateString Gelen tarih string'i
 */
export const formatDateLong = (dateString: string | undefined | null) => {
  return formatDate(dateString, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * Tarihi ve saati '11.11.2025 12:46' gibi gösterir.
 * @param dateString Gelen tarih string'i
 */
export const formatDateTime = (dateString: string | undefined | null) => {
  return formatDate(dateString, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
