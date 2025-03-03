# Firebase Setup Instructions

## Prerequisites

1. Node.js and npm installed
2. Firebase account created
3. Firebase project created in the Firebase console

## Setup Steps

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase in your project

The project already has the necessary Firebase configuration files. If you need to connect to your own Firebase project, run:

```bash
firebase use --add
```

And select your Firebase project.

### 4. Deploy Firebase Functions

```bash
firebase deploy --only functions
```

### 5. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 6. Run Firebase Emulators (for local development)

```bash
firebase emulators:start
```

## Firebase Configuration

The project is already configured with the following Firebase services:

1. **Authentication**: Email/password authentication
2. **Firestore**: Database for inventory, movements, orders, and users
3. **Cloud Functions**: Webhook handlers and scheduled tasks
4. **Hosting**: For deploying the web application

## Firebase Functions

The project includes the following Cloud Functions:

1. `shipstationWebhook`: Handles webhook events from ShipStation
2. `syncGoogleSheets`: Scheduled function to sync data with Google Sheets
3. `checkLowStock`: Firestore trigger to check for low stock levels

## Firestore Security Rules

The security rules implement role-based access control with the following roles:

- `admin`: Full access to all collections
- `warehouse`: Can read all data and write to inventory and movements
- `fulfillment`: Can read all data and write to movements and orders
- `management`: Read-only access to all data

## Environment Variables

If you need to use environment variables in your Firebase Functions, you can set them using:

```bash
firebase functions:config:set someservice.key="THE API KEY" someservice.id="THE CLIENT ID"
```

And access them in your functions code with:

```javascript
functions.config().someservice.key
```
