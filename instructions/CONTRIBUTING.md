# Contributing Guide

## Development Setup
### Environment Setup
1. Clone repository
2. Copy .env.example to .env.local
3. Set up Supabase environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
4. Install dependencies
5. Run development server

## Coding Standards
### Authentication
- Always use environment variables for credentials
- Implement proper error handling
- Add debug logging for issues
- Test authentication flow thoroughly

## Review Process
### Pre-commit Checklist
- Environment variables configured
- Error handling implemented
- Logging added for debugging
- Authentication flow tested

## Tools and Requirements
### Required Tools
- Node.js
- npm/yarn
- Supabase CLI (optional)

## Environment Setup
### Local Development
1. Set up environment variables
2. Initialize Supabase client
3. Test authentication flow
4. Verify logging system
