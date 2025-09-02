import React from 'react';
import { useTranslation } from 'react-i18next';
import { CalculationResult } from '../types/quote';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, TrendingDown, Calendar, CreditCard } from 'lucide-react';

interface CostCalculatorProps {
  result: CalculationResult | null;
}

const CostCalculator: React.FC<CostCalculatorProps> = ({ result }) => {
  const { t, i18n } = useTranslation();
  const isVietnamese = i18n.language === 'vi';

  if (!result) return null;

  const savings = result.purchase.totalTwoYearCost - result.rental.totalTwoYearCost;
  const savingsPercentage = Math.abs((savings / result.rental.totalTwoYearCost) * 100);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-benkon-blue" />
        {t('comparison.title')}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase Option Card */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg border border-blue-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {t('comparison.purchase')}
            </h3>
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">{t('comparison.initialPayment')}:</span>
              <span className="font-semibold text-lg">
                {formatCurrency(result.purchase.month0Cost, isVietnamese ? 'vi' : 'en')}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">{t('comparison.secondYear')}:</span>
              <span className="font-semibold text-lg">
                {formatCurrency(result.purchase.month13Cost, isVietnamese ? 'vi' : 'en')}
              </span>
            </div>

            <div className="bg-blue-100 rounded-lg p-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">{t('comparison.totalCost')}:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(result.purchase.totalTwoYearCost, isVietnamese ? 'vi' : 'en')}
                </span>
              </div>
            </div>

            {savings > 0 && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>
                  {t('comparison.savings')}: {formatCurrency(savings, isVietnamese ? 'vi' : 'en')} 
                  ({savingsPercentage.toFixed(1)}%)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Rental Option Card */}
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-lg border border-purple-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {t('comparison.rental')}
            </h3>
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">{t('comparison.deposit')}:</span>
              <span className="font-semibold text-lg">
                {formatCurrency(result.rental.deposit, isVietnamese ? 'vi' : 'en')}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">{t('comparison.monthlyCost')}:</span>
              <span className="font-semibold text-lg">
                {formatCurrency(result.rental.monthlyRental, isVietnamese ? 'vi' : 'en')}
              </span>
            </div>

            <div className="bg-purple-100 rounded-lg p-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">{t('comparison.totalCost')}:</span>
                <span className="text-2xl font-bold text-purple-600">
                  {formatCurrency(result.rental.totalTwoYearCost, isVietnamese ? 'vi' : 'en')}
                </span>
              </div>
              <p className="text-xs text-purple-600 mt-2">
                {isVietnamese ? '(không bao gồm tiền cọc hoàn trả)' : '(excludes refundable deposit)'}
              </p>
            </div>

            {savings < 0 && (
              <div className="flex items-center gap-2 text-orange-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>
                  {isVietnamese ? 'Chi phí cao hơn' : 'Higher cost'}: {formatCurrency(Math.abs(savings), isVietnamese ? 'vi' : 'en')} 
                  ({savingsPercentage.toFixed(1)}%)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">
              {isVietnamese ? 'Phương án tốt nhất' : 'Best Option'}
            </p>
            <p className="text-lg font-bold text-benkon-blue">
              {savings > 0 ? t('comparison.purchase') : t('comparison.rental')}
            </p>
          </div>
          <div className="h-12 w-px bg-gray-300"></div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">
              {isVietnamese ? 'Chênh lệch' : 'Difference'}
            </p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(Math.abs(savings), isVietnamese ? 'vi' : 'en')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostCalculator;