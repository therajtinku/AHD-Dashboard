import app from './api/index.js';

const PORT = 5000;

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    console.error('Server will continue running, but database operations may fail.');
});

const server = app.listen(PORT, () => {
    console.log(`Local development server running on http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api/records`);
    console.log('\nIf you see MongoDB connection errors above, check your .env file.');
});

// Keep the process alive
server.on('error', (err) => {
    console.error('Server error:', err);
});
