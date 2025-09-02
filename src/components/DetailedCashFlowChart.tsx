import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { CalculationResult } from '../types/quote';
import { TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DetailedCashFlowChartProps {
  result: CalculationResult | null;
}

const DetailedCashFlowChart: React.FC<DetailedCashFlowChartProps> = ({ result }) => {
  const { t, i18n } = useTranslation();
  const isVietnamese = i18n.language === 'vi';

  if (!result) return null;

  // Create labels for months 0-24
  const labels = Array.from({ length: 25 }, (_, i) => 
    i === 0 ? (isVietnamese ? 'Hiện tại' : 'Now') : `${isVietnamese ? 'Tháng' : 'Month'} ${i}`
  );

  // Extract cumulative amounts for each month
  const purchaseCumulative = result.purchase.cashFlow.map(cf => cf.cumulativeAmount);
  const rentalCumulative = result.rental.cashFlow.map(cf => cf.cumulativeAmount);

  const data = {
    labels,
    datasets: [
      {
        label: isVietnamese ? 'Mua trả thẳng (Tích lũy)' : 'Direct Purchase (Cumulative)',
        data: purchaseCumulative,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.1,
        fill: true
      },
      {
        label: isVietnamese ? 'Thuê hợp đồng (Tích lũy)' : 'Contract Rental (Cumulative)',
        data: rentalCumulative,
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(147, 51, 234)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.1,
        fill: true
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
          padding: 20,
          usePointStyle: true,
          pointStyle: 'line'
        }
      },
      title: {
        display: true,
        text: isVietnamese ? 'Dòng tiền tích lũy 24 tháng' : 'Cumulative 24-Month Cash Flow',
        font: {
          size: 18,
          weight: '600' as any
        },
        padding: {
          bottom: 30
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
          },
          afterLabel: function(context: any) {
            const monthIndex = context.dataIndex;
            if (monthIndex === 0) {
              return isVietnamese ? 'Thanh toán ban đầu' : 'Initial payment';
            } else if (monthIndex === 13) {
              return isVietnamese ? 'Năm thứ 2 bắt đầu' : 'Year 2 begins';
            } else if (monthIndex === 24) {
              return isVietnamese ? 'Kết thúc hợp đồng' : 'Contract end';
            }
            return '';
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: isVietnamese ? 'Thời gian' : 'Timeline',
          font: {
            size: 12,
            weight: '500' as any
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          maxTicksLimit: 13,
          font: {
            size: 10
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return (value / 1000000).toFixed(0) + 'M VNĐ';
          },
          font: {
            size: 11
          }
        },
        title: {
          display: true,
          text: isVietnamese ? 'Chi phí tích lũy (VNĐ)' : 'Cumulative Cost (VND)',
          font: {
            size: 12,
            weight: '500' as any
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-6 h-6 text-benkon-blue" />
        <h2 className="text-xl font-semibold text-gray-800">
          {isVietnamese ? 'Biểu đồ dòng tiền tích lũy' : 'Cumulative Cash Flow Chart'}
        </h2>
      </div>
      
      <div className="h-96">
        <Line data={data} options={options} />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <h4 className="font-semibold text-blue-800 mb-2">
            {isVietnamese ? 'Mua trả thẳng' : 'Direct Purchase'}
          </h4>
          <div className="text-sm text-blue-700">
            <div>{isVietnamese ? 'Tổng chi phí:' : 'Total cost:'} <strong>{result.purchase.totalTwoYearCost.toLocaleString('vi-VN')} VNĐ</strong></div>
            <div className="mt-1">{isVietnamese ? 'Thanh toán tháng 0:' : 'Month 0 payment:'} {result.purchase.month0Cost.toLocaleString('vi-VN')} VNĐ</div>
            <div>{isVietnamese ? 'Thanh toán tháng 13:' : 'Month 13 payment:'} {result.purchase.month13Cost.toLocaleString('vi-VN')} VNĐ</div>
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
          <h4 className="font-semibold text-purple-800 mb-2">
            {isVietnamese ? 'Thuê hợp đồng 2 năm' : '2-Year Contract Rental'}
          </h4>
          <div className="text-sm text-purple-700">
            <div>{isVietnamese ? 'Tổng chi phí:' : 'Total cost:'} <strong>{result.rental.totalTwoYearCost.toLocaleString('vi-VN')} VNĐ</strong></div>
            <div className="mt-1">{isVietnamese ? 'Đặt cọc:' : 'Deposit:'} {result.rental.deposit.toLocaleString('vi-VN')} VNĐ ({isVietnamese ? 'hoàn trả' : 'refundable'})</div>
            <div>{isVietnamese ? 'Hàng tháng:' : 'Monthly:'} {result.rental.monthlyRental.toLocaleString('vi-VN')} VNĐ</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedCashFlowChart;