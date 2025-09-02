import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CustomerInfo, CostComponents, CalculationResult } from '../types/quote';
import { formatCurrency, formatDate, addDays } from './formatters';

// Create HTML template for PDF generation
const createPDFHtml = (
  customer: CustomerInfo,
  costs: CostComponents,
  result: CalculationResult,
  language: 'vi' | 'en',
  chartDataUrl?: string,
  barChartDataUrl?: string,
  detailedChartDataUrl?: string
) => {
  const today = new Date();
  const validUntil = addDays(today, 30);
  const quoteNumber = `QT-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

  const customerFields = [
    { label: language === 'vi' ? 'Tên khách hàng' : 'Customer Name', value: customer.customerName },
    { label: language === 'vi' ? 'Công ty' : 'Company', value: customer.companyName },
    { label: language === 'vi' ? 'Địa chỉ' : 'Address', value: customer.address },
    { label: language === 'vi' ? 'Liên hệ' : 'Contact', value: customer.contact },
    { label: language === 'vi' ? 'Số lượng cửa hàng' : 'Number of Stores', value: customer.numberOfStores.toString() }
  ];

  const costItems = [
    { label: language === 'vi' ? 'Chi phí phần cứng' : 'Hardware Cost', value: formatCurrency(costs.hardwareCost, language) },
    { label: language === 'vi' ? 'Chi phí phần mềm (mỗi năm)' : 'Software Cost (per year)', value: formatCurrency(costs.softwareCostPerYear, language) },
    { label: language === 'vi' ? 'Chi phí lắp đặt (mỗi cửa hàng)' : 'Installation Cost (per store)', value: formatCurrency(costs.installationCostPerStore, language) },
    { label: language === 'vi' ? 'Dịch vụ thiết lập (mỗi cửa hàng)' : 'Setup Service (per store)', value: formatCurrency(costs.setupServicePerStore, language) }
  ];

  const terms = language === 'vi' ? [
    'Thuê: Yêu cầu đặt cọc 3 tháng (hoàn trả khi kết thúc hợp đồng)',
    'Mua: Bảo hành phần cứng 1 năm',
    'Cam kết dịch vụ: Phản hồi trong 48 giờ',
    'Chi phí bổ sung có thể áp dụng cho các sự cố do khách hàng gây ra',
    'Báo giá có hiệu lực trong 30 ngày',
    'Giá đã bao gồm VAT và các chi phí liên quan'
  ] : [
    'Rental: 3-month deposit required (refundable at contract end)',
    'Purchase: 1-year hardware warranty included',
    'Service commitment: 48-hour response time',
    'Additional costs may apply for customer-caused issues',
    'Quote valid for 30 days from issue date',
    'All prices include VAT and related costs'
  ];

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          margin: 0;
          padding: 96px;
          font-size: 12px;
          line-height: 1.5;
          color: #333;
          background: white;
          width: 600px;
          box-sizing: border-box;
        }
        
        .header {
          background: #0066CC;
          color: white;
          padding: 20px;
          margin: -96px -96px 30px -96px;
          position: relative;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .header h1 {
          margin: 0;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        
        .header .subtitle {
          margin: 3px 0 0 0;
          font-size: 12px;
          opacity: 0.9;
          font-weight: 400;
        }
        
        .page-number {
          font-size: 11px;
          opacity: 0.8;
        }
        
        .quote-title {
          text-align: center;
          font-size: 22px;
          font-weight: 700;
          margin: 25px 0;
          color: #0066CC;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .quote-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          font-size: 11px;
          color: #666;
          padding: 12px;
          background: #F7F7F7;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
        }
        
        .section {
          margin-bottom: 30px;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .section-header {
          background: #f5f5f5;
          color: #333;
          padding: 12px 16px;
          font-weight: 600;
          font-size: 14px;
          margin: 0;
          border-left: 4px solid #0066CC;
          border-bottom: 1px solid #e5e5e5;
        }
        
        .section-content {
          padding: 16px;
          background: white;
        }
        
        .info-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .info-table tr {
          border-bottom: 1px solid #f0f0f0;
        }
        
        .info-table tr:last-child {
          border-bottom: none;
        }
        
        .info-table td {
          padding: 10px 12px;
          vertical-align: top;
        }
        
        .info-table .label {
          width: 35%;
          font-weight: 500;
          color: #555;
        }
        
        .info-table .value {
          font-weight: 600;
          color: #333;
        }
        
        .cost-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .cost-table tr {
          border-bottom: 1px solid #f0f0f0;
        }
        
        .cost-table tr:last-child {
          border-bottom: none;
        }
        
        .cost-table td {
          padding: 12px;
          vertical-align: middle;
        }
        
        .cost-table .label {
          width: 65%;
          font-weight: 500;
        }
        
        .cost-table .value {
          text-align: right;
          font-weight: 600;
          color: #333;
        }
        
        .comparison {
          display: flex;
          gap: 20px;
        }
        
        .option-box {
          flex: 1;
          border: 2px solid #e5e5e5;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .option-header {
          padding: 12px 16px;
          font-weight: 700;
          font-size: 14px;
          color: white;
          text-align: center;
        }
        
        .purchase-header {
          background: #3B82F6;
        }
        
        .rental-header {
          background: #9333EA;
        }
        
        .option-content {
          padding: 16px;
          background: white;
        }
        
        .option-details {
          font-size: 11px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .option-details:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        
        .option-label {
          font-weight: 500;
          color: #666;
        }
        
        .option-value {
          font-weight: 600;
          color: #333;
        }
        
        .option-total {
          margin-top: 15px;
          padding: 12px;
          background: #F7F7F7;
          border-radius: 6px;
          text-align: center;
        }
        
        .option-total-label {
          font-size: 11px;
          color: #666;
          margin-bottom: 4px;
        }
        
        .option-total-value {
          font-size: 16px;
          font-weight: 700;
          color: #333;
        }
        
        .summary-box {
          background: #F7F7F7;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e5e5e5;
          margin: 25px 0;
        }
        
        .summary-box h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 11px;
        }
        
        .summary-item:last-child {
          margin-bottom: 0;
        }
        
        .summary-label {
          color: #666;
        }
        
        .summary-value {
          font-weight: 600;
          color: #333;
        }
        
        .terms {
          font-size: 11px;
          color: #555;
          line-height: 1.6;
        }
        
        .terms li {
          margin-bottom: 6px;
          list-style: disc;
          margin-left: 20px;
        }
        
        .footer {
          background: #0066CC;
          color: white;
          text-align: center;
          padding: 16px;
          margin: 40px -96px -96px -96px;
          font-size: 11px;
        }
        
        .footer-content {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .footer-item {
          white-space: nowrap;
        }
        
        .chart-container {
          margin: 20px 0;
          text-align: center;
          page-break-inside: avoid;
          width: 100%;
        }
        
        .chart-container img {
          max-width: 520px;
          width: 100%;
          height: auto;
          border: 1px solid #e5e5e5;
          border-radius: 4px;
        }
        
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-content">
          <div>
            <h1>BENKON</h1>
            <div class="subtitle">Energy Efficiency Solutions</div>
          </div>
          <div class="page-number">
            Page 1
          </div>
        </div>
      </div>

      <div class="quote-title">
        ${language === 'vi' ? 'BÁO GIÁ' : 'QUOTATION'}
      </div>

      <div class="quote-info">
        <span>${language === 'vi' ? 'Số báo giá' : 'Quote Number'}: ${quoteNumber}</span>
        <span>${language === 'vi' ? 'Ngày' : 'Date'}: ${formatDate(today, language)}</span>
        <span>${language === 'vi' ? 'Hiệu lực đến' : 'Valid Until'}: ${formatDate(validUntil, language)}</span>
      </div>

      <div class="section">
        <div class="section-header">
          ${language === 'vi' ? 'THÔNG TIN KHÁCH HÀNG' : 'CUSTOMER INFORMATION'}
        </div>
        <div class="section-content">
          <table class="info-table">
            ${customerFields.filter(field => field.value).map(field => 
              `<tr>
                <td class="label">${field.label}</td>
                <td class="value">${field.value}</td>
              </tr>`
            ).join('')}
          </table>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          ${language === 'vi' ? 'CHI TIẾT CHI PHÍ' : 'COST BREAKDOWN'}
        </div>
        <div class="section-content">
          <table class="cost-table">
            ${costItems.map(item => 
              `<tr>
                <td class="label">${item.label}</td>
                <td class="value">${item.value}</td>
              </tr>`
            ).join('')}
          </table>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          ${language === 'vi' ? 'SO SÁNH PHƯƠNG THỨC THANH TOÁN' : 'PAYMENT METHOD COMPARISON'}
        </div>
        <div class="section-content">
          <div class="comparison">
            <div class="option-box">
              <div class="option-header purchase-header">
                ${language === 'vi' ? 'MUA TRẢ THẲNG' : 'DIRECT PURCHASE'}
              </div>
              <div class="option-content">
                <div class="option-details">
                  <span class="option-label">${language === 'vi' ? 'Thanh toán ban đầu' : 'Initial Payment'}:</span>
                  <span class="option-value">${formatCurrency(result.purchase.month0Cost, language)}</span>
                </div>
                <div class="option-details">
                  <span class="option-label">${language === 'vi' ? 'Năm thứ 2' : 'Year 2'}:</span>
                  <span class="option-value">${formatCurrency(result.purchase.month13Cost, language)}</span>
                </div>
                <div class="option-total">
                  <div class="option-total-label">${language === 'vi' ? 'Tổng chi phí 2 năm' : 'Total 2-Year Cost'}</div>
                  <div class="option-total-value">${formatCurrency(result.purchase.totalTwoYearCost, language)}</div>
                </div>
              </div>
            </div>

            <div class="option-box">
              <div class="option-header rental-header">
                ${language === 'vi' ? 'THUÊ HỢP ĐỒNG 2 NĂM' : '2-YEAR CONTRACT RENTAL'}
              </div>
              <div class="option-content">
                <div class="option-details">
                  <span class="option-label">${language === 'vi' ? 'Đặt cọc (hoàn trả)' : 'Deposit (refundable)'}:</span>
                  <span class="option-value">${formatCurrency(result.rental.deposit, language)}</span>
                </div>
                <div class="option-details">
                  <span class="option-label">${language === 'vi' ? 'Thanh toán hàng tháng' : 'Monthly Payment'}:</span>
                  <span class="option-value">${formatCurrency(result.rental.monthlyRental, language)}</span>
                </div>
                <div class="option-total">
                  <div class="option-total-label">${language === 'vi' ? 'Tổng chi phí 2 năm' : 'Total 2-Year Cost'}</div>
                  <div class="option-total-value">${formatCurrency(result.rental.totalTwoYearCost, language)}</div>
                  <div style="font-size: 10px; color: #666; margin-top: 4px;">${language === 'vi' ? '(không bao gồm cọc)' : '(excl. deposit)'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${barChartDataUrl ? `
      <div class="section">
        <div class="section-header">
          ${language === 'vi' ? 'BIỂU ĐỒ THANH TOÁN HÀNG THÁNG' : 'MONTHLY PAYMENT CHART'}
        </div>
        <div class="section-content">
          <div class="chart-container">
            <img src="${barChartDataUrl}" alt="${language === 'vi' ? 'Biểu đồ thanh toán' : 'Payment chart'}" />
          </div>
        </div>
      </div>
      ` : ''}

      ${detailedChartDataUrl ? `
      <div class="section">
        <div class="section-header">
          ${language === 'vi' ? 'BIỂU ĐỒ DÒNG TIỀN TÍCH LŨY' : 'CUMULATIVE CASH FLOW CHART'}
        </div>
        <div class="section-content">
          <div class="chart-container">
            <img src="${detailedChartDataUrl}" alt="${language === 'vi' ? 'Biểu đồ dòng tiền tích lũy' : 'Cumulative cash flow chart'}" />
          </div>
        </div>
      </div>
      ` : ''}

      <div class="section">
        <div class="section-header">
          ${language === 'vi' ? 'ĐIỀU KHOẢN & ĐIỀU KIỆN' : 'TERMS & CONDITIONS'}
        </div>
        <div class="section-content">
          <ul class="terms">
            ${terms.map(term => `<li>${term}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          ${language === 'vi' ? 'DÒNG TIỀN CHI TIẾT 24 THÁNG' : 'DETAILED 24-MONTH CASH FLOW'}
        </div>
        <div class="section-content">
          <table style="width: 100%; border-collapse: collapse; font-size: 10px; border: 1px solid #e5e5e5;">
            <thead>
              <tr style="background: #0066CC; color: white;">
                <th style="text-align: left; padding: 10px; font-weight: 600; border-right: 1px solid #4A90E2;">${language === 'vi' ? 'Tháng' : 'Month'}</th>
                <th style="text-align: center; padding: 10px; font-weight: 600; border-right: 1px solid #4A90E2;" colspan="2">${language === 'vi' ? 'Mua trả thẳng' : 'Direct Purchase'}</th>
                <th style="text-align: center; padding: 10px; font-weight: 600;" colspan="2">${language === 'vi' ? 'Thuê hợp đồng' : 'Contract Rental'}</th>
              </tr>
              <tr style="background: #F7F7F7; font-size: 9px; color: #666;">
                <th style="padding: 8px; border-right: 1px solid #e5e5e5;"></th>
                <th style="text-align: right; padding: 8px; border-right: 1px solid #e5e5e5;">${language === 'vi' ? 'Số tiền' : 'Amount'}</th>
                <th style="text-align: right; padding: 8px; border-right: 1px solid #e5e5e5;">${language === 'vi' ? 'Tích lũy' : 'Cumulative'}</th>
                <th style="text-align: right; padding: 8px; border-right: 1px solid #e5e5e5;">${language === 'vi' ? 'Số tiền' : 'Amount'}</th>
                <th style="text-align: right; padding: 8px;">${language === 'vi' ? 'Tích lũy' : 'Cumulative'}</th>
              </tr>
            </thead>
            <tbody>
              ${result.purchase.cashFlow.slice(0, 25).map((purchasePayment, index) => {
                const rentalPayment = result.rental.cashFlow[index];
                const isHighlight = index === 0 || index === 13 || index === 24;
                return `
                  <tr style="border-bottom: 1px solid #f0f0f0; ${isHighlight ? 'background: #fff9c4;' : ''}">
                    <td style="padding: 8px; font-weight: 500; border-right: 1px solid #f0f0f0;">${language === 'vi' ? 'Tháng' : 'Month'} ${index}${index === 0 ? ` (${language === 'vi' ? 'Hiện tại' : 'Now'})` : ''}</td>
                    <td style="text-align: right; padding: 8px; border-right: 1px solid #f0f0f0; ${purchasePayment.amount > 0 ? 'font-weight: 600; color: #3B82F6;' : 'color: #999;'}">
                      ${purchasePayment.amount > 0 ? formatCurrency(purchasePayment.amount, language) : '-'}
                    </td>
                    <td style="text-align: right; padding: 8px; border-right: 1px solid #f0f0f0; color: #666; font-weight: 500;">
                      ${formatCurrency(purchasePayment.cumulativeAmount, language)}
                    </td>
                    <td style="text-align: right; padding: 8px; border-right: 1px solid #f0f0f0; ${rentalPayment.amount > 0 ? 'font-weight: 600; color: #9333EA;' : 'color: #999;'}">
                      ${rentalPayment.amount > 0 ? formatCurrency(rentalPayment.amount, language) : '-'}
                    </td>
                    <td style="text-align: right; padding: 8px; color: #666; font-weight: 500;">
                      ${formatCurrency(rentalPayment.cumulativeAmount, language)}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
            <tfoot>
              <tr style="background: #0066CC; color: white; font-weight: 600;">
                <td style="padding: 12px; border-right: 1px solid #4A90E2;">${language === 'vi' ? 'Tổng cộng' : 'Total'}</td>
                <td style="text-align: right; padding: 12px; font-size: 11px; border-right: 1px solid #4A90E2;" colspan="2">
                  ${formatCurrency(result.purchase.totalTwoYearCost, language)}
                </td>
                <td style="text-align: right; padding: 12px; font-size: 11px;" colspan="2">
                  ${formatCurrency(result.rental.totalTwoYearCost, language)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div class="footer">
        <div class="footer-content">
          <div class="footer-item"><strong>BenKon Energy Efficiency Solutions</strong></div>
          <div class="footer-item">📧 tran.vo@lab2live.com</div>
          <div class="footer-item">📞 0901800990</div>
          <div class="footer-item">📍 53 Nguyen Co Thach, An Loi Dong, Ho Chi Minh</div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export async function generatePDF(
  customer: CustomerInfo,
  costs: CostComponents,
  result: CalculationResult,
  chartElement: HTMLElement | null,
  barChartElement: HTMLElement | null,
  detailedChartElement: HTMLElement | null,
  language: 'vi' | 'en'
): Promise<void> {
  try {
    // Capture charts as images if available
    let chartDataUrl: string | undefined;
    let barChartDataUrl: string | undefined;
    let detailedChartDataUrl: string | undefined;

    const chartConfig = {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: false,
      logging: false
    };

    if (chartElement) {
      const chartCanvas = await html2canvas(chartElement, chartConfig);
      chartDataUrl = chartCanvas.toDataURL('image/png');
    }

    if (barChartElement) {
      const barChartCanvas = await html2canvas(barChartElement, chartConfig);
      barChartDataUrl = barChartCanvas.toDataURL('image/png');
    }

    if (detailedChartElement) {
      const detailedChartCanvas = await html2canvas(detailedChartElement, chartConfig);
      detailedChartDataUrl = detailedChartCanvas.toDataURL('image/png');
    }

    // Create HTML content for PDF
    const htmlContent = createPDFHtml(customer, costs, result, language, chartDataUrl, barChartDataUrl, detailedChartDataUrl);
    
    // Create a temporary div to render HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '800px';
    tempDiv.style.background = 'white';
    
    document.body.appendChild(tempDiv);

    try {
      // Convert HTML to canvas
      const canvas = await html2canvas(tempDiv.querySelector('body') || tempDiv, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: 800,
        height: Math.max(1200, tempDiv.scrollHeight)
      });

      // Create PDF from canvas
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pageHeightMM = pageHeight;

      // If content fits in one page
      if (imgHeight <= pageHeightMM) {
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        // Multiple pages needed
        const totalPages = Math.ceil(imgHeight / pageHeightMM);
        
        for (let page = 0; page < totalPages; page++) {
          if (page > 0) {
            pdf.addPage();
          }

          // Calculate crop area for this page
          const sourceY = page * pageHeightMM * (canvas.height / imgHeight);
          const sourceHeight = Math.min(pageHeightMM * (canvas.height / imgHeight), canvas.height - sourceY);
          
          // Create canvas for this page
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = sourceHeight;
          
          const pageCtx = pageCanvas.getContext('2d')!;
          pageCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
          
          const pageImgData = pageCanvas.toDataURL('image/png');
          const pageImgHeight = (sourceHeight * imgWidth) / canvas.width;
          
          pdf.addImage(pageImgData, 'PNG', 0, 0, imgWidth, pageImgHeight);
        }
      }

      // Save the PDF
      const today = new Date();
      const fileName = `BenKon_Quote_${customer.customerName.replace(/[^a-zA-Z0-9]/g, '_')}_${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}.pdf`;
      pdf.save(fileName);

    } finally {
      // Clean up temporary element
      document.body.removeChild(tempDiv);
    }

  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(language === 'vi' ? 'Không thể tạo PDF. Vui lòng thử lại.' : 'Failed to generate PDF. Please try again.');
  }
}