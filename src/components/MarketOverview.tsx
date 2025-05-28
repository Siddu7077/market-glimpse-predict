
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import stockData from '../data/stockData.json';

const MarketOverview: React.FC = () => {
  const marketData = Object.entries(stockData).map(([symbol, data]) => ({
    name: symbol,
    value: data.currentPrice,
    change: data.changePercent,
    volume: data.historical[data.historical.length - 1].volume
  }));

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800">Market Cap Distribution</h3>
          <p className="text-gray-600">Current stock prices visualization</p>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={marketData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {marketData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => [`$${value.toFixed(2)}`, 'Price']} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Market Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800">Market Statistics</h3>
          <p className="text-gray-600">Current market performance</p>
        </div>
        
        <div className="space-y-4">
          {marketData.map((stock, index) => (
            <div key={stock.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <div>
                  <div className="font-semibold text-gray-800">{stock.name}</div>
                  <div className="text-sm text-gray-600">${stock.value.toFixed(2)}</div>
                </div>
              </div>
              <div className={`text-right ${getChangeColor(stock.change)}`}>
                <div className="font-semibold">
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500">
                  Vol: {(stock.volume / 1000000).toFixed(1)}M
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
