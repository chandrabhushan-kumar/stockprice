import React, { useState, useEffect } from 'react';

const stocks = [
  { symbol: 'IBM', name: 'IBM.' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Google Inc.' },
 
];

const StockPriceTracker = () => {
  const [selectedStock, setSelectedStock] = useState(stocks[0]);

  const handleStockChange = (event) => {
    const selectedSymbol = event.target.value;
    const stock = stocks.find((s) => s.symbol === selectedSymbol);
    setSelectedStock(stock);
  };

  const fetchStockPrice = async () => {
    let demo = 'P0Z1WI3MXXAF6JBR';
    try {
       const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${selectedStock.symbol}&interval=1min&apikey=${demo}`
      );
      const data = await response.json();
      console.log("data@@@@",data)
      if ('Time Series (1min)' in data) {
        const latestPrice = data['Time Series (1min)'][Object.keys(data['Time Series (1min)'])[0]]['1. open'];
  
        setSelectedStock((prevStock) => ({
          ...prevStock,
          price: latestPrice,
        }));
      } else {
        console.error('Error: Data format from API is not as expected.');
      }
    
      
    } catch (error) {
      console.error('Error fetching stock price:', error);
    }
  };

  
  useEffect(() => {
    fetchStockPrice(); 
    const intervalId = setInterval(fetchStockPrice, 10000); 
    return () => clearInterval(intervalId); 
  }, [selectedStock.symbol]);

  return (
    <div>
      <h1>Stock Price Tracker</h1>
      <div>
        <label>Select a Stock:</label>
        <select onChange={handleStockChange} value={selectedStock.symbol}>
          {stocks.map((stock) => (
            <option key={stock.symbol} value={stock.symbol}>
              {stock.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h2>{selectedStock.name} Stock Price:</h2>
        {selectedStock.price !== undefined ? (
          <p>{selectedStock.price}</p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default StockPriceTracker;