# Admin Login & Contact Form Dashboard - Implementation Guide

## ✅ What Has Been Implemented

### Backend (API)

1. **Admin Endpoints for Contact Messages** (`serverAPI/controllers/contact.controller.js`)
   - `GET /api/contact/admin` - Get all contact messages (paginated, searchable, filterable)
   - `GET /api/contact/admin/:id` - Get single contact message by ID
   - `PATCH /api/contact/admin/:id/status` - Update message status
   - All endpoints are protected with authentication and require admin role

2. **Updated Contact Routes** (`serverAPI/routes/contact.routes.js`)
   - Added protected admin routes
   - Public routes remain unchanged (form submission)

3. **Authentication Already Exists**
   - Login endpoint: `POST /api/auth/login`
   - JWT token authentication
   - Role-based access control (admin, client, freelancer, project_manager)

### Frontend

1. **Login Page** (`src/pages/LoginPage.jsx`)
   - Clean, professional login interface
   - Email and password authentication
   - Redirects to admin dashboard after successful login

2. **Admin Dashboard** (`src/pages/AdminDashboardPage.jsx`)
   - View all contact form submissions
   - Search and filter functionality
   - Pagination support
   - View message details in modal
   - Download attachments
   - Statistics cards (total messages, current page, etc.)

3. **Protected Routes** (`src/components/common/ProtectedRoute.jsx`)
   - Redirects to login if not authenticated
   - Checks for admin role
   - Shows loading state

4. **Public Layout** (`src/components/layout/PublicLayout.jsx`)
   - Wraps public pages with header/footer
   - Admin pages don't use this layout

5. **Updated Contact Service** (`src/services/contactService.js`)
   - Added admin methods:
     - `getAllContactMessages(params)` - Fetch all messages with filters
     - `getContactMessageById(id)` - Get single message
     - `updateContactMessageStatus(id, status)` - Update status

---

## 🚀 How to Use

### Step 1: Create an Admin User

First, you need to create an admin user in the database. You can do this in one of two ways:

#### Option A: Via SQL (Quick Method)

```sql
-- Create admin user
INSERT INTO ppp_users (email, password_hash, first_name, last_name, user_type, account_status, email_verified)
VALUES (
  'admin@example.com',
  '$2a$10$tvuGbrduYE1zVy84BtBmyeZ6iQ3xCsoL0JSJehQxoB9wgnQV7pNcm',  -- Password: Password123!
  'Admin',
  'User',
  'admin',
  'active',
  1
);
```

**Password:** `Password123!` (change this after first login!)

#### Option B: Via Registration API (Then Update Role)

1. Register a user via `/api/auth/register`
2. Update the user_type to 'admin' in database:
   ```sql
   UPDATE ppp_users SET user_type = 'admin', account_status = 'active' WHERE email = 'your-email@example.com';
   ```

### Step 2: Start the Servers

**Backend:**
```bash
cd serverAPI
npm start
```

**Frontend:**
```bash
npm run dev
```

### Step 3: Access Admin Dashboard

1. Navigate to: `http://localhost:3000/login`
2. Login with your admin credentials
3. You'll be redirected to: `http://localhost:3000/admin/dashboard`

---

## 📋 Features

### Admin Dashboard Features

- **View All Submissions**: See all contact form submissions in a clean list
- **Search**: Search by name, email, project title, or message content
- **Filter**: Filter by status (new, read, replied, archived)
- **Pagination**: Navigate through pages of submissions
- **View Details**: Click "View" to see full message details in a modal
- **Download Attachments**: Click to download/view uploaded files
- **Statistics**: See total messages, current page count, messages with attachments

### Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Only admin users can access dashboard
- **Protected Routes**: Automatic redirect to login if not authenticated
- **Secure API Endpoints**: All admin endpoints require authentication

---

## 🔐 User Types/Roles

The system supports the following user types:
- `admin` - Full access to admin dashboard (can view all contact submissions)
- `client` - Regular user
- `freelancer` - Freelancer user
- `project_manager` - Project manager

**Only `admin` users can access the contact submissions dashboard.**

---

## 🌐 API Endpoints

### Admin Contact Endpoints (Protected)

```
GET    /api/contact/admin              - Get all messages (with pagination, search, filters)
GET    /api/contact/admin/:id          - Get single message
PATCH  /api/contact/admin/:id/status   - Update message status
```

**Query Parameters for GET /api/contact/admin:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `status` - Filter by status (new, read, replied, archived)
- `search` - Search in name, email, project title, message

**Example:**
```
GET /api/contact/admin?page=1&limit=10&status=new&search=john
```

---

## 📁 File Structure

```
src/
├── pages/
│   ├── LoginPage.jsx              # Login page for admin
│   └── AdminDashboardPage.jsx     # Admin dashboard to view submissions
├── components/
│   ├── common/
│   │   └── ProtectedRoute.jsx     # Route protection component
│   └── layout/
│       └── PublicLayout.jsx       # Layout wrapper for public pages
├── services/
│   └── contactService.js          # Updated with admin methods
└── contexts/
    └── AuthContext.jsx            # Already has isAdmin() method

serverAPI/
├── controllers/
│   └── contact.controller.js      # Added admin methods
├── routes/
│   └── contact.routes.js          # Added protected admin routes
└── middleware/
    └── auth.middleware.js         # Already has requireRole()
```

---

## 🎨 UI Preview

### Login Page
- Clean, centered login form
- Email and password fields
- Professional design with shield icon

### Admin Dashboard
- Header with user email and logout button
- Statistics cards showing totals
- Search and filter bar
- Message list with:
  - Name, email, phone
  - Project title (if provided)
  - Message preview
  - Attachment link (if file uploaded)
  - View button to see full details
- Modal popup to view full message details
- Pagination controls

---

## 🐛 Troubleshooting

### "Access Denied" Error

**Problem:** You see "Access Denied" when accessing `/admin/dashboard`

**Solution:** 
1. Make sure your user account has `user_type = 'admin'` in database
2. Make sure you're logged in
3. Check browser console for errors

### Can't Login

**Problem:** Login fails with "Invalid email or password"

**Solution:**
1. Check if user exists in database
2. Verify password hash is correct (use the provided hash for Password123!)
3. Check backend console for errors
4. Make sure account_status is 'active' or 'pending'

### No Messages Showing

**Problem:** Dashboard loads but shows "No messages found"

**Solution:**
1. Submit a test contact form from the public contact page
2. Check database: `SELECT * FROM ppp_contact_messages`
3. Check backend console for API errors
4. Verify you're logged in as admin

### File Attachments Not Showing

**Problem:** Attachment links don't work

**Solution:**
1. Check if files exist in `serverAPI/uploads/contact/`
2. Verify file paths in database (`attachment_path` column)
3. Make sure static file serving is enabled in `server.js`

---

## 📝 Next Steps (Optional Enhancements)

1. **Email Notifications**: Send email when new contact form is submitted
2. **Status Management**: Add UI to update message status (read, replied, archived)
3. **Export**: Export messages to CSV/Excel
4. **Reply Function**: Reply to messages directly from dashboard
5. **Dashboard Stats**: More detailed analytics and charts
6. **User Management**: Manage admin users from dashboard

---

## ✅ Testing Checklist

- [ ] Create admin user in database
- [ ] Start backend server
- [ ] Start frontend server
- [ ] Navigate to `/login`
- [ ] Login with admin credentials
- [ ] Should redirect to `/admin/dashboard`
- [ ] Submit test contact form from public contact page
- [ ] View submission in admin dashboard
- [ ] Test search functionality
- [ ] Test filter functionality
- [ ] Test pagination
- [ ] Test viewing message details
- [ ] Test downloading attachment (if uploaded)
- [ ] Test logout

---

**You're all set! The admin dashboard is ready to use. 🎉**

