const express = require('express');
const router = express.Router();
const binanceService = require('../services/binanceService');

/**
 * GET /api/markets/all
 * Lấy tất cả coins
 */
router.get('/all', async (req, res) => {
    try {
        const markets = await binanceService.getAllMarkets();
        res.json({
            success: true,
            data: markets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/markets/popular
 * Lấy popular coins
 */
router.get('/popular', async (req, res) => {
    try {
        const popular = await binanceService.getPopularCoins();
        res.json({
            success: true,
            data: popular
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/markets/gainers
 * Lấy top gainers
 */
router.get('/gainers', async (req, res) => {
    try {
        const gainers = await binanceService.getTopGainers();
        res.json({
            success: true,
            data: gainers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/markets/volume
 * Lấy top volume
 */
router.get('/volume', async (req, res) => {
    try {
        const topVolume = await binanceService.getTopVolume();
        res.json({
            success: true,
            data: topVolume
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/markets/new
 * Lấy new listings
 */
router.get('/new', async (req, res) => {
    try {
        const newListings = await binanceService.getNewListings();
        res.json({
            success: true,
            data: newListings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/markets/history/:symbol
 * Lấy historical price data cho một symbol
 * Query params: timeframe (1h, 1d, 1w, 1M, 1Y)
 */
router.get('/history/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { timeframe } = req.query;

        const historicalData = await binanceService.getHistoricalPrices(symbol, timeframe || '1h');
        res.json({
            success: true,
            data: historicalData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;

