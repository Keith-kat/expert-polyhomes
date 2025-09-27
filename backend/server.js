// Simple backend for deployment - Expert Polyhomes
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple in-memory storage (we'll upgrade to MongoDB later)
let quotes = [];
let contacts = [];

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Expert Polyhomes API is running!',
        timestamp: new Date().toISOString()
    });
});

// Submit quote
app.post('/api/quotes', (req, res) => {
    try {
        const quoteData = req.body;
        
        // Simple price calculation
        const priceMatrix = {
            'fixed': 1500, 'roller': 2800, 'slider': 2600, 'magnetic': 1800
        };
        
        const area = quoteData.windowWidth * quoteData.windowHeight;
        const totalPrice = area * priceMatrix[quoteData.meshType] * quoteData.windowCount;
        
        const quote = {
            id: Date.now(),
            ...quoteData,
            totalPrice,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        quotes.push(quote);
        console.log('New quote received:', quote);
        
        res.json({
            success: true,
            message: 'Quote received successfully!',
            quoteId: quote.id,
            totalPrice: totalPrice
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Contact form
app.post('/api/contact', (req, res) => {
    try {
        const contactData = req.body;
        contactData.id = Date.now();
        contactData.createdAt = new Date().toISOString();
        
        contacts.push(contactData);
        console.log('New contact message:', contactData);
        
        res.json({
            success: true,
            message: 'Message received! We will contact you soon.'
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Service check
app.get('/api/service-check', (req, res) => {
    const location = req.query.location || '';
    const servedAreas = ['nairobi', 'westlands', 'karen', 'langata', 'thika', 'kiambu'];
    
    const isServed = servedAreas.some(area => 
        location.toLowerCase().includes(area)
    );
    
    res.json({
        served: isServed,
        estimate: isServed ? '24 hours' : '2-3 days',
        message: isServed ? 'We serve your area!' : 'Contact us for special arrangements'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});