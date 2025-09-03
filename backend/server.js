import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import { generate } from './chatbot.js';

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to ChatDPT!');
});

app.post('/chat', async (req, res) => {
    const { message, threadId } = req.body;
    // todo: validate above fields

    if (!message || !threadId) {
        res.status(400).json({ message: 'All fields are required!' });
        return;
    }

    console.log('Message', message);

    const result = await generate(message, threadId);
    res.json({ message: result });
});

// Start the server
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

// Handle process termination
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
