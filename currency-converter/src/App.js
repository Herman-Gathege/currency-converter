import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [currencies, setCurrencies] = useState([]);
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState('');

  // API key for ExchangeRate-API
  const API_KEY = '0869915ae1d1a1eac0118a68';

  // Dynamically build the API URL based on the sourceCurrency
  const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${sourceCurrency}`;

  
  // Fetch exchange rates
  const fetchExchangeRate = async () => {
    try {
      const response = await axios.get(API_URL);
      const rate = response.data.conversion_rates[targetCurrency];
      const conversion = (rate * amount).toFixed(2);
      setConvertedAmount(conversion);
      setError('');
    } catch (err) {
      setError('Error fetching exchange rates. Please try again later.');
      setConvertedAmount(null);
    }
  };

  // Fetch list of available currencies
  const fetchCurrencies = async () => {
    try {
      const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/codes`);
      console.log(response.data.supported_codes); // Log the API response to check the structure
      setCurrencies(response.data.supported_codes);
    } catch (err) {
      setError('Error fetching currencies. Please try again later.');
    }
  };

  // Effect to fetch exchange rates whenever source currency, target currency, or amount changes
  useEffect(() => {
    if (amount && sourceCurrency && targetCurrency) {
      fetchExchangeRate();
    }
  }, [sourceCurrency, targetCurrency, amount]);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  return (
    <div className="container">
      <h1>Currency Converter</h1>
      <div className="form-group">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="form-group">
        <select
          value={sourceCurrency}
          onChange={(e) => setSourceCurrency(e.target.value)}
        >
          {/* Ensure currencies are loaded before rendering the dropdown */}
          {currencies.length > 0 ? (
            currencies.map((currency) => (
              <option key={currency[0]} value={currency[0]}>
                {currency[0]} - {currency[1]}
              </option>
            ))
          ) : (
            <option>Loading currencies...</option>
          )}
        </select>
        <span> to </span>
        <select
          value={targetCurrency}
          onChange={(e) => setTargetCurrency(e.target.value)}
        >
          {/* Ensure currencies are loaded before rendering the dropdown */}
          {currencies.length > 0 ? (
            currencies.map((currency) => (
              <option key={currency[0]} value={currency[0]}>
                {currency[0]} - {currency[1]}
              </option>
            ))
          ) : (
            <option>Loading currencies...</option>
          )}
        </select>
      </div>
      <button onClick={fetchExchangeRate}>Convert</button>
      {error && <div className="error">{error}</div>}
      {convertedAmount && (
        <div className="result">
          {amount} {sourceCurrency} = {convertedAmount} {targetCurrency}
        </div>
      )}
    </div>
  );
};

export default App;
