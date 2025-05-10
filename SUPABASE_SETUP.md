# Supabase Setup Guide for FMA Contract Form

This guide will walk you through setting up Supabase for the FMA Contract Form application.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in or create an account
2. Click "New Project" and fill in the details:
   - Name: FMA Contract Form
   - Database Password: (create a strong password)
   - Region: (choose the closest to your users)
3. Click "Create new project"

## 2. Set Up Database Schema

You can set up the database schema in two ways:

### Option 1: Using the SQL Editor

1. In your Supabase dashboard, go to the "SQL Editor" section
2. Create a "New Query"
3. Copy and paste the contents of the `supabase/migrations/20240510_initial_schema.sql` file
4. Click "Run" to execute the SQL and create all tables and policies

### Option 2: Using the Table Editor

1. In your Supabase dashboard, go to the "Table Editor" section
2. Create each table manually with the columns specified in the schema file
3. Set up relationships between tables
4. Enable Row Level Security (RLS) for each table
5. Create policies for each table

## 3. Configure Environment Variables

Add the following environment variables to your Next.js project:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

You can find these values in your Supabase dashboard under Project Settings > API.

## 4. Storage Setup (Optional)

If you want to store PDFs of signed contracts:

1. Go to the "Storage" section in your Supabase dashboard
2. Create a new bucket called "contracts"
3. Set the privacy to "Private"
4. Create RLS policies to control access to the files

## 5. Email Service Integration

For sending confirmation emails, you'll need to set up an email service like Resend, SendGrid, or Postmark:

1. Sign up for an email service
2. Get your API key
3. Add it to your environment variables:

\`\`\`
RESEND_API_KEY=your-resend-api-key
\`\`\`

## 6. Testing Your Setup

To test your Supabase setup:

1. Run your Next.js application locally
2. Fill out and submit the contract form
3. Check your Supabase dashboard to verify that data was inserted into the tables
4. Verify that emails are being sent correctly

## 7. Backup and Maintenance

- Supabase automatically backs up your database daily
- You can manually create backups from the dashboard
- Consider setting up a scheduled task to clean up old data according to your retention policy

## 8. Monitoring and Logs

- Monitor your database usage in the Supabase dashboard
- Check the logs for any errors or issues
- Set up alerts for critical events

## 9. Production Considerations

- Use environment variables for different environments (development, staging, production)
- Consider implementing rate limiting for form submissions to prevent abuse
- Implement CAPTCHA or other anti-spam measures
- Set up proper error logging and monitoring
\`\`\`

Let's create a component to display the IP address for the signature:
