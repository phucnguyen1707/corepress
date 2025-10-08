# Authentication

POST /api/auth/register - Register a new user
POST /api/auth/login - Login a user
POST /api/auth/refresh - Refresh a session token
GET /api/auth/me - Get current user info

# Users

GET /api/users/:id - Get user by ID
PUT /api/users/:id - Update user (only the user themselves)
DELETE /api/users/:id - Delete user (only the user themselves)

# Pages

POST /api/pages - Create a new page
GET /api/pages/:id - Get page by ID
GET /api/pages/user/:userId - Get pages by user ID
PUT /api/pages/:id - Update page
DELETE /api/pages/:id - Delete page

# Page Sections

POST /api/page-sections - Create a new page section
GET /api/page-sections/:id - Get page section by ID
GET /api/page-sections/page/:pageId - Get page sections by page ID
PUT /api/page-sections/:id - Update page section
DELETE /api/page-sections/:id - Delete page section

# Section Headers

POST /api/section-headers - Create a new section header
GET /api/section-headers/:id - Get section header by ID
GET /api/section-headers/section/:sectionId - Get section headers by section ID
PUT /api/section-headers/:id - Update section header
DELETE /api/section-headers/:id - Delete section header

---

# Register a new user:

curl -X POST http://localhost:3000/api/auth/register \
 -H "Content-Type: application/json" \
 -d '{"username": "john_doe", "name": "John Doe", "password": "password123"}'

# Login:

curl -X POST http://localhost:3000/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{"username": "john_doe", "password": "password123"}'

# Refresh Token:

curl -X POST http://localhost:3000/api/auth/refresh \
 -H "Content-Type: application/json" \
 -d '{"refreshToken": "<your_refresh_token>"}'

# Logout:

curl -X POST http://localhost:3000/api/auth/logout \
 -H "Content-Type: application/json" \
 -d '{"refreshToken": "<your_current_refresh_token>"}'

# Create a page (using the token from login):

curl -X POST http://localhost:3000/api/pages \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_TOKEN" \
 -d '{"pageType": "landing"}'

# Create a page section:

curl -X POST http://localhost:3000/api/page-sections \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_TOKEN" \
 -d '{"pageId": "PAGE_ID", "sectionType": "header"}'

# Create a section header:

curl -X POST http://localhost:3000/api/section-headers \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_TOKEN" \
 -d '{"sectionId": "SECTION_ID", "title": "Welcome to My Page"}'
