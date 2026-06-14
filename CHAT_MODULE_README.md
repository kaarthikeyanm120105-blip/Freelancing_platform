# Real-Time Messaging System (Chat Module)

## Project Overview
This module introduces a real-time messaging system allowing clients and freelancers to communicate seamlessly after a job proposal has been accepted. Built natively on the MERN stack with Socket.io, it ensures that messages are delivered instantly, securely, and persistently.

## Chat System Architecture
The architecture comprises a REST API for standard HTTP operations (like fetching past conversations and messages) and a WebSocket (Socket.io) server for real-time bidirectional communication.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Socket.io.
- **Frontend:** React, Axios, Socket.io-client.
- **Authentication:** JWT-based user authentication.

## Database Schema

### Conversation Model
Represents an active chat room between a client and a freelancer for a specific job.
```javascript
const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
}, { timestamps: true });
```

### Message Model
Represents an individual message sent within a conversation.
```javascript
const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messageText: { type: String, required: true },
  messageType: { type: String, enum: ['text', 'file'], default: 'text' },
  readStatus: { type: Boolean, default: false }
}, { timestamps: true });
```

## API Documentation

### Create Conversation
Create a conversation when a freelancer is accepted.
- **Endpoint:** `POST /api/chat/conversation`
- **Body:** `{ "jobId": "...", "clientId": "...", "freelancerId": "..." }`
- **Response:** Returns the newly created or existing conversation object.

### Get User Conversations
Fetch all conversations for the currently logged-in user.
- **Endpoint:** `GET /api/chat/conversations`
- **Response:** Array of conversation objects populated with participant details and the last message.

### Get Messages
Retrieve chat history for a specific conversation.
- **Endpoint:** `GET /api/chat/messages/:conversationId`
- **Response:** Array of message objects sorted by timestamp.

### Send Message (REST Backup)
Save a message to the database directly via HTTP.
- **Endpoint:** `POST /api/chat/message`
- **Body:** `{ "conversationId": "...", "senderId": "...", "messageText": "..." }`

## Socket.io Implementation
Real-time messaging is powered by Socket.io. The server is configured to handle multiple concurrent connections and broadcast messages securely.

**Socket Events:**
- `join_conversation` (Client -> Server): Subscribes the user to a specific conversation room.
- `send_message` (Client -> Server): Emits a new message payload to the server.
- `receive_message` (Server -> Client): Broadcasts the received message to all users in the specific conversation room.
- `message_delivered` (Server -> Client): Acknowledgment that the server successfully stored the message.

## Frontend Integration
The React frontend leverages `socket.io-client` to keep the chat view updated in real-time. 

**Core Components:**
- `MessagesPage.jsx`: Displays the list of all active conversations.
- `ChatPage.jsx / ChatBox.jsx`: The main interface for sending and receiving messages. Contains the left-side conversation list and right-side active chat window.
- `MessageInput.jsx`: Controlled input component for drafting and sending text strings.
- `chatService.js`: Encapsulates Axios HTTP calls (fetching history) and Socket.io event listeners.

## Real-Time Messaging Flow
1. **Initiation:** The client accepts a freelancer's proposal. The backend automatically creates a `Conversation` document.
2. **Connection:** When either party navigates to the Chat Page, their `socket.io-client` connects to the Node.js server.
3. **Room Subscription:** The client emits `join_conversation` with the `conversationId` to ensure they only receive relevant messages.
4. **Sending a Message:**
   - User types a message and clicks send.
   - Frontend emits `send_message` with the payload (text, senderId, conversationId).
   - Backend receives the event, creates a new `Message` document in MongoDB, and emits `receive_message` to the specific Socket.io room.
5. **Receiving a Message:** The receiver's frontend listens for `receive_message` and instantly updates the React state to append the new message bubble.

## Installation Guide

### Environment Variables
**Backend (`.env`)**
```properties
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

### Running the Application
1. **Clone and Install:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. **Start Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```
3. **Start Frontend Client:**
   ```bash
   cd frontend
   npm run dev
   ```

## Future Improvements
- **Online/Offline Status:** Track connected socket instances to show green "online" dots.
- **Typing Indicators:** Broadcast `typing` and `stop_typing` socket events.
- **File & Image Sharing:** Integrate AWS S3 or Cloudinary to handle attachments.
- **Read Receipts:** Update the `readStatus` boolean when the recipient views the chat window.
