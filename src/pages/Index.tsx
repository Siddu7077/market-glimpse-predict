
import React from 'react';
import StockDashboard from '../components/StockDashboard';
import { TrendingUp, Brain, BarChart3, Activity } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">StockPredict AI</h1>
                <p className="text-gray-600">Advanced Stock Price Prediction Platform</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-green-600" />
                <span>Real-time Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <span>Multiple Algorithms</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Market Analytics Dashboard</h2>
          <p className="text-gray-600">
            Get AI-powered stock price predictions using advanced algorithms including Moving Average, 
            Linear Regression, ARIMA-style modeling, and Volume-weighted analysis.
          </p>
        </div>
        
        <StockDashboard />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">© 2024 StockPredict AI. Advanced stock prediction algorithms.</p>
            <p className="text-sm">
              Disclaimer: This is a demonstration application. Not intended for actual investment decisions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
