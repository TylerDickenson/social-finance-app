import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { CRYPTO_SYMBOLS } from '@/Constants/symbols';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function StockChart({ symbol }) {
    const [timeSeriesData, setTimeSeriesData] = useState(null);
    const [chartTimeframe, setChartTimeframe] = useState('1month');
    const [chartLoading, setChartLoading] = useState(false);
    const [chartError, setChartError] = useState(null);
    
    // Check if this is a cryptocurrency
    const isCrypto = CRYPTO_SYMBOLS.includes(symbol);
    
    useEffect(() => {
        fetchChartData(chartTimeframe);
    }, [symbol]);

    const fetchChartData = async (timeframe) => {
        if (!symbol) return;
        
        setChartLoading(true);
        setChartError(null);
        setChartTimeframe(timeframe);
        
        let interval = '1day';
        let outputsize = 30;
        
        switch (timeframe) {
            case '1week':
                interval = '1hour';
                outputsize = 168;
                break;
            case '1month':
                interval = '1day';
                outputsize = 30;
                break;
            case '3months':
                interval = '1day';
                outputsize = 90;
                break;
            case '1year':
                interval = '1week';
                outputsize = 52;
                break;
            case '5years':
                interval = '1month';
                outputsize = 60;
                break;
        }
        
        try {
            const endpoint = isCrypto ? '/crypto/timeseries' : '/stock/timeseries';
            
            console.log(`Fetching ${isCrypto ? 'crypto' : 'stock'} data for ${symbol}`);
            
            const response = await axios.get(`${endpoint}`, {
                params: {
                    symbol: symbol,
                    interval: interval,
                    outputsize: outputsize
                }
            });
            
            console.log('Chart data response:', response.data);
            
            if (response.data && response.data.error) {
                setChartError(`Error: ${response.data.error}`);
                setTimeSeriesData(null);
            } else {
                setTimeSeriesData(response.data);
            }
        } catch (err) {
            console.error('Error fetching time series data:', err);
            setChartError('Failed to load chart data');
            setTimeSeriesData(null);
        } finally {
            setChartLoading(false);
        }
    };

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
    
    const prepareChartData = () => {
        if (!timeSeriesData || !timeSeriesData.values || timeSeriesData.values.length === 0) {
            return null;
        }
        
        const values = [...timeSeriesData.values].reverse();
        
        
        const mainColor = isCrypto ? 'rgb(247, 147, 26)' : 'rgb(53, 162, 235)'; 
        const fillColor = isCrypto ? 'rgba(247, 147, 26, 0.1)' : 'rgba(53, 162, 235, 0.1)';
        
        return {
            labels: values.map(item => {
                const date = new Date(item.datetime);
                return chartTimeframe === '1week' ? 
                    date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) :
                    date.toLocaleDateString();
            }),
            datasets: [
                {
                    label: 'Price',
                    data: values.map(item => item.close),
                    fill: {
                        target: 'origin',
                        above: fillColor,
                    },
                    borderColor: mainColor,
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: chartTimeframe === '1week' ? 0 : 3,
                    pointBackgroundColor: mainColor,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: mainColor,
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2,
                }
            ]
        };
    };
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return formatPrice(context.parsed.y);
                    }
                },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                padding: 10,
                cornerRadius: 6,
                displayColors: false
            }
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    color: 'rgba(200, 200, 200, 0.1)', 
                    borderDash: [5, 5],
                    drawBorder: false
                },
                ticks: {
                    color: 'rgba(120, 120, 120, 1)',
                    font: {
                        size: 10,
                        weight: '500'
                    },
                    maxRotation: 0
                }
            },
            y: {
                grid: {
                    display: true,
                    color: 'rgba(200, 200, 200, 0.1)', 
                    borderDash: [5, 5],
                    drawBorder: false
                },
                ticks: {
                    callback: function(value) {
                        return formatPrice(value);
                    },
                    color: 'rgba(120, 120, 120, 1)', 
                    font: {
                        size: 11,
                        weight: '500' 
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        },
        elements: {
            line: {
                tension: 0.3 
            },
            point: {
                radius: 3,
                hoverRadius: 5
            }
        }
    };
    
    if (chartLoading) {
        return (
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Price History</h3>
                </div>
                <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }
    
    if (chartError) {
        return (
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Price History</h3>
                </div>
                <div className="h-64 flex items-center justify-center">
                    <p className="text-red-500">{chartError}</p>
                </div>
            </div>
        );
    }

    const chartData = prepareChartData();
    if (!chartData) {
        return (
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Price History</h3>
                </div>
                <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">No historical data available</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Price History</h3>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => fetchChartData('1month')}
                        className={`px-3 py-1 rounded-md text-sm ${
                            chartTimeframe === '1month' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        1M
                    </button>
                    <button 
                        onClick={() => fetchChartData('3months')}
                        className={`px-3 py-1 rounded-md text-sm ${
                            chartTimeframe === '3months' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        3M
                    </button>
                    <button 
                        onClick={() => fetchChartData('1year')}
                        className={`px-3 py-1 rounded-md text-sm ${
                            chartTimeframe === '1year' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        1Y
                    </button>
                    <button 
                        onClick={() => fetchChartData('5years')}
                        className={`px-3 py-1 rounded-md text-sm ${
                            chartTimeframe === '5years' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        5Y
                    </button>
                </div>
            </div>
            
            <div className="h-64">
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}