# Deploying the MovieHub App to Digital Ocean

This guide will walk you through deploying the MovieHub application to Digital Ocean using App Platform.

## Prerequisites

1. Create a [Digital Ocean](https://www.digitalocean.com/) account if you don't have one.
2. Install [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) locally for building the application.
3. Install the [doctl](https://docs.digitalocean.com/reference/doctl/how-to/install/) command-line tool.
4. Configure your [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database or use Digital Ocean's managed MongoDB.

## Steps for Deployment

### 1. Prepare the Application

1. Build the React client:
   ```bash
   cd client
   npm run build
   ```

2. Create a production-ready .env file in the server directory:
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   TMDB_API_KEY=your_tmdb_api_key
   ```

3. Create an admin user:
   ```bash
   cd server
   node scripts/createAdmin.js
   ```

### 2. Deploy to Digital Ocean App Platform

#### Option 1: Using the Digital Ocean Web UI

1. Log in to your Digital Ocean account
2. Go to the App Platform section
3. Click "Create App"
4. Connect your GitHub repository
5. Configure your app:
   - Select your repository and branch
   - For the build command: `cd client && npm run build`
   - Set the run command: `cd server && node server.js`
   - Set environment variables from your .env file
   - Configure the HTTP port to match your server port (default 5000)

#### Option 2: Using doctl CLI

1. Authenticate with Digital Ocean:
   ```bash
   doctl auth init
   ```

2. Create an app.yaml file:
   ```yaml
   name: moviehub
   region: nyc
   services:
   - name: moviehub-server
     github:
       repo: your-username/movie-app
       branch: main
     build_command: cd client && npm install && npm run build && cd ../server && npm install
     run_command: cd server && node server.js
     http_port: 5000
     env:
     - key: NODE_ENV
       value: production
     - key: PORT
       value: 5000
     - key: MONGO_URI
       value: your_mongodb_connection_string
       type: SECRET
     - key: JWT_SECRET
       value: your_jwt_secret
       type: SECRET
     - key: TMDB_API_KEY
       value: your_tmdb_api_key
       type: SECRET
   ```

3. Deploy the app:
   ```bash
   doctl apps create --spec app.yaml
   ```

### 3. Configure Domain (Optional)

1. In the Digital Ocean App Platform, go to your app's settings
2. Click on "Domains"
3. Add your custom domain
4. Update your DNS settings to point to the Digital Ocean app

## Using the Deployed Application

1. Access your app at the provided Digital Ocean URL
2. Log in as admin:
   - Email: admin@movieapp.com
   - Password: admin
3. As an admin, you can manage all reviews through the Admin Dashboard

## Advanced Configuration

### Setting up Continuous Deployment

Digital Ocean App Platform automatically detects changes to your GitHub repository and deploys updates. To configure:

1. Go to your app's settings in Digital Ocean
2. Under "Deployment" settings, choose your preferred deployment method:
   - Automatic deployments on every push
   - Deploy on specific branches
   - Manual deployments only

### Performance Optimization

For best performance:

1. Enable CDN for static assets in Digital Ocean settings
2. Configure caching headers for API responses
3. Consider adding a Redis cache for frequently accessed data

## Troubleshooting

1. Check app logs in Digital Ocean App Platform
2. Verify MongoDB connection issues by checking server logs
3. For JWT issues, check if the JWT_SECRET is correctly set