const express = require('express');
const bodyParser = require('body-parser');
const { OpenAIApi, Configuration } = require('openai');
const { sequelize, Conversation } = require('./db');
const axios = require('axios');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function getRoomOptions() {
    try {
        const response = await axios.get('https://bot9assignement.deno.dev/rooms');
        return response.data;
    } catch (error) {
        console.error('Error fetching room options:', error);
        return [];
    }
}

async function bookRoom(roomId, fullName, email, nights) {
    try {
        const response = await axios.post('https://bot9assignement.deno.dev/book', {
            roomId,
            fullName,
            email,
            nights
        });
        return response.data;
    } catch (error) {
        console.error('Error booking room:', error);
        return null;
    }
}

const systemPrompt = `
You are a hotel booking assistant. Your job is to help users book hotel rooms. 
You should not answer any off-topic questions and should guide the user through the process of booking a room.
The steps include:
1. Greeting the user.
2. Showing available room options.
3. Accepting user selection of a room.
4. Collecting user details (name, email, number of nights).
5. Confirming the booking.
6. if user speeks hindi use hinglish
`;

const context = [
    { role: 'system', content: systemPrompt }
];

const functions = [
    {
        name: 'getRoomOptions',
        description: 'Fetch available room options',
        parameters: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'bookRoom',
        description: 'Book a room for the user',
        parameters: {
            type: 'object',
            properties: {
                roomId: { type: 'integer' },
                fullName: { type: 'string' },
                email: { type: 'string' },
                nights: { type: 'integer' }
            },
            required: ['roomId', 'fullName', 'email', 'nights']
        }
    }
];

app.post('/chat', async (req, res) => {
    const { message, userId } = req.body;
    context.push({ role: 'user', content: message });

    try {
        // Store the user's message
        await Conversation.create({ userMessage: message, botMessage: '' });

        const response = await openai.chat.completions.create({
            model: 'gpt-4', 
            messages: context,
            functions: functions,
        });
        
        //console.log(response);
        let botReply = response?.choices[0]?.message?.content?.trim();
        console.log(response.choices[0].message);
        if (response.choices[0].finish_reason === 'function_call') {
            const functionCall = response.choices[0].message.function_call;
            const functionName = functionCall.name;

            if (functionName === 'getRoomOptions') {
                const rooms = await getRoomOptions();
                botReply = `Here are the available rooms:\n${rooms.map(room => `Room ID: ${room.id}, Name: ${room.name}, Price: ${room.price}`).join('\n')}\nPlease select a room by ID.`;
            } else if (functionName === 'bookRoom') {
                const { roomId, fullName, email, nights } = JSON.parse(functionCall.arguments);
                const booking = await bookRoom(roomId, fullName, email, nights);
                botReply = booking ? `Booking confirmed! Your booking ID is ${booking.bookingId}.` : 'There was an error booking the room. Please try again.';
            }
        }

        // Store the bot's reply
        await Conversation.create({ userMessage: '', botMessage: botReply });
        context.push({ role: 'assistant', content: botReply });

        res.json({ reply: botReply });
    } catch (error) {
        console.error('Error interacting with OpenAI API:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
