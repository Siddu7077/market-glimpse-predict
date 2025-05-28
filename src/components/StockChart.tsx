
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface StockDataPoint {
  date: string;
  price: number;
  volume: number;
}

interface StockChartProps {
  data: StockDataPoint[];
  symbol: string;
  predictions?: number[];
}

const StockChart: React.FC<StockChartProps> = ({ data, symbol, predictions = [] }) => {
  // Prepare chart data
  const chartData = data.map((point, index) => ({
    ...point,
    formattedDate: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    prediction: predictions[index] || null
  }));

  // Add future predictions
  if (predictions.length > 0) {
    const lastDate = new Date(data[data.length - 1].date);
    predictions.slice(data.length).forEach((pred, index) => {
      const futureDate = new Date(lastDate);
      futureDate.setDate(futureDate.getDate() + index + 1);
      chartData.push({
        date: futureDate.toISOString().split('T')[0],
        price: 0,
        volume: 0,
        formattedDate: futureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        prediction: pred
      });
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">{symbol} Price Chart</h3>
        <p className="text-gray-600">Historical prices and predictions</p>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: 'white'
            }}
            formatter={(value: any, name: string) => [
              typeof value === 'number' ? `$${value.toFixed(2)}` : 'N/A',
              name === 'price' ? 'Actual Price' : 'Predicted Price'
            ]}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            connectNulls={false}
          />
          <Line 
            type="monotone" 
            dataKey="prediction" 
            stroke="#ef4444" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-600">Actual Price</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-600">Predicted Price</span>
        </div>
      </div>
    </div>
  );
};

export default StockChart;
