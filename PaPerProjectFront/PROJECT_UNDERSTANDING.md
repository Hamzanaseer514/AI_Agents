# PayPerProject Frontend - Project Understanding Documentation

## 📋 Project Overview

**PayPerProject Frontend** is a modern React-based single-page application (SPA) that serves as the frontend interface for the PayPerProject platform. It connects to a Django REST API backend to provide a comprehensive project management and freelancing platform where clients can post projects and freelancers can apply.

### Key Purpose
- Connect clients with freelancers for project-based work
- Provide a marketplace for posting and applying to projects
- Offer various services including AI predictions, consultations, career opportunities, and white-label products
- Support multiple user types: clients, freelancers, companies, and admins

---

## 🛠️ Technology Stack

### Core Framework
- **React 18.2.0** - UI library
- **Vite 4.4.5** - Build tool and dev server
- **React Router DOM 6.16.0** - Client-side routing

### UI & Styling
- **Tailwind CSS 3.3.2** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives (Dialog, Dropdown, Tabs, etc.)
- **Framer Motion 10.16.4** - Animation library
- **Lucide React** - Icon library
- **React Icons** - Additional icon set

### State Management & Forms
- **React Context API** - Global state (AuthContext)
- **React Hook Form 7.49.2** - Form handling
- **LocalStorage** - Client-side data persistence

### Internationalization
- **i18next 23.7.16** - Internationalization framework
- **react-i18next 14.0.0** - React bindings for i18next
- **i18next-browser-languagedetector** - Language detection
- **Supported Languages**: English (en), Arabic (ar), French (fr), German (de), Polish (pl)

### Additional Libraries
- **date-fns 3.6.0** - Date manipulation
- **react-dropzone 14.2.3** - File upload handling
- **react-helmet 6.1.0** - Document head management
- **embla-carousel-react** - Carousel component
- **react-masonry-css** - Masonry layout

---

## 📁 Project Structure

```
PaPerProjectFront/
├── src/
│   ├── main.jsx                 # Application entry point
│   ├── App.jsx                  # Main app component with routing
│   ├── index.css                # Global styles
│   ├── i18n.js                  # Internationalization configuration
│   │
│   ├── pages/                   # Page components (30+ pages)
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── AdminDashboardPage.jsx
│   │   ├── CompanyDashboardPage.jsx
│   │   ├── PostProjectPage.jsx
│   │   ├── ApplyForProjectsPage.jsx
│   │   └── ... (30+ page files)
│   │
│   ├── components/              # Reusable components
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PublicLayout.jsx
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   └── ...
│   │   ├── ui/                  # Base UI components (shadcn/ui style)
│   │   │   ├── button.jsx
│   │   │   ├── input.jsx
│   │   │   ├── dialog.jsx
│   │   │   └── ... (20+ UI components)
│   │   ├── home/                # Home page specific components
│   │   ├── how-it-works/        # How it works page components
│   │   ├── contact/             # Contact form components
│   │   └── ...
│   │
│   ├── services/                # API service layer
│   │   ├── api.js               # Base API configuration & utilities
│   │   ├── authService.js       # Authentication service
│   │   ├── projectService.js    # Project CRUD operations
│   │   ├── companyService.js     # Company management
│   │   ├── companyAuthService.js # Company authentication
│   │   ├── companyJobsService.js # Company job postings
│   │   ├── applicantService.js   # Applicant tracking
│   │   ├── blogService.js        # Blog posts
│   │   ├── reviewService.js      # Reviews
│   │   ├── industryService.js    # Industries
│   │   ├── consultationService.js # Consultations
│   │   ├── contactService.js     # Contact forms
│   │   ├── careerService.js      # Career applications
│   │   ├── aiPredictorService.js # AI prediction service
│   │   ├── userService.js        # User profile management
│   │   └── index.js              # Service exports
│   │
│   ├── contexts/                # React Context providers
│   │   └── AuthContext.jsx       # Authentication context
│   │
│   ├── data/                     # Static data & content
│   │   ├── blog-content/         # Blog post content
│   │   ├── posts/                # Blog post data
│   │   ├── reviews.js            # Review data
│   │   ├── whiteLabelProducts.js # White label products
│   │   └── industryChallenges.js # Industry challenges data
│   │
│   ├── locales/                  # Translation files
│   │   ├── en/                   # English translations
│   │   ├── ar/                   # Arabic translations
│   │   ├── fr/                   # French translations
│   │   ├── de/                   # German translations
│   │   └── pl/                   # Polish translations
│   │
│   └── lib/                      # Utility functions
│       └── utils.js              # Helper functions (cn, etc.)
│
├── public/                       # Static assets
├── plugins/                      # Vite plugins (custom)
├── tools/                        # Build tools & scripts
├── package.json                  # Dependencies & scripts
├── vite.config.js               # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── vercel.json                   # Vercel deployment config
```

---

## 🔌 API Integration

### Base API Configuration

The frontend connects to the Django backend through a centralized API service layer located in `src/services/api.js`.

**Base URL Configuration:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
```

**Key Features:**
- Automatic JWT token management (stored in localStorage)
- Bearer token authentication in request headers
- Error handling for API responses
- Support for file uploads (multipart/form-data)
- JSON request/response handling

### Authentication Flow

1. **Token Storage**: JWT tokens are stored in `localStorage` as `auth_token`
2. **User Data**: User information stored in `localStorage` as `user`
3. **Automatic Headers**: All authenticated requests include `Authorization: Bearer <token>`
4. **Token Refresh**: Handled through `/api/auth/refresh` endpoint

### Service Layer Pattern

Each service module follows a consistent pattern:

```javascript
// Example: projectService.js
import api from './api';

export const listProjects = async (filters = {}) => {
  const response = await api.get('/projects', filters);
  return response;
};

export const createProject = async (projectData) => {
  const response = await api.post('/projects', projectData);
  return response;
};
```

### Available Services

1. **authService** - User authentication (login, register, logout)
2. **projectService** - Project CRUD operations
3. **companyService** - Company management (admin)
4. **companyAuthService** - Company authentication
5. **companyJobsService** - Company job postings
6. **applicantService** - Applicant tracking
7. **blogService** - Blog posts
8. **reviewService** - Reviews
9. **industryService** - Industries
10. **consultationService** - Consultations
11. **contactService** - Contact forms
12. **careerService** - Career applications
13. **aiPredictorService** - AI predictions
14. **userService** - User profile management

---

## 🔐 Authentication System

### AuthContext

The application uses React Context API for global authentication state management (`src/contexts/AuthContext.jsx`).

**Features:**
- User state management
- Authentication status tracking
- Login/Register/Logout functions
- Role-based access helpers (`isClient()`, `isFreelancer()`, `isAdmin()`)

**Usage:**
```javascript
import { useAuth } from '@/contexts/AuthContext';

const { user, isAuthenticated, login, logout } = useAuth();
```

### Protected Routes

Protected routes are implemented using `ProtectedRoute` component:

```javascript
<Route 
  path="/admin/dashboard" 
  element={
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboardPage />
    </ProtectedRoute>
  } 
/>
```

### User Types

The system supports multiple user types:
- **client** - Can post projects
- **freelancer** - Can apply to projects
- **admin** - Administrative access
- **company** - Separate company authentication system

---

## 🗺️ Routing Structure

The application uses React Router DOM for client-side routing. Routes are defined in `src/App.jsx`.

### Route Categories

#### 1. **Public Routes** (with Header/Footer)
- `/` - Home page
- `/how-it-works` - How it works page
- `/industries` - Industries listing
- `/industries/:slug` - Industry detail page
- `/reviews` - Reviews page
- `/contact` - Contact page
- `/consultation` - Consultation page
- `/features` - Features page
- `/pricing` - Pricing page
- `/hire-talent` - Hire talent page
- `/post-project` - Post project page
- `/start-project` - Start project page
- `/white-label-products` - White label products
- `/expert-advice` - Expert advice
- `/quiz` - Quiz page
- `/payment-options` - Payment options
- `/resources` - Resources page
- `/blog` - Blog listing
- `/blog/:slug` - Blog post detail
- `/solutions/*` - Solution pages (AI automations, N8N, IT solutions, etc.)
- `/careers` - Careers page
- `/ai-predictor` - AI predictor tool
- `/startups` - Startups page
- `/referrals` - Referrals page
- `/value-and-pricing` - Value and pricing
- `/agentic-ai-models` - Agentic AI models
- `/resources/agentic-ai-explained` - Agentic AI resource
- `/apply-for-projects` - Apply for projects

#### 2. **Admin Routes** (without Header/Footer)
- `/login` - Admin login
- `/admin/dashboard` - Admin dashboard (protected)

#### 3. **Company Routes** (without Header/Footer)
- `/company/register` - Company registration
- `/company/login` - Company login
- `/company/dashboard` - Company dashboard

### Layout System

- **PublicLayout**: Wraps public routes with Header and Footer
- **No Layout**: Admin and Company routes render without Header/Footer

---

## 🎨 UI Component Architecture

### Component Library

The project uses a custom UI component library built on Radix UI primitives, styled with Tailwind CSS (similar to shadcn/ui pattern).

**Base Components** (`src/components/ui/`):
- `button.jsx` - Button component
- `input.jsx` - Input field
- `dialog.jsx` - Modal dialogs
- `dropdown-menu.jsx` - Dropdown menus
- `tabs.jsx` - Tab navigation
- `toast.jsx` - Toast notifications
- `card.jsx` - Card container
- `accordion.jsx` - Accordion component
- `select.jsx` - Select dropdown
- `checkbox.jsx` - Checkbox input
- `slider.jsx` - Range slider
- And more...

### Layout Components

- **Header** - Main navigation with language switcher, user menu
- **Footer** - Site footer with links
- **PublicLayout** - Wrapper for public pages
- **ScrollToTop** - Scroll to top on route change
- **LanguageSwitcher** - Language selection dropdown

---

## 🌍 Internationalization (i18n)

### Configuration

Internationalization is configured in `src/i18n.js` using i18next.

**Supported Languages:**
- English (en) - Default
- Arabic (ar) - RTL support
- French (fr)
- German (de)
- Polish (pl)

### Translation Files

Translations are stored in `src/locales/{lang}/`:
- `translation.json` - Main translations
- Arabic has additional files: `common.json`, `components.json`, `pages.json`, `reviews.json`, `predictor.json`

### Usage

```javascript
import { useTranslation } from 'react-i18next';

const { t, i18n } = useTranslation();
const text = t('key');
```

### Language Detection

Automatically detects language from:
1. URL path
2. Cookies
3. HTML tag
4. localStorage
5. Subdomain

---

## 🎨 Styling Approach

### Tailwind CSS

The project uses Tailwind CSS 3.3.2 with a custom configuration:

**Key Features:**
- Custom color system using CSS variables
- Dark mode support (class-based)
- Custom fonts: Inter (sans-serif), Cal Sans (headings)
- Custom animations and transitions
- Responsive design utilities

### CSS Variables

Colors are defined using CSS variables in `index.css`:
```css
--primary: 222.2 47.4% 11.2%;
--secondary: 210 40% 96.1%;
--accent: 210 40% 96.1%;
/* etc. */
```

### Custom Fonts

- **Inter** - Main font (loaded from @fontsource/inter)
- **Cal Sans** - Heading font (custom CSS file)

---

## 📄 Key Features & Pages

### 1. **Home Page** (`/`)
- Hero section
- How it works
- Key features
- Social proof
- Testimonials
- Call-to-action sections

### 2. **Project Management**
- **Post Project** (`/post-project`) - Clients can post new projects
- **Apply for Projects** (`/apply-for-projects`) - Freelancers can browse and apply
- **Start Project** (`/start-project`) - Project initiation flow

### 3. **Company Features**
- **Company Registration** (`/company/register`) - Company signup
- **Company Login** (`/company/login`) - Company authentication
- **Company Dashboard** (`/company/dashboard`) - Company management interface
- **Company Jobs** - Post and manage job positions

### 4. **Admin Dashboard** (`/admin/dashboard`)
- Administrative interface
- Protected route (admin only)
- Management of users, projects, companies

### 5. **AI Features**
- **AI Predictor** (`/ai-predictor`) - Predict project costs/duration
- **AI Automations** (`/solutions/ai-automations`) - AI automation solutions
- **Agentic AI Models** (`/agentic-ai-models`) - Agentic AI information

### 6. **Content Pages**
- **Blog** (`/blog`) - Blog listing and posts
- **Industries** (`/industries`) - Industry-specific information
- **Resources** (`/resources`) - Educational resources
- **Careers** (`/careers`) - Job opportunities

### 7. **Services**
- **Consultation** (`/consultation`) - Request consultations
- **Contact** (`/contact`) - Contact forms
- **Hire Talent** (`/hire-talent`) - Talent acquisition
- **White Label Products** (`/white-label-products`) - White label offerings

---

## 🔄 Data Flow

### Authentication Flow
1. User submits login/register form
2. `authService` sends request to Django API
3. API returns JWT token and user data
4. Token stored in localStorage
5. `AuthContext` updates global state
6. User redirected to appropriate dashboard

### API Request Flow
1. Component calls service function (e.g., `projectService.listProjects()`)
2. Service function calls `api.get()` or `api.post()`
3. `api.js` adds authentication headers
4. Request sent to Django backend (`http://localhost:8000/api/...`)
5. Response handled and returned to component
6. Component updates UI with data

### State Management
- **Global State**: AuthContext for authentication
- **Local State**: React hooks (useState, useEffect) for component state
- **Server State**: Fetched via API services, stored in component state
- **Persistence**: localStorage for tokens and user data

---

## 🚀 Development Workflow

### Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Server runs on http://localhost:3000

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the root:
```env
VITE_API_URL=http://localhost:8000/api
```

### Vite Configuration

The project uses Vite with:
- React plugin
- Custom plugins for visual editing
- Path aliases (`@` → `src/`)
- CORS enabled for development
- Custom error handling

---

## 🔗 Backend Integration

### Django Backend Connection

The frontend expects a Django REST API backend running on:
- **Default**: `http://localhost:8000/api`
- **Configurable**: Via `VITE_API_URL` environment variable

### API Endpoints Used

The frontend integrates with various Django API endpoints:

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

**Projects:**
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `POST /api/projects/:id/applications` - Apply to project

**Companies:**
- `POST /api/company-auth/register` - Company registration
- `POST /api/company-auth/login` - Company login
- `GET /api/company-jobs/jobs` - Get company jobs
- `POST /api/company-jobs/jobs` - Create job posting

And many more endpoints for blogs, reviews, industries, consultations, etc.

### API Response Format

Expected response format:
```json
{
  "status": "success",
  "data": { ... },
  "message": "Optional message"
}
```

Error format:
```json
{
  "status": "error",
  "message": "Error message",
  "errors": { ... }
}
```

---

## 📦 Key Dependencies

### Production Dependencies
- **react** & **react-dom** - Core React library
- **react-router-dom** - Routing
- **i18next** & **react-i18next** - Internationalization
- **framer-motion** - Animations
- **react-hook-form** - Form handling
- **@radix-ui/*** - UI primitives
- **tailwindcss** - Styling
- **lucide-react** - Icons

### Development Dependencies
- **vite** - Build tool
- **@vitejs/plugin-react** - React plugin for Vite
- **tailwindcss** - CSS framework
- **autoprefixer** - CSS vendor prefixes
- **eslint** - Code linting

---

## 🎯 Component Patterns

### Page Components
- Located in `src/pages/`
- Typically use `PublicLayout` wrapper
- Fetch data using service functions
- Handle form submissions
- Display content with translations

### Service Components
- Located in `src/components/`
- Reusable across multiple pages
- Accept props for customization
- Use hooks for state management

### UI Components
- Located in `src/components/ui/`
- Base building blocks
- Styled with Tailwind
- Accessible (Radix UI)

---

## 🔒 Security Considerations

1. **JWT Tokens**: Stored in localStorage (consider httpOnly cookies for production)
2. **API Authentication**: Bearer token in Authorization header
3. **Protected Routes**: Route-level protection using `ProtectedRoute`
4. **Role-Based Access**: User type checking in components
5. **CORS**: Configured in Vite for development

---

## 📝 Notes for Development

### Adding New Features

1. **New Page**: Create component in `src/pages/`, add route in `App.jsx`
2. **New Service**: Create file in `src/services/`, export from `index.js`
3. **New Component**: Create in appropriate `src/components/` subdirectory
4. **New Translation**: Add keys to `src/locales/{lang}/translation.json`

### Best Practices

- Use service layer for all API calls
- Use `useAuth` hook for authentication state
- Use `useTranslation` for all user-facing text
- Follow existing component patterns
- Use Tailwind classes for styling
- Keep components focused and reusable

---

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**: Check `VITE_API_URL` and Django server status
2. **Authentication Issues**: Verify token in localStorage, check API response
3. **Routing Issues**: Ensure routes are defined in `App.jsx`
4. **Translation Missing**: Check locale files for missing keys
5. **Build Errors**: Clear `node_modules` and reinstall dependencies

---

## 📚 Additional Resources

- **API Documentation**: `API_DOCUMENTATION.md`
- **Setup Guide**: `SETUP_GUIDE.md`
- **Troubleshooting**: `TROUBLESHOOTING.md`
- **Quick Start**: `QUICK_START.md`

---

**Last Updated**: 2024  
**Frontend Version**: 0.0.0  
**React Version**: 18.2.0  
**Vite Version**: 4.4.5



