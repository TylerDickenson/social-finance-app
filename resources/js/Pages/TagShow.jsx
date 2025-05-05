import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import Post from '@/Components/Post';
import StockChart from '@/Components/StockChart';
import StockDetails from '@/Components/StockDetails';
import axios from 'axios';

const CRYPTO_SYMBOLS = ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'XRP', 'ADA', 'SOL', 'DOGE', 'DOT', 'AVAX', 'MATIC', 'LTC', 'LINK', 'SHIB', 'UNI', 'XLM', 'ATOM'];

export default function TagShow({ tag, posts, currentFilter = 'newest' }) {
    const { auth } = usePage().props;
    const currentUserId = auth.user ? auth.user.id : null;
    const [stockData, setStockData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [keyStats, setKeyStats] = useState(null);
    
    const isStockSymbol = /^[A-Z]{1,5}$/.test(tag.name) && !CRYPTO_SYMBOLS.includes(tag.name);
    const isCryptoSymbol = CRYPTO_SYMBOLS.includes(tag.name);
    const isFinancialSymbol = isStockSymbol || isCryptoSymbol;

    useEffect(() => {
        const fetchStockData = async () => {
            if (isFinancialSymbol) {
                setLoading(true);
                setError(null);
                
                try {
                    const endpoint = isCryptoSymbol ? '/crypto' : '/stock';
                    
                    const [quoteResponse, profileResponse] = await Promise.all([
                        axios.get(`${endpoint}/quote?symbol=${tag.name}`),
                        isStockSymbol ? axios.get(`/stock/profile?symbol=${tag.name}`) : Promise.resolve({data: null})
                    ]);
                    
                    setStockData(quoteResponse.data);
                    setProfileData(profileResponse.data);
                    
                    if (quoteResponse.data && !quoteResponse.data.error) {
                        setKeyStats({
                            marketCap: quoteResponse.data.market_cap || 'N/A',
                            pe: quoteResponse.data.pe || 'N/A',
                            eps: quoteResponse.data.eps || 'N/A',
                            dividend: quoteResponse.data.dividend || 'N/A',
                            dividendYield: quoteResponse.data.dividend_yield || 'N/A',
                            fiftyTwoWeekHigh: quoteResponse.data.fifty_two_week?.high || 'N/A',
                            fiftyTwoWeekLow: quoteResponse.data.fifty_two_week?.low || 'N/A'
                        });
                    }
                } catch (err) {
                    console.error('Error fetching stock data:', err);
                    setError('Unable to load financial data at this time.');
                } finally {
                    setLoading(false);
                }
            }
        };
        
        fetchStockData();
    }, [tag.name, isFinancialSymbol]);

    const handleFilterChange = (newFilter) => {
        router.get(route('tags.show', tag.name), { filter: newFilter }, { preserveState: true });
    };

    const renderPosts = () => {
        if (!Array.isArray(posts) || posts.length === 0) {
            return <p className="text-center text-gray-500 dark:text-gray-400 mb-6">No posts or comments found tagged with ${tag.name}.</p>;
        }

        return posts.map((post) => (
            <div className="mb-6" key={`post-${post.id}`}>
                <Post
                    post={post}
                    currentUserId={currentUserId}
                />
            </div>
        ));
    };

    const renderStockData = () => {
        if (loading) {
            return (
                <div className="p-4 mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <div className="animate-pulse flex space-x-4">
                        <div className="flex-1 space-y-4 py-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (error) {
            return <div className="p-4 mb-8 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">{error}</div>;
        }

        if (!stockData || stockData.error) {
            return null;
        }

        return (
            <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white dark:bg-slate-800 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
                <div className="p-6">
                    <StockDetails 
                        stockData={stockData}
                        profileData={profileData}
                        keyStats={keyStats}
                    />
                    
                    <StockChart symbol={tag.name} />
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={`Tag - ${tag.name}`}
        >
            <Head title={`Tag: ${tag.name}`} />

            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {isFinancialSymbol && (
                    <div className="overflow-hidden mb-6">
                        <div className="p-6">
                            {renderStockData()}
                        </div>
                    </div>
                )}
                <div className="flex justify-end mb-4 mr-10">
                    <div className="relative">
                        <select
                            value={currentFilter}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="appearance-none bg-white dark:bg-slate-500 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="newest">Newest Posts</option>
                            <option value="oldest">Oldest Posts</option>
                            <option value="popular">Most Liked</option>
                        </select>
                        
                    </div>
                </div>

                <div className="overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        {renderPosts()}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}