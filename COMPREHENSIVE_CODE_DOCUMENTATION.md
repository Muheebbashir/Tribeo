# 🌍 TRIBEO - Complete Code Documentation

## 📚 Table of Contents
- [Introduction](#introduction)
- [Backend Documentation](#backend-documentation)
- [Frontend Documentation](#frontend-documentation)
- [Architecture Overview](#architecture-overview)

---

## Introduction

**Tribeo** is a full-stack language learning social platform that connects people who want to learn new languages with native speakers. Users can make friends, chat in real-time, and have video calls with language partners from around the world.

**Tech Stack:**
- **Backend:** Node.js, Express, MongoDB, Stream Chat API
- **Frontend:** React, Vite, TailwindCSS, DaisyUI, Stream Chat React, React Query
- **Real-time Features:** Stream Chat for messaging, Stream Video for calls

---

# 🔧 BACKEND DOCUMENTATION

## 📁 File Structure
```
backend/
├── package.json           # Dependencies and scripts
├── src/
│   ├── server.js         # Main application entry point
│   ├── constants.js      # App-wide constants
│   ├── lib/              # Library/utility files
│   │   ├── db.js         # Database connection
│   │   └── stream.js     # Stream Chat integration
│   ├── middleware/       # Express middlewares
│   │   └── auth.middleware.js
│   ├── models/          # Database models
│   │   ├── User.js
│   │   └── FriendRequest.js
│   ├── controllers/     # Business logic
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── chat.controller.js
│   ├── routes/          # API routes
│   │   ├── auth.route.js
│   │   ├── user.route.js
│   │   └── chat.route.js
│   └── utils/           # Helper functions
│       └── sendemail.js
```

---

## 📄 BACKEND FILES - DETAILED EXPLANATION

### 1. **package.json**
This file contains metadata about the project and lists all dependencies needed to run the backend.

**Purpose:** Manages project dependencies, scripts, and configuration.

```json
{
  "name": "backend",  // Project name
  "version": "1.0.0", // Version number
  "main": "src/server.js", // Entry point of the application
  "scripts": {
    "dev": "nodemon src/server.js",  // Development mode with auto-restart
    "start": "node src/server.js"    // Production mode
  },
  "type": "module", // IMPORTANT: Enables ES6 imports (import/export)
  "dependencies": {
    "bcryptjs": "^3.0.2",      // For hashing passwords securely
    "cookie-parser": "^1.4.7",  // Parse cookies from HTTP requests
    "cors": "^2.8.5",           // Enable Cross-Origin Resource Sharing
    "crypto": "^1.0.1",         // For generating secure tokens
    "dotenv": "^16.5.0",        // Load environment variables from .env
    "express": "^4.21.0",       // Web framework for Node.js
    "jsonwebtoken": "^9.0.2",   // Create and verify JWT tokens
    "mongoose": "^8.13.2",      // MongoDB object modeling
    "nodemailer": "^7.0.12",    // Send emails (for password reset)
    "stream-chat": "^8.60.0"    // Stream Chat backend SDK
  },
  "devDependencies": {
    "nodemon": "^3.1.9"  // Auto-restart server during development
  }
}
```

**Why each dependency matters:**
- **bcryptjs:** Encrypts user passwords so they're never stored in plain text
- **cookie-parser:** Reads authentication cookies sent by the browser
- **cors:** Allows frontend (different domain) to communicate with backend
- **express:** Simplifies creating API endpoints and handling HTTP requests
- **jsonwebtoken:** Creates secure tokens to keep users logged in
- **mongoose:** Makes working with MongoDB easier with schemas and models
- **nodemailer:** Sends password reset emails to users
- **stream-chat:** Integrates Stream's chat functionality

---

### 2. **src/server.js**
This is the **MAIN FILE** that starts the entire backend application.

**Purpose:** Sets up Express server, middleware, routes, and connects to database.

**Line-by-line explanation:**

```javascript
import express from "express";
```
- **What:** Imports Express framework
- **Why:** We need Express to create a web server that handles HTTP requests

```javascript
import "dotenv/config";
```
- **What:** Loads environment variables from `.env` file
- **Why:** Keeps sensitive data (passwords, API keys) separate from code

```javascript
import cookieParser from "cookie-parser";
```
- **What:** Imports cookie parsing middleware
- **Why:** Needed to read JWT tokens stored in cookies

```javascript
import cors from "cors";
```
- **What:** Imports CORS middleware
- **Why:** Allows frontend (localhost:5173) to make requests to backend (localhost:5000)

```javascript
import path from "path";
```
- **What:** Node.js path utility
- **Why:** Helps construct file paths for serving frontend in production

```javascript
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
```
- **What:** Imports all route handlers
- **Why:** Organizes API endpoints into separate files by feature

```javascript
import { connectDB } from "./lib/db.js";
```
- **What:** Imports database connection function
- **Why:** Needed to connect to MongoDB

```javascript
const app = express();
```
- **What:** Creates an Express application instance
- **Why:** This `app` object is used to configure the server

```javascript
const PORT = process.env.PORT;
```
- **What:** Reads port number from environment variables
- **Why:** Allows different ports in development vs production

```javascript
const __dirname = path.resolve();
```
- **What:** Gets the current directory path
- **Why:** ES modules don't have `__dirname` by default, we create it manually

```javascript
app.use(
  cors({
    origin: "http://localhost:5173",  // Frontend URL
    credentials: true,  // Allow cookies to be sent
  })
);
```
- **What:** Configures CORS middleware
- **Why `origin`:** Only allows requests from our frontend
- **Why `credentials: true`:** Enables sending cookies (needed for authentication)

```javascript
app.use(express.json());
```
- **What:** Parses incoming JSON data in request body
- **Why:** Allows us to read data sent from frontend (like `req.body`)

```javascript
app.use(cookieParser());
```
- **What:** Parses cookies from incoming requests
- **Why:** Needed to read JWT token stored in cookies (`req.cookies.jwt`)

```javascript
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
```
- **What:** Mounts route handlers at specific paths
- **Why:** Organizes API endpoints:
  - `/api/auth/*` → Authentication (signup, login, logout)
  - `/api/users/*` → User operations (friends, requests)
  - `/api/chat/*` → Chat operations (get token)

```javascript
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
```
- **What:** Serves frontend in production
- **Why `express.static`:** Serves static files (JS, CSS, images)
- **Why `app.get("*")`:** Catch-all route sends React app for any route (enables client-side routing)

```javascript
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
```
- **What:** Starts the server and connects to database
- **Why:** Makes the server listen for incoming requests on the specified port

---

### 3. **src/constants.js**
Stores constant values used throughout the application.

**Purpose:** Centralize configuration values that might be used in multiple places.

```javascript
export const DB_NAME="TRIBEO"
```
- **What:** Database name for MongoDB
- **Why:** If we ever need to change the database name, we only change it here
- **Usage:** Used in `db.js` when connecting to MongoDB

---

### 4. **src/lib/db.js**
Handles MongoDB database connection.

**Purpose:** Establishes connection to MongoDB using Mongoose.

**Line-by-line explanation:**

```javascript
import mongoose from "mongoose";
```
- **What:** Imports Mongoose library
- **Why:** Mongoose is an ODM (Object Data Modeling) library that makes MongoDB easier to work with

```javascript
import { DB_NAME } from "../constants.js";
```
- **What:** Imports the database name
- **Why:** Keeps database name consistent across the app

```javascript
export const connectDB = async () => {
```
- **What:** Exports an async function
- **Why `async`:** Database operations take time, we need to wait for them
- **Why export:** Can be called from `server.js`

```javascript
try {
```
- **What:** Start of error handling block
- **Why:** Database connections can fail, we need to handle errors gracefully

```javascript
const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
```
- **What:** Connects to MongoDB
- **Why `await`:** Wait for connection to complete before proceeding
- **Connection string:** `mongodb://...connection-url.../TRIBEO`
- **Returns:** Connection object with details about the connection

```javascript
console.log(`MongoDB Connected: ${conn.connection.host}`);
```
- **What:** Logs successful connection
- **Why:** Helps developers know the database connected successfully
- **`conn.connection.host`:** Shows which MongoDB server we connected to

```javascript
} catch (error) {
  console.log("Error in connecting to MongoDB", error);
  process.exit(1); // 1 means failure
}
```
- **What:** Handles connection errors
- **Why `process.exit(1)`:** Stops the entire application if database connection fails
- **Why exit:** The app can't function without a database, so we stop it

---

### 5. **src/lib/stream.js**
Integrates Stream Chat SDK for real-time messaging.

**Purpose:** Create and manage Stream Chat users and generate authentication tokens.

**Line-by-line explanation:**

```javascript
import { StreamChat } from "stream-chat";
```
- **What:** Imports Stream Chat SDK
- **Why:** Provides methods to interact with Stream's chat service

```javascript
import "dotenv/config";
```
- **What:** Loads environment variables
- **Why:** Access Stream API keys

```javascript
const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;
```
- **What:** Gets Stream credentials from environment
- **Why:** Needed to authenticate with Stream's servers
- **Note:** Typo in env variable name (STEAM vs STREAM)

```javascript
if (!apiKey || !apiSecret) {
  console.error("Stream API key or Secret is missing");
}
```
- **What:** Validates that credentials exist
- **Why:** Without these, chat features won't work

```javascript
const streamClient = StreamChat.getInstance(apiKey, apiSecret);
```
- **What:** Creates a Stream Chat client instance
- **Why:** This client is used to perform all Stream operations
- **`getInstance`:** Singleton pattern - only one instance needed

```javascript
export const upsertStreamUser = async (userData) => {
```
- **What:** Function to create or update Stream user
- **Why "upsert":** Creates if doesn't exist, updates if exists
- **userData format:** `{ id, name, image }`

```javascript
try {
  await streamClient.upsertUsers([userData]);
  return userData;
```
- **What:** Sends user data to Stream
- **Why array `[userData]`:** Stream API accepts multiple users at once
- **Why await:** Wait for Stream to process the request

```javascript
} catch (error) {
  console.error("Error upserting Stream user:", error);
}
```
- **What:** Error handling
- **Why:** If Stream is down, app continues to work (just chat won't)

```javascript
export const generateStreamToken = (userId) => {
```
- **What:** Function to create authentication token for Stream
- **Why:** Frontend needs this token to connect to Stream Chat

```javascript
try {
  const userIdStr = userId.toString();
```
- **What:** Converts userId to string
- **Why:** Stream requires user IDs to be strings

```javascript
  return streamClient.createToken(userIdStr);
```
- **What:** Generates JWT token for Stream
- **Why:** This token proves to Stream that the user is authenticated
- **Security:** Only backend can create these tokens (secret key required)

```javascript
} catch (error) {
  console.error("Error generating Stream token:", error);
}
```
- **What:** Error handling
- **Why:** Logs errors for debugging

---

### 6. **src/middleware/auth.middleware.js**
Protects routes that require authentication.

**Purpose:** Verify user is logged in before accessing protected routes.

**Line-by-line explanation:**

```javascript
import jwt from "jsonwebtoken";
```
- **What:** Imports JWT library
- **Why:** Needed to verify JWT tokens

```javascript
import User from "../models/User.js";
```
- **What:** Imports User model
- **Why:** Needed to fetch user data from database

```javascript
export const protectRoute = async (req, res, next) => {
```
- **What:** Express middleware function
- **Why `req, res, next`:** Standard middleware signature
- **`next()`:** Passes control to next middleware/route handler

```javascript
try {
  const token = req.cookies.jwt;
```
- **What:** Extracts JWT from cookies
- **Why cookies:** More secure than localStorage (httpOnly flag)

```javascript
if (!token) {
  return res.status(401).json({ message: "Unauthorized - No token provided" });
}
```
- **What:** Checks if token exists
- **Why 401:** HTTP status for "Unauthorized"
- **Why return:** Stops execution, doesn't continue to next()

```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```
- **What:** Verifies and decodes JWT
- **Why:** Ensures token hasn't been tampered with
- **decoded contains:** `{ userId: "...", iat: ..., exp: ... }`
- **JWT_SECRET:** Secret key used to sign tokens

```javascript
if (!decoded) {
  return res.status(401).json({ message: "Unauthorized - Invalid token" });
}
```
- **What:** Checks if verification succeeded
- **Why:** Tampered or expired tokens fail verification

```javascript
const user = await User.findById(decoded.userId).select("-password");
```
- **What:** Fetches user from database
- **Why `decoded.userId`:** Token contains the user's ID
- **Why `select("-password")`:** Excludes password from returned data (security)

```javascript
if (!user) {
  return res.status(401).json({ message: "Unauthorized - User not found" });
}
```
- **What:** Checks if user exists
- **Why:** User might have been deleted after token was issued

```javascript
req.user = user;
```
- **What:** Attaches user object to request
- **Why:** Makes user data available to route handlers
- **Usage:** `req.user` can now be accessed in controllers

```javascript
next();
```
- **What:** Passes control to next middleware/handler
- **Why:** Authentication successful, allow request to proceed

```javascript
} catch (error) {
  console.log("Error in protectRoute middleware", error);
  res.status(500).json({ message: "Internal Server Error" });
}
```
- **What:** Catches any errors (invalid token format, database errors, etc.)
- **Why 500:** Internal server error status

---

### 7. **src/models/User.js**
Defines the User database schema and model.

**Purpose:** Structure how user data is stored and provide helper methods.

**Line-by-line explanation:**

```javascript
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
```
- **mongoose:** Database modeling
- **bcryptjs:** Password hashing
- **crypto:** Generate secure random tokens

```javascript
const userSchema = new mongoose.Schema(
  {
```
- **What:** Creates a schema (blueprint for documents)
- **Why:** Defines structure and validation rules for users

```javascript
fullName: {
  type: String,
  required: true,
},
```
- **type:** Data type (String, Number, Date, etc.)
- **required:** Field must have a value
- **Why:** Every user needs a name

```javascript
email: {
  type: String,
  required: true,
  unique: true,
},
```
- **unique:** Creates index, prevents duplicate emails
- **Why:** Email is used for login, must be unique

```javascript
password: {
  type: String,
  required: true,
  minlength: 6,
},
```
- **minlength:** Validation - password must be at least 6 characters
- **Why:** Enforces basic password security

```javascript
bio: {
  type: String,
  default: "",
},
```
- **default:** Value if not provided
- **Why:** Not required, optional field for user profile

```javascript
profilePic: {
  type: String,
  default: "",
},
```
- **What:** Stores URL to profile picture
- **Why:** Users need avatars for visual identification

```javascript
nativeLanguage: {
  type: String,
  default: "",
},
learningLanguage: {
  type: String,
  default: "",
},
```
- **What:** Language preferences
- **Why:** Core feature - matching users based on languages

```javascript
location: {
  type: String,
  default: "",
},
```
- **What:** User's location (city, country)
- **Why:** Helps find local language partners

```javascript
isOnboarded: {
  type: Boolean,
  default: false,
},
```
- **What:** Tracks if user completed onboarding
- **Why:** Redirect new users to complete their profile

```javascript
friends: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],
```
- **What:** Array of user IDs
- **type: ObjectId:** References other User documents
- **ref: "User":** Tells Mongoose which model to use for population
- **Why:** Stores user's friend connections

```javascript
passwordResetToken: {
  type: String,
},
passwordResetExpires: {
  type: Date,
},
```
- **What:** Fields for password reset functionality
- **Why:** Store reset token and expiration time temporarily

```javascript
{ timestamps: true }
```
- **What:** Automatically adds `createdAt` and `updatedAt` fields
- **Why:** Track when documents are created/modified

```javascript
userSchema.pre("save", async function (next) {
```
- **What:** Mongoose middleware (hook) that runs before saving
- **pre("save"):** Executes before document is saved to database
- **Why:** Automatically hash password before saving

```javascript
if (!this.isModified("password")) return next();
```
- **What:** Checks if password was changed
- **Why:** Only hash if password is new/changed (skip if updating other fields)
- **this:** Refers to the document being saved

```javascript
try {
  const salt = await bcrypt.genSalt(10);
```
- **What:** Generates a salt for hashing
- **salt:** Random data added to password before hashing
- **10:** Number of rounds (higher = more secure but slower)
- **Why:** Makes each hashed password unique even if same password

```javascript
  this.password = await bcrypt.hash(this.password, salt);
```
- **What:** Hashes the password
- **Why:** Never store plain text passwords (security)

```javascript
  next();
```
- **What:** Continues to save the document
- **Why:** Signals that pre-save hook is complete

```javascript
} catch (error) {
  next(error);
}
```
- **What:** Passes error to next middleware
- **Why:** Proper error handling

```javascript
userSchema.methods.matchPassword = async function (enteredPassword) {
```
- **What:** Instance method added to all user documents
- **methods:** Custom methods available on document instances
- **Why:** Reusable method to check passwords during login

```javascript
const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
return isPasswordCorrect;
```
- **What:** Compares plain text password with hashed password
- **bcrypt.compare:** Hashes entered password and compares with stored hash
- **Why:** Can't reverse hash, must compare this way

```javascript
userSchema.methods.createPasswordResetToken = function () {
```
- **What:** Method to create password reset token
- **Why:** Generates secure token for password reset emails

```javascript
const resetToken = crypto.randomBytes(32).toString("hex");
```
- **What:** Generates random 32-byte token as hex string
- **Why:** Creates unique, unguessable token

```javascript
this.passwordResetToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");
```
- **What:** Hashes the token before storing
- **Why:** Don't store plain token in database (security)
- **If database compromised:** Attacker can't use tokens

```javascript
this.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
```
- **What:** Sets expiration time
- **15 * 60 * 1000:** 15 minutes in milliseconds
- **Why:** Reset links should expire quickly for security

```javascript
return resetToken;
```
- **What:** Returns unhashed token
- **Why:** This is sent in email, user submits it back

```javascript
const User = mongoose.model("User", userSchema);
export default User;
```
- **What:** Creates model from schema and exports it
- **"User":** Model name (creates "users" collection in MongoDB)
- **Why:** Use this model to interact with users collection

---

### 8. **src/models/FriendRequest.js**
Defines the FriendRequest schema.

**Purpose:** Track friend requests between users.

**Line-by-line explanation:**

```javascript
const friendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
```
- **What:** ID of user sending the request
- **ref: "User":** Can populate sender details
- **Why:** Need to know who sent the request

```javascript
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
```
- **What:** ID of user receiving the request
- **Why:** Need to know who should accept/reject

```javascript
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
```
- **enum:** Only allows specified values
- **default:** New requests start as "pending"
- **Why:** Track request state

```javascript
  {
    timestamps: true,
  }
```
- **What:** Adds createdAt and updatedAt
- **Why:** Know when requests were sent/accepted

---

### 9. **src/controllers/auth.controller.js**
Handles all authentication-related logic.

**Purpose:** Business logic for signup, login, logout, onboarding, and password reset.

**Line-by-line explanation:**

#### **signup Function:**

```javascript
export async function signup(req, res) {
  let { email, password, fullName } = req.body;
```
- **What:** Extracts data from request body
- **let:** Used instead of const because email will be modified

```javascript
try {
  if (!email || !password || !fullName) {
    return res.status(400).json({ message: "All fields are required" });
  }
```
- **What:** Validates all fields are provided
- **400:** Bad Request status
- **Why return:** Stop execution if validation fails

```javascript
email = email.toLowerCase().trim();
```
- **toLowerCase():** Converts to lowercase
- **trim():** Removes whitespace
- **Why:** "User@Email.com" and "user@email.com" should be same

```javascript
if (password.length < 6) {
  return res.status(400).json({ message: "Password must be at least 6 characters" });
}
```
- **What:** Validates password length
- **Why:** Basic security requirement

```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return res.status(400).json({ message: "Invalid email format" });
}
```
- **What:** Validates email format using regex
- **Regex breakdown:**
  - `^` - Start of string
  - `[^\s@]+` - One or more characters that aren't space or @
  - `@` - Literal @ symbol
  - `[^\s@]+` - Domain name
  - `\.` - Literal dot
  - `[^\s@]+` - Domain extension
  - `$` - End of string

```javascript
const existingUser = await User.findOne({ email });
if (existingUser) {
  return res.status(400).json({ message: "Email already exists, please use a different one" });
}
```
- **What:** Checks if email already registered
- **Why:** Prevent duplicate accounts

```javascript
const idx = Math.floor(Math.random() * 50) + 1;
const randomAvatar = `https://i.pravatar.cc/150?u=${idx}`;
```
- **What:** Generates random avatar URL
- **Math.random():** 0 to 1
- **× 50:** 0 to 50
- **Math.floor():** Rounds down
- **+ 1:** Makes it 1 to 50 (not 0 to 49)
- **pravatar.cc:** Free avatar service

```javascript
const newUser = await User.create({
  email,
  fullName,
  password,
  profilePic: randomAvatar,
});
```
- **What:** Creates new user in database
- **Why:** User.create automatically saves to DB
- **Password:** Automatically hashed by pre-save hook

```javascript
try {
  await upsertStreamUser({
    id: newUser._id.toString(),
    name: newUser.fullName,
    image: newUser.profilePic || "",
  });
  console.log(`Stream user created for ${newUser.fullName}`);
} catch (error) {
  console.log("Error creating Stream user:", error);
}
```
- **What:** Creates user in Stream Chat
- **Why try/catch:** If Stream is down, still allow signup
- **toString():** Stream requires string ID

```javascript
const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});
```
- **What:** Creates JWT token
- **jwt.sign():** Creates and signs token
- **Payload:** `{ userId: newUser._id }`
- **Secret:** Used to verify token later
- **expiresIn:** Token expires in 7 days
- **Why:** Keep users logged in

```javascript
res.cookie("jwt", token, {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
});
```
- **What:** Sends token as HTTP-only cookie
- **maxAge:** 7 days in milliseconds
- **httpOnly:** JavaScript can't access (prevents XSS attacks)
- **sameSite: "strict":** Prevents CSRF attacks
- **secure:** Only send over HTTPS in production
- **Why cookies:** More secure than localStorage

```javascript
res.status(201).json({ success: true, user: newUser });
```
- **201:** Created status
- **Why:** Confirms successful signup

#### **login Function:**

```javascript
export async function login(req, res) {
  try {
    let { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    email = email.toLowerCase().trim();
```
- **What:** Validates and normalizes input
- **Why:** Same validation as signup

```javascript
const user = await User.findOne({ email });
if (!user) return res.status(401).json({ message: "Invalid email or password" });
```
- **What:** Finds user by email
- **401:** Unauthorized
- **Why vague message:** Don't reveal if email exists (security)

```javascript
const isPasswordCorrect = await user.matchPassword(password);
if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });
```
- **What:** Verifies password
- **matchPassword:** Custom method defined in User model
- **Why:** Compares hashed passwords

```javascript
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});

res.cookie("jwt", token, {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
});

res.status(200).json({ success: true, user });
```
- **What:** Creates token and sends cookie
- **Same as signup:** Keep login logic consistent

#### **logout Function:**

```javascript
export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout successful" });
}
```
- **What:** Removes JWT cookie
- **clearCookie:** Deletes the cookie
- **Why:** User is no longer authenticated

#### **onboard Function:**

```javascript
export async function onboard(req, res) {
  try {
    const userId = req.user._id;
```
- **What:** Gets user ID from middleware
- **req.user:** Set by protectRoute middleware

```javascript
const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
  return res.status(400).json({
    message: "All fields are required",
    missingFields: [
      !fullName && "fullName",
      !bio && "bio",
      !nativeLanguage && "nativeLanguage",
      !learningLanguage && "learningLanguage",
      !location && "location",
    ].filter(Boolean),
  });
}
```
- **What:** Validates all onboarding fields
- **missingFields:** Tells client which fields are missing
- **filter(Boolean):** Removes false values

```javascript
const updatedUser = await User.findByIdAndUpdate(
  userId,
  {
    ...req.body,
    isOnboarded: true,
  },
  { new: true }
);
```
- **What:** Updates user document
- **...req.body:** Spreads all body fields
- **isOnboarded: true:** Marks as onboarded
- **{ new: true }:** Returns updated document (not old one)

```javascript
if (!updatedUser) return res.status(404).json({ message: "User not found" });
```
- **What:** Checks if user exists
- **404:** Not Found

```javascript
try {
  await upsertStreamUser({
    id: updatedUser._id.toString(),
    name: updatedUser.fullName,
    image: updatedUser.profilePic || "",
  });
  console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
} catch (streamError) {
  console.log("Error updating Stream user during onboarding:", streamError.message);
}
```
- **What:** Updates Stream user with new name
- **Why:** Keep Stream user data in sync

#### **forgotPassword Function:**

```javascript
export async function forgotPassword(req, res) {
  try {
    let { email } = req.body;
    email = email.toLowerCase().trim();
```
- **What:** Gets and normalizes email
- **Why:** Find user by email

```javascript
const user = await User.findOne({ email });
if (!user) {
  return res.status(404).json({ message: "User with this email does not exist" });
}
```
- **What:** Finds user
- **Why:** Can't reset password if user doesn't exist

```javascript
const resetToken = crypto.randomBytes(32).toString("hex");
const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
```
- **What:** Generates reset token
- **resetToken:** Plain token (sent in email)
- **hashedToken:** Hashed version (stored in DB)
- **Why separate:** Don't store plain token in database

```javascript
user.passwordResetToken = hashedToken;
user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
await user.save({ validateBeforeSave: false });
```
- **What:** Saves token and expiration
- **10 minutes:** Short expiration for security
- **validateBeforeSave: false:** Skip validation (password not being changed)

```javascript
const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
await sendEmail({
  to: user.email,
  subject: "Password Reset Request",
  html: `<p>You requested a password reset. Click <a href="${resetURL}">here</a> to reset your password. This link is valid for 10 minutes.</p>`,
});
```
- **What:** Sends reset email
- **resetToken:** Plain token (not hashed)
- **Why:** User needs plain token to reset password

#### **resetPassword Function:**

```javascript
export async function resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
```
- **What:** Gets token from URL and new password from body
- **req.params:** URL parameters (`:token` in route)

```javascript
const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
```
- **What:** Hashes submitted token
- **Why:** Database has hashed version

```javascript
const user = await User.findOne({
  passwordResetToken: hashedToken,
  passwordResetExpires: { $gt: Date.now() },
});
```
- **What:** Finds user with matching token that hasn't expired
- **$gt:** Greater than (MongoDB operator)
- **Why:** Token must be valid and not expired

```javascript
if (!user) {
  return res.status(400).json({ message: "Invalid or expired password reset token" });
}
```
- **What:** Validates token
- **Why:** Can't reset if token is invalid/expired

```javascript
user.password = newPassword;
user.passwordResetToken = undefined;
user.passwordResetExpires = undefined;
await user.save();
```
- **What:** Updates password and clears reset fields
- **user.save():** Triggers pre-save hook (hashes password)
- **undefined:** Removes fields from document

---

### 10. **src/controllers/user.controller.js**
Handles user-related operations (friends, recommendations, requests).

**Purpose:** Business logic for friend system.

#### **getRecommendedUsers Function:**

```javascript
export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;
```
- **What:** Gets current user info
- **req.user:** Set by protectRoute middleware

```javascript
const recommendedUsers = await User.find({
  $and: [
    { _id: { $ne: currentUserId } },
    { _id: { $nin: currentUser.friends } },
    { isOnboarded: true },
  ],
});
```
- **What:** Finds users for recommendations
- **$and:** All conditions must be true
- **$ne:** Not equal (exclude self)
- **$nin:** Not in array (exclude existing friends)
- **isOnboarded: true:** Only show completed profiles
- **Why:** Recommend users you're not friends with

```javascript
res.status(200).json(recommendedUsers);
```
- **What:** Returns array of recommended users

#### **getMyFriends Function:**

```javascript
export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage bio location");
```
- **What:** Gets user's friends with details
- **select("friends"):** Only get friends field
- **populate:** Replaces friend IDs with actual user objects
- **Second argument:** Which fields to include from populated documents
- **Why populate:** Get friend details, not just IDs

```javascript
res.status(200).json(user.friends);
```
- **What:** Returns array of friend objects

#### **sendFriendRequest Function:**

```javascript
export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;
```
- **What:** Gets sender and recipient IDs
- **Destructuring:** Renames `id` to `recipientId`

```javascript
if (myId === recipientId) {
  return res.status(400).json({ message: "You can't send friend request to yourself" });
}
```
- **What:** Prevents sending request to self
- **Why:** Business logic validation

```javascript
const recipient = await User.findById(recipientId);
if (!recipient) {
  return res.status(404).json({ message: "Recipient not found" });
}
```
- **What:** Validates recipient exists
- **Why:** Can't send request to non-existent user

```javascript
if (recipient.friends.includes(myId)) {
  return res.status(400).json({ message: "You are already friends with this user" });
}
```
- **What:** Checks if already friends
- **includes():** Array method to check if value exists
- **Why:** Prevent duplicate friendships

```javascript
const existingRequest = await FriendRequest.findOne({
  $or: [
    { sender: myId, recipient: recipientId },
    { sender: recipientId, recipient: myId },
  ],
});
```
- **What:** Checks if request already exists
- **$or:** Either condition can be true
- **Why check both directions:** Prevent duplicate requests

```javascript
if (existingRequest) {
  return res
    .status(400)
    .json({ message: "A friend request already exists between you and this user" });
}
```
- **What:** Prevents duplicate requests
- **Why:** Can't send multiple requests to same user

```javascript
const friendRequest = await FriendRequest.create({
  sender: myId,
  recipient: recipientId,
});

res.status(201).json(friendRequest);
```
- **What:** Creates and returns friend request
- **201:** Created status

#### **acceptFriendRequest Function:**

```javascript
export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }
```
- **What:** Finds the friend request
- **Why:** Need to verify it exists

```javascript
if (friendRequest.recipient.toString() !== req.user.id) {
  return res.status(403).json({ message: "You are not authorized to accept this request" });
}
```
- **What:** Verifies current user is the recipient
- **toString():** ObjectId needs to be converted for comparison
- **403:** Forbidden
- **Why:** Only recipient can accept

```javascript
friendRequest.status = "accepted";
await friendRequest.save();
```
- **What:** Updates request status
- **Why:** Track that request was accepted

```javascript
await User.findByIdAndUpdate(friendRequest.sender, {
  $addToSet: { friends: friendRequest.recipient },
});

await User.findByIdAndUpdate(friendRequest.recipient, {
  $addToSet: { friends: friendRequest.sender },
});
```
- **What:** Adds each user to other's friends array
- **$addToSet:** Adds to array only if not already present (prevents duplicates)
- **Why two updates:** Friendship is bidirectional

#### **getFriendRequests Function:**

```javascript
export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");
```
- **What:** Gets pending requests sent TO current user
- **populate:** Includes sender details
- **Why:** Show who sent the request

```javascript
const acceptedReqs = await FriendRequest.find({
  sender: req.user.id,
  status: "accepted",
}).populate("recipient", "fullName profilePic");
```
- **What:** Gets accepted requests sent BY current user
- **Why:** Show which of your requests were accepted (notifications)

```javascript
res.status(200).json({ incomingReqs, acceptedReqs });
```
- **What:** Returns both types of requests

#### **getOutgoingFriendReqs Function:**

```javascript
export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
```
- **What:** Gets pending requests sent BY current user
- **Why:** Show who you've sent requests to (to display "Request Sent" button)

---

### 11. **src/controllers/chat.controller.js**
Handles Stream Chat token generation.

**Purpose:** Provide authentication tokens for Stream Chat.

```javascript
import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    const token = generateStreamToken(req.user.id);
    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
```
- **What:** Generates Stream Chat token for authenticated user
- **Why:** Frontend needs token to connect to Stream Chat
- **Security:** Only authenticated users can get tokens (protectRoute middleware)

---

### 12. **src/routes/auth.route.js**
Defines authentication routes.

**Purpose:** Map HTTP endpoints to controller functions.

```javascript
import express from "express";
import { login, logout, onboard, signup, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
```
- **What:** Creates Express router
- **Why:** Group related routes together

```javascript
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
```
- **What:** Public routes (no authentication required)
- **POST:** HTTP method for these endpoints
- **Route format:** `/api/auth/signup`, `/api/auth/login`, etc.

```javascript
router.post("/onboarding", protectRoute, onboard);
```
- **What:** Protected route
- **protectRoute:** Middleware runs first, then onboard
- **Why:** Only logged-in users can onboard

```javascript
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
```
- **What:** Password reset routes
- **:token:** URL parameter (dynamic value)
- **Example:** `/api/auth/reset-password/abc123xyz`

```javascript
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});
```
- **What:** Get current user info
- **protectRoute:** Verifies authentication and sets req.user
- **Inline handler:** Small handler defined directly in route
- **Why:** Check if user is logged in

```javascript
export default router;
```
- **What:** Export router to use in server.js

---

### 13. **src/routes/user.route.js**
Defines user/friend routes.

```javascript
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  sendFriendRequest,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protectRoute);
```
- **What:** Applies middleware to ALL routes in this file
- **Why:** All user routes require authentication

```javascript
router.get("/", getRecommendedUsers);
```
- **Route:** `/api/users/`
- **What:** Get recommended users

```javascript
router.get("/friends", getMyFriends);
```
- **Route:** `/api/users/friends`
- **What:** Get user's friends

```javascript
router.post("/friend-request/:id", sendFriendRequest);
```
- **Route:** `/api/users/friend-request/123`
- **What:** Send friend request to user with ID 123

```javascript
router.put("/friend-request/:id/accept", acceptFriendRequest);
```
- **Route:** `/api/users/friend-request/123/accept`
- **PUT:** Update operation (changing request status)
- **What:** Accept friend request with ID 123

```javascript
router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);
```
- **What:** Get incoming and outgoing friend requests

---

### 14. **src/routes/chat.route.js**
Defines chat routes.

```javascript
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);

export default router;
```
- **Route:** `/api/chat/token`
- **What:** Get Stream Chat authentication token
- **Why:** Frontend needs this to connect to Stream Chat

---

### 15. **src/utils/sendemail.js**
Email sending utility.

**Purpose:** Send emails using Nodemailer.

```javascript
import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
```
- **What:** Function to send emails
- **Parameters:** Recipient, subject, HTML content

```javascript
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```
- **What:** Configures email service
- **host:** Gmail SMTP server
- **port 587:** Standard port for TLS
- **secure: false:** Use TLS (not SSL)
- **auth:** Gmail credentials from environment variables
- **Note:** EMAIL_PASS should be an "App Password" not regular Gmail password

```javascript
await transporter.sendMail({
  from: `"Tribeo" <${process.env.EMAIL_USER}>`,
  to,
  subject,
  html,
});
```
- **What:** Sends the email
- **from:** Display name and email address
- **html:** Email content (can include links, styling)

```javascript
export default sendEmail;
```
- **What:** Export for use in controllers

---

# 🎨 FRONTEND DOCUMENTATION

## 📁 File Structure
```
frontend/
├── package.json          # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # TailwindCSS configuration
├── index.html           # HTML entry point
├── src/
│   ├── main.jsx         # React entry point
│   ├── App.jsx          # Main app component
│   ├── index.css        # Global styles
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── store/           # State management
│   └── constants/       # Constants and config
```

---

## 📄 FRONTEND FILES - DETAILED EXPLANATION

### 1. **package.json**

```json
{
  "name": "frontend",
  "type": "module",  // Enable ES6 imports
  "scripts": {
    "dev": "vite",              // Start development server
    "build": "vite build",      // Build for production
    "preview": "vite preview"   // Preview production build
  },
  "dependencies": {
    "@stream-io/video-react-sdk": "^1.14.4",  // Video calling
    "@tanstack/react-query": "^5.74.4",       // Data fetching/caching
    "axios": "^1.8.4",                        // HTTP requests
    "lucide-react": "^0.503.0",               // Icon library
    "react": "^19.0.0",                       // React framework
    "react-dom": "^19.0.0",                   // React DOM rendering
    "react-hot-toast": "^2.5.2",              // Toast notifications
    "react-router": "^7.5.1",                 // Routing
    "stream-chat": "^8.60.0",                 // Chat SDK
    "stream-chat-react": "^12.14.0",          // Chat UI components
    "zustand": "^5.0.3"                       // State management
  },
  "devDependencies": {
    "daisyui": "^4.12.24",        // Component library
    "tailwindcss": "^3.4.17",     // Utility CSS framework
    "vite": "^6.3.1"              // Build tool
  }
}
```

**Why each dependency:**
- **@tanstack/react-query:** Manages server state, caching, and automatic refetching
- **axios:** Simpler API than fetch for HTTP requests
- **lucide-react:** Modern, customizable icons
- **react-hot-toast:** Beautiful toast notifications
- **stream-chat & stream-chat-react:** Complete chat solution with UI
- **@stream-io/video-react-sdk:** Video calling with minimal code
- **zustand:** Lightweight state management (simpler than Redux)
- **daisyui:** Pre-built Tailwind components
- **vite:** Fast development server and build tool

---

### 2. **src/main.jsx**
React application entry point.

**Purpose:** Set up React app with providers.

```javascript
import { StrictMode } from "react";
```
- **What:** React development mode component
- **Why:** Highlights potential problems in development

```javascript
import { createRoot } from "react-dom/client";
```
- **What:** React 18+ rendering API
- **Why:** Creates root for concurrent rendering

```javascript
import "stream-chat-react/dist/css/v2/index.css";
import "./index.css";
```
- **What:** Imports CSS files
- **Order matters:** Stream CSS first, then custom CSS (for overrides)

```javascript
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
```
- **What:** Imports main components and providers
- **BrowserRouter:** Enables client-side routing
- **QueryClient:** Manages React Query cache and settings

```javascript
const queryClient = new QueryClient();
```
- **What:** Creates Query Client instance
- **Why:** Configures caching, refetching, error handling for all queries

```javascript
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
```
- **What:** Renders app with providers
- **Provider nesting:**
  1. StrictMode (outermost)
  2. BrowserRouter (routing)
  3. QueryClientProvider (data fetching)
  4. App (actual app)
- **Why this order:** Each provider wraps what needs it

---

### 3. **src/App.jsx**
Main application component with routing.

**Purpose:** Define routes and handle authentication/onboarding flow.

```javascript
import { Navigate, Route, Routes } from "react-router";
```
- **Routes:** Container for all routes
- **Route:** Individual route definition
- **Navigate:** Redirect component

```javascript
import { Toaster } from "react-hot-toast";
```
- **What:** Toast notification container
- **Why:** Must be in component tree to show toasts

```javascript
const { isLoading, authUser } = useAuthUser();
const { theme } = useThemeStore();
```
- **useAuthUser:** Custom hook to get authenticated user
- **useThemeStore:** Zustand store for theme
- **Why:** Needed for route protection and theming

```javascript
const isAuthenticated = Boolean(authUser);
const isOnboarded = authUser?.isOnboarded;
```
- **isAuthenticated:** True if user is logged in
- **isOnboarded:** True if user completed onboarding
- **?. operator:** Optional chaining (safe if authUser is null)

```javascript
if (isLoading) return <PageLoader />;
```
- **What:** Shows loader while checking authentication
- **Why:** Prevent flash of wrong content

```javascript
return (
  <div className="h-screen" data-theme={theme}>
```
- **h-screen:** Tailwind class for full viewport height
- **data-theme:** DaisyUI theme attribute
- **Why:** Applies selected theme to entire app

**Route Protection Logic:**

```javascript
<Route
  path="/"
  element={
    isAuthenticated && isOnboarded ? (
      <Layout showSidebar={true}>
        <HomePage />
      </Layout>
    ) : (
      <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
    )
  }
/>
```
- **What:** Protected route with multiple checks
- **Logic:**
  - If authenticated AND onboarded → Show home page
  - If not authenticated → Redirect to login
  - If authenticated but not onboarded → Redirect to onboarding
- **Layout wrapper:** Provides sidebar and navbar

```javascript
<Route
  path="/signup"
  element={
    !isAuthenticated ? (
      <SignUpPage />
    ) : (
      <Navigate to={isOnboarded ? "/" : "/onboarding"} />
    )
  }
/>
```
- **What:** Public route (auth not required)
- **Logic:**
  - If not authenticated → Show signup page
  - If authenticated → Redirect to home or onboarding

```javascript
<Route
  path="/call/:id"
  element={
    isAuthenticated && isOnboarded ? (
      <CallPage />
    ) : (
      <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
    )
  }
/>
```
- **:id:** Dynamic route parameter (call ID)
- **No Layout:** Full screen for video calls

```javascript
<Toaster />
```
- **What:** Toast notification container
- **Why here:** Needs to be inside router but outside routes

---

### 4. **src/lib/axios.js**
Axios instance configuration.

**Purpose:** Configure HTTP client with base URL and credentials.

```javascript
import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";
```
- **import.meta.env.MODE:** Vite environment variable
- **Development:** Explicit backend URL
- **Production:** Relative path (served from same domain)
- **Why different:** CORS in development, same-origin in production

```javascript
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
```
- **axios.create:** Creates configured instance
- **baseURL:** Prepended to all requests
- **withCredentials: true:** Send cookies with requests (needed for JWT)
- **Why:** All API calls use this instance

---

### 5. **src/lib/api.js**
API functions for all backend calls.

**Purpose:** Centralize all API calls with clean interface.

```javascript
import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};
```
- **What:** Signup function
- **async:** Returns promise
- **signupData:** Object with email, password, fullName
- **response.data:** Axios wraps response, we just want data
- **Why:** Clean API functions used by React Query

```javascript
export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};
```
- **What:** Get current user
- **try/catch:** Returns null if not authenticated (expected behavior)
- **Why null:** React Query can handle null without errors

```javascript
export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
}
```
- **What:** Get user's friends
- **No try/catch:** Let React Query handle errors

```javascript
export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}
```
- **What:** Send friend request
- **userId:** Recipient's ID (passed as URL parameter)

```javascript
export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}
```
- **What:** Accept friend request
- **PUT:** Update operation

```javascript
export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}
```
- **What:** Get Stream Chat token
- **Returns:** `{ token: "..." }`

```javascript
export async function forgotPassword(email) {
  const response = await axiosInstance.post("/auth/forgot-password", { email });
  return response.data;
}
```
- **What:** Request password reset
- **email:** String (not object)
- **Wrapped in object:** `{ email: email }`

```javascript
export async function resetPassword(token, newPassword) {
  const response = await axiosInstance.post(`/auth/reset-password/${token}`, { newPassword });
  return response.data;
}
```
- **What:** Reset password
- **token:** From email link
- **newPassword:** New password from form

---

### 6. **src/lib/utils.js**
Utility functions.

```javascript
export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
```
- **What:** Capitalizes first letter
- **charAt(0):** Gets first character
- **toUpperCase():** Makes it uppercase
- **slice(1):** Gets rest of string
- **Example:** "english" → "English"

---

### 7. **src/hooks/useAuthUser.js**
Custom hook to get authenticated user.

**Purpose:** Fetch and cache current user data.

```javascript
import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });

  return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
};
```
- **useQuery:** React Query hook
- **queryKey:** Unique identifier for this query
- **queryFn:** Function that fetches data
- **retry: false:** Don't retry if fails (not authenticated is expected)
- **Returns:** Loading state and user data
- **Why custom hook:** Used in multiple components

---

### 8. **src/hooks/useSignUp.js**
Custom hook for signup mutation.

**Purpose:** Handle signup with React Query.

```javascript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";

const useSignUp = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return { isPending, error, signupMutation: mutate };
};
```
- **useMutation:** For create/update/delete operations
- **mutationFn:** Function to call
- **onSuccess:** Callback after successful signup
- **invalidateQueries:** Refetches authUser query
- **Why invalidate:** Updates UI with new user data
- **isPending:** Loading state (replaces isLoading)
- **error:** Error object if mutation fails

---

### 9. **src/hooks/useLogin.js**
Custom hook for login mutation.

```javascript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";

const useLogin = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return { error, isPending, loginMutation: mutate };
};
```
- **Same pattern as useSignUp**
- **Why separate hook:** Different mutation function

---

### 10. **src/hooks/useLogout.js**
Custom hook for logout mutation.

```javascript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";

const useLogout = () => {
  const queryClient = useQueryClient();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return { logoutMutation, isPending, error };
};
```
- **onSuccess:** Refetch authUser (will return null)
- **UI updates:** App.jsx sees authUser is null, redirects to login

---

### 11. **src/hooks/useForgotPassword.js**
Custom hook for forgot password.

```javascript
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../lib/api";
import toast from "react-hot-toast";

const useForgotPassword = () => {
  const { mutate: forgotPasswordMutation, isPending, error, isSuccess } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("Password reset link sent to your email!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    },
  });

  return { forgotPasswordMutation, isPending, error, isSuccess };
};
```
- **toast:** Shows notifications
- **onSuccess:** Show success message
- **onError:** Show error message
- **isSuccess:** Track if mutation succeeded
- **Why:** Show different UI after success

---

### 12. **src/hooks/useResetPassword.js**
Custom hook for password reset.

```javascript
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../lib/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const useResetPassword = () => {
  const navigate = useNavigate();

  const { mutate: resetPasswordMutation, isPending, error, isSuccess } = useMutation({
    mutationFn: ({ token, newPassword }) => resetPassword(token, newPassword),
    onSuccess: () => {
      toast.success("Password reset successful! Please login with your new password.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to reset password");
    },
  });

  return { resetPasswordMutation, isPending, error, isSuccess };
};
```
- **useNavigate:** Hook for programmatic navigation
- **mutationFn:** Destructures parameters
- **setTimeout:** Wait 2 seconds before redirect
- **Why delay:** Let user see success message

---

### 13. **src/store/useThemeStore.js**
Zustand store for theme management.

**Purpose:** Persist theme selection across app.

```javascript
import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("Tribeo-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("Tribeo-theme", theme);
    set({ theme });
  },
}));
```
- **create:** Creates Zustand store
- **set:** Function to update state
- **Initial theme:** From localStorage or default "coffee"
- **setTheme:** Updates both localStorage and state
- **localStorage:** Persists theme across sessions
- **Why Zustand:** Simple global state without Redux complexity

---

### 14. **src/constants/index.js**
App constants and configuration.

**Purpose:** Centralize theme configurations and language data.

```javascript
export const THEMES = [
  {
    name: "light",
    label: "Light",
    colors: ["#ffffff", "#5a67d8", "#8b5cf6", "#1a202c"],
  },
  // ... more themes
];
```
- **THEMES:** Array of theme objects
- **name:** Theme ID for DaisyUI
- **label:** Display name
- **colors:** Preview colors for theme selector
- **Why:** Pre-configured themes from DaisyUI

```javascript
export const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  // ... more languages
];
```
- **What:** Available languages for learning
- **Why:** Used in onboarding dropdowns

```javascript
export const LANGUAGE_TO_FLAG = {
  english: "gb",
  spanish: "es",
  french: "fr",
  // ... more mappings
};
```
- **What:** Maps language to country code
- **Why:** Show flags next to languages
- **Usage:** `flagcdn.com/24x18/${countryCode}.png`

---

### 15. **src/pages/HomePage.jsx**
Main application home page.

**Purpose:** Display user's friends and recommended users.

```javascript
const { data: friends = [], isLoading: loadingFriends } = useQuery({
  queryKey: ["friends"],
  queryFn: getUserFriends,
});
```
- **useQuery:** Fetch friends
- **data: friends = []:** Rename data, default to empty array
- **queryKey:** Unique identifier
- **Why:** Show user's existing friends

```javascript
const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
  queryKey: ["users"],
  queryFn: getRecommendedUsers,
});
```
- **What:** Fetch users to recommend
- **Why:** Suggest potential language partners

```javascript
const { data: outgoingFriendReqs } = useQuery({
  queryKey: ["outgoingFriendReqs"],
  queryFn: getOutgoingFriendReqs,
});
```
- **What:** Fetch pending outgoing requests
- **Why:** Show which users already have pending requests

```javascript
const { mutate: sendRequestMutation, isPending } = useMutation({
  mutationFn: sendFriendRequest,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
});
```
- **What:** Mutation to send friend request
- **onSuccess:** Refetch outgoing requests
- **Why:** Update UI to show "Request Sent"

```javascript
useEffect(() => {
  const outgoingIds = new Set();
  if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
    outgoingFriendReqs.forEach((req) => {
      outgoingIds.add(req.recipient._id);
    });
    setOutgoingRequestsIds(outgoingIds);
  }
}, [outgoingFriendReqs]);
```
- **What:** Creates Set of recipient IDs
- **Set:** Fast lookup for checking if request sent
- **Why:** Efficiently check if request sent to user
- **useEffect:** Runs when outgoingFriendReqs changes

```javascript
{friends.map((friend) => (
  <FriendCard key={friend._id} friend={friend} />
))}
```
- **map:** Renders array of components
- **key:** React needs unique key for list items
- **FriendCard:** Reusable component

```javascript
const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
```
- **has():** Set method to check if value exists
- **O(1) lookup:** Very fast
- **Why:** Determine button state

```javascript
<button
  className={`btn w-full mt-2 ${
    hasRequestBeenSent ? "btn-disabled" : "btn-primary"
  }`}
  onClick={() => sendRequestMutation(user._id)}
  disabled={hasRequestBeenSent || isPending}
>
```
- **Conditional class:** Changes button style
- **onClick:** Sends friend request
- **disabled:** Prevents multiple clicks
- **Why:** Better UX

---

### 16. **src/pages/SignUpPage.jsx**
User registration page.

```javascript
const [signupData, setSignupData] = useState({
  fullName: "",
  email: "",
  password: "",
});
```
- **useState:** Local form state
- **Why:** Controlled inputs

```javascript
const [showPassword, setShowPassword] = useState(false);
```
- **What:** Toggles password visibility
- **Why:** Better UX (see what you're typing)

```javascript
const { isPending, error, signupMutation } = useSignUp();
```
- **Custom hook:** Cleaner code
- **Why:** Reusable signup logic

```javascript
const handleSignup = (e) => {
  e.preventDefault();
  signupMutation(signupData);
};
```
- **e.preventDefault():** Stops form from submitting normally
- **signupMutation:** Triggers signup mutation
- **Why:** Handle form submission

```javascript
{error && (
  <div className="alert alert-error mb-4">
    <span>{error.response.data.message}</span>
  </div>
)}
```
- **Conditional rendering:** Only shows if error exists
- **error.response.data.message:** Backend error message
- **Why:** Show validation errors

```javascript
<input
  type="email"
  placeholder="john@gmail.com"
  className="input input-bordered w-full"
  value={signupData.email}
  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
  required
/>
```
- **value:** Controlled input (React controls value)
- **onChange:** Updates state on change
- **...signupData:** Spread operator (keeps other fields)
- **required:** HTML5 validation
- **Why controlled:** React is source of truth

```javascript
<button
  type="button"
  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
</button>
```
- **type="button":** Prevents form submission
- **Absolute positioning:** Floats over input
- **onClick:** Toggles state
- **Conditional icon:** Changes based on state
- **Why:** Toggle password visibility

```javascript
{isPending ? (
  <>
    <span className="loading loading-spinner loading-xs"></span>
    Loading...
  </>
) : (
  "Create Account"
)}
```
- **Conditional rendering:** Show spinner or text
- **Why:** Visual feedback during submission

---

### 17. **src/pages/LoginPage.jsx**
User login page.

**Very similar to SignUpPage, key differences:**

```javascript
const { isPending, error, loginMutation } = useLogin();
```
- **loginMutation instead of signupMutation**

```javascript
<Link to="/forgot-password" className="text-sm text-primary hover:underline">
  Forgot password?
</Link>
```
- **What:** Link to password reset
- **Why:** Help users who forgot password

**Same patterns:**
- Controlled inputs
- Password visibility toggle
- Error display
- Loading state

---

### 18. **src/pages/OnboardingPage.jsx**
Profile completion page.

```javascript
const { authUser } = useAuthUser();
const queryClient = useQueryClient();
```
- **authUser:** Pre-populated form fields
- **queryClient:** For invalidating queries

```javascript
const [formState, setFormState] = useState({
  fullName: authUser?.fullName || "",
  bio: authUser?.bio || "",
  nativeLanguage: authUser?.nativeLanguage || "",
  learningLanguage: authUser?.learningLanguage || "",
  location: authUser?.location || "",
  profilePic: authUser?.profilePic || "",
});
```
- **Initial state:** Uses existing user data or empty strings
- **?.operator:** Safe access (null if authUser is null)
- **Why:** Pre-fill if user returns to onboarding

```javascript
const { mutate: onboardingMutation, isPending } = useMutation({
  mutationFn: completeOnboarding,
  onSuccess: () => {
    toast.success("Profile onboarded successfully");
    queryClient.invalidateQueries({ queryKey: ["authUser"] });
  },
  onError: (error) => {
    toast.error(error.response.data.message);
  },
});
```
- **onSuccess:** Show success toast and refetch user
- **onError:** Show error message
- **invalidateQueries:** Updates authUser (sets isOnboarded: true)
- **Result:** App.jsx redirects to home

```javascript
const handleRandomAvatar = () => {
  const idx = Math.floor(Math.random() * 50) + 1;
  const randomAvatar = `https://i.pravatar.cc/150?img=${idx}`;
  setFormState({ ...formState, profilePic: randomAvatar });
  toast.success("Random profile picture generated!");
};
```
- **What:** Generates random avatar
- **Math.random():** 0-1
- **× 50 + 1:** 1-50
- **pravatar.cc:** Free avatar service
- **Why:** Quick way to get profile picture

```javascript
<select
  name="nativeLanguage"
  value={formState.nativeLanguage}
  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
  className="select select-bordered w-full"
>
  <option value="">Select your native language</option>
  {LANGUAGES.map((lang) => (
    <option key={`native-${lang}`} value={lang.toLowerCase()}>
      {lang}
    </option>
  ))}
</select>
```
- **select:** Dropdown
- **value:** Controlled select
- **LANGUAGES.map:** Creates option for each language
- **key:** Unique identifier
- **value.toLowerCase():** Consistent casing
- **Why:** Ensure consistent data format

---

### 19. **src/pages/FriendsPage.jsx**
Displays user's friends list.

```javascript
const { data: friends = [], isLoading: loadingFriends } = useQuery({
  queryKey: ["friends"],
  queryFn: getUserFriends,
});
```
- **What:** Fetches friends
- **Same query as HomePage:** React Query deduplicates (only one request)

```javascript
{loadingFriends ? (
  <div className="flex justify-center py-12">
    <span className="loading loading-spinner loading-lg" />
  </div>
) : friends.length === 0 ? (
  <NoFriendsFound />
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {friends.map((friend) => (
      <FriendCard key={friend._id} friend={friend} />
    ))}
  </div>
)}
```
- **Nested ternary:** Three states (loading, empty, data)
- **Grid:** Responsive layout (1 to 4 columns)
- **Why:** Clean display of all friends

---

### 20. **src/pages/NotificationsPage.jsx**
Friend requests and notifications.

```javascript
const { data: friendRequests, isLoading } = useQuery({
  queryKey: ["friendRequests"],
  queryFn: getFriendRequests,
});

const incomingRequests = friendRequests?.incomingReqs || [];
const acceptedRequests = friendRequests?.acceptedReqs || [];
```
- **What:** Fetches both types of requests
- **Destructure:** Separates incoming and accepted
- **|| []:** Default to empty array if undefined

```javascript
const { mutate: acceptRequestMutation, isPending } = useMutation({
  mutationFn: acceptFriendRequest,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    queryClient.invalidateQueries({ queryKey: ["friends"] });
  },
});
```
- **onSuccess:** Refetches both queries
- **Why both:** Request moves from pending to accepted, becomes friend
- **Result:** UI updates to show new friend

```javascript
<button
  className="btn btn-primary btn-sm"
  onClick={() => acceptRequestMutation(request._id)}
  disabled={isPending}
>
  Accept
</button>
```
- **onClick:** Accepts request
- **disabled:** Prevents multiple clicks
- **Why:** One click per request

---

### 21. **src/pages/ChatPage.jsx**
Real-time chat interface.

**Purpose:** One-on-one chat using Stream Chat.

```javascript
const { id: targetUserId } = useParams();
```
- **useParams:** Gets URL parameters
- **id:** From route `/chat/:id`
- **Renames to targetUserId:** More descriptive

```javascript
const [chatClient, setChatClient] = useState(null);
const [channel, setChannel] = useState(null);
const [loading, setLoading] = useState(true);
```
- **chatClient:** Stream Chat client instance
- **channel:** Current chat channel
- **loading:** While initializing
- **Why state:** Needed for rendering

```javascript
const { data: tokenData } = useQuery({
  queryKey: ["streamToken"],
  queryFn: getStreamToken,
  enabled: !!authUser,
});
```
- **enabled:** Only fetch if authUser exists
- **!!:** Converts to boolean
- **Why:** Don't fetch token until we have user

```javascript
useEffect(() => {
  const initChat = async () => {
    if (!tokenData?.token || !authUser) return;
```
- **useEffect:** Runs when dependencies change
- **initChat:** Async function inside effect
- **Guard clause:** Exit if no token or user

```javascript
const client = StreamChat.getInstance(STREAM_API_KEY);

await client.connectUser(
  {
    id: authUser._id,
    name: authUser.fullName,
    image: authUser.profilePic,
  },
  tokenData.token
);
```
- **getInstance:** Gets Stream client
- **connectUser:** Authenticates with Stream
- **User data:** ID, name, image
- **token:** JWT from backend
- **Why:** Connect to Stream's servers

```javascript
const channelId = [authUser._id, targetUserId].sort().join("-");
```
- **What:** Creates consistent channel ID
- **sort():** Alphabetical order
- **Example:** User A and User B always get same channel
- **Why sort:** Prevents duplicate channels
- **Result:** "userId1-userId2"

```javascript
const currChannel = client.channel("messaging", channelId, {
  members: [authUser._id, targetUserId],
});

await currChannel.watch();
```
- **channel:** Creates or gets existing channel
- **"messaging":** Channel type
- **members:** Who can access channel
- **watch():** Subscribes to real-time updates
- **Why:** Enable live chat

```javascript
setChatClient(client);
setChannel(currChannel);
```
- **What:** Saves client and channel to state
- **Why:** Needed for rendering Stream components

```javascript
} catch (error) {
  console.error("Error initializing chat:", error);
  toast.error("Could not connect to chat. Please try again.");
} finally {
  setLoading(false);
}
```
- **catch:** Handle errors gracefully
- **finally:** Always runs (even if error)
- **Why finally:** Stop loading regardless of success/failure

```javascript
}, [tokenData, authUser, targetUserId]);
```
- **Dependencies:** Re-run if these change
- **Why:** Reinitialize if user changes

```javascript
const handleVideoCall = () => {
  if (channel) {
    const callUrl = `${window.location.origin}/call/${channel.id}`;
    
    channel.sendMessage({
      text: `I've started a video call. Join me here: ${callUrl}`,
    });
    
    toast.success("Video call link sent successfully!");
  }
};
```
- **What:** Sends video call invitation
- **window.location.origin:** Current domain
- **channel.sendMessage:** Sends message via Stream
- **Why:** Share call link in chat

```javascript
if (loading || !chatClient || !channel) return <ChatLoader />;

return (
  <div className="h-[93vh]">
    <Chat client={chatClient}>
      <Channel channel={channel}>
        <div className="w-full relative">
          <CallButton handleVideoCall={handleVideoCall} />
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput focus />
          </Window>
        </div>
        <Thread />
      </Channel>
    </Chat>
  </div>
);
```
- **Chat:** Stream Chat provider
- **Channel:** Channel provider
- **Window:** Main chat area
- **ChannelHeader:** Shows chat participant
- **MessageList:** Displays messages
- **MessageInput:** Type messages
- **Thread:** Side panel for message threads
- **CallButton:** Custom button for video calls
- **Why components:** Stream provides complete UI

---

### 22. **src/pages/CallPage.jsx**
Video calling interface.

**Purpose:** Video calls using Stream Video SDK.

```javascript
const { id: callId } = useParams();
```
- **callId:** From URL `/call/:id`
- **Why:** Identifies which call to join

```javascript
const [client, setClient] = useState(null);
const [call, setCall] = useState(null);
const [isConnecting, setIsConnecting] = useState(true);
```
- **client:** Stream Video client
- **call:** Call instance
- **isConnecting:** Loading state

```javascript
useEffect(() => {
  const initCall = async () => {
    if (!tokenData.token || !authUser || !callId) return;
```
- **Similar pattern to ChatPage**
- **Guard clause:** Exit if missing data

```javascript
const user = {
  id: authUser._id,
  name: authUser.fullName,
  image: authUser.profilePic,
};

const videoClient = new StreamVideoClient({
  apiKey: STREAM_API_KEY,
  user,
  token: tokenData.token,
});
```
- **What:** Creates Stream Video client
- **Same token:** Works for both chat and video
- **Why:** Authenticate with Stream Video

```javascript
const callInstance = videoClient.call("default", callId);
await callInstance.join({ create: true });
```
- **call:** Gets or creates call
- **"default":** Call type
- **join:** Joins the call
- **create: true:** Creates call if doesn't exist
- **Why:** Enable video calling

```javascript
setClient(videoClient);
setCall(callInstance);
```
- **What:** Saves to state for rendering

```javascript
{client && call ? (
  <StreamVideo client={client}>
    <StreamCall call={call}>
      <CallContent />
    </StreamCall>
  </StreamVideo>
) : (
  <div className="flex items-center justify-center h-full">
    <p>Could not initialize call. Please refresh or try again later.</p>
  </div>
)}
```
- **StreamVideo:** Video provider
- **StreamCall:** Call provider
- **CallContent:** Custom component with call UI

```javascript
const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate("/");

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};
```
- **useCallStateHooks:** Stream's hooks
- **useCallCallingState:** Current call state
- **CallingState.LEFT:** User left call
- **navigate("/"):** Redirect to home
- **SpeakerLayout:** Video grid layout
- **CallControls:** Mute, camera, end call buttons
- **StreamTheme:** Styled UI
- **Why:** Complete video call UI with minimal code

---

### 23. **src/pages/ForgotPasswordPage.jsx**
Password reset request page.

```javascript
const [email, setEmail] = useState("");
const { forgotPasswordMutation, isPending, isSuccess } = useForgotPassword();
```
- **email:** Local state for form
- **isSuccess:** Track if email sent
- **Why:** Show success message

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  forgotPasswordMutation(email);
};
```
- **What:** Sends password reset email
- **Simple:** Just email, no complex data

```javascript
{!isSuccess ? (
  <form onSubmit={handleSubmit}>
    {/* Form fields */}
  </form>
) : (
  <div className="space-y-4">
    <div className="alert alert-success">
      {/* Success message */}
    </div>
    {/* Additional instructions */}
  </div>
)}
```
- **Conditional rendering:** Form or success message
- **Why:** Better UX (confirm email sent)

---

### 24. **src/pages/ResetPasswordPage.jsx**
Password reset completion page.

```javascript
const { token } = useParams();
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
```
- **token:** From URL `/reset-password/:token`
- **Two password fields:** Ensure user typed correctly

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (newPassword !== confirmPassword) {
    return;
  }
  
  if (newPassword.length < 6) {
    return;
  }
  
  resetPasswordMutation({ token, newPassword });
};
```
- **Validation:** Passwords match and meet requirements
- **token + newPassword:** Sent to backend
- **Why validate:** Better UX (instant feedback)

```javascript
{confirmPassword && newPassword !== confirmPassword && (
  <span className="text-xs text-error">Passwords do not match</span>
)}
```
- **Real-time validation:** Shows error as user types
- **Why:** Immediate feedback

---

### 25. **src/components/Layout.jsx**
Main layout wrapper.

**Purpose:** Consistent layout with sidebar and navbar.

```javascript
const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="flex">
        {showSidebar && <Sidebar />}
        
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto bg-base-100">{children}</main>
        </div>
      </div>
    </div>
  );
};
```
- **children:** Page content
- **showSidebar:** Conditional sidebar
- **flex:** Horizontal layout
- **flex-1:** Takes remaining space
- **overflow-y-auto:** Scrollable content
- **Why:** Consistent structure for all pages

---

### 26. **src/components/Navbar.jsx**
Top navigation bar.

```javascript
const { authUser } = useAuthUser();
const location = useLocation();
const isChatPage = location.pathname?.startsWith("/chat");
```
- **authUser:** Current user info
- **location:** Current route
- **isChatPage:** Special handling for chat page
- **Why:** Show logo in chat page (no sidebar)

```javascript
const { logoutMutation } = useLogout();
```
- **logoutMutation:** Logout function
- **Why:** Logout button in navbar

```javascript
{isChatPage && (
  <div className="pl-5">
    <Link to="/" className="flex items-center gap-2.5">
      <ShipWheelIcon className="size-9 text-primary" />
      <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
        Tribeo
      </span>
    </Link>
  </div>
)}
```
- **Conditional logo:** Only in chat page
- **Why:** Chat page has no sidebar (logo needed)

```javascript
<Link to={"/notifications"}>
  <button className="btn btn-ghost btn-circle">
    <BellIcon className="h-6 w-6 text-base-content opacity-70" />
  </button>
</Link>
```
- **Notifications button:** Link to notifications page
- **btn-ghost:** Transparent button
- **btn-circle:** Round button
- **Why:** Quick access to friend requests

```javascript
<ThemeSelector />
```
- **What:** Theme picker dropdown
- **Why:** Let users customize appearance

```javascript
<div className="avatar">
  <div className="w-9 rounded-full">
    <img src={authUser?.profilePic} alt="User Avatar" rel="noreferrer" />
  </div>
</div>
```
- **What:** User's profile picture
- **avatar:** DaisyUI component
- **rounded-full:** Circular
- **Why:** Visual identification

```javascript
<button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
  <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
</button>
```
- **Logout button:** Ends session
- **onClick:** Triggers logout mutation
- **Why:** Easy way to log out

---

### 27. **src/components/Sidebar.jsx**
Left navigation sidebar.

```javascript
const { authUser } = useAuthUser();
const location = useLocation();
const currentPath = location.pathname;
```
- **currentPath:** Highlight active page
- **Why:** Visual feedback

```javascript
<Link
  to="/"
  className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
    currentPath === "/" ? "btn-active" : ""
  }`}
>
  <HomeIcon className="size-5 text-base-content opacity-70" />
  <span>Home</span>
</Link>
```
- **Conditional class:** `btn-active` if current page
- **justify-start:** Left-align content
- **Why:** Clear navigation

```javascript
<div className="p-4 border-t border-base-300 mt-auto">
  <div className="flex items-center gap-3">
    <div className="avatar">
      <div className="w-10 rounded-full">
        <img src={authUser?.profilePic} alt="User Avatar" />
      </div>
    </div>
    <div className="flex-1">
      <p className="font-semibold text-sm">{authUser?.fullName}</p>
      <p className="text-xs text-success flex items-center gap-1">
        <span className="size-2 rounded-full bg-success inline-block" />
        Online
      </p>
    </div>
  </div>
</div>
```
- **mt-auto:** Pushes to bottom
- **border-t:** Top border
- **Online indicator:** Green dot + text
- **Why:** Show current user info

---

### 28. **src/components/FriendCard.jsx**
Friend display card component.

```javascript
const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-lg transition-all duration-300 border border-base-300 shadow-md">
```
- **friend prop:** Friend object
- **hover:shadow-lg:** Lift effect on hover
- **transition-all:** Smooth animation
- **Why:** Reusable friend display

```javascript
<div className="avatar">
  <div className="w-16 h-16 rounded-full">
    <img src={friend.profilePic} alt={friend.fullName} />
  </div>
</div>
```
- **What:** Profile picture
- **w-16 h-16:** Fixed size
- **rounded-full:** Circular

```javascript
<div className="flex flex-wrap gap-1.5">
  <span className="badge badge-secondary">
    {getLanguageFlag(friend.nativeLanguage)}
    Native: {capitialize(friend.nativeLanguage)}
  </span>
  <span className="badge badge-outline">
    {getLanguageFlag(friend.learningLanguage)}
    Learning: {capitialize(friend.learningLanguage)}
  </span>
</div>
```
- **badges:** Language indicators
- **getLanguageFlag:** Shows flag icon
- **capitalize:** Proper casing
- **Why:** Show language match

```javascript
<Link to={`/chat/${friend._id}`} className="btn btn-outline w-full mt-2">
  Message
</Link>
```
- **Link to chat:** Opens chat with friend
- **friend._id:** Target user ID
- **Why:** Quick access to chat

```javascript
export function getLanguageFlag(language) {
  if (!language) return null;
  
  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];
  
  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
```
- **What:** Gets flag image for language
- **flagcdn.com:** Free flag service
- **24x18:** Flag dimensions
- **Why:** Visual language indicator

---

### 29. **src/components/CallButton.jsx**
Video call button.

```javascript
function CallButton({ handleVideoCall }) {
  return (
    <div className="p-3 border-b flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0">
      <button onClick={handleVideoCall} className="btn btn-success btn-sm text-white">
        <VideoIcon className="size-6" />
      </button>
    </div>
  );
}
```
- **handleVideoCall:** Passed from ChatPage
- **absolute top-0:** Floats above chat
- **btn-success:** Green button
- **VideoIcon:** Camera icon
- **Why:** Start video call from chat

---

### 30. **src/components/ChatLoader.jsx**
Chat loading component.

```javascript
function ChatLoader() {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-4">
      <LoaderIcon className="animate-spin size-10 text-primary" />
      <p className="mt-4 text-center text-lg font-mono">Connecting to chat...</p>
    </div>
  );
}
```
- **h-screen:** Full height
- **flex center:** Center content
- **animate-spin:** Rotating animation
- **Why:** Visual feedback while loading

---

### 31. **src/components/PageLoader.jsx**
General page loader.

```javascript
const PageLoader = () => {
  const { theme } = useThemeStore();
  return (
    <div className="min-h-screen flex items-center justify-center" data-theme={theme}>
      <LoaderIcon className="animate-spin size-10 text-primary" />
    </div>
  );
};
```
- **useThemeStore:** Apply theme
- **data-theme:** DaisyUI theme attribute
- **Why:** Loader matches app theme

---

### 32. **src/components/NoFriendsFound.jsx**
Empty state component.

```javascript
const NoFriendsFound = () => {
  return (
    <div className="card bg-base-200 p-6 text-center border border-base-300 shadow-md">
      <h3 className="font-semibold text-lg mb-2">No friends yet</h3>
      <p className="text-base-content opacity-70">
        Connect with language partners below to start practicing together!
      </p>
    </div>
  );
};
```
- **What:** Shows when user has no friends
- **Why:** Better than blank space
- **Helpful message:** Guides user to action

---

### 33. **src/components/NoNotificationsFound.jsx**
Empty notifications component.

```javascript
function NoNotificationsFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="size-16 rounded-full bg-base-300 flex items-center justify-center mb-4">
        <BellIcon className="size-8 text-base-content opacity-40" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
      <p className="text-base-content opacity-70 max-w-md">
        When you receive friend requests or messages, they'll appear here.
      </p>
    </div>
  );
}
```
- **Bell icon:** Visual indicator
- **Helpful message:** Explains what notifications are for
- **Why:** Better UX than empty page

---

### 34. **src/components/ThemeSelector.jsx**
Theme picker dropdown.

```javascript
const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();
  
  return (
    <div className="dropdown dropdown-end">
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <PaletteIcon className="size-5" />
      </button>
```
- **dropdown:** DaisyUI dropdown component
- **dropdown-end:** Aligns to right
- **tabIndex:** Makes dropdown keyboard accessible
- **PaletteIcon:** Paint palette icon

```javascript
<div
  tabIndex={0}
  className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl
  w-56 border border-base-content/10 max-h-80 overflow-y-auto"
>
  <div className="space-y-1">
    {THEMES.map((themeOption) => (
```
- **dropdown-content:** Dropdown menu
- **max-h-80:** Max height with scroll
- **overflow-y-auto:** Scroll if too many themes
- **map:** Render all themes

```javascript
<button
  key={themeOption.name}
  className={`
    w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors
    ${
      theme === themeOption.name
        ? "bg-primary/10 text-primary"
        : "hover:bg-base-content/5"
    }
  `}
  onClick={() => setTheme(themeOption.name)}
>
```
- **Conditional class:** Highlight current theme
- **onClick:** Changes theme
- **transition-colors:** Smooth color change

```javascript
<div className="ml-auto flex gap-1">
  {themeOption.colors.map((color, i) => (
    <span
      key={i}
      className="size-2 rounded-full"
      style={{ backgroundColor: color }}
    />
  ))}
</div>
```
- **What:** Theme preview colors
- **ml-auto:** Pushes to right
- **Inline style:** Dynamic background color
- **Why:** Visual preview of theme

---

## 🏗️ Architecture Overview

### **Authentication Flow:**
1. User signs up → Backend creates user → JWT cookie sent
2. Frontend stores cookie → Included in all requests
3. Protected routes check `req.cookies.jwt`
4. Middleware verifies JWT → Attaches user to request
5. Frontend checks `/api/auth/me` on load
6. If authenticated → Show app, else → Show login

### **Friend System Flow:**
1. User A sends request to User B
2. Creates FriendRequest document (status: pending)
3. User B sees in notifications
4. User B accepts → FriendRequest status: accepted
5. Both users added to each other's friends array
6. Now they can chat and video call

### **Chat Flow:**
1. Frontend gets Stream token from backend
2. Connects to Stream with token
3. Creates channel with both user IDs
4. Stream handles all messaging
5. Real-time updates via WebSocket

### **Video Call Flow:**
1. User clicks video button in chat
2. Sends message with call link
3. Other user clicks link
4. Both join Stream Video call
5. Stream handles WebRTC connection

### **Data Flow:**
1. Component needs data → Calls React Query hook
2. Hook checks cache → If cached, return immediately
3. If not cached → Call API function
4. API function uses axios → Backend API
5. Backend queries MongoDB → Returns data
6. React Query caches → Component renders

### **State Management:**
- **Server State:** React Query (user data, friends, requests)
- **UI State:** Component state (form inputs, dropdowns)
- **Global State:** Zustand (theme preference)
- **Why separate:** Each tool optimized for its purpose

---

## 🔐 Security Features

### **Backend Security:**
1. **Password Hashing:** bcrypt with salt (never store plain text)
2. **JWT:** Signed tokens (can't be tampered with)
3. **HttpOnly Cookies:** JavaScript can't access (prevents XSS)
4. **SameSite Cookies:** Prevents CSRF attacks
5. **Token Expiration:** Tokens expire after 7 days
6. **Reset Token Hashing:** Don't store plain reset tokens
7. **Email Normalization:** Prevent duplicate accounts
8. **Input Validation:** Check all user input
9. **Error Messages:** Don't reveal if email exists

### **Frontend Security:**
1. **HTTPS Only:** Secure cookies only over HTTPS
2. **No Sensitive Data in State:** Passwords never stored
3. **CORS:** Backend only accepts requests from frontend
4. **Token in Cookies:** More secure than localStorage
5. **Route Protection:** Redirect unauthenticated users

---

## 📱 Responsive Design

### **Tailwind Breakpoints:**
- **Default:** Mobile (< 640px)
- **sm:** Small tablets (≥ 640px)
- **md:** Tablets (≥ 768px)
- **lg:** Laptops (≥ 1024px)
- **xl:** Desktops (≥ 1280px)

### **Responsive Patterns:**
```javascript
// Grid: 1 column on mobile, 4 on desktop
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"

// Hide sidebar on mobile
className="hidden lg:flex"

// Responsive padding
className="p-4 sm:p-6 lg:p-8"
```

---

## 🎨 Styling Strategy

### **TailwindCSS:**
- **Utility-first:** Small, reusable classes
- **No CSS files:** Styles in JSX
- **Purge unused:** Only includes used classes in production

### **DaisyUI:**
- **Component library:** Pre-built components
- **Themes:** 30+ themes out of the box
- **Customizable:** Can override with Tailwind

### **Why this approach:**
- **Fast development:** No writing CSS from scratch
- **Consistent:** Design system built-in
- **Small bundle:** Tree-shaking removes unused code
- **Maintainable:** Classes describe purpose

---

## 🚀 Performance Optimizations

### **React Query:**
- **Caching:** Don't refetch unchanged data
- **Deduplication:** Multiple components sharing data → one request
- **Background refetch:** Update stale data automatically
- **Optimistic updates:** Update UI before server responds

### **Code Splitting:**
- **Route-based:** Each page loaded separately
- **Lazy loading:** Components loaded when needed
- **Vite:** Fast development and optimized builds

### **Stream Services:**
- **WebSocket:** Real-time updates without polling
- **CDN:** Static assets served globally
- **Optimized:** Professional infrastructure

---

## 🐛 Error Handling

### **Backend:**
```javascript
try {
  // Operation
} catch (error) {
  console.log("Error:", error);
  res.status(500).json({ message: "Internal Server Error" });
}
```
- Always catch errors
- Log for debugging
- Return generic message (don't expose internals)

### **Frontend:**
```javascript
const { data, error, isLoading } = useQuery({...});

if (isLoading) return <Loader />;
if (error) return <ErrorMessage />;
```
- React Query handles errors
- Show loading states
- Graceful error displays

---

## 📝 Best Practices Used

### **Code Organization:**
- Separate concerns (models, controllers, routes)
- Reusable components
- Custom hooks for logic
- Utility functions

### **Naming Conventions:**
- camelCase for variables/functions
- PascalCase for components
- Descriptive names (getUserFriends vs getUF)

### **Comments:**
- Explain WHY, not WHAT
- Document complex logic
- API documentation

### **Git Workflow:**
- Meaningful commit messages
- Feature branches
- Regular commits

---

## 🎯 Key Takeaways

### **Why Express:**
- Simple and unopinionated
- Large ecosystem
- Easy to learn
- Flexible

### **Why MongoDB:**
- Flexible schema (easy to change)
- JSON-like documents (matches JavaScript)
- Great for prototyping
- Scalable

### **Why React:**
- Component-based (reusable)
- Large ecosystem
- Great developer experience
- Virtual DOM (fast)

### **Why React Query:**
- Handles server state perfectly
- Automatic caching
- Less boilerplate
- Better than Redux for API data

### **Why Stream:**
- Production-ready chat/video
- No WebSocket management
- Scales automatically
- Great documentation

---

This documentation covers every file, every important function, and explains why each piece of code exists. You now understand:

1. **What each file does**
2. **How files connect to each other**
3. **Why specific technologies were chosen**
4. **How data flows through the app**
5. **Security considerations**
6. **Best practices implemented**

Use this as a reference whenever you need to understand or modify any part of the application!
