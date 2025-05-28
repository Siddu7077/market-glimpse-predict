
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface VolumeDataPoint {
  date: string;
  volume: number;
}

interface VolumeChartProps {
  data: VolumeDataPoint[];
  symbol: string;
}

const VolumeChart: React.FC<VolumeChartProps> = ({ data, symbol }) => {
  const chartData = data.map(point => ({
    ...point,
    formattedDate: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    volumeM: (point.volume / 1000000).toFixed(1)
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">{symbol} Trading Volume</h3>
        <p className="text-gray-600">Daily trading volume in millions</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            tickFormatter={(value) => `${value}M`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: 'white'
            }}
            formatter={(value: any) => [`${value}M`, 'Volume']}
          />
          <Bar 
            dataKey="volumeM" 
            fill="#8b5cf6"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VolumeChart;
