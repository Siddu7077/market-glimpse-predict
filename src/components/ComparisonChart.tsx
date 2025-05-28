
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import stockData from '../data/stockData.json';

const ComparisonChart: React.FC = () => {
  const [selectedStocks, setSelectedStocks] = useState(['AAPL', 'GOOGL', 'MSFT']);
  
  const availableStocks = Object.keys(stockData);
  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  // Normalize data to percentage change from first day
  const getComparisonData = () => {
    const maxLength = Math.max(...selectedStocks.map(symbol => 
      (stockData as any)[symbol].historical.length
    ));

    const comparisonData = [];
    
    for (let i = 0; i < maxLength; i++) {
      const dataPoint: any = {};
      
      selectedStocks.forEach(symbol => {
        const stock = (stockData as any)[symbol];
        if (stock.historical[i]) {
          const firstPrice = stock.historical[0].price;
          const currentPrice = stock.historical[i].price;
          const percentChange = ((currentPrice - firstPrice) / firstPrice) * 100;
          
          dataPoint.date = stock.historical[i].date;
          dataPoint.formattedDate = new Date(stock.historical[i].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          dataPoint[symbol] = percentChange;
        }
      });
      
      if (Object.keys(dataPoint).length > 2) {
        comparisonData.push(dataPoint);
      }
    }
    
    return comparisonData;
  };

  const toggleStock = (symbol: string) => {
    setSelectedStocks(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const comparisonData = getComparisonData();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Stock Performance Comparison</h3>
        <p className="text-gray-600 mb-4">Compare percentage change from starting price</p>
        
        <div className="flex flex-wrap gap-2">
          {availableStocks.map((symbol) => (
            <Button
              key={symbol}
              variant={selectedStocks.includes(symbol) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleStock(symbol)}
              className="text-xs"
            >
              {symbol}
            </Button>
          ))}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="formattedDate" 
            stroke="#666"
            fontSize={12}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickFormatter={(value) => `${value.toFixed(1)}%`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: 'white'
            }}
            formatter={(value: any, name: string) => [
              `${value.toFixed(2)}%`,
              name
            ]}
          />
          <Legend />
          {selectedStocks.map((symbol, index) => (
            <Line
              key={symbol}
              type="monotone"
              dataKey={symbol}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={false}
              name={symbol}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {selectedStocks.map((symbol, index) => (
          <Badge key={symbol} variant="secondary" className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span>{symbol}</span>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ComparisonChart;
