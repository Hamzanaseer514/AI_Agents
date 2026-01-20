# Pay Per Project - Complete Database Design

## Database Overview

**Database System:** PostgreSQL 14+ (Recommended) or MySQL 8.0+  
**Character Set:** UTF-8  
**Timezone:** UTC  

## Core Modules

1. User Management & Authentication
2. Project Management & Lifecycle
3. Content Management (Blog, Reviews, Industries)
4. White-Label Products Catalog
5. Consultation & Applications
6. Payment & Billing System
7. Referral Program
8. Analytics & Reporting

## Entity Relationship Diagram (ERD) Overview

The database consists of 40+ tables organized into the following modules:

### User Management Module
- users
- user_profiles
- user_sessions
- user_permissions
- user_roles
- user_verifications

### Project Management Module
- projects
- project_phases
- project_milestones
- project_documents
- project_team_members
- project_applications
- project_reviews

### Content Management Module
- blog_posts
- blog_categories
- blog_tags
- reviews
- industries
- industry_challenges
- white_label_products
- white_label_categories

### Consultation & Application Module
- consultations
- consultation_responses
- career_applications
- project_applications
- talent_requests
- quiz_responses

### Payment & Billing Module
- pricing_plans
- subscriptions
- invoices
- payments
- payment_methods
- credits
- credit_transactions

### Referral Module
- referrals
- referral_codes
- referral_rewards

### Analytics Module
- analytics_events
- user_activity_logs
- page_views
- conversion_tracking

