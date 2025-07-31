// Tax calculation logic for 1031 exchanges
export interface TaxCalculationInput {
  salePrice: number;
  purchasePrice: number;
  improvements: number;
  closingCosts: number;
  state: string;
  filingStatus: 'single' | 'married_joint' | 'married_separate' | 'head_of_household';
  income: number;
}

export interface TaxCalculationResult {
  originalBasis: number;
  adjustedBasis: number;
  capitalGain: number;
  federalTax: number;
  stateTax: number;
  netInvestmentIncomeTax: number;
  totalTaxWithout1031: number;
  totalTaxWith1031: number;
  taxSavings: number;
  percentageSaved: number;
}

// 2024 Federal capital gains tax rates
const federalCapitalGainsRates = {
  single: [
    { min: 0, max: 47025, rate: 0 },
    { min: 47025, max: 518900, rate: 0.15 },
    { min: 518900, max: Infinity, rate: 0.20 }
  ],
  married_joint: [
    { min: 0, max: 94050, rate: 0 },
    { min: 94050, max: 583750, rate: 0.15 },
    { min: 583750, max: Infinity, rate: 0.20 }
  ],
  married_separate: [
    { min: 0, max: 47025, rate: 0 },
    { min: 47025, max: 291850, rate: 0.15 },
    { min: 291850, max: Infinity, rate: 0.20 }
  ],
  head_of_household: [
    { min: 0, max: 63000, rate: 0 },
    { min: 63000, max: 551350, rate: 0.15 },
    { min: 551350, max: Infinity, rate: 0.20 }
  ]
};

// State capital gains tax rates (2024)
const stateCapitalGainsRates: Record<string, number> = {
  'AL': 0.05,
  'AK': 0,
  'AZ': 0.025,
  'AR': 0.059,
  'CA': 0.133, // Highest bracket
  'CO': 0.044,
  'CT': 0.069,
  'DE': 0.066,
  'FL': 0,
  'GA': 0.0575,
  'HI': 0.11,
  'ID': 0.058,
  'IL': 0.0495,
  'IN': 0.0323,
  'IA': 0.06,
  'KS': 0.057,
  'KY': 0.045,
  'LA': 0.045,
  'ME': 0.0715,
  'MD': 0.0575,
  'MA': 0.05,
  'MI': 0.0425,
  'MN': 0.0985,
  'MS': 0.05,
  'MO': 0.054,
  'MT': 0.0675,
  'NE': 0.0684,
  'NV': 0,
  'NH': 0.05, // Interest and dividends only
  'NJ': 0.1075,
  'NM': 0.059,
  'NY': 0.109,
  'NC': 0.0475,
  'ND': 0.029,
  'OH': 0.03,
  'OK': 0.0475,
  'OR': 0.099,
  'PA': 0.0307,
  'RI': 0.0599,
  'SC': 0.065,
  'SD': 0,
  'TN': 0,
  'TX': 0,
  'UT': 0.0465,
  'VT': 0.087,
  'VA': 0.0575,
  'WA': 0.07, // New capital gains tax on high earners
  'WV': 0.065,
  'WI': 0.0765,
  'WY': 0,
  'DC': 0.1075
};

// Net Investment Income Tax threshold
const NIITThreshold = {
  single: 200000,
  married_joint: 250000,
  married_separate: 125000,
  head_of_household: 200000
};

export function calculateTaxSavings(input: TaxCalculationInput): TaxCalculationResult {
  // Calculate basis
  const originalBasis = input.purchasePrice + input.improvements + input.closingCosts;
  const adjustedBasis = originalBasis; // Simplified - in reality would include depreciation
  
  // Calculate capital gain
  const capitalGain = Math.max(0, input.salePrice - adjustedBasis);
  
  // Calculate federal capital gains tax
  const brackets = federalCapitalGainsRates[input.filingStatus];
  let federalTax = 0;
  
  for (const bracket of brackets) {
    if (input.income > bracket.min) {
      const taxableInThisBracket = Math.min(capitalGain, bracket.max - bracket.min);
      federalTax += taxableInThisBracket * bracket.rate;
    }
  }
  
  // Calculate state tax
  const stateRate = stateCapitalGainsRates[input.state] || 0;
  const stateTax = capitalGain * stateRate;
  
  // Calculate Net Investment Income Tax (3.8% for high earners)
  const niitThreshold = NIITThreshold[input.filingStatus];
  const netInvestmentIncomeTax = input.income > niitThreshold ? capitalGain * 0.038 : 0;
  
  // Total taxes
  const totalTaxWithout1031 = federalTax + stateTax + netInvestmentIncomeTax;
  const totalTaxWith1031 = 0; // Deferred with 1031 exchange
  const taxSavings = totalTaxWithout1031 - totalTaxWith1031;
  const percentageSaved = capitalGain > 0 ? (taxSavings / totalTaxWithout1031) * 100 : 0;
  
  return {
    originalBasis,
    adjustedBasis,
    capitalGain,
    federalTax,
    stateTax,
    netInvestmentIncomeTax,
    totalTaxWithout1031,
    totalTaxWith1031,
    taxSavings,
    percentageSaved
  };
}

// Format currency for display
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Get state name from abbreviation
export const stateNames: Record<string, string> = {
  'AL': 'Alabama',
  'AK': 'Alaska',
  'AZ': 'Arizona',
  'AR': 'Arkansas',
  'CA': 'California',
  'CO': 'Colorado',
  'CT': 'Connecticut',
  'DE': 'Delaware',
  'FL': 'Florida',
  'GA': 'Georgia',
  'HI': 'Hawaii',
  'ID': 'Idaho',
  'IL': 'Illinois',
  'IN': 'Indiana',
  'IA': 'Iowa',
  'KS': 'Kansas',
  'KY': 'Kentucky',
  'LA': 'Louisiana',
  'ME': 'Maine',
  'MD': 'Maryland',
  'MA': 'Massachusetts',
  'MI': 'Michigan',
  'MN': 'Minnesota',
  'MS': 'Mississippi',
  'MO': 'Missouri',
  'MT': 'Montana',
  'NE': 'Nebraska',
  'NV': 'Nevada',
  'NH': 'New Hampshire',
  'NJ': 'New Jersey',
  'NM': 'New Mexico',
  'NY': 'New York',
  'NC': 'North Carolina',
  'ND': 'North Dakota',
  'OH': 'Ohio',
  'OK': 'Oklahoma',
  'OR': 'Oregon',
  'PA': 'Pennsylvania',
  'RI': 'Rhode Island',
  'SC': 'South Carolina',
  'SD': 'South Dakota',
  'TN': 'Tennessee',
  'TX': 'Texas',
  'UT': 'Utah',
  'VT': 'Vermont',
  'VA': 'Virginia',
  'WA': 'Washington',
  'WV': 'West Virginia',
  'WI': 'Wisconsin',
  'WY': 'Wyoming',
  'DC': 'District of Columbia'
};