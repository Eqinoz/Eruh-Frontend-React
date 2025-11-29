import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
}

export const exportToExcel = async (
  data: any[], 
  columns: ExcelColumn[], 
  fileName: string,
  reportTitle: string // 👈 YENİ PARAMETRE: Raporun Başlığı
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Rapor');

  // --- 1. SÜTUN GENİŞLİKLERİNİ AYARLA ---
  // ExcelJS'e sütunları tanıtıyoruz ama header'ı otomatik yazdırmıyoruz (kendimiz yazacağız)
  worksheet.columns = columns.map(col => ({
    key: col.key,
    width: col.width || 20
  }));

  // --- 2. EN ÜSTTEKİ DEV BAŞLIK SATIRI (ROW 1) ---
  // Başlık metni ve oluşturulma tarihi
  const titleText = `${reportTitle} - (${new Date().toLocaleDateString('tr-TR')})`;
  const titleRow = worksheet.addRow([titleText]); // 1. Satıra ekle

  // Hücreleri Birleştir (A1'den son sütuna kadar)
  worksheet.mergeCells(1, 1, 1, columns.length);

  // Başlık Stili (Fıstık Yeşili Zemin, Beyaz Büyük Yazı)
  titleRow.height = 45;
  titleRow.font = { name: 'Arial', family: 4, size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
  titleRow.getCell(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2E8B57' } // Koyu Fıstık Yeşili (SeaGreen)
  };

  // --- 3. TABLO BAŞLIKLARI SATIRI (ROW 2) ---
  // Sütun başlıklarını (header) manuel olarak 2. satıra ekliyoruz
  const headerValues = columns.map(col => col.header);
  const headerRow = worksheet.addRow(headerValues);

  // Tablo Başlık Stili (Altın/Turuncu Zemin - Ayrışsın diye)
  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Arial', bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFC89F3A' } // Fıstık Altın Rengi
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Kenarlıklar
    cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
  });

  // --- 4. VERİ SATIRLARI (ROW 3 ve sonrası) ---
  // Verileri ekle (key'lere göre otomatik eşleşir)
  // Not: addRow yerine, her bir objeyi sırayla eklemeliyiz çünkü columns tanımını yaptık
  data.forEach(item => {
    worksheet.addRow(item);
  });

  // --- 5. VERİ HÜCRELERİNE KENARLIK ---
  // 3. satırdan (veri başlangıcı) son satıra kadar dön
  const lastRow = worksheet.lastRow ? worksheet.lastRow.number : 3;
  
  for (let i = 3; i <= lastRow; i++) {
    const row = worksheet.getRow(i);
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    });
  }

  // --- 6. İNDİRME ---
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${fileName}_${new Date().toLocaleDateString('tr-TR').replace(/\./g, '-')}.xlsx`);
};