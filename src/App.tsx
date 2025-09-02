import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import QuoteForm from './components/QuoteForm';
import CostCalculator from './components/CostCalculator';
import CashFlowTable from './components/CashFlowTable';
import CashFlowBarChart from './components/CashFlowBarChart';
import DetailedCashFlowChart from './components/DetailedCashFlowChart';
import LanguageToggle from './components/LanguageToggle';
import { CustomerInfo, CostComponents, CalculationResult } from './types/quote';
import { calculateOptions } from './utils/calculations';
import { RefreshCw, Calculator } from 'lucide-react';
import './i18n';

function App() {
  const { t, i18n } = useTranslation();
  const [, setCustomer] = useState<CustomerInfo | null>(null);
  const [, setCosts] = useState<CostComponents | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Load preferred language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleCalculate = (customerData: CustomerInfo, costsData: CostComponents) => {
    setCustomer(customerData);
    setCosts(costsData);
    const calculationResult = calculateOptions(customerData, costsData);
    setResult(calculationResult);
    setShowResults(true);
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    if (window.confirm(i18n.language === 'vi' 
      ? 'Bạn có chắc chắn muốn làm mới toàn bộ form?' 
      : 'Are you sure you want to reset the entire form?')) {
      setCustomer(null);
      setCosts(null);
      setResult(null);
      setShowResults(false);
      localStorage.removeItem('quoteFormData');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-benkon-blue rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('app.title')}</h1>
                <p className="text-sm text-gray-600">{t('app.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {showResults && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t('actions.reset')}
                </button>
              )}
              <LanguageToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quote Form */}
        <div className="mb-12">
          <QuoteForm onSubmit={handleCalculate} />
        </div>

        {/* Results Section */}
        {showResults && result && (
          <div id="results" className="space-y-8 animate-fadeIn">
            {/* Cost Calculator Summary */}
            <CostCalculator result={result} />


            {/* Cash Flow Bar Chart */}
            <CashFlowBarChart result={result} />

            {/* Detailed Cash Flow Chart */}
            <DetailedCashFlowChart result={result} />

            {/* Cash Flow Table */}
            <CashFlowTable result={result} />

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">BenKon Energy Efficiency Solutions</p>
            <p className="text-gray-400">www.benkon.io | support@benkon.io</p>
            <p className="text-sm text-gray-500 mt-4">
              © {new Date().getFullYear()} BenKon. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;