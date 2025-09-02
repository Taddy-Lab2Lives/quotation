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
          padding: 72px;
          font-size: 12px;
          line-height: 1.4;
          color: #333;
          background: white;
          width: 648px;
          box-sizing: border-box;
        }
        
        .header {
          background: #0066CC;
          color: white;
          padding: 15px 20px;
          margin: -72px -72px 20px -72px;
          position: relative;
        }
        
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
        }
        
        .header .subtitle {
          margin: 5px 0 0 0;
          font-size: 11px;
          opacity: 0.9;
        }
        
        .quote-title {
          text-align: center;
          font-size: 20px;
          font-weight: 700;
          margin: 20px 0;
          color: #0066CC;
        }
        
        .quote-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 25px;
          font-size: 10px;
          color: #666;
        }
        
        .section {
          margin-bottom: 25px;
        }
        
        .section-header {
          background: #f5f5f5;
          padding: 8px 12px;
          font-weight: 600;
          font-size: 13px;
          margin-bottom: 15px;
          border-left: 4px solid #0066CC;
        }
        
        .field {
          margin-bottom: 6px;
        }
        
        .cost-table {
          width: 100%;
        }
        
        .cost-table tr {
          border-bottom: 1px solid #eee;
        }
        
        .cost-table td {
          padding: 8px 0;
        }
        
        .cost-table .label {
          width: 70%;
        }
        
        .cost-table .value {
          text-align: right;
          font-weight: 600;
        }
        
        .comparison {
          display: flex;
          gap: 20px;
          margin: 20px 0;
        }
        
        .option-box {
          flex: 1;
          border: 2px solid;
          border-radius: 8px;
          padding: 15px;
        }
        
        .purchase-box {
          border-color: #3B82F6;
        }
        
        .rental-box {
          border-color: #9333EA;
        }
        
        .option-title {
          font-weight: 700;
          font-size: 13px;
          margin-bottom: 10px;
        }
        
        .purchase-title {
          color: #3B82F6;
        }
        
        .rental-title {
          color: #9333EA;
        }
        
        .option-details {
          font-size: 10px;
          margin-bottom: 8px;
        }
        
        .option-total {
          font-weight: 700;
          font-size: 12px;
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px solid #eee;
        }
        
        .summary-box {
          background: #fff8dc;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
        }
        
        .terms {
          font-size: 10px;
          color: #555;
        }
        
        .terms li {
          margin-bottom: 4px;
        }
        
        .footer {
          background: #0066CC;
          color: white;
          text-align: center;
          padding: 10px;
          margin: 30px -72px -72px -72px;
          font-size: 10px;
        }
        
        .chart-container {
          margin: 20px 0;
          text-align: center;
          page-break-inside: avoid;
          width: 100%;
        }
        
        .chart-container img {
          max-width: 580px;
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
        <h1>BENKON</h1>
        <div class="subtitle">Energy Efficiency Solutions</div>
        <div style="float: right; margin-top: -30px;">www.benkon.io</div>
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
        ${customerFields.filter(field => field.value).map(field => 
          `<div class="field"><strong>${field.label}:</strong> ${field.value}</div>`
        ).join('')}
      </div>

      <div class="section">
        <div class="section-header">
          ${language === 'vi' ? 'CHI TIẾT CHI PHÍ' : 'COST BREAKDOWN'}
        </div>
        <table class="cost-table">
          ${costItems.map(item => 
            `<tr>
              <td class="label">${item.label}</td>
              <td class="value">${item.value}</td>
            </tr>`
          ).join('')}
        </table>
      </div>

      <div class="section">
        <div class="section-header">
          ${language === 'vi' ? 'SO SÁNH PHƯƠNG THỨC THANH TOÁN' : 'PAYMENT METHOD COMPARISON'}
        </div>
        
        <div class="comparison">
          <div class="option-box purchase-box">
            <div class="option-title purchase-title">
              ${language === 'vi' ? 'MUA TRẢ THẲNG' : 'DIRECT PURCHASE'}
            </div>
            <div class="option-details">
              ${language === 'vi' ? 'Thanh toán ban đầu' : 'Initial Payment'}: ${formatCurrency(result.purchase.month0Cost, language)}
            </div>
            <div class="option-details">
              ${language === 'vi' ? 'Năm thứ 2' : 'Year 2'}: ${formatCurrency(result.purchase.month13Cost, language)}
            </div>
            <div class="option-total purchase-title">
              ${language === 'vi' ? 'Tổng cộng' : 'Total'}: ${formatCurrency(result.purchase.totalTwoYearCost, language)}
            </div>
          </div>

          <div class="option-box rental-box">
            <div class="option-title rental-title">
              ${language === 'vi' ? 'THUÊ HỢP ĐỒNG 2 NĂM' : '2-YEAR CONTRACT RENTAL'}
            </div>
            <div class="option-details">
              ${language === 'vi' ? 'Đặt cọc (hoàn trả)' : 'Deposit (refundable)'}: ${formatCurrency(result.rental.deposit, language)}
            </div>
            <div class="option-details">
              ${language === 'vi' ? 'Hàng tháng' : 'Monthly'}: ${formatCurrency(result.rental.monthlyRental, language)}
            </div>
            <div class="option-total rental-title">
              ${language === 'vi' ? 'Tổng cộng' : 'Total'}: ${formatCurrency(result.rental.totalTwoYearCost, language)}
              <br><small>${language === 'vi' ? '(không bao gồm cọc)' : '(excl. deposit)'}</small>
            </div>
          </div>
        </div>
      </div>

      <div class="summary-box">
        <h4>${language === 'vi' ? 'TÓM TẮT DÒNG TIỀN 24 THÁNG' : '24-MONTH CASH FLOW SUMMARY'}</h4>
        <div>${language === 'vi' ? 'Mua trả thẳng' : 'Direct Purchase'}: <strong>${formatCurrency(result.purchase.totalTwoYearCost, language)}</strong></div>
        <div>${language === 'vi' ? 'Thuê hợp đồng' : 'Contract Rental'}: <strong>${formatCurrency(result.rental.totalTwoYearCost, language)}</strong> ${language === 'vi' ? '(không bao gồm cọc)' : '(excl. deposit)'}</div>
      </div>

      <div class="section">
        <div class="section-header">
          ${language === 'vi' ? 'DÒNG TIỀN CHI TIẾT 24 THÁNG' : 'DETAILED 24-MONTH CASH FLOW'}
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
          <thead>
            <tr style="border-bottom: 2px solid #ddd; background: #f8f9fa;">
              <th style="text-align: left; padding: 8px; font-weight: 600;">${language === 'vi' ? 'Tháng' : 'Month'}</th>
              <th style="text-align: right; padding: 8px; font-weight: 600; color: #3B82F6;" colspan="2">${language === 'vi' ? 'Mua trả thẳng' : 'Direct Purchase'}</th>
              <th style="text-align: right; padding: 8px; font-weight: 600; color: #9333EA;" colspan="2">${language === 'vi' ? 'Thuê hợp đồng' : 'Contract Rental'}</th>
            </tr>
            <tr style="border-bottom: 1px solid #ddd; background: #f8f9fa; font-size: 9px; color: #666;">
              <th style="padding: 6px;"></th>
              <th style="text-align: right; padding: 6px;">${language === 'vi' ? 'Số tiền' : 'Amount'}</th>
              <th style="text-align: right; padding: 6px;">${language === 'vi' ? 'Tích lũy' : 'Cumulative'}</th>
              <th style="text-align: right; padding: 6px;">${language === 'vi' ? 'Số tiền' : 'Amount'}</th>
              <th style="text-align: right; padding: 6px;">${language === 'vi' ? 'Tích lũy' : 'Cumulative'}</th>
            </tr>
          </thead>
          <tbody>
            ${result.purchase.cashFlow.slice(0, 25).map((purchasePayment, index) => {
              const rentalPayment = result.rental.cashFlow[index];
              const isHighlight = index === 0 || index === 13 || index === 24;
              return `
                <tr style="border-bottom: 1px solid #eee; ${isHighlight ? 'background: #fffbeb;' : ''}">
                  <td style="padding: 6px; font-weight: 500;">${language === 'vi' ? 'Tháng' : 'Month'} ${index}${index === 0 ? ` (${language === 'vi' ? 'Hiện tại' : 'Now'})` : ''}</td>
                  <td style="text-align: right; padding: 6px; ${purchasePayment.amount > 0 ? 'font-weight: 600; color: #3B82F6;' : 'color: #999;'}">
                    ${purchasePayment.amount > 0 ? formatCurrency(purchasePayment.amount, language) : '-'}
                  </td>
                  <td style="text-align: right; padding: 6px; color: #666;">
                    ${formatCurrency(purchasePayment.cumulativeAmount, language)}
                  </td>
                  <td style="text-align: right; padding: 6px; ${rentalPayment.amount > 0 ? 'font-weight: 600; color: #9333EA;' : 'color: #999;'}">
                    ${rentalPayment.amount > 0 ? formatCurrency(rentalPayment.amount, language) : '-'}
                  </td>
                  <td style="text-align: right; padding: 6px; color: #666;">
                    ${formatCurrency(rentalPayment.cumulativeAmount, language)}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
          <tfoot>
            <tr style="background: #f1f5f9; font-weight: 600; border-top: 2px solid #ddd;">
              <td style="padding: 10px; color: #374151;">${language === 'vi' ? 'Tổng cộng' : 'Total'}</td>
              <td style="text-align: right; padding: 10px; color: #3B82F6; font-size: 11px;" colspan="2">
                ${formatCurrency(result.purchase.totalTwoYearCost, language)}
              </td>
              <td style="text-align: right; padding: 10px; color: #9333EA; font-size: 11px;" colspan="2">
                ${formatCurrency(result.rental.totalTwoYearCost, language)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      ${barChartDataUrl ? `
      <div class="section">
        <div class="section-header">
          ${language === 'vi' ? 'BIỂU ĐỒ THANH TOÁN HÀNG THÁNG' : 'MONTHLY PAYMENT CHART'}
        </div>
        <div class="chart-container">
          <img src="${barChartDataUrl}" alt="${language === 'vi' ? 'Biểu đồ thanh toán' : 'Payment chart'}" />
        </div>
      </div>
      ` : ''}

      ${detailedChartDataUrl ? `
      <div class="section">
        <div class="section-header">
          ${language === 'vi' ? 'BIỂU ĐỒ DÒNG TIỀN TÍCH LŨY' : 'CUMULATIVE CASH FLOW CHART'}
        </div>
        <div class="chart-container">
          <img src="${detailedChartDataUrl}" alt="${language === 'vi' ? 'Biểu đồ dòng tiền tích lũy' : 'Cumulative cash flow chart'}" />
        </div>
      </div>
      ` : ''}

      <div class="section">
        <div class="section-header">
          ${language === 'vi' ? 'ĐIỀU KHOẢN & ĐIỀU KIỆN' : 'TERMS & CONDITIONS'}
        </div>
        <ul class="terms">
          ${terms.map(term => `<li>• ${term}</li>`).join('')}
        </ul>
      </div>

      <div class="footer">
        <div><strong>BenKon Energy Efficiency Solutions</strong></div>
        <div>www.benkon.io | support@benkon.io</div>
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