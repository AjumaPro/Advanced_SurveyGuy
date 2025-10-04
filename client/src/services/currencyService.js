// Currency Service - Handles geographical currency detection and conversion

// Currency configurations with exchange rates (base: USD)
const CURRENCY_CONFIG = {
  USD: { symbol: '$', name: 'US Dollar', flag: '🇺🇸', rate: 1.0 },
  GHS: { symbol: 'GH¢', name: 'Ghanaian Cedi', flag: '🇬🇭', rate: 12.5 },
  NGN: { symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬', rate: 750.0 },
  KES: { symbol: 'KSh', name: 'Kenyan Shilling', flag: '🇰🇪', rate: 150.0 },
  ZAR: { symbol: 'R', name: 'South African Rand', flag: '🇿🇦', rate: 18.5 },
  EGP: { symbol: 'E£', name: 'Egyptian Pound', flag: '🇪🇬', rate: 30.8 },
  MAD: { symbol: 'MAD', name: 'Moroccan Dirham', flag: '🇲🇦', rate: 10.2 },
  TND: { symbol: 'TND', name: 'Tunisian Dinar', flag: '🇹🇳', rate: 3.1 },
  DZD: { symbol: 'DZD', name: 'Algerian Dinar', flag: '🇩🇿', rate: 134.5 },
  ETB: { symbol: 'ETB', name: 'Ethiopian Birr', flag: '🇪🇹', rate: 55.0 },
  UGX: { symbol: 'UGX', name: 'Ugandan Shilling', flag: '🇺🇬', rate: 3700.0 },
  TZS: { symbol: 'TZS', name: 'Tanzanian Shilling', flag: '🇹🇿', rate: 2500.0 },
  RWF: { symbol: 'RWF', name: 'Rwandan Franc', flag: '🇷🇼', rate: 1200.0 },
  XOF: { symbol: 'XOF', name: 'West African CFA Franc', flag: '🇸🇳', rate: 600.0 },
  XAF: { symbol: 'XAF', name: 'Central African CFA Franc', flag: '🇨🇲', rate: 600.0 },
  EUR: { symbol: '€', name: 'Euro', flag: '🇪🇺', rate: 0.92 },
  GBP: { symbol: '£', name: 'British Pound', flag: '🇬🇧', rate: 0.79 },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', rate: 1.35 },
  AUD: { symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', rate: 1.52 },
  JPY: { symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', rate: 150.0 },
  INR: { symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', rate: 83.0 },
  BRL: { symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷', rate: 5.0 },
  MXN: { symbol: '$', name: 'Mexican Peso', flag: '🇲🇽', rate: 17.0 }
};

// Country to currency mapping
const COUNTRY_CURRENCY_MAP = {
  // Africa
  'GH': 'GHS', 'Ghana': 'GHS',
  'NG': 'NGN', 'Nigeria': 'NGN',
  'KE': 'KES', 'Kenya': 'KES',
  'ZA': 'ZAR', 'South Africa': 'ZAR',
  'EG': 'EGP', 'Egypt': 'EGP',
  'MA': 'MAD', 'Morocco': 'MAD',
  'TN': 'TND', 'Tunisia': 'TND',
  'DZ': 'DZD', 'Algeria': 'DZD',
  'ET': 'ETB', 'Ethiopia': 'ETB',
  'UG': 'UGX', 'Uganda': 'UGX',
  'TZ': 'TZS', 'Tanzania': 'TZS',
  'RW': 'RWF', 'Rwanda': 'RWF',
  'SN': 'XOF', 'Senegal': 'XOF', 'BF': 'XOF', 'Burkina Faso': 'XOF', 'ML': 'XOF', 'Mali': 'XOF', 'NE': 'XOF', 'Niger': 'XOF', 'CI': 'XOF', 'Ivory Coast': 'XOF', 'GW': 'XOF', 'Guinea-Bissau': 'XOF', 'GN': 'XOF', 'Guinea': 'XOF', 'TG': 'XOF', 'Togo': 'XOF', 'BJ': 'XOF', 'Benin': 'XOF',
  'CM': 'XAF', 'Cameroon': 'XAF', 'CF': 'XAF', 'Central African Republic': 'XAF', 'TD': 'XAF', 'Chad': 'XAF', 'CG': 'XAF', 'Republic of the Congo': 'XAF', 'GQ': 'XAF', 'Equatorial Guinea': 'XAF', 'GA': 'XAF', 'Gabon': 'XAF',
  
  // North America
  'US': 'USD', 'United States': 'USD',
  'CA': 'CAD', 'Canada': 'CAD',
  'MX': 'MXN', 'Mexico': 'MXN',
  
  // Europe
  'GB': 'GBP', 'United Kingdom': 'GBP',
  'DE': 'EUR', 'Germany': 'EUR', 'FR': 'EUR', 'France': 'EUR', 'IT': 'EUR', 'Italy': 'EUR', 'ES': 'EUR', 'Spain': 'EUR', 'NL': 'EUR', 'Netherlands': 'EUR', 'BE': 'EUR', 'Belgium': 'EUR', 'AT': 'EUR', 'Austria': 'EUR', 'PT': 'EUR', 'Portugal': 'EUR', 'FI': 'EUR', 'Finland': 'EUR', 'IE': 'EUR', 'Ireland': 'EUR', 'LU': 'EUR', 'Luxembourg': 'EUR', 'GR': 'EUR', 'Greece': 'EUR', 'CY': 'EUR', 'Cyprus': 'EUR', 'MT': 'EUR', 'Malta': 'EUR', 'SI': 'EUR', 'Slovenia': 'EUR', 'SK': 'EUR', 'Slovakia': 'EUR', 'EE': 'EUR', 'Estonia': 'EUR', 'LV': 'EUR', 'Latvia': 'EUR', 'LT': 'EUR', 'Lithuania': 'EUR',
  
  // Asia
  'JP': 'JPY', 'Japan': 'JPY',
  'IN': 'INR', 'India': 'INR',
  
  // Oceania
  'AU': 'AUD', 'Australia': 'AUD',
  
  // South America
  'BR': 'BRL', 'Brazil': 'BRL'
};

// Base pricing in USD
const BASE_PRICING = {
  free: { monthly: 0, yearly: 0 },
  pro: { monthly: 1.6, yearly: 16.0 }, // $1.6/month, $16/year
  enterprise: { monthly: 8.0, yearly: 80.0 } // $8/month, $80/year
};

class CurrencyService {
  constructor() {
    this.userCurrency = null;
    this.userCountry = null;
    this.isDetected = false;
  }

  // Detect user's location and currency
  async detectUserCurrency() {
    try {
      // Try to get location from IP geolocation
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.country_code) {
        this.userCountry = data.country_code;
        this.userCurrency = COUNTRY_CURRENCY_MAP[data.country_code] || 'USD';
        this.isDetected = true;
        
        // Store in localStorage for future use
        localStorage.setItem('userCurrency', this.userCurrency);
        localStorage.setItem('userCountry', this.userCountry);
        
        return this.userCurrency;
      }
    } catch (error) {
      console.warn('Failed to detect location, using default currency:', error);
    }

    // Fallback to localStorage or default
    this.userCurrency = localStorage.getItem('userCurrency') || 'USD';
    this.userCountry = localStorage.getItem('userCountry') || 'US';
    this.isDetected = false;
    
    return this.userCurrency;
  }

  // Get currency configuration
  getCurrencyConfig(currency = null) {
    const targetCurrency = currency || this.userCurrency || 'USD';
    return CURRENCY_CONFIG[targetCurrency] || CURRENCY_CONFIG.USD;
  }

  // Convert price from USD to target currency
  convertPrice(usdPrice, targetCurrency = null) {
    const currency = targetCurrency || this.userCurrency || 'USD';
    const config = this.getCurrencyConfig(currency);
    const convertedPrice = usdPrice * config.rate;
    
    // Round to appropriate decimal places
    if (currency === 'JPY' || currency === 'KRW' || currency === 'UGX' || currency === 'TZS' || currency === 'RWF') {
      return Math.round(convertedPrice);
    }
    
    return Math.round(convertedPrice * 100) / 100;
  }

  // Get pricing for a specific plan and currency
  getPlanPricing(planId, billingCycle = 'monthly', currency = null) {
    const targetCurrency = currency || this.userCurrency || 'USD';
    const basePrice = BASE_PRICING[planId]?.[billingCycle] || 0;
    const convertedPrice = this.convertPrice(basePrice, targetCurrency);
    
    return {
      amount: convertedPrice,
      currency: targetCurrency,
      symbol: this.getCurrencyConfig(targetCurrency).symbol,
      original: basePrice
    };
  }

  // Format price with currency symbol
  formatPrice(amount, currency = null) {
    const targetCurrency = currency || this.userCurrency || 'USD';
    const config = this.getCurrencyConfig(targetCurrency);
    
    // Handle different currency formatting
    if (targetCurrency === 'USD' || targetCurrency === 'CAD' || targetCurrency === 'AUD') {
      return `${config.symbol}${amount.toFixed(2)}`;
    } else if (targetCurrency === 'EUR') {
      return `${amount.toFixed(2)}${config.symbol}`;
    } else if (targetCurrency === 'JPY' || targetCurrency === 'KRW') {
      return `${config.symbol}${Math.round(amount)}`;
    } else {
      return `${config.symbol}${amount.toFixed(2)}`;
    }
  }

  // Get all available currencies
  getAvailableCurrencies() {
    return Object.keys(CURRENCY_CONFIG).map(code => ({
      code,
      ...CURRENCY_CONFIG[code]
    }));
  }

  // Set user currency manually
  setUserCurrency(currency) {
    if (CURRENCY_CONFIG[currency]) {
      this.userCurrency = currency;
      localStorage.setItem('userCurrency', currency);
      return true;
    }
    return false;
  }

  // Get current user currency
  getCurrentCurrency() {
    return this.userCurrency || 'USD';
  }

  // Get current user country
  getCurrentCountry() {
    return this.userCountry || 'US';
  }

  // Check if currency was auto-detected
  isAutoDetected() {
    return this.isDetected;
  }

  // Get savings calculation for yearly plans
  getYearlySavings(planId, currency = null) {
    const targetCurrency = currency || this.userCurrency || 'USD';
    const monthlyPrice = this.getPlanPricing(planId, 'monthly', targetCurrency);
    const yearlyPrice = this.getPlanPricing(planId, 'yearly', targetCurrency);
    
    const monthlyTotal = monthlyPrice.amount * 12;
    const savings = monthlyTotal - yearlyPrice.amount;
    
    return {
      amount: savings,
      percentage: Math.round((savings / monthlyTotal) * 100),
      currency: targetCurrency,
      symbol: this.getCurrencyConfig(targetCurrency).symbol
    };
  }
}

// Create singleton instance
const currencyService = new CurrencyService();

export default currencyService;
export { CURRENCY_CONFIG, COUNTRY_CURRENCY_MAP, BASE_PRICING };
