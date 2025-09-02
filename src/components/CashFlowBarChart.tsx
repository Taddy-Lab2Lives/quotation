import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CalculationResult } from '../types/quote';
import { BarChart2 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CashFlowBarChartProps {
  result: CalculationResult | null;
}

const CashFlowBarChart: React.FC<CashFlowBarChartProps> = ({ result }) => {
  const { t, i18n } = useTranslation();
  const isVietnamese = i18n.language === 'vi';

  if (!result) return null;

  // Create labels for months 0-24
  const labels = Array.from({ length: 25 }, (_, i) => i.toString());

  // Extract payment amounts for each month
  const purchaseData = result.purchase.cashFlow.map(cf => cf.amount);
  const rentalData = result.rental.cashFlow.map(cf => cf.amount);

  const data = {
    labels,
    datasets: [
      {
        label: t('comparison.purchase'),
        data: purchaseData,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: t('comparison.rental'),
        data: rentalData,
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: '500' as any
          },
          padding: 20
        }
      },
      title: {
        display: true,
        text: isVietnamese ? 'Dòng tiền chi tiết 24 tháng' : 'Detailed 24-Month Cash Flow',
        font: {
          size: 16,
          weight: '600' as any
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString('vi-VN') + ' VNĐ';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: t('comparison.month'),
          font: {
            size: 12
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return (value / 1000000).toFixed(0) + 'M';
          }
        },
        title: {
          display: true,
          text: isVietnamese ? 'Thanh toán (VNĐ)' : 'Payment (VND)',
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-6 h-6 text-benkon-blue" />
        <h2 className="text-xl font-semibold text-gray-800">
          {isVietnamese ? 'Biểu đồ dòng tiền' : 'Cash Flow Chart'}
        </h2>
      </div>
      
      <div className="h-96">
        <Bar data={data} options={options} />
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>{isVietnamese ? 'Lưu ý:' : 'Note:'}</strong> {' '}
          {isVietnamese 
            ? 'Tiền đặt cọc 3 tháng (hiển thị ở tháng 0 của phương án thuê) sẽ được hoàn trả khi kết thúc hợp đồng và không tính vào tổng chi phí 2 năm.'
            : 'The 3-month deposit (shown at month 0 for rental option) is refundable at contract end and is not included in the total 2-year cost.'}
        </p>
      </div>
    </div>
  );
};

export default CashFlowBarChart;