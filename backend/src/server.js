require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const marketRoutes = require('./routes/marketRoutes');
const { initializeWebSocket } = require('./websocket/websocket');

const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Socket.io setup với CORS
const io = new Server(server, {
    cors: corsOptions
});

// Initialize WebSocket
initializeWebSocket(io);

// REST API routes
app.use('/api/markets', marketRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Crypto Backend Server is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Crypto Backend API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            markets: {
                all: '/api/markets/all',
                popular: '/api/markets/popular',
                gainers: '/api/markets/gainers',
                volume: '/api/markets/volume',
                new: '/api/markets/new'
            }
        }
    });
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log('═══════════════════════════════════════');
    console.log('🚀 Crypto Backend Server Started');
    console.log('═══════════════════════════════════════');
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
    console.log(`🌐 Frontend: ${process.env.FRONTEND_URL}`);
    console.log('═══════════════════════════════════════');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});
