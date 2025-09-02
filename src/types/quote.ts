export interface CustomerInfo {
  customerName: string;
  companyName?: string;
  address?: string;
  contact?: string;
  numberOfStores: number;
}

export interface CostComponents {
  hardwareCost: number;
  softwareCostPerYear: number;
  installationCostPerStore: number;
  setupServicePerStore: number;
}

export interface QuoteData {
  customer: CustomerInfo;
  costs: CostComponents;
  createdAt: Date;
  validUntil: Date;
}

export interface CalculationResult {
  purchase: PurchaseOption;
  rental: RentalOption;
}

export interface PurchaseOption {
  month0Cost: number;
  month13Cost: number;
  totalTwoYearCost: number;
  cashFlow: MonthlyPayment[];
}

export interface RentalOption {
  monthlyRental: number;
  deposit: number;
  totalTwoYearCost: number;
  cashFlow: MonthlyPayment[];
}

export interface MonthlyPayment {
  month: number;
  amount: number;
  cumulativeAmount: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill?: boolean;
    tension?: number;
  }[];
}

export type Language = 'vi' | 'en';