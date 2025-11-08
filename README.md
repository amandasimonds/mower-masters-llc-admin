# Mower Masters Admin Panel

A React-based customer management system for Mower Masters LLC, built with Firebase, TypeScript, and Vite.

## Features

- 🔐 **Firebase Authentication** - Secure admin login
- 👥 **Customer Management** - Add, edit, delete, and search customers
- 🚜 **Mower Details** - Track mower brand, model, and serial numbers
- 📝 **Service History** - Complete timeline of all services performed
- 💬 **Customer Notes** - Add and manage internal notes for each customer
- 🎨 **Modern UI** - Clean, responsive interface with smooth animations
- 🔍 **Search** - Quick search by name, email, or phone

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Firebase** - Authentication and database
  - Firebase Auth for user authentication
  - Firestore for data storage
- **React Router** - Client-side routing

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
   - Add your admin user email
4. Enable **Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode
   - Start with test mode rules (update later)
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" and click the web icon `</>`
   - Copy the config object

### 2. Configure Firebase

Edit `src/firebase/config.ts` and replace the config with your values:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 5. Create Admin User

In Firebase Console:
1. Go to Authentication > Users
2. Click "Add user"
3. Enter email and password
4. Use these credentials to log in

## Firestore Security Rules

Update your Firestore security rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Data Structure

### Customers Collection
```typescript
{
  firstName: string
  lastName: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  mowerDetails: {
    brand: string
    model: string
    serialNumber?: string
    purchaseYear?: number
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Service History Collection
```typescript
{
  customerId: string
  date: Timestamp
  serviceType: string
  description: string
  technician: string
  cost: number
  parts?: string
  status: 'completed' | 'pending' | 'scheduled'
  createdAt: Timestamp
}
```

### Notes Collection
```typescript
{
  customerId: string
  content: string
  author: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deployment

Deploy to any static hosting service:

### Netlify
```bash
npm run build
# Drag and drop the dist folder to Netlify
```

### Vercel
```bash
npm run build
vercel --prod
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## Usage

1. **Login** - Use your Firebase admin credentials
2. **View Customers** - See all customers on the dashboard
3. **Add Customer** - Click "+ Add Customer" to create new customer
4. **Edit Customer** - Click on a customer card, then "Edit"
5. **Add Service** - In customer detail, go to "Service History" tab and click "+ Add Service"
6. **Add Note** - In customer detail, go to "Notes" tab and click "+ Add Note"
7. **Search** - Use the search bar to find customers quickly

## Support

For issues or questions, contact the development team.

## License

Private - Mower Masters LLC
