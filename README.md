# MERN LMS (Learning Management System)

A full-stack Learning Management System built with the MERN stack (MongoDB, Express, React, Node.js). This platform enables instructors to create and manage courses while students can enroll, learn, and purchase courses. It also includes a digital library system for managing books.

## Features

### Student Features
- **User Authentication**: Sign up and login with secure JWT authentication
- **Course Enrollment**: Browse and enroll in available courses
- **Course Learning**: Watch videos, track progress, and complete course curriculum
- **Course Reviews**: Leave ratings and reviews for completed courses
- **Wishlist**: Save courses for later
- **Purchase History**: View all purchased courses and transaction history
- **Digital Library**: Issue and manage books from the library system
- **Fine Management**: Track and pay library fines through integrated payment gateway
- **Payment Integration**: Pay for courses using Razorpay

### Instructor Features
- **Course Creation**: Create and manage courses with detailed curriculum
- **Video Management**: Upload and manage course videos with Cloudinary integration
- **Course Settings**: Configure course pricing, description, and metadata
- **Student Management**: View enrolled students and course statistics
- **Dashboard**: Analytics and overview of all created courses

### Admin Features
- **User Management**: Manage users and their roles
- **Course Moderation**: Approve or manage course content
- **System Administration**: Overall platform management

## Tech Stack

### Frontend
- **React**: UI library for building interactive interfaces
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server
- **React Player**: Video player component
- **Radix UI**: Unstyled, accessible components

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Token-based authentication
- **Bcryptjs**: Password hashing
- **Cloudinary**: Cloud-based media management
- **Razorpay**: Payment gateway integration
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing

## Prerequisites

Before running this project, make sure you have:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Cloudinary account (for image/video uploads)
- Razorpay account (for payment processing)

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/MERN-LMS.git
cd MERN-LMS
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the server directory with the following variables:
```env
PORT=5000
MONGO_URI=mongodb+srv://your_mongo_username:your_mongo_password@cluster.mongodb.net/lms
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLIENT_URL=http://localhost:5173
```

### 3. Setup Frontend
```bash
cd ../client
npm install
```

## Running the Application

### Development Mode

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run dev
```

Backend will run on: `http://localhost:5000`

**Terminal 2 - Start Frontend Server:**
```bash
cd client
npm run dev
```

Frontend will run on: `http://localhost:5173`

### Production Build

**Build Frontend:**
```bash
cd client
npm run build
```

**Start Backend (Production):**
```bash
cd server
npm start
```

## Project Structure

```
MERN-LMS/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/             # Reusable React components
│   │   ├── pages/                  # Page components
│   │   ├── context/                # React Context for state management
│   │   ├── services/               # API service calls
│   │   ├── hooks/                  # Custom React hooks
│   │   └── config/                 # Application configuration
│   └── package.json
│
├── server/                          # Express backend
│   ├── controllers/                # Request handlers
│   ├── models/                     # MongoDB schemas
│   ├── routes/                     # API routes
│   ├── middleware/                 # Custom middleware
│   ├── helpers/                    # Utility functions
│   ├── server.js                   # Main server file
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/check-auth` - Verify authentication status

### Courses (Student)
- `GET /student/course` - Get all available courses
- `GET /student/course/:id` - Get course details
- `POST /student/course/enroll` - Enroll in course

### Courses (Instructor)
- `POST /instructor/course/create` - Create new course
- `PUT /instructor/course/:id` - Update course
- `GET /instructor/course` - Get instructor's courses

### Media
- `POST /media/upload` - Upload media (video/image)
- `DELETE /media/delete/:id` - Delete media

### Orders & Payments
- `POST /student/order/create` - Create course purchase order
- `GET /student/order/:id` - Get order details

### Books
- `GET /student/books` - Get all available books
- `POST /student/book-issue` - Issue a book to student
- `POST /student/book-issue/return` - Return issued book

### Wishlist
- `GET /student/wishlist/:userId` - Get user wishlist
- `POST /student/wishlist/add` - Add course to wishlist
- `POST /student/wishlist/remove` - Remove from wishlist

## Features Implemented

✅ User authentication with JWT
✅ Role-based access control (Student, Instructor)
✅ Course creation and management
✅ Video streaming and progress tracking
✅ Payment gateway integration (Razorpay)
✅ Cloud-based media management (Cloudinary)
✅ Digital library system
✅ Book issue/return management
✅ Fine payment system
✅ Course reviews and ratings
✅ Wishlist functionality
✅ Responsive UI with Tailwind CSS
✅ Real-time progress updates

## Future Enhancements

- [ ] Live classes/webinars
- [ ] Discussion forums
- [ ] Certificate generation
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Content recommendations

## Error Handling & Debugging

### Common Issues

**Backend Connection Refused**
- Ensure MongoDB is running
- Check `.env` file has correct MONGO_URI
- Verify port 5000 is not in use

**Video Player Errors**
- Check video URL is accessible
- Verify Cloudinary credentials are correct

**Payment Gateway Issues**
- Verify Razorpay keys are correct
- Check API endpoints match your Razorpay version

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: your-email@example.com

## Acknowledgments

- Built with MERN stack
- UI components from Radix UI
- Styling with Tailwind CSS
- Payment processing by Razorpay
- Media hosting by Cloudinary

---

**Happy Learning! 🚀**
