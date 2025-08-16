<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class StockDataController extends Controller
{
    protected $baseUrl = 'https://api.twelvedata.com';
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.twelvedata.key');
        \Log::info('Twelve Data API Key: ' . $this->apiKey);
        
    }

    public function getQuote(Request $request)
    {
        $symbol = $request->query('symbol');
        
        if (!$symbol) {
            return response()->json(['error' => 'Symbol parameter is required'], 400);
        }
        
        $cacheKey = "stock_quote_{$symbol}";
        
        return Cache::remember($cacheKey, 300, function () use ($symbol) {
            $response = Http::get("{$this->baseUrl}/quote", [
                'symbol' => $symbol,
                'apikey' => $this->apiKey,
            ]);
            
            if ($response->successful()) {
                return $response->json();
            }
            
            return ['error' => 'Failed to fetch quote data', 'details' => $response->json()];
        });
    }

    public function getProfile(Request $request)
    {
        $symbol = $request->query('symbol');
        
        if (!$symbol) {
            return response()->json(['error' => 'Symbol parameter is required'], 400);
        }
        
        $cacheKey = "stock_profile_{$symbol}";
        
        return Cache::remember($cacheKey, 86400, function () use ($symbol) {
            $response = Http::get("{$this->baseUrl}/profile", [
                'symbol' => $symbol,
                'apikey' => $this->apiKey,
            ]);
            
            if ($response->successful()) {
                return $response->json();
            }
            
            return ['error' => 'Failed to fetch profile data', 'details' => $response->json()];
        });
    }
    
    public function getTimeSeriesData(Request $request)
    {
        $symbol = $request->query('symbol');
        $interval = $request->query('interval', '1day');
        $outputsize = $request->query('outputsize', '30');
        
        if (!$symbol) {
            return response()->json(['error' => 'Symbol parameter is required'], 400);
        }
        
        $cacheKey = "stock_timeseries_{$symbol}_{$interval}_{$outputsize}";
        
        return Cache::remember($cacheKey, 3600, function () use ($symbol, $interval, $outputsize) {
            $response = Http::get("{$this->baseUrl}/time_series", [
                'symbol' => $symbol,
                'interval' => $interval,
                'outputsize' => $outputsize,
                'apikey' => $this->apiKey,
            ]);
            
            if ($response->successful()) {
                return $response->json();
            }
            
            return ['error' => 'Failed to fetch time series data', 'details' => $response->json()];
        });
    }
}