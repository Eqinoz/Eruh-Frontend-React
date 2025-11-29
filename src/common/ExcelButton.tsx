import { toast } from "react-toastify";
import { exportToExcel, type ExcelColumn } from "../utilities/excelHelper";

interface ExcelButtonProps {
  data: any[];
  columns: ExcelColumn[];
  fileName: string;
  title: string; // 👈 YENİ PROP: Excel'in içindeki başlık
  disabled?: boolean;
}

const ExcelButton = ({ data, columns, fileName, title, disabled = false }: ExcelButtonProps) => {
  
  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.warn("Dışa aktarılacak veri bulunamadı.");
      return;
    }

    // Başlığı da gönderiyoruz
    exportToExcel(data, columns, fileName, title);
    toast.success("Excel dosyası hazırlanıyor...");
  };

  return (
    <button 
      className="btn btn-success py-1 shadow-sm" 
      onClick={handleExport}
      disabled={disabled}
      title="Excel'e Aktar"
    >
      <i className="bi bi-file-earmark-excel-fill me-2"></i>
      Excel
    </button>
  );
};

export default ExcelButton;