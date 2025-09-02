import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomerInfo, CostComponents, CalculationResult } from '../types/quote';
import { generatePDF } from '../utils/pdfGenerator';
import { Download, Printer, Loader2 } from 'lucide-react';

interface PDFGeneratorProps {
  customer: CustomerInfo | null;
  costs: CostComponents | null;
  result: CalculationResult | null;
  chartRef: React.RefObject<HTMLDivElement>;
  barChartRef: React.RefObject<HTMLDivElement>;
  detailedChartRef: React.RefObject<HTMLDivElement>;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ customer, costs, result, chartRef, barChartRef, detailedChartRef }) => {
  const { t, i18n } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    if (!customer || !costs || !result) {
      alert(i18n.language === 'vi' 
        ? 'Vui lòng điền đầy đủ thông tin và tính toán trước khi xuất PDF' 
        : 'Please fill in all information and calculate before exporting PDF');
      return;
    }

    setIsGenerating(true);
    
    try {
      const chartElement = chartRef.current;
      const barChartElement = barChartRef.current;
      const detailedChartElement = detailedChartRef.current;
      await generatePDF(customer, costs, result, chartElement, barChartElement, detailedChartElement, i18n.language as 'vi' | 'en');
      
      // Success notification
      const successMsg = i18n.language === 'vi' 
        ? 'PDF đã được tạo và tải xuống thành công!' 
        : 'PDF generated and downloaded successfully!';
      alert(successMsg);
    } catch (error) {
      console.error('Error generating PDF:', error);
      const errorMsg = error instanceof Error ? error.message : (
        i18n.language === 'vi'
          ? 'Có lỗi xảy ra khi tạo PDF. Vui lòng thử lại.'
          : 'An error occurred while generating the PDF. Please try again.'
      );
      alert(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    if (!customer || !costs || !result) {
      alert(i18n.language === 'vi' 
        ? 'Vui lòng điền đầy đủ thông tin và tính toán trước khi in' 
        : 'Please fill in all information and calculate before printing');
      return;
    }
    
    window.print();
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleGeneratePDF}
        disabled={isGenerating || !result}
        className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all ${
          isGenerating || !result
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-benkon-blue text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t('actions.generating')}
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            {t('actions.export')}
          </>
        )}
      </button>

      <button
        onClick={handlePrint}
        disabled={!result}
        className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all ${
          !result
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-white text-benkon-blue border-2 border-benkon-blue hover:bg-blue-50'
        }`}
      >
        <Printer className="w-5 h-5" />
        {t('actions.print')}
      </button>
    </div>
  );
};

export default PDFGenerator;