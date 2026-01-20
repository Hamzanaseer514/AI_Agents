# PayPerProject - Complete API Documentation

This document provides a comprehensive list of all API endpoints available in the PayPerProject server API.

**Base URL:** `http://localhost:5000/api`  
**Swagger Documentation:** `http://localhost:5000/api-docs`

---

## 📋 Table of Contents

1. [Authentication APIs](#1-authentication-apis)
2. [User APIs](#2-user-apis)
3. [Project APIs](#3-project-apis)
4. [Blog APIs](#4-blog-apis)
5. [Review APIs](#5-review-apis)
6. [Industry APIs](#6-industry-apis)
7. [Consultation APIs](#7-consultation-apis)
8. [Contact APIs](#8-contact-apis)
9. [Pricing APIs](#9-pricing-apis)
10. [Payment APIs](#10-payment-apis)
11. [Referral APIs](#11-referral-apis)
12. [Analytics APIs](#12-analytics-apis)
13. [White Label APIs](#13-white-label-apis)
14. [Career APIs](#14-career-apis)
15. [Quiz APIs](#15-quiz-apis)
16. [AI Predictor APIs](#16-ai-predictor-apis)
17. [Chatbot APIs](#17-chatbot-apis)
18. [Notification APIs](#18-notification-apis)
19. [Company APIs](#19-company-apis)
20. [Company Auth APIs](#20-company-auth-apis)
21. [Company Jobs APIs](#21-company-jobs-apis)
22. [Applicant APIs](#22-applicant-apis)
23. [Health Check](#23-health-check)

---

## 1. Authentication APIs

**Base Path:** `/api/auth`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | ❌ No | Register a new user account |
| POST | `/api/auth/login` | ❌ No | Login user and get JWT token |
| POST | `/api/auth/refresh` | ❌ No | Refresh access token using refresh token |
| POST | `/api/auth/logout` | ✅ Yes | Logout current user |
| GET | `/api/auth/me` | ✅ Yes | Get current authenticated user information |

**Request Examples:**

**Register:**
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "client"
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 2. User APIs

**Base Path:** `/api/users`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/users/profile` | ✅ Yes | Get user profile information |
| PUT | `/api/users/profile` | ✅ Yes | Update user profile |
| GET | `/api/users/dashboard` | ✅ Yes | Get user dashboard statistics |

---

## 3. Project APIs

**Base Path:** `/api/projects`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/projects` | ⚠️ Optional | List all projects (with pagination, filters) |
| GET | `/api/projects/:id` | ⚠️ Optional | Get project details by ID |
| POST | `/api/projects` | ✅ Yes | Create a new project |
| PUT | `/api/projects/:id` | ✅ Yes | Update project details |
| DELETE | `/api/projects/:id` | ✅ Yes | Delete a project |
| POST | `/api/projects/:id/applications` | ✅ Yes | Apply to a project (freelancer) |
| GET | `/api/projects/:id/applications` | ✅ Yes | Get all applications for a project |

**Query Parameters (for GET /api/projects):**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by project status

**Request Example - Create Project:**
```json
POST /api/projects
{
  "title": "Website Development",
  "description": "Need a modern website",
  "project_type": "web_development",
  "industry_id": 1,
  "budget_min": 1000,
  "budget_max": 5000,
  "deadline": "2024-12-31"
}
```

---

## 4. Blog APIs

**Base Path:** `/api/blog`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/blog/posts` | ❌ No | List all blog posts |
| GET | `/api/blog/posts/:slug` | ❌ No | Get blog post by slug |
| GET | `/api/blog/categories` | ❌ No | Get all blog categories |
| GET | `/api/blog/tags` | ❌ No | Get all blog tags |

---

## 5. Review APIs

**Base Path:** `/api/reviews`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/reviews` | ❌ No | List all reviews |
| GET | `/api/reviews/summary` | ❌ No | Get reviews summary/statistics |

---

## 6. Industry APIs

**Base Path:** `/api/industries`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/industries` | ❌ No | List all industries |
| GET | `/api/industries/:slug` | ❌ No | Get industry details by slug |
| GET | `/api/industries/:slug/challenges` | ❌ No | Get industry-specific challenges |

---

## 7. Consultation APIs

**Base Path:** `/api/consultations`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/consultations` | ❌ No | Create a consultation request |
| GET | `/api/consultations` | ✅ Yes | Get user's consultations |
| GET | `/api/consultations/:id` | ✅ Yes | Get consultation details by ID |

---

## 8. Contact APIs

**Base Path:** `/api/contact`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/contact` | ❌ No | Submit contact form (with optional file upload) |
| POST | `/api/contact/complaints` | ❌ No | Submit a complaint |
| GET | `/api/contact/admin` | ✅ Admin | Get all contact messages (Admin only) |
| GET | `/api/contact/admin/:id` | ✅ Admin | Get contact message by ID (Admin only) |
| PATCH | `/api/contact/admin/:id/status` | ✅ Admin | Update contact message status (Admin only) |

**Note:** Contact form supports optional file upload via multipart/form-data.

---

## 9. Pricing APIs

**Base Path:** `/api/pricing`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/pricing/plans` | ❌ No | Get all pricing plans |
| GET | `/api/pricing/subscriptions` | ✅ Yes | Get user's subscriptions |
| POST | `/api/pricing/subscriptions` | ✅ Yes | Create a new subscription |

---

## 10. Payment APIs

**Base Path:** `/api/payments`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/payments/invoices` | ✅ Yes | Get user's invoices |
| POST | `/api/payments` | ✅ Yes | Process a payment |
| GET | `/api/payments/methods` | ✅ Yes | Get user's payment methods |
| POST | `/api/payments/methods` | ✅ Yes | Add a payment method |

---

## 11. Referral APIs

**Base Path:** `/api/referrals`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/referrals/my-code` | ✅ Yes | Get user's referral code |
| POST | `/api/referrals/use-code` | ❌ No | Use a referral code |
| GET | `/api/referrals/my-referrals` | ✅ Yes | Get user's referral statistics |

---

## 12. Analytics APIs

**Base Path:** `/api/analytics`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/analytics/events` | ⚠️ Optional | Log an analytics event |
| POST | `/api/analytics/page-views` | ⚠️ Optional | Log a page view |

**Note:** Authentication is optional - events can be tracked for both authenticated and anonymous users.

---

## 13. White Label APIs

**Base Path:** `/api/white-label`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/white-label/products` | ❌ No | List all white label products |
| GET | `/api/white-label/products/:id` | ❌ No | Get white label product by ID |
| GET | `/api/white-label/categories` | ❌ No | Get white label product categories |

---

## 14. Career APIs

**Base Path:** `/api/careers`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/careers/positions` | ❌ No | List all job positions |
| POST | `/api/careers/applications` | ❌ No | Submit career application (with optional resume upload) |
| GET | `/api/careers/admin/applications` | ✅ Admin | Get all applications (Admin only) |
| GET | `/api/careers/admin/applications/:id` | ✅ Admin | Get application by ID (Admin only) |
| PATCH | `/api/careers/admin/applications/:id/status` | ✅ Admin | Update application status (Admin only) |

**Note:** Career application supports optional resume file upload via multipart/form-data.

---

## 15. Quiz APIs

**Base Path:** `/api/quiz`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/quiz/responses` | ❌ No | Submit quiz response |

---

## 16. AI Predictor APIs

**Base Path:** `/api/ai-predictor`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/ai-predictor` | ❌ No | Submit AI prediction request (project cost/duration) |
| GET | `/api/ai-predictor/admin` | ✅ Admin | Get all predictions (Admin only) |
| GET | `/api/ai-predictor/admin/:id` | ✅ Admin | Get prediction by ID (Admin only) |

---

## 17. Chatbot APIs

**Base Path:** `/api/chatbot`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/chatbot/conversations` | ⚠️ Optional | Create a new chatbot conversation |
| POST | `/api/chatbot/messages` | ⚠️ Optional | Send a message in a conversation |
| GET | `/api/chatbot/conversations/:id/messages` | ⚠️ Optional | Get messages for a conversation |

**Note:** Authentication is optional - chatbot can be used by both authenticated and anonymous users.

---

## 18. Notification APIs

**Base Path:** `/api/notifications`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/notifications` | ✅ Yes | Get user's notifications |
| PUT | `/api/notifications/:id/read` | ✅ Yes | Mark notification as read |
| PUT | `/api/notifications/read-all` | ✅ Yes | Mark all notifications as read |

---

## 19. Company APIs

**Base Path:** `/api/companies`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/companies` | ✅ Admin | Create a new company (Admin only) |
| GET | `/api/companies` | ✅ Admin | Get all companies (Admin only) |
| GET | `/api/companies/:companyId/tokens` | ✅ Admin | Get company tokens (Admin only) |
| POST | `/api/companies/:companyId/tokens` | ✅ Admin | Generate token for company (Admin only) |

---

## 20. Company Auth APIs

**Base Path:** `/api/company-auth`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/company-auth/verify-token` | ❌ No | Verify company token |
| POST | `/api/company-auth/register` | ❌ No | Register a company account |
| POST | `/api/company-auth/login` | ❌ No | Login company account |

---

## 21. Company Jobs APIs

**Base Path:** `/api/company-jobs`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/company-jobs/jobs` | ✅ Company | Create a job position (Company auth required) |
| GET | `/api/company-jobs/jobs` | ✅ Company | Get company's job positions (Company auth required) |
| PUT | `/api/company-jobs/jobs/:id` | ✅ Company | Update job position (Company auth required) |
| GET | `/api/company-jobs/jobs/:jobId/applications` | ✅ Company | Get applications for a job (Company auth required) |
| PATCH | `/api/company-jobs/applications/:id/status` | ✅ Company | Update application status (Company auth required) |

**Note:** These endpoints require company authentication (different from user authentication).

---

## 22. Applicant APIs

**Base Path:** `/api/applicants`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/applicants/status` | ❌ No | Get application status (by tracking ID or email) |

---

## 23. Health Check

**Base Path:** `/health`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/health` | ❌ No | Check server and database health status |

**Response Example:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🔐 Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

**Getting a Token:**
1. Register: `POST /api/auth/register`
2. Login: `POST /api/auth/login`
3. Use the `token` from the response in subsequent requests

---

## 📝 Notes

- **Public Endpoints (❌ No):** No authentication required
- **Protected Endpoints (✅ Yes):** Requires JWT token authentication
- **Optional Auth (⚠️ Optional):** Works with or without authentication
- **Admin Only (✅ Admin):** Requires admin role
- **Company Auth (✅ Company):** Requires company authentication token

---

## 🧪 Testing APIs

### Using Swagger UI

1. Start the server: `cd serverAPI && npm run dev`
2. Open: http://localhost:5000/api-docs
3. Click "Authorize" button and enter your JWT token
4. Test endpoints directly from the browser

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get projects (with token)
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Import the Swagger spec from: http://localhost:5000/api-docs/swagger.json
2. Set up environment variables for base URL and token
3. Use the "Authorize" feature to set JWT token globally

---

## 📊 API Statistics

- **Total API Endpoints:** 70+
- **Public Endpoints:** ~30
- **Protected Endpoints:** ~40
- **Admin Only Endpoints:** ~10
- **File Upload Endpoints:** 3 (Contact, Career, with optional uploads)

---

## 🔗 Related Documentation

- **Swagger UI:** http://localhost:5000/api-docs
- **Setup Guide:** `SETUP_GUIDE.md`
- **Backend README:** `serverAPI/README.md`
- **API Usage Guide:** `serverAPI/API_USAGE_GUIDE.md`

---

**Last Updated:** 2024  
**API Version:** 1.0.0










