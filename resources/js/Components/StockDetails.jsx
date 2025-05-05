import React from 'react';
import { CRYPTO_SYMBOLS } from '@/Constants/symbols';

export default function StockDetails({ stockData, profileData, keyStats }) {
    const isCrypto = CRYPTO_SYMBOLS.includes(stockData?.symbol);

    const formatPrice = (price) => {
        if (!price && price !== 0) return 'N/A';
        
        const options = {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: isCrypto ? 2 : 2,
            maximumFractionDigits: isCrypto ? 6 : 2
        };
        
        return new Intl.NumberFormat('en-US', options).format(price);
    };

    const formatLargeNumber = (num) => {
        if (!num && num !== 0) return 'N/A';
        
        const absNum = Math.abs(Number(num));
        if (absNum >= 1.0e+12) return (absNum / 1.0e+12).toFixed(2) + 'T';
        if (absNum >= 1.0e+9) return (absNum / 1.0e+9).toFixed(2) + 'B';
        if (absNum >= 1.0e+6) return (absNum / 1.0e+6).toFixed(2) + 'M';
        if (absNum >= 1.0e+3) return (absNum / 1.0e+3).toFixed(2) + 'K';
        
        return absNum.toFixed(2);
    };

    const formatPercentage = (value) => {
        if (!value && value !== 0) return 'N/A';
        const numValue = parseFloat(value);
        const sign = numValue >= 0 ? '+' : '';
        return `${sign}${numValue.toFixed(2)}%`;
    };

    const getPriceChangeColor = (change) => {
        if (!change && change !== 0) return 'text-gray-500 dark:text-gray-400';
        const numChange = parseFloat(change);
        return numChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    };

    if (!stockData) return null;

    return (
        <>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isCrypto ? stockData.symbol : (profileData?.name || stockData.symbol)}
                    </h2>
                    {!isCrypto && profileData && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {profileData.exchange} · {profileData.industry || 'N/A'}
                        </p>
                    )}
                    {isCrypto && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Cryptocurrency
                        </p>
                    )}
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(stockData.close)}
                    </div>
                    <div className={`text-sm font-medium ${getPriceChangeColor(stockData.percent_change)}`}>
                        {formatPrice(stockData.change)} ({formatPercentage(stockData.percent_change)})
                    </div>
                </div>
            </div>
            
            {/* Basic price metrics - shown for both stocks and crypto */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Open</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatPrice(stockData.open)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">High</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatPrice(stockData.high)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Low</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatPrice(stockData.low)}</p>
                </div>
                {!isCrypto && (
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Trading Volume</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                            {new Intl.NumberFormat().format(stockData.volume)}
                        </p>
                    </div>
                )}
                {isCrypto && (
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">24h Volume</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                            {new Intl.NumberFormat().format(stockData.volume)}
                        </p>
                    </div>
                )}
            </div>
            
           
            {!isCrypto && keyStats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    {keyStats.marketCap && keyStats.marketCap !== 'N/A' && (
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Market Cap</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {formatLargeNumber(keyStats.marketCap)}
                            </p>
                        </div>
                    )}
                    {keyStats.pe && keyStats.pe !== 'N/A' && (
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">P/E Ratio</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {keyStats.pe !== 'N/A' ? Number(keyStats.pe).toFixed(2) : 'N/A'}
                            </p>
                        </div>
                    )}
                    {keyStats.eps && keyStats.eps !== 'N/A' && (
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">EPS</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {keyStats.eps !== 'N/A' ? Number(keyStats.eps).toFixed(2) : 'N/A'}
                            </p>
                        </div>
                    )}
                    {keyStats.dividend && keyStats.dividend !== 'N/A' && (
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Dividend</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {keyStats.dividend !== 'N/A' ? formatPrice(keyStats.dividend) : 'N/A'}
                            </p>
                        </div>
                    )}
                    {keyStats.dividendYield && keyStats.dividendYield !== 'N/A' && (
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Dividend Yield</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {keyStats.dividendYield !== 'N/A' ? formatPercentage(keyStats.dividendYield) : 'N/A'}
                            </p>
                        </div>
                    )}
                    {keyStats.fiftyTwoWeekHigh && keyStats.fiftyTwoWeekHigh !== 'N/A' && (
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">52W High</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {formatPrice(keyStats.fiftyTwoWeekHigh)}
                            </p>
                        </div>
                    )}
                    {keyStats.fiftyTwoWeekLow && keyStats.fiftyTwoWeekLow !== 'N/A' && (
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">52W Low</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {formatPrice(keyStats.fiftyTwoWeekLow)}
                            </p>
                        </div>
                    )}
                </div>
            )}
        
            {isCrypto && keyStats && keyStats.marketCap && keyStats.marketCap !== 'N/A' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Market Cap</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                            {formatLargeNumber(keyStats.marketCap)}
                        </p>
                    </div>
                </div>
            )}
            
            
            {!isCrypto && profileData && profileData.description && (
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-sm font-semibold  text-gray-900 dark:text-white mb-2">
                        About {profileData.name}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        {profileData.description?.substring(0, 300)}
                        {profileData.description?.length > 300 ? '...' : ''}
                    </p>
                </div>
            )}
        </>
    );
}