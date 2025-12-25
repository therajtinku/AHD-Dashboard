import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Record from './models/Record.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for large CSV syncs

// MongoDB Connection (Cached for Serverless)
const connectToDatabase = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not defined in environment variables');
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of default 30s
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

// Routes

// GET: Fetch all records
app.get('/api/records', async (req, res) => {
    try {
        await connectToDatabase();
        const records = await Record.find({});
        res.status(200).json(records);
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Failed to fetch records' });
    }
});

// POST: Add single record
app.post('/api/records', async (req, res) => {
    try {
        await connectToDatabase();
        const newRecord = new Record(req.body);
        await newRecord.save();
        res.status(201).json(newRecord);
    } catch (error) {
        console.error('Error adding record:', error);
        res.status(500).json({ error: 'Failed to add record' });
    }
});

// PUT: Update record
app.put('/api/records/:id', async (req, res) => {
    try {
        await connectToDatabase();
        const { id } = req.params;
        const updatedRecord = await Record.findOneAndUpdate({ id }, req.body, { new: true });
        if (!updatedRecord) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.status(200).json(updatedRecord);
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({ error: 'Failed to update record' });
    }
});

// DELETE: Delete record
app.delete('/api/records/:id', async (req, res) => {
    try {
        await connectToDatabase();
        const { id } = req.params;
        await Record.findOneAndDelete({ id });
        res.status(200).json({ message: 'Record deleted' });
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({ error: 'Failed to delete record' });
    }
});

// POST: Sync/Import (Bulk)
app.post('/api/sync', async (req, res) => {
    try {
        await connectToDatabase();
        const records = req.body;

        if (!Array.isArray(records)) {
            return res.status(400).json({ error: 'Input must be an array of records' });
        }

        // Strategy: We can either upsert or replace. 
        // For simplicity and to match previous "Reset -> Import" logic, 
        // we will check if it's a full sync or incremental. 
        // If the user wants to "Sync" from a URL, they often expect the URL to be the source of truth.
        // However, maintaining user-added records while syncing is complex.
        // For now, let's implement a smart "Upsert based on ID" strategy.

        const bulkOps = records.map(record => ({
            updateOne: {
                filter: { id: record.id },
                update: { $set: record },
                upsert: true
            }
        }));

        if (bulkOps.length > 0) {
            await Record.bulkWrite(bulkOps);
        }

        const allRecords = await Record.find({});
        res.status(200).json(allRecords);
    } catch (error) {
        console.error('Error syncing data:', error);
        // Distinguish between validation errors and others
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Duplicate record found (ID collision). Data might need cleanup.' });
        }
        res.status(500).json({ error: `Failed to sync data: ${error.message}` });
    }
});

// Clean up endpoint (Reset Data)
app.delete('/api/records', async (req, res) => {
    try {
        await connectToDatabase();
        await Record.deleteMany({});
        res.status(200).json({ message: 'All records deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reset data' });
    }
});

// Export app for Vercel
export default app;
