# Chat Application

A real-time chat application supporting one-to-one and group messaging, built with Firebase Firestore, Firebase Authentication, Redis Cache, and Node.js. The frontend is hosted on Cloudflare, while the backend and Redis server run locally.

## Features
- Real-time one-to-one and group messaging
- Secure user authentication with Firebase Authentication
- Firestore database for chat storage and synchronization
- Redis cache for optimized performance
- Node.js backend as a watchdog to monitor Firebase services
- Frontend hosted on Cloudflare

## System Architecture
- **Frontend**: Deployed on Cloudflare
- **Backend**: Node.js server running locally
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Caching**: Redis cache

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript (React or Vanilla JS)
- **Backend**: Node.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Cache**: Redis
- **Hosting**: Cloudflare (frontend), Local Server (backend & Redis)

## Getting Started

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Redis](https://redis.io/docs/getting-started/)
- Cloudflare account for hosting

### Clone the Repository
```sh
 git clone https://github.com/your-username/chat-app.git
 cd chat-app
```

### Backend Setup
1. Navigate to the `backend` directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure Firebase:
   - Create a `.env` file and add your Firebase credentials:
     ```env
     FIREBASE_API_KEY=your_api_key
     FIREBASE_AUTH_DOMAIN=your_auth_domain
     FIREBASE_PROJECT_ID=your_project_id
     FIREBASE_STORAGE_BUCKET=your_storage_bucket
     FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     FIREBASE_APP_ID=your_app_id
     ```
4. Start the backend server:
   ```sh
   npm start
   ```

### Redis Setup
1. Start Redis server:
   ```sh
   redis-server
   ```
2. Ensure Redis is running:
   ```sh
   redis-cli ping
   ```

### Frontend Setup and Deployment on Cloudflare
1. Navigate to the `frontend` directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Build the frontend for deployment:
   ```sh
   npm run build
   ```
4. Deploy to Cloudflare Pages:
   - Log in to your [Cloudflare account](https://dash.cloudflare.com/)
   - Navigate to **Pages** and create a new project
   - Connect your GitHub repository
   - Select the `frontend` directory as the root
   - Set the build command to `npm run build`
   - Set the output directory to `build`
   - Click **Deploy**

### Running the Application
- Start the backend server (`npm start` in backend directory)
- Ensure Redis is running (`redis-server`)
- Access the frontend via Cloudflare Pages URL

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a Pull Request


Feel free to update the configurations and add your Firebase credentials in the `.env` file before running the application. Happy coding!
