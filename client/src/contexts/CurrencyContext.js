import React, { createContext, useContext, useState, useEffect } from 'react';
import currencyService from '../services/currencyService';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [userCurrency, setUserCurrency] = useState('USD');
  const [userCountry, setUserCountry] = useState('US');
  const [isDetected, setIsDetected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availableCurrencies, setAvailableCurrencies] = useState([]);

  useEffect(() => {
    initializeCurrency();
  }, []);

  const initializeCurrency = async () => {
    try {
      setIsLoading(true);
      
      // Get available currencies
      const currencies = currencyService.getAvailableCurrencies();
      setAvailableCurrencies(currencies);
      
      // Detect user's currency
      const detectedCurrency = await currencyService.detectUserCurrency();
      const detectedCountry = currencyService.getCurrentCountry();
      const autoDetected = currencyService.isAutoDetected();
      
      setUserCurrency(detectedCurrency);
      setUserCountry(detectedCountry);
      setIsDetected(autoDetected);
      
    } catch (error) {
      console.error('Error initializing currency:', error);
      // Fallback to USD
      setUserCurrency('USD');
      setUserCountry('US');
      setIsDetected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const changeCurrency = (currency) => {
    if (currencyService.setUserCurrency(currency)) {
      setUserCurrency(currency);
      setIsDetected(false); // Manual selection
    }
  };

  const getPlanPricing = (planId, billingCycle = 'monthly') => {
    return currencyService.getPlanPricing(planId, billingCycle, userCurrency);
  };

  const formatPrice = (amount) => {
    return currencyService.formatPrice(amount, userCurrency);
  };

  const getYearlySavings = (planId) => {
    return currencyService.getYearlySavings(planId, userCurrency);
  };

  const getCurrencyConfig = () => {
    return currencyService.getCurrencyConfig(userCurrency);
  };

  const value = {
    userCurrency,
    userCountry,
    isDetected,
    isLoading,
    availableCurrencies,
    changeCurrency,
    getPlanPricing,
    formatPrice,
    getYearlySavings,
    getCurrencyConfig,
    currencyService
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
