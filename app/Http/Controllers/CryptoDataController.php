<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class CryptoDataController extends Controller
{
    protected $baseUrl = 'https://api.twelvedata.com';
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = env('TWELVE_DATA_API_KEY');
    }

    public function getQuote(Request $request)
    {
        $symbol = $request->query('symbol');
        
        if (!$symbol) {
            return response()->json(['error' => 'Symbol parameter is required'], 400);
        }
        
        // Ensure we have the USD pair format for crypto
        $symbolParam = "{$symbol}/USD";
        
        // Cache quotes for 2 minutes - crypto prices change rapidly
        $cacheKey = "crypto_quote_{$symbol}";
        
        return Cache::remember($cacheKey, 120, function () use ($symbolParam) {
            $response = Http::get("{$this->baseUrl}/quote", [
                'symbol' => $symbolParam,
                'apikey' => $this->apiKey,
            ]);
            
            if ($response->successful()) {
                return $response->json();
            }
            
            return ['error' => 'Failed to fetch crypto quote data', 'details' => $response->json()];
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
        
        $symbolParam = "{$symbol}/USD";
        
        $cacheKey = "crypto_timeseries_{$symbol}_{$interval}_{$outputsize}";
        
        return Cache::remember($cacheKey, 300, function () use ($symbolParam, $interval, $outputsize) {
            $response = Http::get("{$this->baseUrl}/time_series", [
                'symbol' => $symbolParam,
                'interval' => $interval,
                'outputsize' => $outputsize,
                'apikey' => $this->apiKey,
            ]);
            
            if ($response->successful()) {
                return $response->json();
            }
            
            return ['error' => 'Failed to fetch crypto time series data', 'details' => $response->json()];
        });
    }
}