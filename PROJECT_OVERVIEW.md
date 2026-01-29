# AI Employee Project - Complete Overview

## 🏗️ Architecture Overview

This is a **full-stack AI-powered project management and automation platform** with the following structure:

### Backend (Django)
- **Location**: Base directory (`/`)
- **Framework**: Django 5.0.1 with Django REST Framework
- **Database**: SQL Server Express (configurable via .env)
- **Purpose**: RESTful API backend with AI agent capabilities

### Frontend (React + Vite)
- **Location**: `PaPerProjectFront/` directory
- **Framework**: React 18.2 with Vite
- **UI Library**: Tailwind CSS + Radix UI components
- **Purpose**: Modern SPA consuming Django APIs

---

## 📦 Core Applications

### 1. **Core App** (`core/`)
The main application containing:
- **User Management**: Django User + UserProfile with roles
- **Project Management**: Projects, Tasks, Subtasks, Milestones
- **Company Management**: Company, CompanyUser, CompanyModulePurchase
- **Financial**: PricingPlans, Subscriptions, Payments, Invoices, Credits
- **Content**: Blog, Reviews, FAQs, Industries
- **Communication**: ContactMessages, Consultations, Chatbot
- **Analytics**: AnalyticsEvents, PageViews, Notifications

**Key Models:**
- `Project` - Main project entity
- `Task` - Individual tasks with dependencies
- `Subtask` - Breakdown of tasks
- `Company` - Organization/company entity
- `CompanyUser` - Users belonging to companies
- `UserProfile` - Extended user information with roles

### 2. **API App** (`api/`)
Centralized REST API endpoints:
- Authentication (Token-based + Company User headers)
- Project CRUD operations
- User management
- Industry, Blog, Review endpoints
- Company management
- Module purchase (Stripe integration)
- Agent-specific endpoints (PM, Recruitment, Marketing)

**Authentication Methods:**
1. **Token Authentication**: `Authorization: Token <token>` (Django REST Framework)
2. **Company User Authentication**: Custom headers `X-Company-User-ID` and `X-Company-ID`

### 3. **Project Manager Agent** (`project_manager_agent/`)
AI-powered project management features:
- Task prioritization
- Knowledge Q&A
- Project pilot (AI project planning)
- Timeline/Gantt generation
- Subtask generation

### 4. **Recruitment Agent** (`recruitment_agent/`)
Automated recruitment system:
- **CV Processing**: Parse, analyze, and rank CVs
- **Job Descriptions**: Create and manage job postings
- **Interview Scheduling**: Automated interview scheduling with follow-ups
- **Qualification**: AI-powered candidate qualification (INTERVIEW/HOLD/REJECT)
- **Email Automation**: Follow-up emails for pending interviews, reminders for scheduled interviews

**Key Models:**
- `CVRecord` - Parsed CV data with scores
- `JobDescription` - Job postings
- `Interview` - Scheduled interviews
- `RecruiterEmailSettings` - Email timing preferences
- `RecruiterInterviewSettings` - Interview scheduling preferences
- `RecruiterQualificationSettings` - Decision thresholds

### 5. **Marketing Agent** (`marketing_agent/`)
Email marketing automation:
- **Campaigns**: Email campaigns with target audiences
- **Email Sequences**: Multi-step email sequences with delays
- **Sub-sequences**: Interest-based follow-up sequences
- **Email Accounts**: IMAP email account management
- **Reply Detection**: Automatic reply analysis and interest detection
- **Market Research**: AI-powered market research
- **Document Authoring**: AI-generated marketing documents

**Key Models:**
- `Campaign` - Marketing campaigns
- `Lead` - Lead management
- `EmailSequence` - Multi-step email sequences
- `EmailSequenceStep` - Individual steps in sequences
- `EmailAccount` - IMAP email accounts
- `EmailSendHistory` - Email tracking
- `Reply` - Email reply analysis

**Celery Automation:**
- Sequence emails: Every 5 minutes
- Inbox sync: Every 5 minutes
- Retry failed emails: Every 15 minutes
- Auto-start campaigns: Every 15 minutes
- Monitor campaigns: Every 30 minutes
- Auto-pause expired: Daily

### 6. **Frontline Agent** (`Frontline_agent/`)
Customer support automation (basic implementation)

---

## 🔐 Authentication & Authorization

### Regular Users
1. Register/Login via `/api/auth/register` and `/api/auth/login`
2. Receive Django REST Framework token
3. Token stored in `localStorage` as `auth_token`
4. Requests include: `Authorization: Token <token>`

### Company Users
1. Register via company registration token
2. Login via `/api/company/login`
3. Authentication via custom headers:
   - `X-Company-User-ID`: Company user ID
   - `X-Company-ID`: Company ID
4. Data stored in `localStorage` as `company_user` and `company_auth_token`

### Roles
- `project_manager` - Project management access
- `recruitment_agent` - Recruitment features
- `marketing_agent` - Marketing features
- `frontline_agent` - Customer support
- `company_user` - Company-specific access

---

## 💾 Database Schema

### Core Tables (from migrations)

#### User & Company
- `auth_user` - Django User model
- `core_userprofile` - Extended user info with roles
- `core_company` - Companies/organizations
- `core_companyuser` - Users belonging to companies
- `core_companyusertoken` - Company user auth tokens
- `core_companymodulepurchase` - Module purchases (recruitment, marketing, PM)

#### Projects & Tasks
- `core_project` - Projects
- `core_task` - Tasks
- `core_subtask` - Task breakdowns
- `core_projectmilestone` - Project milestones
- `core_teammember` - Project team members
- `core_projectapplication` - Freelancer applications

#### Marketing Agent
- `ppp_marketingagent_campaign` - Marketing campaigns
- `ppp_marketingagent_lead` - Leads
- `ppp_marketingagent_emailsequence` - Email sequences
- `ppp_marketingagent_emailsequencestep` - Sequence steps
- `ppp_marketingagent_emailaccount` - Email accounts
- `ppp_marketingagent_emailsendhistory` - Email tracking
- `ppp_marketingagent_reply` - Email replies

#### Recruitment Agent
- `ppp_cv_records` - CV records
- `recruitment_agent_jobdescription` - Job descriptions
- `recruitment_agent_interview` - Interviews
- `recruitment_agent_recruiteremailsettings` - Email settings
- `recruitment_agent_recruiterinterviewsettings` - Interview settings

#### Financial
- `core_pricingplan` - Subscription plans
- `core_subscription` - User subscriptions
- `core_payment` - Payment transactions
- `core_invoice` - Invoices
- `core_credit` - User credits
- `core_referralcode` - Referral codes

#### Content
- `core_blogpost` - Blog posts
- `core_review` - Customer reviews
- `core_industry` - Industry categories
- `core_contactmessage` - Contact form submissions

---

## 🔄 API Communication Flow

### Frontend → Backend
1. Frontend makes request via `api.js` service
2. Token/headers added automatically
3. Request sent to Django backend (`http://localhost:8000/api/...`)
4. Django REST Framework processes request
5. Response returned as JSON

### Example Flow:
```javascript
// Frontend (PaPerProjectFront/src/services/projectService.js)
import api from './api';

export const listProjects = async () => {
  return await api.get('/projects');
};

// Backend (api/views/project.py)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_projects(request):
    # Process request
    return Response(data)
```

---

## 🤖 AI Agents Architecture

### Project Manager Agent
- **Models**: Groq (llama-3.1-8b-instant)
- **Features**: Task prioritization, project planning, Q&A

### Recruitment Agent
- **Models**: Groq (GROQ_REC_API_KEY)
- **Features**: CV parsing, qualification, interview scheduling

### Marketing Agent
- **Models**: Groq for Q&A, OpenAI for document writing
- **Features**: Market research, document authoring, email automation

---

## ⚙️ Background Tasks (Celery)

### Marketing Agent Tasks
- **send-sequence-emails**: Every 5 minutes - Sends emails based on sequence delays
- **sync-inbox-replies**: Every 5 minutes - Syncs IMAP inbox and detects replies
- **retry-failed-emails**: Every 15 minutes - Retries failed email sends
- **auto-start-campaigns**: Every 15 minutes - Starts scheduled campaigns
- **monitor-campaigns**: Every 30 minutes - Monitors campaigns and sends notifications
- **auto-pause-expired-campaigns**: Daily - Pauses expired campaigns

### Celery Configuration
- **Broker**: Redis (production) or SQLite (development)
- **Result Backend**: Redis or SQLite
- **Scheduler**: Celery Beat (periodic tasks)

---

## 📁 Frontend Structure

### Key Directories
- `src/pages/` - Page components
- `src/components/` - Reusable components
  - `common/` - Common components (Navbar, ProtectedRoute)
  - `ui/` - UI components (buttons, forms, etc.)
  - `marketing/`, `recruitment/`, `pm-agent/` - Agent-specific components
- `src/services/` - API service layer
  - `api.js` - Base API client
  - `authService.js` - Authentication
  - `companyAuthService.js` - Company authentication
  - `projectService.js` - Projects
  - `marketingAgentService.js` - Marketing agent
  - `recruitmentAgentService.js` - Recruitment agent
  - `pmAgentService.js` - Project manager agent
- `src/contexts/` - React contexts (AuthContext)
- `src/data/` - Static data (blog content, reviews)

### Routing
- Public routes: Home, Blog, Industries, etc.
- Protected routes: Admin dashboard, Company dashboard
- Agent routes: Project Manager, Marketing, Recruitment dashboards

---

## 🔧 Configuration

### Backend (.env)
```env
# Database
DB_NAME=your_db
DB_HOST=localhost
DB_PORT=1433
DB_USER=your_user
DB_PASSWORD=your_password

# AI APIs
GROQ_API_KEY=your_groq_key
GROQ_REC_API_KEY=your_rec_groq_key
OPENAI_API_KEY=your_openai_key

# Email
EMAIL_BACKEND=smtp
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your_email
EMAIL_HOST_PASSWORD=your_password

# Celery
USE_REDIS=True
CELERY_BROKER_URL=redis://localhost:6379/0

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🚀 Key Features

### 1. Module Purchase System
- Companies purchase modules (Recruitment, Marketing, PM Agent)
- Stripe integration for payments
- Module access control via `CompanyModulePurchase`

### 2. Multi-Tenant Architecture
- Companies have isolated data
- Company users belong to specific companies
- Projects can be company-owned

### 3. AI-Powered Automation
- **Recruitment**: Automated CV processing, qualification, interview scheduling
- **Marketing**: Automated email sequences, reply detection, campaign monitoring
- **Project Management**: AI task prioritization, project planning

### 4. Email Automation
- **Marketing**: Multi-step sequences with delays, sub-sequences for replies
- **Recruitment**: Follow-up emails, interview reminders
- **Tracking**: Open rates, click rates, reply detection

---

## 📊 Database Relationships

### Company → CompanyUser → Projects
```
Company (1) → (N) CompanyUser
CompanyUser (1) → (N) Project (created_by_company_user)
Company (1) → (N) Project (company)
```

### Project → Tasks → Subtasks
```
Project (1) → (N) Task
Task (1) → (N) Subtask
Task (N) → (N) Task (dependencies)
```

### Campaign → Sequence → Steps → Send History
```
Campaign (1) → (N) EmailSequence
EmailSequence (1) → (N) EmailSequenceStep
EmailSequenceStep (1) → (N) EmailSendHistory
```

### Job → CV → Interview
```
JobDescription (1) → (N) CVRecord
CVRecord (1) → (N) Interview
```

---

## 🎯 How It All Works Together

1. **User Registration**: User registers → Gets token → Can access features
2. **Company Setup**: Company created → Registration tokens generated → Company users register
3. **Module Purchase**: Company purchases module → `CompanyModulePurchase` created → Access granted
4. **Project Creation**: Company user creates project → Project linked to company
5. **AI Agents**: Users interact with agents via frontend → Frontend calls API → Backend processes with AI → Results returned
6. **Automation**: Celery tasks run periodically → Check for conditions → Execute actions (send emails, sync inbox, etc.)

---

## 📝 Important Notes

1. **Database**: Uses SQL Server Express (can be configured for SQLite in development)
2. **CORS**: Configured for localhost:3000 and localhost:5173
3. **Authentication**: Dual system (Token + Company User headers)
4. **File Uploads**: Handled via multipart/form-data
5. **Email Tracking**: Uses tracking tokens in URLs
6. **Celery**: Required for marketing automation (can use SQLite broker for development)

---

## 🔍 Key Files to Understand

### Backend
- `project_manager_ai/settings.py` - Main configuration
- `api/urls.py` - All API endpoints
- `core/models.py` - Core database models
- `marketing_agent/models.py` - Marketing models
- `recruitment_agent/models.py` - Recruitment models
- `marketing_agent/tasks.py` - Celery tasks

### Frontend
- `PaPerProjectFront/src/services/api.js` - API client
- `PaPerProjectFront/src/App.jsx` - Routing
- `PaPerProjectFront/src/contexts/AuthContext.jsx` - Authentication state

---

This project is a comprehensive AI-powered platform for project management, recruitment, and marketing automation with a modern React frontend and robust Django backend.

