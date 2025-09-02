import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculationResult } from '../types/quote';
import { formatCurrency } from '../utils/formatters';
import { Table, ChevronDown, ChevronUp } from 'lucide-react';

interface CashFlowTableProps {
  result: CalculationResult | null;
}

const CashFlowTable: React.FC<CashFlowTableProps> = ({ result }) => {
  const { t, i18n } = useTranslation();
  const isVietnamese = i18n.language === 'vi';
  const [showFullTable, setShowFullTable] = useState(false);

  if (!result) return null;

  const monthsToShow = showFullTable ? 25 : 13;
  const purchaseCashFlow = result.purchase.cashFlow.slice(0, monthsToShow);
  const rentalCashFlow = result.rental.cashFlow.slice(0, monthsToShow);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Table className="w-6 h-6 text-benkon-blue" />
          <h2 className="text-xl font-semibold text-gray-800">
            {isVietnamese ? 'Dòng Tiền Chi Tiết' : 'Detailed Cash Flow'}
          </h2>
        </div>
        <button
          onClick={() => setShowFullTable(!showFullTable)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-benkon-blue hover:bg-blue-50 rounded-lg transition-colors"
        >
          {showFullTable ? (
            <>
              <ChevronUp className="w-4 h-4" />
              {isVietnamese ? 'Thu gọn' : 'Show less'}
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              {isVietnamese ? 'Xem tất cả' : 'Show all'}
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                {t('comparison.month')}
              </th>
              <th className="text-right py-3 px-4 font-semibold text-blue-600" colSpan={2}>
                {t('comparison.purchase')}
              </th>
              <th className="text-right py-3 px-4 font-semibold text-purple-600" colSpan={2}>
                {t('comparison.rental')}
              </th>
            </tr>
            <tr className="border-b border-gray-200 text-sm text-gray-600">
              <th className="text-left py-2 px-4"></th>
              <th className="text-right py-2 px-4">{t('comparison.amount')}</th>
              <th className="text-right py-2 px-4">{t('comparison.cumulative')}</th>
              <th className="text-right py-2 px-4">{t('comparison.amount')}</th>
              <th className="text-right py-2 px-4">{t('comparison.cumulative')}</th>
            </tr>
          </thead>
          <tbody>
            {purchaseCashFlow.map((_, index) => {
              const purchasePayment = purchaseCashFlow[index];
              const rentalPayment = rentalCashFlow[index];
              const isHighlightMonth = index === 0 || index === 13 || index === 24;

              return (
                <tr 
                  key={index} 
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    isHighlightMonth ? 'bg-yellow-50' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-medium text-gray-700">
                    {index === 0 ? (
                      <span className="inline-flex items-center gap-1">
                        {`${t('comparison.month')} ${index}`}
                        <span className="text-xs text-gray-500">
                          ({isVietnamese ? 'Hiện tại' : 'Now'})
                        </span>
                      </span>
                    ) : (
                      `${t('comparison.month')} ${index}`
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {purchasePayment.amount > 0 ? (
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(purchasePayment.amount, isVietnamese ? 'vi' : 'en')}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {formatCurrency(purchasePayment.cumulativeAmount, isVietnamese ? 'vi' : 'en')}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {rentalPayment.amount > 0 ? (
                      <span className="font-semibold text-purple-600">
                        {formatCurrency(rentalPayment.amount, isVietnamese ? 'vi' : 'en')}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {formatCurrency(rentalPayment.cumulativeAmount, isVietnamese ? 'vi' : 'en')}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-semibold">
              <td className="py-4 px-4 text-gray-700">
                {isVietnamese ? 'Tổng cộng' : 'Total'}
              </td>
              <td className="py-4 px-4 text-right" colSpan={2}>
                <span className="text-blue-600 text-lg">
                  {formatCurrency(result.purchase.totalTwoYearCost, isVietnamese ? 'vi' : 'en')}
                </span>
              </td>
              <td className="py-4 px-4 text-right" colSpan={2}>
                <span className="text-purple-600 text-lg">
                  {formatCurrency(result.rental.totalTwoYearCost, isVietnamese ? 'vi' : 'en')}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {!showFullTable && (
        <div className="mt-4 text-center text-sm text-gray-500">
          {isVietnamese 
            ? 'Nhấn "Xem tất cả" để xem dòng tiền đầy đủ 24 tháng' 
            : 'Click "Show all" to see full 24-month cash flow'}
        </div>
      )}
    </div>
  );
};

export default CashFlowTable;