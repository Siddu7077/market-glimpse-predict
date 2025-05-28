
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Target, Brain, BarChart3, Activity } from 'lucide-react';
import { StockPredictor } from '../utils/predictionAlgorithms';
import stockData from '../data/stockData.json';

interface PredictionResult {
  algorithm: string;
  predictedPrice: number;
  confidence: number;
  nextDayPrediction: number;
  trend: 'bullish' | 'bearish' | 'neutral';
}

interface PredictionPanelProps {
  onSymbolChange: (symbol: string) => void;
  currentSymbol: string;
}

const PredictionPanel: React.FC<PredictionPanelProps> = ({ onSymbolChange, currentSymbol }) => {
  const [inputSymbol, setInputSymbol] = useState('');
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const algorithmIcons = {
    'Moving Average': BarChart3,
    'Linear Regression': TrendingUp,
    'ARIMA-Style': Brain,
    'Volume Weighted': Activity
  };

  const handlePredict = async () => {
    const symbol = inputSymbol.toUpperCase() || currentSymbol;
    
    if (!symbol) return;
    
    const stockInfo = (stockData as any)[symbol];
    if (!stockInfo) {
      alert('Stock symbol not found in our database. Available symbols: AAPL, GOOGL, MSFT, TSLA, AMZN');
      return;
    }

    setIsLoading(true);
    onSymbolChange(symbol);
    
    // Simulate API delay
    setTimeout(() => {
      const predictions = StockPredictor.getAllPredictions(stockInfo.historical);
      setPredictions(predictions);
      setIsLoading(false);
    }, 1000);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return 'bg-green-100 text-green-800';
      case 'bearish':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const averagePrediction = predictions.length > 0 
    ? predictions.reduce((sum, p) => sum + p.predictedPrice, 0) / predictions.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-6 h-6 text-blue-600" />
            <span>Stock Price Prediction</span>
          </CardTitle>
          <CardDescription>
            Enter a stock symbol to get AI-powered price predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={inputSymbol}
              onChange={(e) => setInputSymbol(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handlePredict()}
              className="flex-1"
            />
            <Button 
              onClick={handlePredict}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              {isLoading ? 'Analyzing...' : 'Predict'}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <span>Available symbols:</span>
            {Object.keys(stockData).map((symbol) => (
              <button
                key={symbol}
                onClick={() => {
                  setInputSymbol(symbol);
                  onSymbolChange(symbol);
                }}
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-blue-600 transition-colors"
              >
                {symbol}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictions Overview */}
      {predictions.length > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Prediction Summary</CardTitle>
            <CardDescription>
              Consensus prediction for {currentSymbol}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${averagePrediction.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Average Prediction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {predictions.filter(p => p.trend === 'bullish').length}/{predictions.length}
                </div>
                <div className="text-sm text-gray-600">Bullish Signals</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Predictions */}
      {predictions.map((prediction, index) => {
        const IconComponent = algorithmIcons[prediction.algorithm as keyof typeof algorithmIcons];
        
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <IconComponent className="w-5 h-5 text-blue-600" />
                  <span>{prediction.algorithm}</span>
                </CardTitle>
                <Badge className={getTrendColor(prediction.trend)}>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(prediction.trend)}
                    <span className="capitalize">{prediction.trend}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    ${prediction.predictedPrice.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Current Prediction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    ${prediction.nextDayPrediction.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Next Day</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Confidence Level</span>
                  <span className={`font-semibold ${getConfidenceColor(prediction.confidence)}`}>
                    {(prediction.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${prediction.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Algorithm uses {prediction.algorithm === 'Moving Average' ? 'historical price averages' :
                                prediction.algorithm === 'Linear Regression' ? 'trend line analysis' :
                                prediction.algorithm === 'ARIMA-Style' ? 'time series forecasting' :
                                'volume-weighted calculations'} for prediction
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PredictionPanel;
