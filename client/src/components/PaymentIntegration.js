import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Info,
  Settings,
  Copy,
  ExternalLink,
  TrendingUp,
  Users,
  ChevronDown
} from 'lucide-react';

const PaymentIntegration = ({ 
  survey, 
  onPaymentUpdate, 
  userPlan = 'free' 
}) => {
  const [paymentSettings, setPaymentSettings] = useState(survey?.payment || {
    enabled: false,
    type: 'fixed', // 'fixed', 'variable', 'donation'
    amount: 0,
    currency: 'USD',
    description: '',
    stripePublicKey: '',
    webhookSecret: '',
    successUrl: '',
    cancelUrl: '',
    collectBillingInfo: true,
    allowPromoCodes: false,
    taxSettings: {
      enabled: false,
      rate: 0,
      type: 'percentage'
    }
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isTestMode, setIsTestMode] = useState(true);
  // const [paymentMethods, setPaymentMethods] = useState([]);

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' }
  ];

  const paymentTypes = [
    {
      id: 'fixed',
      name: 'Fixed Amount',
      description: 'Set a fixed price for your survey',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'variable',
      name: 'Variable Amount',
      description: 'Let users choose from preset amounts',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'donation',
      name: 'Donation',
      description: 'Accept donations with custom amounts',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const updatePaymentSettings = (updates) => {
    const newSettings = { ...paymentSettings, ...updates };
    setPaymentSettings(newSettings);
    onPaymentUpdate(newSettings);
  };

  // const addPaymentMethod = () => {
  //   const newMethod = {
  //     id: Date.now(),
  //     type: 'card',
  //     name: 'Credit Card',
  //     enabled: true,
  //     processingFee: 2.9
  //   };
  //   setPaymentMethods(prev => [...prev, newMethod]);
  // };

  // const removePaymentMethod = (methodId) => {
  //   setPaymentMethods(prev => prev.filter(m => m.id !== methodId));
  // };

  const generateWebhookSecret = () => {
    const secret = 'whsec_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    updatePaymentSettings({ webhookSecret: secret });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show success message
  };

  const getCurrencySymbol = (currencyCode) => {
    return currencies.find(c => c.code === currencyCode)?.symbol || '$';
  };

  const calculateProcessingFee = (amount) => {
    const fee = (amount * 0.029) + 0.30; // Stripe's standard fee
    return Math.round(fee * 100) / 100;
  };

  return (
    <div className="payment-integration bg-white rounded-xl shadow-lg border border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Payment Integration</h2>
              <p className="text-sm text-slate-600">
                Accept payments with your surveys using Stripe
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={paymentSettings.enabled}
                onChange={(e) => updatePaymentSettings({ enabled: e.target.checked })}
                className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-slate-700">Enable Payments</span>
            </label>
          </div>
        </div>
      </div>

      {paymentSettings.enabled && (
        <div className="p-6 space-y-6">
          {/* Payment Type Selection */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => updatePaymentSettings({ type: type.id })}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    paymentSettings.type === type.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${type.color}`}>
                      {type.icon}
                    </div>
                    <h4 className="font-semibold text-slate-900">{type.name}</h4>
                  </div>
                  <p className="text-sm text-slate-600">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Amount Configuration */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Currency
                </label>
                <select
                  value={paymentSettings.currency}
                  onChange={(e) => updatePaymentSettings({ currency: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              </div>

              {paymentSettings.type === 'fixed' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500">
                        {getCurrencySymbol(paymentSettings.currency)}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={paymentSettings.amount}
                      onChange={(e) => updatePaymentSettings({ amount: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  {paymentSettings.amount > 0 && (
                    <p className="text-xs text-slate-500 mt-1">
                      Processing fee: {getCurrencySymbol(paymentSettings.currency)}{calculateProcessingFee(paymentSettings.amount)}
                    </p>
                  )}
                </div>
              )}

              {paymentSettings.type === 'variable' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preset Amounts
                  </label>
                  <div className="space-y-2">
                    {[10, 25, 50, 100].map(amount => (
                      <div key={amount} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`amount-${amount}`}
                          className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor={`amount-${amount}`} className="text-sm text-slate-700">
                          {getCurrencySymbol(paymentSettings.currency)}{amount}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Payment Description
            </label>
            <input
              type="text"
              value={paymentSettings.description}
              onChange={(e) => updatePaymentSettings({ description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="What is this payment for?"
            />
          </div>

          {/* Stripe Configuration */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Stripe Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Stripe Public Key
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={paymentSettings.stripePublicKey}
                    onChange={(e) => updatePaymentSettings({ stripePublicKey: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="pk_test_..."
                  />
                  <button
                    onClick={() => copyToClipboard(paymentSettings.stripePublicKey)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Webhook Secret
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="password"
                    value={paymentSettings.webhookSecret}
                    onChange={(e) => updatePaymentSettings({ webhookSecret: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="whsec_..."
                  />
                  <button
                    onClick={generateWebhookSecret}
                    className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 font-medium"
            >
              <Settings className="w-4 h-4" />
              <span>Advanced Settings</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4 p-4 bg-slate-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Success URL
                    </label>
                    <input
                      type="url"
                      value={paymentSettings.successUrl}
                      onChange={(e) => updatePaymentSettings({ successUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://example.com/success"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Cancel URL
                    </label>
                    <input
                      type="url"
                      value={paymentSettings.cancelUrl}
                      onChange={(e) => updatePaymentSettings({ cancelUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://example.com/cancel"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={paymentSettings.collectBillingInfo}
                      onChange={(e) => updatePaymentSettings({ collectBillingInfo: e.target.checked })}
                      className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Collect billing information</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={paymentSettings.allowPromoCodes}
                      onChange={(e) => updatePaymentSettings({ allowPromoCodes: e.target.checked })}
                      className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Allow promo codes</span>
                  </label>
                </div>

                {/* Tax Settings */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Tax Settings</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={paymentSettings.taxSettings.enabled}
                        onChange={(e) => updatePaymentSettings({
                          taxSettings: { ...paymentSettings.taxSettings, enabled: e.target.checked }
                        })}
                        className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-slate-700">Enable tax calculation</span>
                    </label>

                    {paymentSettings.taxSettings.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Tax Rate (%)
                          </label>
                          <input
                            type="number"
                            value={paymentSettings.taxSettings.rate}
                            onChange={(e) => updatePaymentSettings({
                              taxSettings: { ...paymentSettings.taxSettings, rate: parseFloat(e.target.value) || 0 }
                            })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            max="100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Tax Type
                          </label>
                          <select
                            value={paymentSettings.taxSettings.type}
                            onChange={(e) => updatePaymentSettings({
                              taxSettings: { ...paymentSettings.taxSettings, type: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Test Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-yellow-900">Test Mode</h4>
                <p className="text-sm text-yellow-800">
                  Use test card numbers to verify payments without charging real money
                </p>
              </div>
            </div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isTestMode}
                onChange={(e) => setIsTestMode(e.target.checked)}
                className="w-4 h-4 text-yellow-600 border-yellow-300 rounded focus:ring-yellow-500"
              />
              <span className="text-sm font-medium text-yellow-900">Test Mode</span>
            </label>
          </div>

          {/* Test Card Numbers */}
          {isTestMode && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Test Card Numbers</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Successful payment:</span>
                  <code className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-800">
                    4242 4242 4242 4242
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Declined payment:</span>
                  <code className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-800">
                    4000 0000 0000 0002
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Requires authentication:</span>
                  <code className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-800">
                    4000 0025 0000 3155
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* Integration Status */}
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="text-sm font-semibold text-green-900">Integration Ready</h4>
                <p className="text-sm text-green-800">
                  Your payment integration is configured and ready to use
                </p>
              </div>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700">
              <ExternalLink className="w-4 h-4" />
              <span>View Documentation</span>
            </button>
          </div>
        </div>
      )}

      {!paymentSettings.enabled && (
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Payment Integration Disabled</h3>
          <p className="text-slate-600 mb-4">
            Enable payments to accept money with your surveys
          </p>
          <button
            onClick={() => updatePaymentSettings({ enabled: true })}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
          >
            Enable Payments
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentIntegration;
