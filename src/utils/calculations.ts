import { 
  CostComponents, 
  CustomerInfo, 
  CalculationResult, 
  PurchaseOption, 
  RentalOption, 
  MonthlyPayment 
} from '../types/quote';

export function calculateOptions(
  customer: CustomerInfo, 
  costs: CostComponents
): CalculationResult {
  const totalHardwareCost = costs.hardwareCost;
  const totalInstallationCost = costs.installationCostPerStore * customer.numberOfStores;
  const totalSetupCost = costs.setupServicePerStore * customer.numberOfStores;
  const yearlyServiceCost = costs.softwareCostPerYear;

  // Purchase Option Calculation
  const purchaseMonth0 = totalHardwareCost + totalInstallationCost + totalSetupCost + yearlyServiceCost;
  const purchaseMonth13 = yearlyServiceCost;
  const purchaseTotalTwoYear = purchaseMonth0 + purchaseMonth13;

  // Rental Option Calculation
  const twoYearBaseCost = totalHardwareCost + totalInstallationCost + totalSetupCost + (yearlyServiceCost * 2);
  const monthlyRental = Math.round((twoYearBaseCost * 1.2) / 24);
  const deposit = monthlyRental * 3;
  // Total 2-year cost excludes deposit as it's refundable
  const rentalTotalTwoYear = monthlyRental * 24;

  // Generate cash flow for purchase option
  const purchaseCashFlow: MonthlyPayment[] = [];
  let purchaseCumulative = 0;
  
  for (let month = 0; month <= 24; month++) {
    let amount = 0;
    if (month === 0) {
      amount = purchaseMonth0;
    } else if (month === 13) {
      amount = purchaseMonth13;
    }
    purchaseCumulative += amount;
    purchaseCashFlow.push({
      month,
      amount,
      cumulativeAmount: purchaseCumulative
    });
  }

  // Generate cash flow for rental option
  const rentalCashFlow: MonthlyPayment[] = [];
  let rentalCumulative = 0;
  
  for (let month = 0; month <= 24; month++) {
    let amount = 0;
    if (month === 0) {
      amount = deposit;
    } else {
      amount = monthlyRental;
    }
    rentalCumulative += amount;
    rentalCashFlow.push({
      month,
      amount,
      cumulativeAmount: rentalCumulative
    });
  }

  const purchase: PurchaseOption = {
    month0Cost: purchaseMonth0,
    month13Cost: purchaseMonth13,
    totalTwoYearCost: purchaseTotalTwoYear,
    cashFlow: purchaseCashFlow
  };

  const rental: RentalOption = {
    monthlyRental,
    deposit,
    totalTwoYearCost: rentalTotalTwoYear,
    cashFlow: rentalCashFlow
  };

  return { purchase, rental };
}