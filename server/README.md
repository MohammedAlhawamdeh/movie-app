# Movie App Server

## Setup Instructions

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and add your configuration
   ```

3. Start MongoDB:
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

4. Create an admin user:
   ```bash
   # Using default values
   node scripts/createAdmin.js

   # Or with custom values
   node scripts/createAdmin.js "Admin Name" "admin@email.com" "password123"
   ```

   Default admin credentials:
   - Email: admin@example.com
   - Password: admin123
   - Name: Admin User

5. Start the server:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## Admin Features

### User Management
- View all users
- Delete users
- Manage user roles
- View user statistics

### Review Management
- View all reviews
- Delete inappropriate reviews
- Monitor review activity

### Dashboard Statistics
- Total users count
- Total reviews count
- Recent activity
- System statistics

## API Endpoints

### Admin Routes
- GET /api/admin/stats - Get dashboard statistics
- GET /api/admin/users - List all users
- GET /api/admin/reviews - List all reviews
- DELETE /api/admin/users/:id - Delete a user
- DELETE /api/admin/reviews/:id - Delete a review

### Protected Routes (Admin Only)
All admin routes are protected and require:
1. Valid JWT token
2. Admin user status

## Security Notes

1. Change default admin password immediately after creation
2. Keep your JWT_SECRET secure
3. Use strong passwords
4. Monitor access logs
5. Regular security audits

## Troubleshooting

1. Database Connection Issues:
   ```bash
   # Check MongoDB connection
   mongo
   # Verify MONGO_URI in .env
   ```

2. Admin Creation Issues:
   ```bash
   # Check if admin exists
   mongo
   use movie-app
   db.users.find({isAdmin: true})
   ```

3. Permission Issues:
   ```bash
   # Verify user has admin rights
   db.users.findOne({email: "admin@example.com"})
   ```

4. Reset Admin:
   ```bash
   # Remove existing admin
   db.users.deleteOne({email: "admin@example.com"})
   # Create new admin
   node scripts/createAdmin.js
   ```

## Environment Variables

```env
PORT=5000                     # Server port
NODE_ENV=development         # Environment (development/production)
MONGO_URI=mongodb://localhost:27017/movie-app  # MongoDB connection string
JWT_SECRET=your_secret_key   # JWT encryption key
```

## Production Deployment

1. Set proper environment variables
2. Use secure MongoDB connection
3. Enable proper security headers
4. Configure proper logging
5. Set up monitoring

For additional help or issues, please refer to the project documentation or create an issue on the repository.