# CeylonEye Tourism Management System - Transport Module

A complete MERN stack application for managing transport providers in a tourism management system.

## Features

- ✅ **CRUD Operations**: Create, Read, Update, Delete transport providers
- ✅ **Modern UI**: Beautiful, responsive design with Bootstrap-like styling
- ✅ **Error Handling**: Comprehensive error handling on both frontend and backend
- ✅ **Loading States**: User-friendly loading indicators
- ✅ **Form Validation**: Client-side and server-side validation
- ✅ **MongoDB Integration**: Full database integration with Mongoose

## Tech Stack

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Styling**: Inline CSS with modern design

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## MongoDB Setup Instructions

### Option 1: MongoDB Community Server (Recommended for Development)

1. **Download MongoDB Community Server**
   - Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select your operating system (Windows, macOS, or Linux)
   - Download the Community Server

2. **Install MongoDB**
   - **Windows**: Run the downloaded `.msi` file and follow the installation wizard
   - **macOS**: Use Homebrew: `brew install mongodb-community`
   - **Linux**: Follow the [official installation guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

3. **Start MongoDB Service**
   - **Windows**: MongoDB should start automatically as a service
   - **macOS/Linux**: Run `mongod` in terminal

4. **Verify Installation**
   - Open a new terminal and run: `mongosh`
   - You should see the MongoDB shell prompt

### Option 2: MongoDB Atlas (Cloud Database)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose the free tier (M0)
   - Select a region close to you
   - Create cluster

3. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password
   - Set privileges to "Read and write to any database"

4. **Whitelist Your IP**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Add your current IP or use "0.0.0.0/0" for all IPs (development only)

5. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `server` directory:

```env
MONGO_URI=mongodb://localhost:27017/tourism_management
PORT=5000
```

**For MongoDB Atlas**, use your connection string:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tourism_management?retryWrites=true&w=majority
PORT=5000
```

### 3. Start the Application

**Terminal 1 - Start the Backend Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start the Frontend:**
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## MongoDB Compass Setup

MongoDB Compass is a GUI tool for managing MongoDB databases.

### Installation

1. **Download MongoDB Compass**
   - Go to [MongoDB Compass Download](https://www.mongodb.com/products/compass)
   - Download and install Compass

2. **Connect to Local MongoDB**
   - Open MongoDB Compass
   - Use connection string: `mongodb://localhost:27017`
   - Click "Connect"

3. **Connect to MongoDB Atlas**
   - Open MongoDB Compass
   - Use your Atlas connection string
   - Click "Connect"

4. **View Your Data**
   - Navigate to the `tourism_management` database
   - View the `transportproviders` collection
   - You can see, edit, and manage your data directly

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transport-providers` | Get all transport providers |
| GET | `/api/transport-providers/:id` | Get single transport provider |
| POST | `/api/transport-providers` | Create new transport provider |
| PUT | `/api/transport-providers/:id` | Update transport provider |
| DELETE | `/api/transport-providers/:id` | Delete transport provider |

## Data Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  contact: String (required),
  vehicleType: String (required),
  availability: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running: `mongosh` should work
   - Check your connection string in `.env`
   - Verify MongoDB service is started

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill process using the port: `npx kill-port 5000`

3. **CORS Issues**
   - CORS is already configured in the server
   - Ensure frontend is running on port 3000

4. **Module Not Found**
   - Run `npm install` in both server and client directories
   - Clear node_modules and reinstall if needed

### Getting Help

- Check the console for error messages
- Verify all dependencies are installed
- Ensure MongoDB is running and accessible
- Check network connectivity for Atlas connections

## Project Structure

```
CeylonEye1/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── models/        # Mongoose models
│   │   └── routes/        # API routes
│   ├── index.js           # Server entry point
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
