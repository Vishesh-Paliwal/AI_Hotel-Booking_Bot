# Room-Book-AI: Simplified Hotel Booking Chatbot

# Demo-Video :
[Screencast from 07-07-24 03_47_55 PM IST(3).webm](https://github.com/user-attachments/assets/cbe2d8c4-9d12-4d0c-973d-bf69944dc1e3)


## Objective
Develop a RESTful API using Express.js that implements a chatbot capable of handling hotel booking queries. The chatbot will use OpenAI's API for natural language processing and maintain conversation history.

## Main Endpoint
- **POST /chat** - Handle user messages and return chatbot responses.

## Chatbot Flow
1. User initiates a conversation about booking a resort room.
2. Bot fetches room options from an API and responds with a list of room options.
3. User selects a room.
4. Bot provides pricing information.
5. User confirms they want to proceed with booking.
6. Bot makes a simulated API call to book the room and returns a booking confirmation with a booking ID.

## Setup Instructions
### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- SQLite3

### Installation
1. Clone the repository

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add your OpenAI API key:
    ```env
    OPENAI_API_KEY=your_openai_api_key
    ```

4. Run the server:
    ```sh
    npm start
    ```

5. Open a web browser and navigate to http://localhost:3001 to interact with the chatbot.


# Project Structure

room-book-ai/

├── public/

│   ├── index.html

│   ├── style.css

├── server.js

├── db.js

├── package.json

├── .env

├── README.md

