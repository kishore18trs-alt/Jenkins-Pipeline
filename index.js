const express = require('express');

const app = express();
const PORT = 3000;

// Middleware for express to parse JSON bodies
app.use(express.json());

// Simple API to test CI/CD
app.get('/', (req, res) => {
res.send('CI/CD Pipeline is working 🚀');
});

// Health Check API (IMPORTANT for DevOps)
app.get('/health', (req, res) => {
res.status(200).json({ status: 'OK' });
});

// Sample API
app.get('/api/users', (req, res) => {
res.json([
{ id: 1, name: 'Kishore G' },

]);
});


// POST API
app.post('/api/data', (req, res) => {
const data = req.body;
res.json({
message: 'Data received successfully',
data
});
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
console.log(`Server running on port ${PORT}`);
});
