const binanceService = require('../services/binanceService');

let updateInterval = null;

/**
 * Khởi tạo WebSocket server với Socket.io
 */
function initializeWebSocket(io) {
    console.log('🔌 WebSocket server initialized');

    io.on('connection', (socket) => {
        console.log(`✅ Client connected: ${socket.id}`);

        // Gửi data ban đầu cho client
        sendInitialData(socket);

        // Lắng nghe disconnect
        socket.on('disconnect', () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });

    // Bắt đầu gửi updates định kỳ cho tất cả clients
    startPriceUpdates(io);
}

/**
 * Gửi dữ liệu ban đầu khi client kết nối
 */
async function sendInitialData(socket) {
    try {
        const markets = await binanceService.getAllMarkets();
        socket.emit('initialData', {
            markets,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('Error sending initial data:', error.message);
    }
}

/**
 * Bắt đầu gửi price updates mỗi giây
 */
function startPriceUpdates(io) {
    // Clear existing interval nếu có
    if (updateInterval) {
        clearInterval(updateInterval);
    }

    // Gửi updates mỗi 1 giây
    updateInterval = setInterval(async () => {
        try {
            const markets = await binanceService.getAllMarkets();

            // Broadcast cho tất cả connected clients
            io.emit('priceUpdate', {
                markets,
                timestamp: Date.now()
            });

            // Log để debug
            console.log(`📊 Price update sent to ${io.engine.clientsCount} clients`);
        } catch (error) {
            console.error('Error sending price update:', error.message);
        }
    }, 1000); // 1000ms = 1 second
}

/**
 * Dừng price updates
 */
function stopPriceUpdates() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
        console.log('⏹️ Price updates stopped');
    }
}

module.exports = {
    initializeWebSocket,
    stopPriceUpdates
};
