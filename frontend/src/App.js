import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp, DollarSign } from 'lucide-react';

// Format currency
const formatCurrency = (value, decimals = 1) => `£${value.toFixed(decimals)}m`;
const formatBps = (value) => `${value} bps`;

function App() {
  const [formData, setFormData] = useState({
    company_name: 'ABC Corporation',
    sector: 'utility',
    rating: 'A',
    deal_size_million: 500,
    preferred_currency: 'GBP',
    market_condition: 'normal',
    base_currency: 'GBP'
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === 'deal_size_million' ? parseInt(value) : value
    }));
  };

  const handleCalculate = async () => {
    setLoading(true);
    
    // Simulated API response for demonstration
    // In production, replace with actual API call
    setTimeout(() => {
      const mockResults = {
        company_name: formData.company_name,
        direct_pricing: {
          currency: formData.base_currency,
          base_rate: 4.0,
          credit_spread_bps: 120,
          size_adjustment_bps: 10,
          market_adjustment_bps: formData.market_condition === 'quiet_week' ? -10 : 0,
          swap_cost_bps: 0,
          all_in_cost_percent: 5.3,
          breakdown: {
            "government_rate": "4.0%",
            "credit_spread": "+120 bps",
            "size_premium": "+10 bps",
            "market_adjustment": formData.market_condition === 'quiet_week' ? "-10 bps" : "+0 bps",
            "swap_cost": "0 bps",
            "total": "5.30%"
          }
        },
        currency_comparison: [
          { currency: "GBP", all_in_cost_percent: 5.3, credit_spread_bps: 120 },
          { currency: "EUR", all_in_cost_percent: 4.85, credit_spread_bps: 125 },
          { currency: "USD", all_in_cost_percent: 5.95, credit_spread_bps: 115 }
        ],
        financial_impact: {
          "GBP": { annual_cost_millions: 26.5, ten_year_cost_millions: 265 },
          "EUR": { annual_cost_millions: 24.25, ten_year_cost_millions: 242.5 },
          "USD": { annual_cost_millions: 29.75, ten_year_cost_millions: 297.5 },
          recommendation: {
            optimal_currency: "EUR",
            savings_vs_base_bps: 45,
            annual_savings_millions: 2.25,
            ten_year_savings_millions: 22.5
          }
        },
        recommendations: {
          optimal_currency: "EUR",
          rationale: "Issue in EUR for lowest all-in cost",
          market_timing: formData.market_condition === 'quiet_week' 
            ? "Excellent timing - light issuance calendar provides 10 bps benefit"
            : "Neutral market conditions - proceed when ready",
          alternative_strategies: formData.deal_size_million >= 750 
            ? [`Consider splitting into 2x £${formData.deal_size_million/2}m deals to improve liquidity and reduce size premium`]
            : []
        }
      };
      
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          DCM Syndicate Pricing Calculator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <Card className="lg:col-span-1 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-blue-400">Bond Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sector</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => handleInputChange('sector', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="utility">Utility</option>
                    <option value="bank">Bank</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => handleInputChange('rating', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="AAA">AAA</option>
                    <option value="AA">AA</option>
                    <option value="A">A</option>
                    <option value="BBB">BBB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Deal Size (£m)</label>
                  <input
                    type="number"
                    value={formData.deal_size_million}
                    onChange={(e) => handleInputChange('deal_size_million', e.target.value)}
                    min="100"
                    max="1000"
                    step="50"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Market Condition</label>
                  <select
                    value={formData.market_condition}
                    onChange={(e) => handleInputChange('market_condition', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="quiet_week">Quiet Week</option>
                    <option value="normal">Normal</option>
                    <option value="busy_week">Busy Week</option>
                    <option value="central_bank_meeting">Central Bank Meeting</option>
                  </select>
                </div>

                <button
                  onClick={handleCalculate}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-md hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Calculating...' : 'Calculate Pricing'}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {results && (
            <div className="lg:col-span-2 space-y-6">
              {/* Currency Comparison Chart */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-400">Currency Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={results.currency_comparison}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="currency" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                        labelStyle={{ color: '#D1D5DB' }}
                      />
                      <Legend />
                      <Bar dataKey="all_in_cost_percent" fill="#8B5CF6" name="All-in Cost (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Direct Pricing Breakdown */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-green-400">Pricing Breakdown - {results.direct_pricing.currency}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(results.direct_pricing.breakdown).map(([key, value]) => (
                      <div key={key} className="bg-gray-700 p-3 rounded">
                        <p className="text-sm text-gray-400 capitalize">{key.replace('_', ' ')}</p>
                        <p className="text-lg font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Financial Impact */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-yellow-400 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Financial Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(results.financial_impact).map(([currency, data]) => {
                      if (currency === 'recommendation') return null;
                      return (
                        <div key={currency} className="bg-gray-700 p-4 rounded">
                          <h4 className="font-semibold text-lg mb-2">{currency}</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-400">Annual Cost</p>
                              <p className="text-xl">{formatCurrency(data.annual_cost_millions)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">10-Year Cost</p>
                              <p className="text-xl">{formatCurrency(data.ten_year_cost_millions)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {results.financial_impact.recommendation && (
                      <div className="bg-gradient-to-r from-green-900 to-emerald-900 p-4 rounded">
                        <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Potential Savings
                        </h4>
                        <p className="mb-2">Optimal Currency: <span className="font-bold text-green-400">{results.financial_impact.recommendation.optimal_currency}</span></p>
                        <p className="mb-2">Savings: <span className="font-bold">{results.financial_impact.recommendation.savings_vs_base_bps} bps</span></p>
                        <p>Annual Savings: <span className="font-bold text-green-400">{formatCurrency(results.financial_impact.recommendation.annual_savings_millions)}</span></p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-orange-400 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-gray-700 p-4 rounded">
                      <p className="font-semibold mb-1">Optimal Currency</p>
                      <p className="text-green-400">{results.recommendations.optimal_currency}</p>
                      <p className="text-sm text-gray-400 mt-1">{results.recommendations.rationale}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded">
                      <p className="font-semibold mb-1">Market Timing</p>
                      <p className="text-sm">{results.recommendations.market_timing}</p>
                    </div>
                    {results.recommendations.alternative_strategies.length > 0 && (
                      <div className="bg-gray-700 p-4 rounded">
                        <p className="font-semibold mb-2">Alternative Strategies</p>
                        <ul className="list-disc list-inside space-y-1">
                          {results.recommendations.alternative_strategies.map((strategy, idx) => (
                            <li key={idx} className="text-sm text-gray-300">{strategy}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;