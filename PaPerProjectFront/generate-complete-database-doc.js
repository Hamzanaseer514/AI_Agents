import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Complete database schema definition
const databaseTables = [
  // USER MANAGEMENT MODULE
  {
    name: 'users',
    module: 'User Management',
    description: 'Main user table storing all user accounts (clients, freelancers, admins, project managers)',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Unique user identifier' },
      { name: 'email', type: 'VARCHAR(255)', nullable: false, key: 'UNIQUE', description: 'User email address' },
      { name: 'password_hash', type: 'VARCHAR(255)', nullable: false, description: 'Bcrypt hashed password' },
      { name: 'first_name', type: 'VARCHAR(100)', nullable: true, description: 'First name' },
      { name: 'last_name', type: 'VARCHAR(100)', nullable: true, description: 'Last name' },
      { name: 'phone', type: 'VARCHAR(20)', nullable: true, description: 'Phone number' },
      { name: 'user_type', type: "ENUM('client', 'freelancer', 'admin', 'project_manager')", nullable: false, description: 'Type of user' },
      { name: 'account_status', type: "ENUM('active', 'inactive', 'suspended', 'pending')", nullable: false, default: 'pending', description: 'Account status' },
      { name: 'email_verified', type: 'BOOLEAN', nullable: false, default: false, description: 'Email verification status' },
      { name: 'last_login', type: 'TIMESTAMP', nullable: true, description: 'Last login timestamp' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP', description: 'Account creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', description: 'Last update timestamp' },
    ],
    indexes: ['email', 'user_type', 'account_status'],
    foreignKeys: [],
  },
  {
    name: 'user_profiles',
    module: 'User Management',
    description: 'Extended user profile information',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Profile ID' },
      { name: 'user_id', type: 'BIGINT', nullable: false, description: 'Foreign key to users table' },
      { name: 'company_name', type: 'VARCHAR(255)', nullable: true, description: 'Company name' },
      { name: 'bio', type: 'TEXT', nullable: true, description: 'User biography' },
      { name: 'avatar_url', type: 'VARCHAR(500)', nullable: true, description: 'Profile picture URL' },
      { name: 'location', type: 'VARCHAR(255)', nullable: true, description: 'User location' },
      { name: 'timezone', type: 'VARCHAR(50)', nullable: true, description: 'User timezone' },
      { name: 'website', type: 'VARCHAR(255)', nullable: true, description: 'Website URL' },
      { name: 'linkedin', type: 'VARCHAR(255)', nullable: true, description: 'LinkedIn profile' },
      { name: 'github', type: 'VARCHAR(255)', nullable: true, description: 'GitHub profile' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
    ],
    indexes: ['user_id'],
    foreignKeys: [{ column: 'user_id', references: 'users(id)', onDelete: 'CASCADE' }],
  },
  {
    name: 'user_sessions',
    module: 'User Management',
    description: 'User session management for authentication',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Session ID' },
      { name: 'user_id', type: 'BIGINT', nullable: false, description: 'Foreign key to users table' },
      { name: 'session_token', type: 'VARCHAR(255)', nullable: false, key: 'UNIQUE', description: 'Session token' },
      { name: 'ip_address', type: 'VARCHAR(45)', nullable: true, description: 'IP address' },
      { name: 'user_agent', type: 'TEXT', nullable: true, description: 'User agent string' },
      { name: 'expires_at', type: 'TIMESTAMP', nullable: false, description: 'Session expiration time' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['user_id', 'session_token', 'expires_at'],
    foreignKeys: [{ column: 'user_id', references: 'users(id)', onDelete: 'CASCADE' }],
  },
  {
    name: 'user_verifications',
    module: 'User Management',
    description: 'Email and phone verification tokens',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Verification ID' },
      { name: 'user_id', type: 'BIGINT', nullable: false, description: 'Foreign key to users table' },
      { name: 'token', type: 'VARCHAR(255)', nullable: false, key: 'UNIQUE', description: 'Verification token' },
      { name: 'type', type: "ENUM('email', 'phone', 'password_reset')", nullable: false, description: 'Verification type' },
      { name: 'verified', type: 'BOOLEAN', nullable: false, default: false, description: 'Verification status' },
      { name: 'expires_at', type: 'TIMESTAMP', nullable: false, description: 'Token expiration time' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['user_id', 'token', 'expires_at'],
    foreignKeys: [{ column: 'user_id', references: 'users(id)', onDelete: 'CASCADE' }],
  },
  // PROJECT MANAGEMENT MODULE
  {
    name: 'projects',
    module: 'Project Management',
    description: 'Core project table storing all project information',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Unique project identifier' },
      { name: 'client_id', type: 'BIGINT', nullable: false, description: 'Foreign key to users table (client)' },
      { name: 'project_manager_id', type: 'BIGINT', nullable: true, description: 'Foreign key to users table (project manager)' },
      { name: 'title', type: 'VARCHAR(255)', nullable: false, description: 'Project title' },
      { name: 'description', type: 'TEXT', nullable: false, description: 'Project description' },
      { name: 'industry_id', type: 'BIGINT', nullable: true, description: 'Foreign key to industries table' },
      { name: 'project_type', type: "VARCHAR(50)", nullable: false, description: "Type of project (website, mobile_app, saas, etc.)" },
      { name: 'status', type: "ENUM('draft', 'posted', 'in_progress', 'review', 'completed', 'cancelled')", nullable: false, default: 'draft', description: 'Project status' },
      { name: 'budget_min', type: 'DECIMAL(10,2)', nullable: true, description: 'Minimum budget' },
      { name: 'budget_max', type: 'DECIMAL(10,2)', nullable: true, description: 'Maximum budget' },
      { name: 'deadline', type: 'DATE', nullable: true, description: 'Project deadline' },
      { name: 'priority', type: "ENUM('low', 'medium', 'high', 'urgent')", nullable: false, default: 'medium', description: 'Project priority' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
    ],
    indexes: ['client_id', 'project_manager_id', 'industry_id', 'status', 'project_type'],
    foreignKeys: [
      { column: 'client_id', references: 'users(id)', onDelete: 'CASCADE' },
      { column: 'project_manager_id', references: 'users(id)', onDelete: 'SET NULL' },
      { column: 'industry_id', references: 'industries(id)', onDelete: 'SET NULL' },
    ],
  },
  {
    name: 'project_team_members',
    module: 'Project Management',
    description: 'Team members assigned to projects',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Team member assignment ID' },
      { name: 'project_id', type: 'BIGINT', nullable: false, description: 'Foreign key to projects table' },
      { name: 'user_id', type: 'BIGINT', nullable: false, description: 'Foreign key to users table (team member)' },
      { name: 'role', type: "VARCHAR(50)", nullable: false, description: "Team member role (developer, designer, qa, etc.)" },
      { name: 'assigned_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP', description: 'Assignment timestamp' },
      { name: 'removed_at', type: 'TIMESTAMP', nullable: true, description: 'Removal timestamp if applicable' },
    ],
    indexes: ['project_id', 'user_id'],
    foreignKeys: [
      { column: 'project_id', references: 'projects(id)', onDelete: 'CASCADE' },
      { column: 'user_id', references: 'users(id)', onDelete: 'CASCADE' },
    ],
  },
  {
    name: 'project_applications',
    module: 'Project Management',
    description: 'Freelancer applications for projects',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Application ID' },
      { name: 'project_id', type: 'BIGINT', nullable: false, description: 'Foreign key to projects table' },
      { name: 'freelancer_id', type: 'BIGINT', nullable: false, description: 'Foreign key to users table (freelancer)' },
      { name: 'proposal', type: 'TEXT', nullable: false, description: 'Application proposal text' },
      { name: 'estimated_cost', type: 'DECIMAL(10,2)', nullable: true, description: 'Estimated project cost' },
      { name: 'estimated_duration', type: 'INT', nullable: true, description: 'Estimated duration in days' },
      { name: 'status', type: "ENUM('pending', 'shortlisted', 'accepted', 'rejected')", nullable: false, default: 'pending', description: 'Application status' },
      { name: 'applied_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP', description: 'Application timestamp' },
    ],
    indexes: ['project_id', 'freelancer_id', 'status'],
    foreignKeys: [
      { column: 'project_id', references: 'projects(id)', onDelete: 'CASCADE' },
      { column: 'freelancer_id', references: 'users(id)', onDelete: 'CASCADE' },
    ],
  },
  {
    name: 'project_milestones',
    module: 'Project Management',
    description: 'Project milestones and deliverables',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Milestone ID' },
      { name: 'project_id', type: 'BIGINT', nullable: false, description: 'Foreign key to projects table' },
      { name: 'title', type: 'VARCHAR(255)', nullable: false, description: 'Milestone title' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Milestone description' },
      { name: 'due_date', type: 'DATE', nullable: false, description: 'Milestone due date' },
      { name: 'status', type: "ENUM('pending', 'in_progress', 'completed', 'cancelled')", nullable: false, default: 'pending', description: 'Milestone status' },
      { name: 'completed_at', type: 'TIMESTAMP', nullable: true, description: 'Completion timestamp' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['project_id', 'status', 'due_date'],
    foreignKeys: [{ column: 'project_id', references: 'projects(id)', onDelete: 'CASCADE' }],
  },
  {
    name: 'project_documents',
    module: 'Project Management',
    description: 'Files and documents associated with projects',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Document ID' },
      { name: 'project_id', type: 'BIGINT', nullable: false, description: 'Foreign key to projects table' },
      { name: 'uploaded_by', type: 'BIGINT', nullable: false, description: 'Foreign key to users table (uploader)' },
      { name: 'file_name', type: 'VARCHAR(255)', nullable: false, description: 'Original file name' },
      { name: 'file_path', type: 'VARCHAR(500)', nullable: false, description: 'File storage path' },
      { name: 'file_type', type: 'VARCHAR(50)', nullable: false, description: 'File MIME type' },
      { name: 'file_size', type: 'BIGINT', nullable: false, description: 'File size in bytes' },
      { name: 'document_type', type: "ENUM('requirement', 'deliverable', 'contract', 'other')", nullable: false, description: 'Document type' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['project_id', 'uploaded_by', 'document_type'],
    foreignKeys: [
      { column: 'project_id', references: 'projects(id)', onDelete: 'CASCADE' },
      { column: 'uploaded_by', references: 'users(id)', onDelete: 'CASCADE' },
    ],
  },
  // CONTENT MANAGEMENT MODULE
  {
    name: 'blog_posts',
    module: 'Content Management',
    description: 'Blog posts and articles',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Post ID' },
      { name: 'slug', type: 'VARCHAR(255)', nullable: false, key: 'UNIQUE', description: 'URL-friendly slug' },
      { name: 'title', type: 'VARCHAR(255)', nullable: false, description: 'Post title' },
      { name: 'description', type: 'TEXT', nullable: false, description: 'Post description/excerpt' },
      { name: 'content', type: 'LONGTEXT', nullable: false, description: 'Post content (HTML/Markdown)' },
      { name: 'author_id', type: 'BIGINT', nullable: false, description: 'Foreign key to users table (author)' },
      { name: 'category', type: 'VARCHAR(100)', nullable: false, description: 'Post category' },
      { name: 'featured_image', type: 'VARCHAR(500)', nullable: true, description: 'Featured image URL' },
      { name: 'status', type: "ENUM('draft', 'published', 'archived')", nullable: false, default: 'draft', description: 'Post status' },
      { name: 'published_at', type: 'TIMESTAMP', nullable: true, description: 'Publication timestamp' },
      { name: 'views_count', type: 'INT', nullable: false, default: 0, description: 'Number of views' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
    ],
    indexes: ['slug', 'author_id', 'category', 'status', 'published_at'],
    foreignKeys: [{ column: 'author_id', references: 'users(id)', onDelete: 'CASCADE' }],
  },
  {
    name: 'blog_tags',
    module: 'Content Management',
    description: 'Tags for blog posts',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Tag ID' },
      { name: 'name', type: 'VARCHAR(100)', nullable: false, key: 'UNIQUE', description: 'Tag name' },
      { name: 'slug', type: 'VARCHAR(100)', nullable: false, key: 'UNIQUE', description: 'URL-friendly slug' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['name', 'slug'],
    foreignKeys: [],
  },
  {
    name: 'blog_post_tags',
    module: 'Content Management',
    description: 'Many-to-many relationship between blog posts and tags',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Relationship ID' },
      { name: 'post_id', type: 'BIGINT', nullable: false, description: 'Foreign key to blog_posts table' },
      { name: 'tag_id', type: 'BIGINT', nullable: false, description: 'Foreign key to blog_tags table' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['post_id', 'tag_id'],
    foreignKeys: [
      { column: 'post_id', references: 'blog_posts(id)', onDelete: 'CASCADE' },
      { column: 'tag_id', references: 'blog_tags(id)', onDelete: 'CASCADE' },
    ],
  },
  {
    name: 'reviews',
    module: 'Content Management',
    description: 'Customer reviews and testimonials',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Review ID' },
      { name: 'client_name', type: 'VARCHAR(255)', nullable: false, description: 'Reviewer name' },
      { name: 'company', type: 'VARCHAR(255)', nullable: false, description: 'Company name' },
      { name: 'quote', type: 'TEXT', nullable: false, description: 'Review text/quote' },
      { name: 'rating', type: 'DECIMAL(2,1)', nullable: false, description: 'Rating (1.0 to 5.0)' },
      { name: 'project_id', type: 'BIGINT', nullable: true, description: 'Foreign key to projects table (if review is for specific project)' },
      { name: 'featured', type: 'BOOLEAN', nullable: false, default: false, description: 'Whether review is featured' },
      { name: 'date', type: 'DATE', nullable: false, description: 'Review date' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['project_id', 'featured', 'rating', 'date'],
    foreignKeys: [{ column: 'project_id', references: 'projects(id)', onDelete: 'SET NULL' }],
  },
  {
    name: 'industries',
    module: 'Content Management',
    description: 'Industries served by the platform',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Industry ID' },
      { name: 'name', type: 'VARCHAR(255)', nullable: false, description: 'Industry name' },
      { name: 'slug', type: 'VARCHAR(255)', nullable: false, key: 'UNIQUE', description: 'URL-friendly slug' },
      { name: 'category', type: 'VARCHAR(100)', nullable: false, description: 'Industry category' },
      { name: 'description', type: 'TEXT', nullable: false, description: 'Industry description' },
      { name: 'icon', type: 'VARCHAR(100)', nullable: true, description: 'Icon identifier' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
    ],
    indexes: ['slug', 'category'],
    foreignKeys: [],
  },
  {
    name: 'industry_challenges',
    module: 'Content Management',
    description: 'Challenges and solutions for each industry',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Challenge ID' },
      { name: 'industry_slug', type: 'VARCHAR(255)', nullable: false, description: 'Industry slug (denormalized for easier querying)' },
      { name: 'challenge_title', type: 'VARCHAR(255)', nullable: false, description: 'Challenge title' },
      { name: 'challenge_description', type: 'TEXT', nullable: false, description: 'Challenge description' },
      { name: 'solution', type: 'TEXT', nullable: true, description: 'Proposed solution' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['industry_slug'],
    foreignKeys: [],
  },
  {
    name: 'white_label_products',
    module: 'Content Management',
    description: 'White-label products catalog',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Product ID' },
      { name: 'name', type: 'VARCHAR(255)', nullable: false, description: 'Product name' },
      { name: 'description', type: 'TEXT', nullable: false, description: 'Product description' },
      { name: 'category', type: 'VARCHAR(100)', nullable: false, description: 'Product category' },
      { name: 'partner_id', type: 'BIGINT', nullable: true, description: 'Foreign key to users table (partner/owner)' },
      { name: 'featured', type: 'BOOLEAN', nullable: false, default: false, description: 'Whether product is featured' },
      { name: 'status', type: "ENUM('draft', 'active', 'inactive')", nullable: false, default: 'draft', description: 'Product status' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
    ],
    indexes: ['category', 'partner_id', 'featured', 'status'],
    foreignKeys: [{ column: 'partner_id', references: 'users(id)', onDelete: 'SET NULL' }],
  },
  // CONSULTATION & APPLICATION MODULE
  {
    name: 'consultations',
    module: 'Consultation & Applications',
    description: 'Client consultation requests',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Consultation ID' },
      { name: 'client_id', type: 'BIGINT', nullable: false, description: 'Foreign key to users table (client)' },
      { name: 'project_type', type: 'VARCHAR(100)', nullable: false, description: 'Type of project' },
      { name: 'requirements', type: 'TEXT', nullable: false, description: 'Project requirements' },
      { name: 'budget_range', type: 'VARCHAR(100)', nullable: true, description: 'Budget range' },
      { name: 'timeline', type: 'VARCHAR(100)', nullable: true, description: 'Expected timeline' },
      { name: 'status', type: "ENUM('pending', 'scheduled', 'completed', 'cancelled')", nullable: false, default: 'pending', description: 'Consultation status' },
      { name: 'scheduled_at', type: 'TIMESTAMP', nullable: true, description: 'Scheduled consultation time' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['client_id', 'status', 'scheduled_at'],
    foreignKeys: [{ column: 'client_id', references: 'users(id)', onDelete: 'CASCADE' }],
  },
  {
    name: 'talent_requests',
    module: 'Consultation & Applications',
    description: 'Talent hiring requests from clients',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Request ID' },
      { name: 'client_id', type: 'BIGINT', nullable: false, description: 'Foreign key to users table (client)' },
      { name: 'title', type: 'VARCHAR(255)', nullable: false, description: 'Request title' },
      { name: 'description', type: 'TEXT', nullable: false, description: 'Talent requirements' },
      { name: 'skills_required', type: 'JSON', nullable: true, description: 'Required skills (JSON array)' },
      { name: 'experience_level', type: "ENUM('junior', 'mid', 'senior', 'expert')", nullable: true, description: 'Required experience level' },
      { name: 'status', type: "ENUM('pending', 'in_progress', 'fulfilled', 'cancelled')", nullable: false, default: 'pending', description: 'Request status' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['client_id', 'status'],
    foreignKeys: [{ column: 'client_id', references: 'users(id)', onDelete: 'CASCADE' }],
  },
  {
    name: 'career_applications',
    module: 'Consultation & Applications',
    description: 'Job applications for careers page',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Application ID' },
      { name: 'position_title', type: 'VARCHAR(255)', nullable: false, description: 'Position applied for' },
      { name: 'applicant_name', type: 'VARCHAR(255)', nullable: false, description: 'Applicant full name' },
      { name: 'email', type: 'VARCHAR(255)', nullable: false, description: 'Applicant email' },
      { name: 'phone', type: 'VARCHAR(20)', nullable: true, description: 'Applicant phone' },
      { name: 'resume_path', type: 'VARCHAR(500)', nullable: true, description: 'Resume file path' },
      { name: 'cover_letter', type: 'TEXT', nullable: true, description: 'Cover letter text' },
      { name: 'status', type: "ENUM('pending', 'reviewing', 'interview', 'accepted', 'rejected')", nullable: false, default: 'pending', description: 'Application status' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['email', 'position_title', 'status'],
    foreignKeys: [],
  },
  {
    name: 'quiz_responses',
    module: 'Consultation & Applications',
    description: 'Responses from the interactive quiz',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Response ID' },
      { name: 'email', type: 'VARCHAR(255)', nullable: false, description: 'Respondent email' },
      { name: 'name', type: 'VARCHAR(255)', nullable: true, description: 'Respondent name' },
      { name: 'location', type: 'VARCHAR(255)', nullable: true, description: 'Location' },
      { name: 'industry', type: 'VARCHAR(100)', nullable: true, description: 'Industry' },
      { name: 'goal', type: 'VARCHAR(100)', nullable: true, description: 'Business goal' },
      { name: 'project_type', type: 'VARCHAR(100)', nullable: true, description: 'Project type' },
      { name: 'responses', type: 'JSON', nullable: false, description: 'All quiz responses (JSON object)' },
      { name: 'recommendations', type: 'TEXT', nullable: true, description: 'AI-generated recommendations' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['email'],
    foreignKeys: [],
  },
  {
    name: 'contact_messages',
    module: 'Consultation & Applications',
    description: 'Contact form submissions',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Message ID' },
      { name: 'full_name', type: 'VARCHAR(255)', nullable: false, description: 'Sender name' },
      { name: 'email', type: 'VARCHAR(255)', nullable: false, description: 'Sender email' },
      { name: 'phone', type: 'VARCHAR(20)', nullable: true, description: 'Sender phone' },
      { name: 'project_title', type: 'VARCHAR(255)', nullable: true, description: 'Project title' },
      { name: 'message', type: 'TEXT', nullable: false, description: 'Message content' },
      { name: 'attachment_path', type: 'VARCHAR(500)', nullable: true, description: 'File attachment path' },
      { name: 'status', type: "ENUM('new', 'read', 'replied', 'archived')", nullable: false, default: 'new', description: 'Message status' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['email', 'status'],
    foreignKeys: [],
  },
  {
    name: 'complaints',
    module: 'Consultation & Applications',
    description: 'Customer complaints',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Complaint ID' },
      { name: 'complaint_name', type: 'VARCHAR(255)', nullable: true, description: 'Complainant name' },
      { name: 'complaint_email', type: 'VARCHAR(255)', nullable: false, description: 'Complainant email' },
      { name: 'complaint_message', type: 'TEXT', nullable: false, description: 'Complaint details' },
      { name: 'status', type: "ENUM('pending', 'in_review', 'resolved', 'archived')", nullable: false, default: 'pending', description: 'Complaint status' },
      { name: 'resolved_at', type: 'TIMESTAMP', nullable: true, description: 'Resolution timestamp' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['complaint_email', 'status'],
    foreignKeys: [],
  },
  // PAYMENT & BILLING MODULE
  {
    name: 'pricing_plans',
    module: 'Payment & Billing',
    description: 'Subscription pricing plans',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Plan ID' },
      { name: 'name', type: "VARCHAR(50)", nullable: false, key: 'UNIQUE', description: "Plan name (Basic, Standard, Pro)" },
      { name: 'price', type: 'DECIMAL(10,2)', nullable: false, description: 'Monthly price' },
      { name: 'currency', type: "VARCHAR(3)", nullable: false, default: 'GBP', description: 'Currency code' },
      { name: 'description', type: 'TEXT', nullable: false, description: 'Plan description' },
      { name: 'features', type: 'JSON', nullable: false, description: 'Plan features (JSON object)' },
      { name: 'is_featured', type: 'BOOLEAN', nullable: false, default: false, description: 'Whether plan is featured' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, default: true, description: 'Whether plan is active' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
    ],
    indexes: ['name', 'is_active'],
    foreignKeys: [],
  },
  {
    name: 'subscriptions',
    module: 'Payment & Billing',
    description: 'User subscriptions to pricing plans',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Subscription ID' },
      { name: 'user_id', type: 'BIGINT', nullable: false, description: 'Foreign key to users table' },
      { name: 'plan_id', type: 'BIGINT', nullable: false, description: 'Foreign key to pricing_plans table' },
      { name: 'status', type: "ENUM('active', 'cancelled', 'expired', 'trial')", nullable: false, description: 'Subscription status' },
      { name: 'started_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP', description: 'Subscription start date' },
      { name: 'expires_at', type: 'TIMESTAMP', nullable: true, description: 'Subscription expiration date' },
      { name: 'cancelled_at', type: 'TIMESTAMP', nullable: true, description: 'Cancellation timestamp' },
      { name: 'auto_renew', type: 'BOOLEAN', nullable: false, default: true, description: 'Whether subscription auto-renews' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
    ],
    indexes: ['user_id', 'plan_id', 'status', 'expires_at'],
    foreignKeys: [
      { column: 'user_id', references: 'users(id)', onDelete: 'CASCADE' },
      { column: 'plan_id', references: 'pricing_plans(id)', onDelete: 'RESTRICT' },
    ],
  },
  {
    name: 'invoices',
    module: 'Payment & Billing',
    description: 'Generated invoices',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Invoice ID' },
      { name: 'user_id', type: 'BIGINT', nullable: false, description: 'Foreign key to users table' },
      { name: 'subscription_id', type: 'BIGINT', nullable: true, description: 'Foreign key to subscriptions table' },
      { name: 'invoice_number', type: 'VARCHAR(50)', nullable: false, key: 'UNIQUE', description: 'Unique invoice number' },
      { name: 'amount', type: 'DECIMAL(10,2)', nullable: false, description: 'Invoice amount' },
      { name: 'currency', type: "VARCHAR(3)", nullable: false, default: 'GBP', description: 'Currency code' },
      { name: 'status', type: "ENUM('pending', 'paid', 'overdue', 'cancelled')", nullable: false, default: 'pending', description: 'Invoice status' },
      { name: 'due_date', type: 'DATE', nullable: false, description: 'Invoice due date' },
      { name: 'paid_at', type: 'TIMESTAMP', nullable: true, description: 'Payment timestamp' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['user_id', 'subscription_id', 'invoice_number', 'status', 'due_date'],
    foreignKeys: [
      { column: 'user_id', references: 'users(id)', onDelete: 'CASCADE' },
      { column: 'subscription_id', references: 'subscriptions(id)', onDelete: 'SET NULL' },
    ],
  },
  {
    name: 'payments',
    module: 'Payment & Billing',
    description: 'Payment transactions',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Payment ID' },
      { name: 'invoice_id', type: 'BIGINT', nullable: true, description: 'Foreign key to invoices table' },
      { name: 'user_id', type: 'BIGINT', nullable: false, description: 'Foreign key to users table' },
      { name: 'amount', type: 'DECIMAL(10,2)', nullable: false, description: 'Payment amount' },
      { name: 'currency', type: "VARCHAR(3)", nullable: false, default: 'GBP', description: 'Currency code' },
      { name: 'payment_method_id', type: 'BIGINT', nullable: true, description: 'Foreign key to payment_methods table' },
      { name: 'payment_gateway', type: "VARCHAR(50)", nullable: false, description: 'Payment gateway (stripe, paypal, etc.)' },
      { name: 'transaction_id', type: 'VARCHAR(255)', nullable: true, key: 'UNIQUE', description: 'Gateway transaction ID' },
      { name: 'status', type: "ENUM('pending', 'completed', 'failed', 'refunded')", nullable: false, default: 'pending', description: 'Payment status' },
      { name: 'processed_at', type: 'TIMESTAMP', nullable: true, description: 'Processing timestamp' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['invoice_id', 'user_id', 'payment_method_id', 'transaction_id', 'status'],
    foreignKeys: [
      { column: 'invoice_id', references: 'invoices(id)', onDelete: 'SET NULL' },
      { column: 'user_id', references: 'users(id)', onDelete: 'CASCADE' },
      { column: 'payment_method_id', references: 'payment_methods(id)', onDelete: 'SET NULL' },
    ],
  },
  {
    name: 'payment_methods',
    module: 'Payment & Billing',
    description: 'Stored payment methods for users',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Payment method ID' },
      { name: 'user_id', type: 'BIGINT', nullable: false, description: 'Foreign key to users table' },
      { name: 'type', type: "ENUM('credit_card', 'debit_card', 'bank_transfer', 'paypal', 'other')", nullable: false, description: 'Payment method type' },
      { name: 'gateway_customer_id', type: 'VARCHAR(255)', nullable: true, description: 'Gateway customer ID' },
      { name: 'gateway_payment_method_id', type: 'VARCHAR(255)', nullable: true, description: 'Gateway payment method ID' },
      { name: 'last_four', type: 'VARCHAR(4)', nullable: true, description: 'Last 4 digits of card' },
      { name: 'brand', type: 'VARCHAR(50)', nullable: true, description: 'Card brand (visa, mastercard, etc.)' },
      { name: 'expiry_month', type: 'TINYINT', nullable: true, description: 'Expiry month' },
      { name: 'expiry_year', type: 'SMALLINT', nullable: true, description: 'Expiry year' },
      { name: 'is_default', type: 'BOOLEAN', nullable: false, default: false, description: 'Whether this is default payment method' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, default: true, description: 'Whether payment method is active' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
    ],
    indexes: ['user_id', 'gateway_customer_id', 'is_default'],
    foreignKeys: [{ column: 'user_id', references: 'users(id)', onDelete: 'CASCADE' }],
  },
  {
    name: 'credits',
    module: 'Payment & Billing',
    description: 'Platform credits system',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Credit record ID' },
      { name: 'user_id', type: 'BIGINT', nullable: false, description: 'Foreign key to users table' },
      { name: 'balance', type: 'DECIMAL(10,2)', nullable: false, default: 0, description: 'Current credit balance' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
    ],
    indexes: ['user_id'],
    foreignKeys: [{ column: 'user_id', references: 'users(id)', onDelete: 'CASCADE' }],
  },
  {
    name: 'credit_transactions',
    module: 'Payment & Billing',
    description: 'Credit transaction history',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Transaction ID' },
      { name: 'credit_id', type: 'BIGINT', nullable: false, description: 'Foreign key to credits table' },
      { name: 'amount', type: 'DECIMAL(10,2)', nullable: false, description: 'Transaction amount (positive for credit, negative for debit)' },
      { name: 'type', type: "ENUM('earned', 'spent', 'refunded', 'expired')", nullable: false, description: 'Transaction type' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Transaction description' },
      { name: 'reference_type', type: 'VARCHAR(50)', nullable: true, description: 'Reference entity type (subscription, referral, etc.)' },
      { name: 'reference_id', type: 'BIGINT', nullable: true, description: 'Reference entity ID' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['credit_id', 'type', 'reference_type', 'reference_id', 'created_at'],
    foreignKeys: [{ column: 'credit_id', references: 'credits(id)', onDelete: 'CASCADE' }],
  },
  // REFERRAL MODULE
  {
    name: 'referral_codes',
    module: 'Referral Program',
    description: 'Referral codes for users',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Referral code ID' },
      { name: 'user_id', type: 'BIGINT', nullable: false, description: 'Foreign key to users table (referrer)' },
      { name: 'code', type: 'VARCHAR(50)', nullable: false, key: 'UNIQUE', description: 'Unique referral code' },
      { name: 'reward_type', type: "ENUM('credit', 'discount', 'cash')", nullable: false, description: 'Type of reward' },
      { name: 'reward_amount', type: 'DECIMAL(10,2)', nullable: false, description: 'Reward amount' },
      { name: 'max_uses', type: 'INT', nullable: true, description: 'Maximum number of uses (NULL for unlimited)' },
      { name: 'current_uses', type: 'INT', nullable: false, default: 0, description: 'Current number of uses' },
      { name: 'expires_at', type: 'TIMESTAMP', nullable: true, description: 'Expiration timestamp' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, default: true, description: 'Whether code is active' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['user_id', 'code', 'is_active'],
    foreignKeys: [{ column: 'user_id', references: 'users(id)', onDelete: 'CASCADE' }],
  },
  {
    name: 'referrals',
    module: 'Referral Program',
    description: 'Referral tracking',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Referral ID' },
      { name: 'referral_code_id', type: 'BIGINT', nullable: false, description: 'Foreign key to referral_codes table' },
      { name: 'referrer_id', type: 'BIGINT', nullable: false, description: 'Foreign key to users table (referrer)' },
      { name: 'referred_user_id', type: 'BIGINT', nullable: false, description: 'Foreign key to users table (referred user)' },
      { name: 'status', type: "ENUM('pending', 'completed', 'cancelled')", nullable: false, default: 'pending', description: 'Referral status' },
      { name: 'reward_earned', type: 'DECIMAL(10,2)', nullable: true, description: 'Reward amount earned' },
      { name: 'reward_paid_at', type: 'TIMESTAMP', nullable: true, description: 'When reward was paid' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['referral_code_id', 'referrer_id', 'referred_user_id', 'status'],
    foreignKeys: [
      { column: 'referral_code_id', references: 'referral_codes(id)', onDelete: 'CASCADE' },
      { column: 'referrer_id', references: 'users(id)', onDelete: 'CASCADE' },
      { column: 'referred_user_id', references: 'users(id)', onDelete: 'CASCADE' },
    ],
  },
  // ANALYTICS MODULE
  {
    name: 'analytics_events',
    module: 'Analytics & Reporting',
    description: 'Analytics event tracking',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Event ID' },
      { name: 'user_id', type: 'BIGINT', nullable: true, description: 'Foreign key to users table (NULL for anonymous)' },
      { name: 'event_type', type: 'VARCHAR(100)', nullable: false, description: 'Event type (page_view, click, form_submit, etc.)' },
      { name: 'event_name', type: 'VARCHAR(255)', nullable: false, description: 'Event name' },
      { name: 'properties', type: 'JSON', nullable: true, description: 'Event properties (JSON object)' },
      { name: 'ip_address', type: 'VARCHAR(45)', nullable: true, description: 'IP address' },
      { name: 'user_agent', type: 'TEXT', nullable: true, description: 'User agent string' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['user_id', 'event_type', 'event_name', 'created_at'],
    foreignKeys: [{ column: 'user_id', references: 'users(id)', onDelete: 'SET NULL' }],
  },
  {
    name: 'page_views',
    module: 'Analytics & Reporting',
    description: 'Page view tracking',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'View ID' },
      { name: 'user_id', type: 'BIGINT', nullable: true, description: 'Foreign key to users table (NULL for anonymous)' },
      { name: 'page_path', type: 'VARCHAR(500)', nullable: false, description: 'Page path/URL' },
      { name: 'referrer', type: 'VARCHAR(500)', nullable: true, description: 'Referrer URL' },
      { name: 'session_id', type: 'VARCHAR(255)', nullable: true, description: 'Session identifier' },
      { name: 'duration', type: 'INT', nullable: true, description: 'Time spent on page in seconds' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['user_id', 'page_path', 'session_id', 'created_at'],
    foreignKeys: [{ column: 'user_id', references: 'users(id)', onDelete: 'SET NULL' }],
  },
  {
    name: 'user_activity_logs',
    module: 'Analytics & Reporting',
    description: 'User activity logging',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Log ID' },
      { name: 'user_id', type: 'BIGINT', nullable: false, description: 'Foreign key to users table' },
      { name: 'action', type: 'VARCHAR(100)', nullable: false, description: 'Action performed' },
      { name: 'entity_type', type: 'VARCHAR(50)', nullable: true, description: 'Entity type (project, user, etc.)' },
      { name: 'entity_id', type: 'BIGINT', nullable: true, description: 'Entity ID' },
      { name: 'details', type: 'JSON', nullable: true, description: 'Additional details (JSON object)' },
      { name: 'ip_address', type: 'VARCHAR(45)', nullable: true, description: 'IP address' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['user_id', 'action', 'entity_type', 'entity_id', 'created_at'],
    foreignKeys: [{ column: 'user_id', references: 'users(id)', onDelete: 'CASCADE' }],
  },
  // AI PREDICTOR MODULE
  {
    name: 'ai_predictor_submissions',
    module: 'AI Predictor',
    description: 'AI predictor form submissions and predictions',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Submission ID' },
      { name: 'email', type: 'VARCHAR(255)', nullable: false, description: 'Submitter email' },
      { name: 'project_type', type: 'VARCHAR(100)', nullable: false, description: 'Project type' },
      { name: 'project_data', type: 'JSON', nullable: false, description: 'All project form data (JSON)' },
      { name: 'predicted_cost', type: 'DECIMAL(10,2)', nullable: true, description: 'AI-predicted cost' },
      { name: 'predicted_duration', type: 'INT', nullable: true, description: 'AI-predicted duration in days' },
      { name: 'predicted_team_size', type: 'INT', nullable: true, description: 'AI-predicted team size' },
      { name: 'prediction_confidence', type: 'DECIMAL(5,2)', nullable: true, description: 'Prediction confidence score (0-100)' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['email', 'project_type', 'created_at'],
    foreignKeys: [],
  },
  // CHATBOT MODULE
  {
    name: 'chatbot_conversations',
    module: 'Chatbot',
    description: 'Chatbot conversation sessions',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Conversation ID' },
      { name: 'user_id', type: 'BIGINT', nullable: true, description: 'Foreign key to users table (NULL for anonymous)' },
      { name: 'session_id', type: 'VARCHAR(255)', nullable: false, key: 'UNIQUE', description: 'Session identifier' },
      { name: 'status', type: "ENUM('active', 'closed', 'archived')", nullable: false, default: 'active', description: 'Conversation status' },
      { name: 'started_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP', description: 'Conversation start time' },
      { name: 'ended_at', type: 'TIMESTAMP', nullable: true, description: 'Conversation end time' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['user_id', 'session_id', 'status'],
    foreignKeys: [{ column: 'user_id', references: 'users(id)', onDelete: 'SET NULL' }],
  },
  {
    name: 'chatbot_messages',
    module: 'Chatbot',
    description: 'Individual messages in chatbot conversations',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Message ID' },
      { name: 'conversation_id', type: 'BIGINT', nullable: false, description: 'Foreign key to chatbot_conversations table' },
      { name: 'sender_type', type: "ENUM('user', 'bot')", nullable: false, description: 'Message sender type' },
      { name: 'message', type: 'TEXT', nullable: false, description: 'Message content' },
      { name: 'metadata', type: 'JSON', nullable: true, description: 'Additional message metadata' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['conversation_id', 'sender_type', 'created_at'],
    foreignKeys: [{ column: 'conversation_id', references: 'chatbot_conversations(id)', onDelete: 'CASCADE' }],
  },
  // NOTIFICATION MODULE
  {
    name: 'notifications',
    module: 'Notifications',
    description: 'System notifications for users',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Notification ID' },
      { name: 'user_id', type: 'BIGINT', nullable: false, description: 'Foreign key to users table' },
      { name: 'type', type: "VARCHAR(50)", nullable: false, description: 'Notification type (project_update, message, payment, etc.)' },
      { name: 'title', type: 'VARCHAR(255)', nullable: false, description: 'Notification title' },
      { name: 'message', type: 'TEXT', nullable: false, description: 'Notification message' },
      { name: 'link', type: 'VARCHAR(500)', nullable: true, description: 'Notification link URL' },
      { name: 'read', type: 'BOOLEAN', nullable: false, default: false, description: 'Whether notification is read' },
      { name: 'read_at', type: 'TIMESTAMP', nullable: true, description: 'Read timestamp' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
    ],
    indexes: ['user_id', 'type', 'read', 'created_at'],
    foreignKeys: [{ column: 'user_id', references: 'users(id)', onDelete: 'CASCADE' }],
  },
  // FAQ MODULE
  {
    name: 'faqs',
    module: 'Content Management',
    description: 'Frequently asked questions',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'FAQ ID' },
      { name: 'question', type: 'TEXT', nullable: false, description: 'FAQ question' },
      { name: 'answer', type: 'TEXT', nullable: false, description: 'FAQ answer' },
      { name: 'category', type: 'VARCHAR(100)', nullable: true, description: 'FAQ category' },
      { name: 'order', type: 'INT', nullable: false, default: 0, description: 'Display order' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, default: true, description: 'Whether FAQ is active' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
    ],
    indexes: ['category', 'is_active', 'order'],
    foreignKeys: [],
  },
  // LANGUAGE/TRANSLATION MODULE
  {
    name: 'translations',
    module: 'Content Management',
    description: 'Multi-language translations',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'PRIMARY KEY AUTO_INCREMENT', description: 'Translation ID' },
      { name: 'language_code', type: "VARCHAR(5)", nullable: false, description: 'Language code (en, ar, de, fr, pl)' },
      { name: 'namespace', type: 'VARCHAR(100)', nullable: false, description: 'Translation namespace (common, pages, etc.)' },
      { name: 'key', type: 'VARCHAR(255)', nullable: false, description: 'Translation key' },
      { name: 'value', type: 'TEXT', nullable: false, description: 'Translated value' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
    ],
    indexes: ['language_code', 'namespace', 'key'],
    foreignKeys: [],
  },
];

// Stored Procedures
const storedProcedures = [
  {
    name: 'sp_create_user',
    module: 'User Management',
    description: 'Creates a new user account with profile',
    parameters: [
      { name: 'p_email', type: 'VARCHAR(255)', description: 'User email' },
      { name: 'p_password_hash', type: 'VARCHAR(255)', description: 'Hashed password' },
      { name: 'p_first_name', type: 'VARCHAR(100)', description: 'First name' },
      { name: 'p_last_name', type: 'VARCHAR(100)', description: 'Last name' },
      { name: 'p_user_type', type: 'VARCHAR(50)', description: 'User type' },
    ],
    returns: 'BIGINT - New user ID',
    logic: 'Creates user record, sends verification email, creates user profile, initializes credits balance',
  },
  {
    name: 'sp_authenticate_user',
    module: 'User Management',
    description: 'Authenticates user login',
    parameters: [
      { name: 'p_email', type: 'VARCHAR(255)', description: 'User email' },
      { name: 'p_password', type: 'VARCHAR(255)', description: 'Plain text password' },
    ],
    returns: 'JSON - User data and session token if successful, NULL if failed',
    logic: 'Validates credentials, creates session, updates last_login timestamp, returns user data',
  },
  {
    name: 'sp_create_project',
    module: 'Project Management',
    description: 'Creates a new project',
    parameters: [
      { name: 'p_client_id', type: 'BIGINT', description: 'Client user ID' },
      { name: 'p_title', type: 'VARCHAR(255)', description: 'Project title' },
      { name: 'p_description', type: 'TEXT', description: 'Project description' },
      { name: 'p_project_type', type: 'VARCHAR(50)', description: 'Project type' },
      { name: 'p_budget_min', type: 'DECIMAL(10,2)', description: 'Minimum budget' },
      { name: 'p_budget_max', type: 'DECIMAL(10,2)', description: 'Maximum budget' },
    ],
    returns: 'BIGINT - New project ID',
    logic: 'Creates project record, assigns project manager (if available), sends notifications',
  },
  {
    name: 'sp_apply_to_project',
    module: 'Project Management',
    description: 'Creates a project application from freelancer',
    parameters: [
      { name: 'p_project_id', type: 'BIGINT', description: 'Project ID' },
      { name: 'p_freelancer_id', type: 'BIGINT', description: 'Freelancer user ID' },
      { name: 'p_proposal', type: 'TEXT', description: 'Application proposal' },
      { name: 'p_estimated_cost', type: 'DECIMAL(10,2)', description: 'Estimated cost' },
    ],
    returns: 'BIGINT - New application ID',
    logic: 'Creates application, checks application limits, sends notifications to client and PM',
  },
  {
    name: 'sp_process_payment',
    module: 'Payment & Billing',
    description: 'Processes a payment transaction',
    parameters: [
      { name: 'p_invoice_id', type: 'BIGINT', description: 'Invoice ID' },
      { name: 'p_payment_method_id', type: 'BIGINT', description: 'Payment method ID' },
      { name: 'p_amount', type: 'DECIMAL(10,2)', description: 'Payment amount' },
      { name: 'p_transaction_id', type: 'VARCHAR(255)', description: 'Gateway transaction ID' },
    ],
    returns: 'BIGINT - Payment ID',
    logic: 'Creates payment record, updates invoice status, processes through payment gateway, sends receipts',
  },
  {
    name: 'sp_record_referral',
    module: 'Referral Program',
    description: 'Records a referral when user signs up with referral code',
    parameters: [
      { name: 'p_referral_code', type: 'VARCHAR(50)', description: 'Referral code used' },
      { name: 'p_referred_user_id', type: 'BIGINT', description: 'New user ID who used the code' },
    ],
    returns: 'BIGINT - Referral ID',
    logic: 'Validates referral code, creates referral record, awards credits/rewards, updates code usage count',
  },
  {
    name: 'sp_get_user_statistics',
    module: 'Analytics & Reporting',
    description: 'Gets comprehensive statistics for a user',
    parameters: [
      { name: 'p_user_id', type: 'BIGINT', description: 'User ID' },
      { name: 'p_start_date', type: 'DATE', description: 'Start date for statistics' },
      { name: 'p_end_date', type: 'DATE', description: 'End date for statistics' },
    ],
    returns: 'JSON - User statistics (projects, applications, payments, etc.)',
    logic: 'Aggregates user data across multiple tables, returns comprehensive statistics',
  },
  {
    name: 'sp_generate_invoice',
    module: 'Payment & Billing',
    description: 'Generates invoice for subscription or one-time payment',
    parameters: [
      { name: 'p_user_id', type: 'BIGINT', description: 'User ID' },
      { name: 'p_subscription_id', type: 'BIGINT', description: 'Subscription ID (nullable)' },
      { name: 'p_amount', type: 'DECIMAL(10,2)', description: 'Invoice amount' },
      { name: 'p_due_date', type: 'DATE', description: 'Due date' },
    ],
    returns: 'BIGINT - Invoice ID',
    logic: 'Generates unique invoice number, creates invoice record, sends invoice email',
  },
  {
    name: 'sp_update_project_status',
    module: 'Project Management',
    description: 'Updates project status and triggers related actions',
    parameters: [
      { name: 'p_project_id', type: 'BIGINT', description: 'Project ID' },
      { name: 'p_new_status', type: 'VARCHAR(50)', description: 'New status' },
      { name: 'p_updated_by', type: 'BIGINT', description: 'User ID who made the update' },
    ],
    returns: 'BOOLEAN - Success status',
    logic: 'Updates project status, logs activity, sends status change notifications, triggers milestone updates if needed',
  },
  {
    name: 'sp_calculate_project_cost',
    module: 'Project Management',
    description: 'Calculates total project cost including all expenses',
    parameters: [
      { name: 'p_project_id', type: 'BIGINT', description: 'Project ID' },
    ],
    returns: 'DECIMAL(10,2) - Total project cost',
    logic: 'Sums up all project-related costs (team member costs, expenses, etc.)',
  },
  {
    name: 'sp_get_user_dashboard_stats',
    module: 'User Management',
    description: 'Gets dashboard statistics for a user',
    parameters: [
      { name: 'p_user_id', type: 'BIGINT', description: 'User ID' },
    ],
    returns: 'JSON - Dashboard statistics',
    logic: 'Aggregates projects count, applications count, payments, credits, etc.',
  },
  {
    name: 'sp_search_projects',
    module: 'Project Management',
    description: 'Search and filter projects',
    parameters: [
      { name: 'p_search_term', type: 'VARCHAR(255)', description: 'Search term' },
      { name: 'p_industry_id', type: 'BIGINT', description: 'Industry filter (nullable)' },
      { name: 'p_project_type', type: 'VARCHAR(50)', description: 'Project type filter (nullable)' },
      { name: 'p_status', type: 'VARCHAR(50)', description: 'Status filter (nullable)' },
      { name: 'p_limit', type: 'INT', description: 'Result limit' },
      { name: 'p_offset', type: 'INT', description: 'Result offset' },
    ],
    returns: 'JSON - Array of matching projects',
    logic: 'Searches projects by title, description, filters by criteria, returns paginated results',
  },
  {
    name: 'sp_get_project_details',
    module: 'Project Management',
    description: 'Gets comprehensive project details',
    parameters: [
      { name: 'p_project_id', type: 'BIGINT', description: 'Project ID' },
    ],
    returns: 'JSON - Complete project data with team, milestones, applications',
    logic: 'Joins multiple tables to return complete project information',
  },
  {
    name: 'sp_create_blog_post',
    module: 'Content Management',
    description: 'Creates a new blog post',
    parameters: [
      { name: 'p_author_id', type: 'BIGINT', description: 'Author user ID' },
      { name: 'p_title', type: 'VARCHAR(255)', description: 'Post title' },
      { name: 'p_slug', type: 'VARCHAR(255)', description: 'URL slug' },
      { name: 'p_content', type: 'LONGTEXT', description: 'Post content' },
      { name: 'p_category', type: 'VARCHAR(100)', description: 'Post category' },
    ],
    returns: 'BIGINT - New post ID',
    logic: 'Creates blog post, validates slug uniqueness, sets published_at if status is published',
  },
  {
    name: 'sp_get_reviews_summary',
    module: 'Content Management',
    description: 'Gets reviews summary statistics',
    parameters: [],
    returns: 'JSON - Average rating, total reviews, featured reviews',
    logic: 'Calculates average rating, counts total reviews, returns featured reviews',
  },
  {
    name: 'sp_create_consultation',
    module: 'Consultation & Applications',
    description: 'Creates a consultation request',
    parameters: [
      { name: 'p_client_id', type: 'BIGINT', description: 'Client user ID' },
      { name: 'p_project_type', type: 'VARCHAR(100)', description: 'Project type' },
      { name: 'p_requirements', type: 'TEXT', description: 'Project requirements' },
    ],
    returns: 'BIGINT - New consultation ID',
    logic: 'Creates consultation record, assigns to available consultant, sends confirmation emails',
  },
  {
    name: 'sp_process_quiz_response',
    module: 'Consultation & Applications',
    description: 'Processes quiz response and generates recommendations',
    parameters: [
      { name: 'p_email', type: 'VARCHAR(255)', description: 'Respondent email' },
      { name: 'p_responses', type: 'JSON', description: 'All quiz responses (JSON object)' },
    ],
    returns: 'BIGINT - Quiz response ID',
    logic: 'Saves quiz responses, analyzes with AI, generates personalized recommendations, sends email with results',
  },
  {
    name: 'sp_submit_ai_predictor',
    module: 'AI Predictor',
    description: 'Processes AI predictor form submission',
    parameters: [
      { name: 'p_email', type: 'VARCHAR(255)', description: 'Submitter email' },
      { name: 'p_project_data', type: 'JSON', description: 'All form data (JSON)' },
    ],
    returns: 'JSON - Prediction results (cost, duration, team size, confidence)',
    logic: 'Saves submission, calls AI prediction service, stores predictions, returns results',
  },
  {
    name: 'sp_send_chatbot_message',
    module: 'Chatbot',
    description: 'Sends a message in chatbot conversation',
    parameters: [
      { name: 'p_conversation_id', type: 'BIGINT', description: 'Conversation ID' },
      { name: 'p_message', type: 'TEXT', description: 'User message' },
    ],
    returns: 'JSON - Bot response message',
    logic: 'Saves user message, processes with AI chatbot, saves bot response, returns response',
  },
  {
    name: 'sp_create_notification',
    module: 'Notifications',
    description: 'Creates a notification for user',
    parameters: [
      { name: 'p_user_id', type: 'BIGINT', description: 'User ID' },
      { name: 'p_type', type: 'VARCHAR(50)', description: 'Notification type' },
      { name: 'p_title', type: 'VARCHAR(255)', description: 'Notification title' },
      { name: 'p_message', type: 'TEXT', description: 'Notification message' },
    ],
    returns: 'BIGINT - Notification ID',
    logic: 'Creates notification, sends email/push notification based on user preferences',
  },
  {
    name: 'sp_mark_notification_read',
    module: 'Notifications',
    description: 'Marks notification as read',
    parameters: [
      { name: 'p_notification_id', type: 'BIGINT', description: 'Notification ID' },
      { name: 'p_user_id', type: 'BIGINT', description: 'User ID' },
    ],
    returns: 'BOOLEAN - Success status',
    logic: 'Validates user owns notification, marks as read, updates read_at timestamp',
  },
  {
    name: 'sp_update_subscription',
    module: 'Payment & Billing',
    description: 'Updates user subscription plan',
    parameters: [
      { name: 'p_user_id', type: 'BIGINT', description: 'User ID' },
      { name: 'p_new_plan_id', type: 'BIGINT', description: 'New plan ID' },
    ],
    returns: 'BIGINT - Updated subscription ID',
    logic: 'Cancels old subscription, creates new subscription, processes prorated charges, sends confirmation',
  },
  {
    name: 'sp_cancel_subscription',
    module: 'Payment & Billing',
    description: 'Cancels user subscription',
    parameters: [
      { name: 'p_user_id', type: 'BIGINT', description: 'User ID' },
    ],
    returns: 'BOOLEAN - Success status',
    logic: 'Cancels subscription, stops auto-renewal, allows access until period ends, sends cancellation email',
  },
  {
    name: 'sp_add_credits',
    module: 'Payment & Billing',
    description: 'Adds credits to user account',
    parameters: [
      { name: 'p_user_id', type: 'BIGINT', description: 'User ID' },
      { name: 'p_amount', type: 'DECIMAL(10,2)', description: 'Credit amount' },
      { name: 'p_type', type: 'VARCHAR(50)', description: 'Credit type (earned, purchased, refunded, etc.)' },
      { name: 'p_description', type: 'TEXT', description: 'Credit description' },
    ],
    returns: 'BIGINT - Credit transaction ID',
    logic: 'Updates credits balance, creates credit transaction record, sends notification',
  },
  {
    name: 'sp_use_credits',
    module: 'Payment & Billing',
    description: 'Deducts credits from user account',
    parameters: [
      { name: 'p_user_id', type: 'BIGINT', description: 'User ID' },
      { name: 'p_amount', type: 'DECIMAL(10,2)', description: 'Credit amount to use' },
      { name: 'p_description', type: 'TEXT', description: 'Usage description' },
    ],
    returns: 'BOOLEAN - Success status',
    logic: 'Checks sufficient balance, deducts credits, creates transaction record, returns success/failure',
  },
  {
    name: 'sp_validate_referral_code',
    module: 'Referral Program',
    description: 'Validates and checks referral code availability',
    parameters: [
      { name: 'p_code', type: 'VARCHAR(50)', description: 'Referral code' },
    ],
    returns: 'JSON - Code details if valid, NULL if invalid',
    logic: 'Checks code exists, is active, not expired, within usage limits, returns code details',
  },
  {
    name: 'sp_apply_referral_code',
    module: 'Referral Program',
    description: 'Applies referral code to new user signup',
    parameters: [
      { name: 'p_code', type: 'VARCHAR(50)', description: 'Referral code' },
      { name: 'p_referred_user_id', type: 'BIGINT', description: 'New user ID' },
    ],
    returns: 'BIGINT - Referral ID',
    logic: 'Validates code, creates referral record, awards credits to both referrer and referred user, updates code usage',
  },
  {
    name: 'sp_get_industry_details',
    module: 'Content Management',
    description: 'Gets complete industry information',
    parameters: [
      { name: 'p_slug', type: 'VARCHAR(255)', description: 'Industry slug' },
    ],
    returns: 'JSON - Industry data with challenges, trends, solutions',
    logic: 'Fetches industry record, joins with challenges and insights, returns comprehensive data',
  },
  {
    name: 'sp_search_white_label_products',
    module: 'Content Management',
    description: 'Search white-label products',
    parameters: [
      { name: 'p_category', type: 'VARCHAR(100)', description: 'Category filter (nullable)' },
      { name: 'p_search_term', type: 'VARCHAR(255)', description: 'Search term (nullable)' },
    ],
    returns: 'JSON - Array of matching products',
    logic: 'Searches products by name/description, filters by category, returns active products only',
  },
  {
    name: 'sp_get_user_projects_summary',
    module: 'Project Management',
    description: 'Gets summary of all user projects',
    parameters: [
      { name: 'p_user_id', type: 'BIGINT', description: 'User ID' },
      { name: 'p_role', type: "VARCHAR(50)", description: "Role filter ('client' or 'freelancer')" },
    ],
    returns: 'JSON - Projects summary with counts by status',
    logic: 'Counts projects grouped by status, returns summary statistics',
  },
  {
    name: 'sp_get_project_applications',
    module: 'Project Management',
    description: 'Gets all applications for a project',
    parameters: [
      { name: 'p_project_id', type: 'BIGINT', description: 'Project ID' },
      { name: 'p_status', type: 'VARCHAR(50)', description: 'Status filter (nullable)' },
    ],
    returns: 'JSON - Array of applications with freelancer details',
    logic: 'Fetches applications, joins with freelancer profiles, returns sorted by date or status',
  },
  {
    name: 'sp_shortlist_application',
    module: 'Project Management',
    description: 'Shortlists a project application',
    parameters: [
      { name: 'p_application_id', type: 'BIGINT', description: 'Application ID' },
      { name: 'p_project_id', type: 'BIGINT', description: 'Project ID' },
    ],
    returns: 'BOOLEAN - Success status',
    logic: 'Updates application status to shortlisted, sends notifications, logs activity',
  },
  {
    name: 'sp_accept_application',
    module: 'Project Management',
    description: 'Accepts a project application and starts project',
    parameters: [
      { name: 'p_application_id', type: 'BIGINT', description: 'Application ID' },
      { name: 'p_project_id', type: 'BIGINT', description: 'Project ID' },
    ],
    returns: 'BOOLEAN - Success status',
    logic: 'Updates application status, updates project status to in_progress, assigns team, sends notifications',
  },
  {
    name: 'sp_create_milestone',
    module: 'Project Management',
    description: 'Creates a project milestone',
    parameters: [
      { name: 'p_project_id', type: 'BIGINT', description: 'Project ID' },
      { name: 'p_title', type: 'VARCHAR(255)', description: 'Milestone title' },
      { name: 'p_due_date', type: 'DATE', description: 'Due date' },
      { name: 'p_description', type: 'TEXT', description: 'Milestone description' },
    ],
    returns: 'BIGINT - Milestone ID',
    logic: 'Creates milestone record, sends notifications to team, updates project timeline',
  },
  {
    name: 'sp_complete_milestone',
    module: 'Project Management',
    description: 'Marks milestone as completed',
    parameters: [
      { name: 'p_milestone_id', type: 'BIGINT', description: 'Milestone ID' },
    ],
    returns: 'BOOLEAN - Success status',
    logic: 'Updates milestone status, sets completed_at, triggers project progress update, sends notifications',
  },
  {
    name: 'sp_upload_project_document',
    module: 'Project Management',
    description: 'Uploads document to project',
    parameters: [
      { name: 'p_project_id', type: 'BIGINT', description: 'Project ID' },
      { name: 'p_uploaded_by', type: 'BIGINT', description: 'User ID who uploaded' },
      { name: 'p_file_name', type: 'VARCHAR(255)', description: 'File name' },
      { name: 'p_file_path', type: 'VARCHAR(500)', description: 'File storage path' },
      { name: 'p_document_type', type: 'VARCHAR(50)', description: 'Document type' },
    ],
    returns: 'BIGINT - Document ID',
    logic: 'Validates file, creates document record, sends notifications to project team',
  },
  {
    name: 'sp_get_freelancer_portfolio',
    module: 'User Management',
    description: 'Gets freelancer portfolio and stats',
    parameters: [
      { name: 'p_freelancer_id', type: 'BIGINT', description: 'Freelancer user ID' },
    ],
    returns: 'JSON - Portfolio data with projects, ratings, skills',
    logic: 'Aggregates freelancer completed projects, calculates ratings, returns portfolio summary',
  },
  {
    name: 'sp_update_user_profile',
    module: 'User Management',
    description: 'Updates user profile information',
    parameters: [
      { name: 'p_user_id', type: 'BIGINT', description: 'User ID' },
      { name: 'p_profile_data', type: 'JSON', description: 'Profile data to update (JSON object)' },
    ],
    returns: 'BOOLEAN - Success status',
    logic: 'Updates user_profile table, validates data, logs changes',
  },
  {
    name: 'sp_reset_password',
    module: 'User Management',
    description: 'Initiates password reset process',
    parameters: [
      { name: 'p_email', type: 'VARCHAR(255)', description: 'User email' },
    ],
    returns: 'BOOLEAN - Success status',
    logic: 'Generates reset token, creates verification record, sends password reset email',
  },
  {
    name: 'sp_confirm_password_reset',
    module: 'User Management',
    description: 'Confirms password reset with token',
    parameters: [
      { name: 'p_token', type: 'VARCHAR(255)', description: 'Reset token' },
      { name: 'p_new_password_hash', type: 'VARCHAR(255)', description: 'New hashed password' },
    ],
    returns: 'BOOLEAN - Success status',
    logic: 'Validates token, checks expiration, updates password, invalidates token',
  },
  {
    name: 'sp_verify_email',
    module: 'User Management',
    description: 'Verifies user email address',
    parameters: [
      { name: 'p_token', type: 'VARCHAR(255)', description: 'Verification token' },
    ],
    returns: 'BOOLEAN - Success status',
    logic: 'Validates token, marks email as verified, updates user record',
  },
  {
    name: 'sp_get_pricing_plans',
    module: 'Payment & Billing',
    description: 'Gets all active pricing plans',
    parameters: [],
    returns: 'JSON - Array of pricing plans with features',
    logic: 'Returns all active pricing plans with feature breakdown',
  },
  {
    name: 'sp_create_invoice_from_subscription',
    module: 'Payment & Billing',
    description: 'Creates invoice for subscription renewal',
    parameters: [
      { name: 'p_subscription_id', type: 'BIGINT', description: 'Subscription ID' },
    ],
    returns: 'BIGINT - Invoice ID',
    logic: 'Generates invoice for subscription period, calculates amount, sets due date, sends invoice email',
  },
  {
    name: 'sp_record_payment_webhook',
    module: 'Payment & Billing',
    description: 'Records payment webhook from payment gateway',
    parameters: [
      { name: 'p_transaction_id', type: 'VARCHAR(255)', description: 'Gateway transaction ID' },
      { name: 'p_webhook_data', type: 'JSON', description: 'Webhook payload (JSON)' },
      { name: 'p_status', type: 'VARCHAR(50)', description: 'Payment status from gateway' },
    ],
    returns: 'BIGINT - Payment ID',
    logic: 'Validates webhook, updates payment status, updates invoice, sends notifications',
  },
  {
    name: 'sp_get_user_subscription_details',
    module: 'Payment & Billing',
    description: 'Gets user subscription details with usage',
    parameters: [
      { name: 'p_user_id', type: 'BIGINT', description: 'User ID' },
    ],
    returns: 'JSON - Subscription details with usage statistics',
    logic: 'Gets active subscription, calculates usage (projects, applications), returns detailed info',
  },
  {
    name: 'sp_log_analytics_event',
    module: 'Analytics & Reporting',
    description: 'Logs an analytics event',
    parameters: [
      { name: 'p_user_id', type: 'BIGINT', description: 'User ID (nullable)' },
      { name: 'p_event_type', type: 'VARCHAR(100)', description: 'Event type' },
      { name: 'p_event_name', type: 'VARCHAR(255)', description: 'Event name' },
      { name: 'p_properties', type: 'JSON', description: 'Event properties (JSON)' },
    ],
    returns: 'BIGINT - Event ID',
    logic: 'Creates analytics event record, triggers real-time analytics updates',
  },
  {
    name: 'sp_get_analytics_dashboard',
    module: 'Analytics & Reporting',
    description: 'Gets analytics dashboard data',
    parameters: [
      { name: 'p_start_date', type: 'DATE', description: 'Start date' },
      { name: 'p_end_date', type: 'DATE', description: 'End date' },
    ],
    returns: 'JSON - Dashboard analytics (page views, conversions, user activity)',
    logic: 'Aggregates analytics data for date range, calculates metrics, returns dashboard summary',
  },
  {
    name: 'sp_get_blog_posts_paginated',
    module: 'Content Management',
    description: 'Gets paginated blog posts',
    parameters: [
      { name: 'p_category', type: 'VARCHAR(100)', description: 'Category filter (nullable)' },
      { name: 'p_limit', type: 'INT', description: 'Posts per page' },
      { name: 'p_offset', type: 'INT', description: 'Offset for pagination' },
    ],
    returns: 'JSON - Array of blog posts with pagination metadata',
    logic: 'Fetches published posts, filters by category, orders by published_at, returns with total count',
  },
  {
    name: 'sp_get_blog_post_by_slug',
    module: 'Content Management',
    description: 'Gets blog post by slug',
    parameters: [
      { name: 'p_slug', type: 'VARCHAR(255)', description: 'Post slug' },
    ],
    returns: 'JSON - Blog post with author and tags',
    logic: 'Fetches post, joins author info, gets tags, increments views_count, returns complete post data',
  },
  {
    name: 'sp_create_career_application',
    module: 'Consultation & Applications',
    description: 'Creates a career application',
    parameters: [
      { name: 'p_position_title', type: 'VARCHAR(255)', description: 'Position title' },
      { name: 'p_applicant_name', type: 'VARCHAR(255)', description: 'Applicant name' },
      { name: 'p_email', type: 'VARCHAR(255)', description: 'Applicant email' },
      { name: 'p_resume_path', type: 'VARCHAR(500)', description: 'Resume file path' },
    ],
    returns: 'BIGINT - Application ID',
    logic: 'Creates application, parses resume (AI), calculates match score, sends confirmation email',
  },
  {
    name: 'sp_create_talent_request',
    module: 'Consultation & Applications',
    description: 'Creates a talent hiring request',
    parameters: [
      { name: 'p_client_id', type: 'BIGINT', description: 'Client user ID' },
      { name: 'p_title', type: 'VARCHAR(255)', description: 'Request title' },
      { name: 'p_description', type: 'TEXT', description: 'Talent requirements' },
      { name: 'p_skills_required', type: 'JSON', description: 'Required skills (JSON array)' },
    ],
    returns: 'BIGINT - Request ID',
    logic: 'Creates talent request, matches with available talent, sends notifications',
  },
  {
    name: 'sp_submit_contact_form',
    module: 'Consultation & Applications',
    description: 'Processes contact form submission',
    parameters: [
      { name: 'p_full_name', type: 'VARCHAR(255)', description: 'Sender name' },
      { name: 'p_email', type: 'VARCHAR(255)', description: 'Sender email' },
      { name: 'p_message', type: 'TEXT', description: 'Message content' },
      { name: 'p_project_title', type: 'VARCHAR(255)', description: 'Project title (nullable)' },
    ],
    returns: 'BIGINT - Message ID',
    logic: 'Creates contact message, sends notification to support team, sends auto-reply to sender',
  },
  {
    name: 'sp_create_complaint',
    module: 'Consultation & Applications',
    description: 'Creates a customer complaint',
    parameters: [
      { name: 'p_complaint_email', type: 'VARCHAR(255)', description: 'Complainant email' },
      { name: 'p_complaint_message', type: 'TEXT', description: 'Complaint details' },
    ],
    returns: 'BIGINT - Complaint ID',
    logic: 'Creates complaint record, assigns to support team, sends acknowledgment email, creates priority ticket',
  },
  {
    name: 'sp_resolve_complaint',
    module: 'Consultation & Applications',
    description: 'Resolves a customer complaint',
    parameters: [
      { name: 'p_complaint_id', type: 'BIGINT', description: 'Complaint ID' },
      { name: 'p_resolution_notes', type: 'TEXT', description: 'Resolution notes' },
    ],
    returns: 'BOOLEAN - Success status',
    logic: 'Updates complaint status, sets resolved_at, sends resolution email to complainant',
  },
  {
    name: 'sp_get_user_notifications',
    module: 'Notifications',
    description: 'Gets user notifications',
    parameters: [
      { name: 'p_user_id', type: 'BIGINT', description: 'User ID' },
      { name: 'p_unread_only', type: 'BOOLEAN', description: 'Whether to get only unread' },
      { name: 'p_limit', type: 'INT', description: 'Result limit' },
    ],
    returns: 'JSON - Array of notifications',
    logic: 'Fetches notifications, filters by read status, orders by created_at desc, returns paginated results',
  },
  {
    name: 'sp_mark_all_notifications_read',
    module: 'Notifications',
    description: 'Marks all user notifications as read',
    parameters: [
      { name: 'p_user_id', type: 'BIGINT', description: 'User ID' },
    ],
    returns: 'INT - Number of notifications marked as read',
    logic: 'Updates all unread notifications for user, sets read_at timestamp',
  },
  {
    name: 'sp_create_chatbot_conversation',
    module: 'Chatbot',
    description: 'Creates a new chatbot conversation',
    parameters: [
      { name: 'p_user_id', type: 'BIGINT', description: 'User ID (nullable for anonymous)' },
      { name: 'p_session_id', type: 'VARCHAR(255)', description: 'Session identifier' },
    ],
    returns: 'BIGINT - Conversation ID',
    logic: 'Creates conversation record, initializes with welcome message',
  },
  {
    name: 'sp_close_chatbot_conversation',
    module: 'Chatbot',
    description: 'Closes a chatbot conversation',
    parameters: [
      { name: 'p_conversation_id', type: 'BIGINT', description: 'Conversation ID' },
    ],
    returns: 'BOOLEAN - Success status',
    logic: 'Updates conversation status, sets ended_at timestamp',
  },
  {
    name: 'sp_get_conversion_tracking',
    module: 'Analytics & Reporting',
    description: 'Gets conversion tracking data',
    parameters: [
      { name: 'p_start_date', type: 'DATE', description: 'Start date' },
      { name: 'p_end_date', type: 'DATE', description: 'End date' },
    ],
    returns: 'JSON - Conversion funnel data',
    logic: 'Tracks conversions through funnel (visit → form → consultation → project), returns funnel metrics',
  },
  {
    name: 'sp_get_top_performing_pages',
    module: 'Analytics & Reporting',
    description: 'Gets top performing pages by views',
    parameters: [
      { name: 'p_start_date', type: 'DATE', description: 'Start date' },
      { name: 'p_end_date', type: 'DATE', description: 'End date' },
      { name: 'p_limit', type: 'INT', description: 'Number of pages to return' },
    ],
    returns: 'JSON - Array of pages with view counts',
    logic: 'Aggregates page views, calculates average duration, returns top pages',
  },
  {
    name: 'sp_archive_old_data',
    module: 'Database Maintenance',
    description: 'Archives old data for performance',
    parameters: [
      { name: 'p_table_name', type: 'VARCHAR(100)', description: 'Table to archive from' },
      { name: 'p_days_old', type: 'INT', description: 'Archive data older than this many days' },
    ],
    returns: 'INT - Number of records archived',
    logic: 'Moves old records to archive tables, maintains referential integrity',
  },
];

async function generateDatabaseDocumentation() {
  const sections = [];

  // Title Page
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Pay Per Project',
          bold: true,
          size: 72,
        }),
      ],
      heading: HeadingLevel.TITLE,
      spacing: { after: 400 },
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Complete Database Design Documentation',
          size: 48,
        }),
      ],
      spacing: { after: 600 },
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Documentation Date: ${new Date().toLocaleDateString()}`,
          size: 24,
        }),
      ],
      spacing: { after: 1200 },
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: '',
      pageBreakBefore: true,
    })
  );

  // Table of Contents
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Table of Contents',
          bold: true,
          size: 32,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '1. Executive Summary',
          size: 20,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '2. Database Overview',
          size: 20,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '3. Entity Relationship Diagram (ERD)',
          size: 20,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '4. Database Tables (All 40+ Tables)',
          size: 20,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '5. Stored Procedures (50+ Procedures)',
          size: 20,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '6. React Components & Classes (80+ Components)',
          size: 20,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '7. API Endpoints Design',
          size: 20,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: '',
      pageBreakBefore: true,
    })
  );

  // Executive Summary
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '1. Executive Summary',
          bold: true,
          size: 36,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'This document provides a comprehensive database design for the Pay Per Project platform, a fully managed project delivery system. The database schema supports all features including user management, project lifecycle, reviews, blog system, white-label products, consultations, applications, payments, referrals, and more.',
          size: 24,
        }),
      ],
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Database Statistics:',
          bold: true,
          size: 28,
        }),
      ],
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `• Total Tables: ${databaseTables.length}`,
          size: 24,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `• Total Stored Procedures: ${storedProcedures.length}`,
          size: 24,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '• React Components: 80+ components across 31 pages',
          size: 24,
        }),
      ],
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: '',
      pageBreakBefore: true,
    })
  );

  // Database Overview
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '2. Database Overview',
          bold: true,
          size: 36,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Database System: PostgreSQL 14+ (Recommended) or MySQL 8.0+',
          bold: true,
          size: 28,
        }),
      ],
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Character Set: UTF-8',
          size: 24,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Timezone: UTC',
          size: 24,
        }),
      ],
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Core Modules:',
          bold: true,
          size: 28,
        }),
      ],
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '1. User Management & Authentication',
          size: 24,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '2. Project Management & Lifecycle',
          size: 24,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '3. Content Management (Blog, Reviews, Industries)',
          size: 24,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '4. White-Label Products Catalog',
          size: 24,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '5. Consultation & Applications',
          size: 24,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '6. Payment & Billing System',
          size: 24,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '7. Referral Program',
          size: 24,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '8. Analytics & Reporting',
          size: 24,
        }),
      ],
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: '',
      pageBreakBefore: true,
    })
  );

  // Database Tables Section
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '4. Database Tables',
          bold: true,
          size: 36,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 400 },
    })
  );

  // Group tables by module
  const tablesByModule = {};
  databaseTables.forEach(table => {
    if (!tablesByModule[table.module]) {
      tablesByModule[table.module] = [];
    }
    tablesByModule[table.module].push(table);
  });

  // Document each module's tables
  Object.keys(tablesByModule).forEach((moduleName, moduleIndex) => {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `4.${moduleIndex + 1} ${moduleName} Module`,
            bold: true,
            size: 32,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 200 },
      })
    );

    tablesByModule[moduleName].forEach((table, tableIndex) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${moduleIndex + 1}.${tableIndex + 1} ${table.name}`,
              bold: true,
              size: 28,
            }),
          ],
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Description: ${table.description}`,
              size: 24,
            }),
          ],
          spacing: { after: 200 },
        })
      );

      // Create table for columns
      const columnRows = [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Column Name', bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Data Type', bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Nullable', bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Key/Default', bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Description', bold: true })] })] }),
          ],
        }),
        ...table.columns.map(col => {
          const keyInfo = [];
          if (col.key) keyInfo.push(col.key);
          if (col.default) keyInfo.push(`DEFAULT: ${col.default}`);
          
          return new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: col.name })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: col.type })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: col.nullable ? 'Yes' : 'No' })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: keyInfo.join(', ') || '-' })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: col.description || '-' })] })] }),
            ],
          });
        }),
      ];

      sections.push(
        new Table({
          rows: columnRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        })
      );

      // Foreign Keys
      if (table.foreignKeys && table.foreignKeys.length > 0) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Foreign Keys:',
                bold: true,
                size: 24,
              }),
            ],
            spacing: { before: 200, after: 100 },
          })
        );
        table.foreignKeys.forEach(fk => {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${fk.column} → ${fk.references} (ON DELETE: ${fk.onDelete})`,
                  size: 22,
                }),
              ],
              spacing: { after: 50 },
            })
          );
        });
      }

      // Indexes
      if (table.indexes && table.indexes.length > 0) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Indexes:',
                bold: true,
                size: 24,
              }),
            ],
            spacing: { before: 200, after: 100 },
          })
        );
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: table.indexes.join(', '),
                size: 22,
              }),
            ],
            spacing: { after: 200 },
          })
        );
      }

      sections.push(
        new Paragraph({
          text: '',
          spacing: { after: 400 },
        })
      );
    });
  });

  // Stored Procedures Section
  sections.push(
    new Paragraph({
      text: '',
      pageBreakBefore: true,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '5. Stored Procedures',
          bold: true,
          size: 36,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 400 },
    })
  );

  storedProcedures.forEach((sp, index) => {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${index + 1}. ${sp.name}`,
            bold: true,
            size: 32,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Module: ${sp.module}`,
            size: 24,
            italics: true,
          }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Description: ${sp.description}`,
            size: 24,
          }),
        ],
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Returns: ${sp.returns}`,
            size: 24,
          }),
        ],
        spacing: { after: 200 },
      })
    );

    if (sp.parameters && sp.parameters.length > 0) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Parameters:',
              bold: true,
              size: 24,
            }),
          ],
          spacing: { after: 100 },
        })
      );

      const paramRows = [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Parameter Name', bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Data Type', bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Description', bold: true })] })] }),
          ],
        }),
        ...sp.parameters.map(param =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: param.name })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: param.type })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: param.description })] })] }),
            ],
          })
        ),
      ];

      sections.push(
        new Table({
          rows: paramRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        })
      );
    }

    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Business Logic: ${sp.logic}`,
            size: 24,
          }),
        ],
        spacing: { before: 200, after: 400 },
      })
    );
  });

  // React Components Section
  sections.push(
    new Paragraph({
      text: '',
      pageBreakBefore: true,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '6. React Components & Classes',
          bold: true,
          size: 36,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'The Pay Per Project frontend is built with React 18.2.0 and consists of 80+ components organized into the following structure:',
          size: 24,
        }),
      ],
      spacing: { after: 400 },
    })
  );

  // Get all React components
  function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        getAllFiles(filePath, fileList);
      } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
        const relativePath = path.relative(path.join(__dirname, 'src'), filePath);
        fileList.push('src/' + relativePath.replace(/\\/g, '/'));
      }
    });
    return fileList;
  }
  
  const srcDir = path.join(__dirname, 'src');
  const allComponentFiles = getAllFiles(srcDir);
  const pageFiles = allComponentFiles.filter(f => f.startsWith('src/pages/'));
  const componentFiles_filtered = allComponentFiles.filter(f => f.startsWith('src/components/'));

  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '6.1 Page Components (31 Pages)',
          bold: true,
          size: 32,
        }),
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 },
    })
  );

  pageFiles.forEach((file, index) => {
    const fileName = path.basename(file, path.extname(file));
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${index + 1}. ${fileName}`,
            bold: true,
            size: 28,
          }),
        ],
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `File Path: ${file}`,
            size: 22,
            italics: true,
          }),
        ],
        spacing: { after: 200 },
      })
    );
  });

  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '6.2 Reusable Components',
          bold: true,
          size: 32,
        }),
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 },
    })
  );

  // Group components by directory
  const componentsByDir = {};
  componentFiles_filtered.forEach(file => {
    const dir = path.dirname(file).replace('src/components/', '');
    const category = dir || 'root';
    if (!componentsByDir[category]) {
      componentsByDir[category] = [];
    }
    componentsByDir[category].push(file);
  });

  Object.keys(componentsByDir).forEach((category, catIndex) => {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Category: ${category || 'Root Components'}`,
            bold: true,
            size: 28,
          }),
        ],
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 },
      })
    );

    componentsByDir[category].forEach((file, fileIndex) => {
      const fileName = path.basename(file, path.extname(file));
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${fileName}`,
              size: 24,
            }),
          ],
          spacing: { after: 50 },
        })
      );
    });
  });

  // API Endpoints Section
  sections.push(
    new Paragraph({
      text: '',
      pageBreakBefore: true,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '7. API Endpoints Design',
          bold: true,
          size: 36,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'The following API endpoints should be implemented to support the frontend functionality:',
          size: 24,
        }),
      ],
      spacing: { after: 400 },
    })
  );

  const apiEndpoints = [
    { method: 'POST', path: '/api/auth/register', description: 'User registration', module: 'Authentication' },
    { method: 'POST', path: '/api/auth/login', description: 'User login', module: 'Authentication' },
    { method: 'POST', path: '/api/auth/logout', description: 'User logout', module: 'Authentication' },
    { method: 'GET', path: '/api/users/profile', description: 'Get user profile', module: 'User Management' },
    { method: 'PUT', path: '/api/users/profile', description: 'Update user profile', module: 'User Management' },
    { method: 'GET', path: '/api/projects', description: 'List projects', module: 'Project Management' },
    { method: 'POST', path: '/api/projects', description: 'Create project', module: 'Project Management' },
    { method: 'GET', path: '/api/projects/:id', description: 'Get project details', module: 'Project Management' },
    { method: 'PUT', path: '/api/projects/:id', description: 'Update project', module: 'Project Management' },
    { method: 'POST', path: '/api/projects/:id/applications', description: 'Apply to project', module: 'Project Management' },
    { method: 'GET', path: '/api/blog/posts', description: 'List blog posts', module: 'Content Management' },
    { method: 'GET', path: '/api/blog/posts/:slug', description: 'Get blog post by slug', module: 'Content Management' },
    { method: 'GET', path: '/api/reviews', description: 'List reviews', module: 'Content Management' },
    { method: 'POST', path: '/api/consultations', description: 'Create consultation request', module: 'Consultations' },
    { method: 'POST', path: '/api/contact', description: 'Submit contact form', module: 'Contact' },
    { method: 'GET', path: '/api/pricing/plans', description: 'Get pricing plans', module: 'Billing' },
    { method: 'POST', path: '/api/subscriptions', description: 'Create subscription', module: 'Billing' },
    { method: 'GET', path: '/api/invoices', description: 'List user invoices', module: 'Billing' },
    { method: 'POST', path: '/api/payments', description: 'Process payment', module: 'Billing' },
    { method: 'POST', path: '/api/referrals/use-code', description: 'Use referral code', module: 'Referrals' },
    { method: 'GET', path: '/api/referrals/my-code', description: 'Get user referral code', module: 'Referrals' },
  ];

  const endpointsByModule = {};
  apiEndpoints.forEach(endpoint => {
    if (!endpointsByModule[endpoint.module]) {
      endpointsByModule[endpoint.module] = [];
    }
    endpointsByModule[endpoint.module].push(endpoint);
  });

  Object.keys(endpointsByModule).forEach((module, modIndex) => {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `7.${modIndex + 1} ${module} Endpoints`,
            bold: true,
            size: 32,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 200 },
      })
    );

    const endpointRows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Method', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Endpoint', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Description', bold: true })] })] }),
        ],
      }),
      ...endpointsByModule[module].map(ep =>
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: ep.method })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: ep.path })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: ep.description })] })] }),
          ],
        })
      ),
    ];

    sections.push(
      new Table({
        rows: endpointRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
      })
    );
    sections.push(
      new Paragraph({
        text: '',
        spacing: { after: 400 },
      })
    );
  });

  // Create document
  const doc = new Document({
    creator: "Pay Per Project Documentation Generator",
    title: "Pay Per Project - Complete Database Design",
    description: "Complete database design with tables, procedures, and classes",
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: sections,
      },
    ],
  });

  const outputPath = path.join(__dirname, 'PayPerProject_Database_Design.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`\n✓ Complete Database Documentation generated successfully!`);
  console.log(`  Output: ${outputPath}`);
  console.log(`  Total Tables: ${databaseTables.length}`);
  console.log(`  Total Stored Procedures: ${storedProcedures.length}`);
  console.log(`  Total API Endpoints: ${apiEndpoints.length}`);
}

generateDatabaseDocumentation().catch(console.error);

