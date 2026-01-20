# API Integration Guide

## ✅ What Has Been Completed

### 1. API Service Layer Created
- ✅ `src/services/api.js` - Base API client with authentication
- ✅ `src/services/authService.js` - Authentication services
- ✅ `src/services/projectService.js` - Project management
- ✅ `src/services/contactService.js` - Contact form submissions
- ✅ `src/services/blogService.js` - Blog posts
- ✅ `src/services/reviewService.js` - Reviews
- ✅ `src/services/industryService.js` - Industries
- ✅ `src/services/consultationService.js` - Consultations
- ✅ `src/services/userService.js` - User profile management

### 2. Authentication Context
- ✅ `src/contexts/AuthContext.jsx` - React context for auth state
- ✅ Integrated into App.jsx

### 3. Form Integration
- ✅ `ContactForm.jsx` - Now uses API (fully integrated)

---

## 🚀 Setup Instructions

### Step 1: Create Environment File

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

This tells the frontend where to find the API server.

### Step 2: Start the Backend API

```bash
cd serverAPI
npm start
```

The API will run on: `http://localhost:5000`

### Step 3: Start the Frontend

```bash
npm run dev
```

The frontend will run on: `http://localhost:3000`

---

## 📋 Integration Status

### ✅ Fully Integrated

1. **ContactForm** (`src/components/contact/ContactForm.jsx`)
   - Submits to `/api/contact`
   - Shows loading state
   - Error handling
   - Success/error toasts

### 🔄 Ready to Integrate (Service Created, Component Needs Update)

2. **ComplaintsForm** (`src/components/contact/ComplaintsForm.jsx`)
   - Service: `contactService.submitComplaint()`
   - Endpoint: `/api/contact/complaints`

3. **TalentRequestForm** (`src/components/hire-talent/TalentRequestForm.jsx`)
   - Service needed: `talentService.submitTalentRequest()`
   - Endpoint: `/api/talent-requests`

4. **ApplicationForm** (`src/components/careers/ApplicationForm.jsx`)
   - Service needed: `careerService.submitApplication()`
   - Endpoint: `/api/careers/applications`

5. **AiPredictorForm** (`src/components/consultation/AiPredictorForm.jsx`)
   - Service needed: `aiPredictorService.submitPrediction()`
   - Endpoint: `/api/ai-predictor`

6. **Consultation Forms**
   - Service: `consultationService.submitConsultation()`
   - Endpoint: `/api/consultations`

---

## 🔌 How to Use the API Services

### Authentication

```jsx
import { useAuth } from '@/contexts/AuthContext';
import authService from '@/services/authService';

// In your component
const { user, isAuthenticated, login, logout } = useAuth();

// Login
await login('user@example.com', 'password');

// Logout
await logout();
```

### Contact Form

```jsx
import { contactService } from '@/services';

// Submit contact form
try {
  const response = await contactService.submitContactForm({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    projectTitle: 'My Project',
    message: 'Project description...',
  });
  
  if (response.status === 'success') {
    // Show success message
  }
} catch (error) {
  // Handle error
  console.error(error.message);
}
```

### Projects

```jsx
import { projectService } from '@/services';

// List projects
const response = await projectService.listProjects({
  page: 1,
  limit: 10,
  status: 'posted',
});

// Get single project
const project = await projectService.getProject(1);

// Create project (requires auth)
const newProject = await projectService.createProject({
  title: 'My Project',
  description: 'Description...',
  projectType: 'website',
  budgetMin: 10000,
  budgetMax: 20000,
});
```

---

## 📝 Next Steps to Complete Integration

### 1. Update ComplaintsForm

```jsx
import { contactService } from '@/services';
import { useState } from 'react';

const ComplaintsForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await contactService.submitComplaint({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
      });
      
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // ... rest of component
};
```

### 2. Update Pages to Fetch Data

#### ReviewsPage
```jsx
import { useEffect, useState } from 'react';
import { reviewService } from '@/services';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await reviewService.listReviews();
        if (response.status === 'success') {
          setReviews(response.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };
    
    fetchReviews();
  }, []);
  
  // ... render reviews
};
```

#### IndustriesPage
```jsx
import { industryService } from '@/services';

// Fetch industries
const response = await industryService.listIndustries();
```

#### BlogPage
```jsx
import { blogService } from '@/services';

// Fetch blog posts
const response = await blogService.listPosts();
```

---

## 🔧 Configuration

### API Base URL

The API base URL is configured in `src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

Set it via environment variable:
```env
VITE_API_URL=http://localhost:5000/api
```

### Authentication Token

Tokens are automatically stored in localStorage and included in requests:

- Storage: `localStorage.getItem('auth_token')`
- Header: `Authorization: Bearer {token}`

---

## 🐛 Error Handling

All API services throw errors that can be caught:

```jsx
try {
  await contactService.submitContactForm(data);
} catch (error) {
  // error.message - User-friendly message
  // error.status - HTTP status code
  // error.data - Full error response
  console.error('Error:', error.message);
}
```

---

## ✅ Testing

1. **Start Backend**:
   ```bash
   cd serverAPI
   npm start
   ```

2. **Start Frontend**:
   ```bash
   npm run dev
   ```

3. **Test Contact Form**:
   - Go to `/contact`
   - Fill out and submit form
   - Check browser console for API calls
   - Verify data in database

4. **Test with Swagger**:
   - Open: http://localhost:5000/api-docs
   - Test endpoints directly

---

## 📚 Documentation

- **API Documentation**: http://localhost:5000/api-docs
- **Backend Guide**: `serverAPI/API_USAGE_GUIDE.md`
- **Backend Setup**: `serverAPI/COMPLETE_SETUP_GUIDE.md`

---

## 🎯 Integration Checklist

- [x] API service layer created
- [x] Authentication context created
- [x] AuthProvider integrated in App.jsx
- [x] ContactForm integrated
- [ ] ComplaintsForm integrated
- [ ] TalentRequestForm integrated
- [ ] ApplicationForm integrated
- [ ] AiPredictorForm integrated
- [ ] Consultation forms integrated
- [ ] ReviewsPage fetches from API
- [ ] IndustriesPage fetches from API
- [ ] BlogPage fetches from API
- [ ] ProjectsPage fetches from API

---

**The API integration foundation is complete!** 🚀

Start by testing the ContactForm, then gradually integrate other forms and pages.

