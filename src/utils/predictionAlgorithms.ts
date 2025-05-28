
interface StockDataPoint {
  date: string;
  price: number;
  volume: number;
}

interface PredictionResult {
  algorithm: string;
  predictedPrice: number;
  confidence: number;
  nextDayPrediction: number;
  trend: 'bullish' | 'bearish' | 'neutral';
}

export class StockPredictor {
  static movingAveragePredict(data: StockDataPoint[], period: number = 10): PredictionResult {
    const prices = data.slice(-period).map(d => d.price);
    const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    
    // Simple trend analysis
    const recentPrices = prices.slice(-5);
    const trend = recentPrices[recentPrices.length - 1] > recentPrices[0] ? 'bullish' : 'bearish';
    
    // Add some randomness for next day prediction
    const volatility = this.calculateVolatility(prices);
    const nextDayPrediction = average + (Math.random() - 0.5) * volatility * 2;
    
    return {
      algorithm: 'Moving Average',
      predictedPrice: average,
      confidence: Math.min(0.85, 0.6 + (period / 20)),
      nextDayPrediction,
      trend: Math.abs(recentPrices[recentPrices.length - 1] - recentPrices[0]) < 1 ? 'neutral' : trend
    };
  }

  static linearRegressionPredict(data: StockDataPoint[]): PredictionResult {
    const prices = data.map(d => d.price);
    const n = prices.length;
    
    // Calculate linear regression
    const x = Array.from({length: n}, (_, i) => i);
    const y = prices;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const predictedPrice = slope * n + intercept;
    const nextDayPrediction = slope * (n + 1) + intercept;
    
    // Calculate R-squared for confidence
    const yMean = sumY / n;
    const totalSumSquares = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    const residualSumSquares = y.reduce((sum, yi, i) => {
      const predicted = slope * i + intercept;
      return sum + Math.pow(yi - predicted, 2);
    }, 0);
    const rSquared = 1 - (residualSumSquares / totalSumSquares);
    
    return {
      algorithm: 'Linear Regression',
      predictedPrice,
      confidence: Math.max(0.3, Math.min(0.95, rSquared)),
      nextDayPrediction,
      trend: slope > 0 ? 'bullish' : slope < 0 ? 'bearish' : 'neutral'
    };
  }

  static arimaStylePredict(data: StockDataPoint[]): PredictionResult {
    const prices = data.map(d => d.price);
    
    // Simplified ARIMA-style calculation
    // Calculate differences
    const differences = [];
    for (let i = 1; i < prices.length; i++) {
      differences.push(prices[i] - prices[i - 1]);
    }
    
    // Calculate autoregressive component
    const lag1 = differences.slice(0, -1);
    const lag0 = differences.slice(1);
    
    if (lag1.length === 0) {
      return this.movingAveragePredict(data);
    }
    
    const correlation = this.calculateCorrelation(lag1, lag0);
    const meanDiff = differences.reduce((sum, d) => sum + d, 0) / differences.length;
    
    const predictedDiff = meanDiff + correlation * (differences[differences.length - 1] - meanDiff);
    const predictedPrice = prices[prices.length - 1] + predictedDiff;
    const nextDayPrediction = predictedPrice + predictedDiff * 0.7; // Dampening factor
    
    const volatility = this.calculateVolatility(prices);
    const confidence = Math.max(0.4, Math.min(0.9, 0.8 - volatility / 10));
    
    return {
      algorithm: 'ARIMA-Style',
      predictedPrice,
      confidence,
      nextDayPrediction,
      trend: predictedDiff > 0.5 ? 'bullish' : predictedDiff < -0.5 ? 'bearish' : 'neutral'
    };
  }

  static volumeWeightedPredict(data: StockDataPoint[]): PredictionResult {
    // Use volume as weights for prediction
    const recentData = data.slice(-10);
    const totalVolume = recentData.reduce((sum, d) => sum + d.volume, 0);
    
    const weightedPrice = recentData.reduce((sum, d) => {
      return sum + (d.price * d.volume) / totalVolume;
    }, 0);
    
    // Price momentum based on volume
    const highVolumeData = recentData.filter(d => d.volume > totalVolume / recentData.length);
    const avgHighVolumePrice = highVolumeData.reduce((sum, d) => sum + d.price, 0) / highVolumeData.length;
    
    const nextDayPrediction = weightedPrice + (avgHighVolumePrice - weightedPrice) * 0.3;
    
    const trend = avgHighVolumePrice > weightedPrice ? 'bullish' : 'bearish';
    
    return {
      algorithm: 'Volume Weighted',
      predictedPrice: weightedPrice,
      confidence: 0.75,
      nextDayPrediction,
      trend: Math.abs(avgHighVolumePrice - weightedPrice) < 1 ? 'neutral' : trend
    };
  }

  private static calculateVolatility(prices: number[]): number {
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    return Math.sqrt(variance);
  }

  private static calculateCorrelation(x: number[], y: number[]): number {
    const n = Math.min(x.length, y.length);
    if (n === 0) return 0;
    
    const meanX = x.slice(0, n).reduce((sum, val) => sum + val, 0) / n;
    const meanY = y.slice(0, n).reduce((sum, val) => sum + val, 0) / n;
    
    let numerator = 0;
    let denominatorX = 0;
    let denominatorY = 0;
    
    for (let i = 0; i < n; i++) {
      const diffX = x[i] - meanX;
      const diffY = y[i] - meanY;
      numerator += diffX * diffY;
      denominatorX += diffX * diffX;
      denominatorY += diffY * diffY;
    }
    
    const denominator = Math.sqrt(denominatorX * denominatorY);
    return denominator === 0 ? 0 : numerator / denominator;
  }

  static getAllPredictions(data: StockDataPoint[]): PredictionResult[] {
    return [
      this.movingAveragePredict(data),
      this.linearRegressionPredict(data),
      this.arimaStylePredict(data),
      this.volumeWeightedPredict(data)
    ];
  }
}
