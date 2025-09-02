import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CustomerInfo, CostComponents, CalculationResult } from '../types/quote';
import { formatCurrency, formatDate, addDays } from './formatters';

export async function generatePDF(
  customer: CustomerInfo,
  costs: CostComponents,
  result: CalculationResult,
  chartElement: HTMLElement | null,
  language: 'vi' | 'en'
): Promise<void> {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    let yPosition = margin;

    // Helper function to check and add new page if needed
    const checkNewPage = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Helper function to handle Vietnamese text
    const vietText = (text: string): string => {
      return text;
    };

    // Set font
    pdf.setFont('helvetica', 'normal');

    // Header
    pdf.setFillColor(0, 102, 204);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.text('BENKON', margin, 20);
    
    pdf.setFontSize(10);
    pdf.text('Technology Solutions', margin, 28);
    pdf.text('www.benkon.io', pageWidth - margin - 30, 20);
    
    yPosition = 50;

    // Quote Title
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(20);
    const title = language === 'vi' ? 'BÁO GIÁ' : 'QUOTATION';
    pdf.text(vietText(title), pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;

    // Quote Info
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    const today = new Date();
    const validUntil = addDays(today, 30);
    const quoteNumber = `QT-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    const quoteLabel = language === 'vi' ? 'Số báo giá' : 'Quote Number';
    const dateLabel = language === 'vi' ? 'Ngày' : 'Date';
    const validLabel = language === 'vi' ? 'Hiệu lực đến' : 'Valid Until';
    
    pdf.text(`${vietText(quoteLabel)}: ${quoteNumber}`, margin, yPosition);
    pdf.text(`${vietText(dateLabel)}: ${formatDate(today, language)}`, pageWidth / 2, yPosition);
    pdf.text(`${vietText(validLabel)}: ${formatDate(validUntil, language)}`, pageWidth - margin - 50, yPosition);
    
    yPosition += 15;

    // Customer Information Section
    pdf.setFillColor(245, 245, 245);
    pdf.rect(margin, yPosition, contentWidth, 8, 'F');
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    const customerTitle = language === 'vi' ? 'THÔNG TIN KHÁCH HÀNG' : 'CUSTOMER INFORMATION';
    pdf.text(vietText(customerTitle), margin + 2, yPosition + 5.5);
    
    yPosition += 12;
    pdf.setFontSize(10);
    pdf.setTextColor(50, 50, 50);
    
    if (customer.customerName) {
      const nameLabel = language === 'vi' ? 'Tên khách hàng' : 'Customer Name';
      pdf.text(`${vietText(nameLabel)}: ${vietText(customer.customerName)}`, margin, yPosition);
      yPosition += 6;
    }
    if (customer.companyName) {
      const companyLabel = language === 'vi' ? 'Công ty' : 'Company';
      pdf.text(`${vietText(companyLabel)}: ${vietText(customer.companyName)}`, margin, yPosition);
      yPosition += 6;
    }
    if (customer.address) {
      const addressLabel = language === 'vi' ? 'Địa chỉ' : 'Address';
      pdf.text(`${vietText(addressLabel)}: ${vietText(customer.address)}`, margin, yPosition);
      yPosition += 6;
    }
    if (customer.contact) {
      const contactLabel = language === 'vi' ? 'Liên hệ' : 'Contact';
      pdf.text(`${vietText(contactLabel)}: ${vietText(customer.contact)}`, margin, yPosition);
      yPosition += 6;
    }
    const storesLabel = language === 'vi' ? 'Số lượng cửa hàng' : 'Number of Stores';
    pdf.text(`${vietText(storesLabel)}: ${customer.numberOfStores}`, margin, yPosition);
    
    yPosition += 12;

    // Cost Breakdown Section
    checkNewPage(60);
    pdf.setFillColor(245, 245, 245);
    pdf.rect(margin, yPosition, contentWidth, 8, 'F');
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    const costTitle = language === 'vi' ? 'CHI TIẾT CHI PHÍ' : 'COST BREAKDOWN';
    pdf.text(vietText(costTitle), margin + 2, yPosition + 5.5);
    
    yPosition += 12;
    pdf.setFontSize(10);

    // Cost table - simple text layout
    const costItems = [
      [language === 'vi' ? 'Chi phí phần cứng' : 'Hardware Cost', formatCurrency(costs.hardwareCost, language)],
      [language === 'vi' ? 'Chi phí phần mềm (mỗi năm)' : 'Software Cost (per year)', formatCurrency(costs.softwareCostPerYear, language)],
      [language === 'vi' ? 'Chi phí lắp đặt (mỗi cửa hàng)' : 'Installation Cost (per store)', formatCurrency(costs.installationCostPerStore, language)],
      [language === 'vi' ? 'Dịch vụ thiết lập (mỗi cửa hàng)' : 'Setup Service (per store)', formatCurrency(costs.setupServicePerStore, language)]
    ];

    costItems.forEach(([label, value]) => {
      pdf.text(vietText(label), margin, yPosition);
      pdf.text(value, pageWidth - margin - 40, yPosition, { align: 'right' });
      yPosition += 6;
    });

    yPosition += 8;

    // Payment Comparison Section
    checkNewPage(80);
    pdf.setFillColor(245, 245, 245);
    pdf.rect(margin, yPosition, contentWidth, 8, 'F');
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    const comparisonTitle = language === 'vi' ? 'SO SÁNH PHƯƠNG THỨC THANH TOÁN' : 'PAYMENT METHOD COMPARISON';
    pdf.text(vietText(comparisonTitle), margin + 2, yPosition + 5.5);
    
    yPosition += 12;

    // Purchase Option
    pdf.setFillColor(59, 130, 246, 0.1);
    pdf.rect(margin, yPosition, contentWidth / 2 - 5, 40, 'F');
    pdf.setDrawColor(59, 130, 246);
    pdf.rect(margin, yPosition, contentWidth / 2 - 5, 40, 'S');
    
    pdf.setFontSize(11);
    pdf.setTextColor(59, 130, 246);
    const purchaseTitle = language === 'vi' ? 'MUA TRẢ THẲNG' : 'DIRECT PURCHASE';
    pdf.text(vietText(purchaseTitle), margin + 2, yPosition + 6);
    
    pdf.setFontSize(9);
    pdf.setTextColor(50, 50, 50);
    const initialLabel = language === 'vi' ? 'Thanh toán ban đầu' : 'Initial Payment';
    pdf.text(`${vietText(initialLabel)}:`, margin + 2, yPosition + 14);
    pdf.text(formatCurrency(result.purchase.month0Cost, language), margin + 2, yPosition + 20);
    
    const year2Label = language === 'vi' ? 'Năm thứ 2' : 'Year 2';
    pdf.text(`${vietText(year2Label)}:`, margin + 2, yPosition + 28);
    pdf.text(formatCurrency(result.purchase.month13Cost, language), margin + 2, yPosition + 34);

    // Rental Option
    pdf.setFillColor(147, 51, 234, 0.1);
    pdf.rect(pageWidth / 2 + 5, yPosition, contentWidth / 2 - 5, 40, 'F');
    pdf.setDrawColor(147, 51, 234);
    pdf.rect(pageWidth / 2 + 5, yPosition, contentWidth / 2 - 5, 40, 'S');
    
    pdf.setFontSize(11);
    pdf.setTextColor(147, 51, 234);
    const rentalTitle = language === 'vi' ? 'THUÊ HỢP ĐỒNG 2 NĂM' : '2-YEAR CONTRACT RENTAL';
    pdf.text(vietText(rentalTitle), pageWidth / 2 + 7, yPosition + 6);
    
    pdf.setFontSize(9);
    pdf.setTextColor(50, 50, 50);
    const depositLabel = language === 'vi' ? 'Đặt cọc (3 tháng - hoàn trả)' : 'Deposit (3 months - refundable)';
    pdf.text(`${vietText(depositLabel)}:`, pageWidth / 2 + 7, yPosition + 14);
    pdf.text(formatCurrency(result.rental.deposit, language), pageWidth / 2 + 7, yPosition + 20);
    
    const monthlyLabel = language === 'vi' ? 'Thanh toán hàng tháng' : 'Monthly Payment';
    pdf.text(`${vietText(monthlyLabel)}:`, pageWidth / 2 + 7, yPosition + 28);
    pdf.text(formatCurrency(result.rental.monthlyRental, language), pageWidth / 2 + 7, yPosition + 34);

    yPosition += 45;

    // Total Comparison
    pdf.setFillColor(255, 251, 235);
    pdf.rect(margin, yPosition, contentWidth, 12, 'F');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    const totalLabel = language === 'vi' ? 'TỔNG CHI PHÍ 2 NĂM' : 'TOTAL 2-YEAR COST';
    pdf.text(vietText(`${totalLabel}:`), margin + 2, yPosition + 7);
    
    pdf.setTextColor(59, 130, 246);
    pdf.text(formatCurrency(result.purchase.totalTwoYearCost, language), margin + 60, yPosition + 7);
    
    pdf.setTextColor(147, 51, 234);
    const rentalNote = language === 'vi' ? '(không bao gồm cọc)' : '(excl. deposit)';
    pdf.text(`${formatCurrency(result.rental.totalTwoYearCost, language)} ${vietText(rentalNote)}`, pageWidth / 2 + 10, yPosition + 7);

    yPosition += 20;

    // Add chart if available
    if (chartElement) {
      checkNewPage(100);
      try {
        const canvas = await html2canvas(chartElement, {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
          logging: false
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (imgHeight <= 80) {
          pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
        }
      } catch (error) {
        console.error('Error adding chart to PDF:', error);
        // Continue without chart if it fails
      }
    }

    // Terms and Conditions
    checkNewPage(50);
    pdf.setFillColor(245, 245, 245);
    pdf.rect(margin, yPosition, contentWidth, 8, 'F');
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    const termsTitle = language === 'vi' ? 'ĐIỀU KHOẢN & ĐIỀU KIỆN' : 'TERMS & CONDITIONS';
    pdf.text(vietText(termsTitle), margin + 2, yPosition + 5.5);
    
    yPosition += 12;
    pdf.setFontSize(9);
    pdf.setTextColor(70, 70, 70);
    
    const terms = language === 'vi' ? [
      '• Thuê: Yêu cầu đặt cọc 3 tháng (hoàn trả khi kết thúc hợp đồng)',
      '• Mua: Bảo hành phần cứng 1 năm',
      '• Cam kết dịch vụ: Phản hồi trong 48 giờ',
      '• Chi phí bổ sung có thể áp dụng cho các sự cố do khách hàng gây ra',
      '• Báo giá có hiệu lực trong 30 ngày'
    ] : [
      '• Rental: 3-month deposit required (refundable at contract end)',
      '• Purchase: 1-year hardware warranty',
      '• Service commitment: 48-hour response time',
      '• Additional costs may apply for customer-caused issues',
      '• Quote valid for 30 days'
    ];

    terms.forEach(term => {
      const lines = pdf.splitTextToSize(vietText(term), contentWidth - 5);
      if (Array.isArray(lines)) {
        lines.forEach((line: string) => {
          checkNewPage(10);
          pdf.text(line, margin, yPosition);
          yPosition += 5;
        });
      } else {
        checkNewPage(10);
        pdf.text(lines, margin, yPosition);
        yPosition += 5;
      }
    });

    // Footer
    pdf.setFillColor(0, 102, 204);
    pdf.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.text('BenKon Technology Solutions', pageWidth / 2, pageHeight - 10, { align: 'center' });
    pdf.setFontSize(8);
    pdf.text('www.benkon.io | support@benkon.io', pageWidth / 2, pageHeight - 5, { align: 'center' });

    // Save the PDF
    const fileName = `BenKon_Quote_${customer.customerName.replace(/\s+/g, '_')}_${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}.pdf`;
    pdf.save(fileName);
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(language === 'vi' ? 'Không thể tạo PDF. Vui lòng thử lại.' : 'Failed to generate PDF. Please try again.');
  }
}