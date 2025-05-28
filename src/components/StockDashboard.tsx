
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import StockChart from './StockChart';
import PredictionPanel from './PredictionPanel';
import stockData from '../data/stockData.json';

interface StockInfo {
  name: string;
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  historical: Array<{
    date: string;
    price: number;
    volume: number;
  }>;
}

const StockDashboard: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [currentStock, setCurrentStock] = useState<StockInfo | null>(null);

  useEffect(() => {
    const stock = (stockData as any)[selectedSymbol];
    if (stock) {
      setCurrentStock(stock);
    }
  }, [selectedSymbol]);

  if (!currentStock) {
    return <div>Loading...</div>;
  }

  const isPositive = currentStock.change >= 0;

  return (
    <div className="space-y-6">
      {/* Stock Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Price</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentStock.currentPrice.toFixed(2)}</div>
            <p className="text-xs text-blue-100">
              {currentStock.name}
            </p>
          </CardContent>
        </Card>

        <Card className={`${isPositive ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'} text-white`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Change</CardTitle>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isPositive ? '+' : ''}${currentStock.change.toFixed(2)}
            </div>
            <p className="text-xs">
              {isPositive ? '+' : ''}{currentStock.changePercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume</CardTitle>
            <BarChart3 className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(currentStock.historical[currentStock.historical.length - 1].volume / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-purple-100">
              Trading volume
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Symbol</CardTitle>
            <Badge variant="secondary" className="bg-white text-indigo-600">
              Stock
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStock.symbol}</div>
            <p className="text-xs text-indigo-100">
              Market ticker
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <StockChart 
            data={currentStock.historical} 
            symbol={currentStock.symbol}
          />
        </div>

        {/* Prediction Panel */}
        <div className="lg:col-span-1">
          <PredictionPanel 
            onSymbolChange={setSelectedSymbol}
            currentSymbol={selectedSymbol}
          />
        </div>
      </div>
    </div>
  );
};

export default StockDashboard;
