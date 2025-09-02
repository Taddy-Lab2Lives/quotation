import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomerInfo, CostComponents } from '../types/quote';
import { parseNumberInput } from '../utils/formatters';
import { User, Building2, MapPin, Phone, Store, DollarSign } from 'lucide-react';

interface QuoteFormProps {
  onSubmit: (customer: CustomerInfo, costs: CostComponents) => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation();

  const [customer, setCustomer] = useState<CustomerInfo>({
    customerName: '',
    companyName: '',
    address: '',
    contact: '',
    numberOfStores: 1
  });

  const [costs, setCosts] = useState<CostComponents>({
    hardwareCost: 6500000,
    softwareCostPerYear: 5000000,
    installationCostPerStore: 1600000,
    setupServicePerStore: 1200000
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('quoteFormData');
    if (savedData) {
      const { customer: savedCustomer, costs: savedCosts } = JSON.parse(savedData);
      setCustomer(savedCustomer);
      setCosts(savedCosts);
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('quoteFormData', JSON.stringify({ customer, costs }));
  }, [customer, costs]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customer.customerName.trim()) {
      newErrors.customerName = t('validation.required');
    }

    if (customer.numberOfStores < 1) {
      newErrors.numberOfStores = t('validation.minValue');
    }

    Object.keys(costs).forEach(key => {
      if ((costs as any)[key] <= 0) {
        newErrors[key] = t('validation.minValue');
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(customer, costs);
    }
  };

  const formatInputValue = (value: number): string => {
    return value.toLocaleString('vi-VN');
  };

  const handleCostChange = (field: keyof CostComponents, value: string) => {
    const numericValue = parseNumberInput(value);
    setCosts(prev => ({ ...prev, [field]: numericValue }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Customer Information Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-benkon-blue" />
          {t('customer.title')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('customer.name')} *
            </label>
            <input
              type="text"
              value={customer.customerName}
              onChange={e => setCustomer(prev => ({ ...prev, customerName: e.target.value }))}
              placeholder={t('customer.namePlaceholder')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-benkon-blue focus:border-transparent ${
                errors.customerName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.customerName && (
              <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="w-4 h-4 inline mr-1" />
              {t('customer.company')}
            </label>
            <input
              type="text"
              value={customer.companyName}
              onChange={e => setCustomer(prev => ({ ...prev, companyName: e.target.value }))}
              placeholder={t('customer.companyPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-benkon-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              {t('customer.address')}
            </label>
            <input
              type="text"
              value={customer.address}
              onChange={e => setCustomer(prev => ({ ...prev, address: e.target.value }))}
              placeholder={t('customer.addressPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-benkon-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              {t('customer.contact')}
            </label>
            <input
              type="text"
              value={customer.contact}
              onChange={e => setCustomer(prev => ({ ...prev, contact: e.target.value }))}
              placeholder={t('customer.contactPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-benkon-blue focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Store className="w-4 h-4 inline mr-1" />
              {t('customer.stores')} *
            </label>
            <input
              type="number"
              min="1"
              value={customer.numberOfStores}
              onChange={e => setCustomer(prev => ({ ...prev, numberOfStores: parseInt(e.target.value) || 1 }))}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-benkon-blue focus:border-transparent ${
                errors.numberOfStores ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.numberOfStores && (
              <p className="text-red-500 text-sm mt-1">{errors.numberOfStores}</p>
            )}
          </div>
        </div>
      </div>

      {/* Cost Components Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-benkon-blue" />
          {t('costs.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('costs.hardware')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={formatInputValue(costs.hardwareCost)}
                onChange={e => handleCostChange('hardwareCost', e.target.value)}
                className={`w-full px-4 py-2 pr-16 border rounded-lg focus:ring-2 focus:ring-benkon-blue focus:border-transparent ${
                  errors.hardwareCost ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                VNĐ
              </span>
            </div>
            {errors.hardwareCost && (
              <p className="text-red-500 text-sm mt-1">{errors.hardwareCost}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('costs.software')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={formatInputValue(costs.softwareCostPerYear)}
                onChange={e => handleCostChange('softwareCostPerYear', e.target.value)}
                className={`w-full px-4 py-2 pr-16 border rounded-lg focus:ring-2 focus:ring-benkon-blue focus:border-transparent ${
                  errors.softwareCostPerYear ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                VNĐ
              </span>
            </div>
            {errors.softwareCostPerYear && (
              <p className="text-red-500 text-sm mt-1">{errors.softwareCostPerYear}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('costs.installation')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={formatInputValue(costs.installationCostPerStore)}
                onChange={e => handleCostChange('installationCostPerStore', e.target.value)}
                className={`w-full px-4 py-2 pr-16 border rounded-lg focus:ring-2 focus:ring-benkon-blue focus:border-transparent ${
                  errors.installationCostPerStore ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                VNĐ
              </span>
            </div>
            {errors.installationCostPerStore && (
              <p className="text-red-500 text-sm mt-1">{errors.installationCostPerStore}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('costs.setup')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={formatInputValue(costs.setupServicePerStore)}
                onChange={e => handleCostChange('setupServicePerStore', e.target.value)}
                className={`w-full px-4 py-2 pr-16 border rounded-lg focus:ring-2 focus:ring-benkon-blue focus:border-transparent ${
                  errors.setupServicePerStore ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                VNĐ
              </span>
            </div>
            {errors.setupServicePerStore && (
              <p className="text-red-500 text-sm mt-1">{errors.setupServicePerStore}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-benkon-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {t('actions.calculate')}
        </button>
      </div>
    </form>
  );
};

export default QuoteForm;