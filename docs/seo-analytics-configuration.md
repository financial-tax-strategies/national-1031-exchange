# SEO Analytics Configuration

This document explains how to set up and use the SEO Analytics configuration feature.

## Overview

The SEO Analytics Configuration feature allows administrators to manage various analytics and tracking pixels through the admin interface at `/admin/seo-analytics`. The configuration is persisted in the database and automatically loaded on all pages.

## Features

### 1. Analytics & Tracking Pixels

Configure the following analytics services:

- Google Analytics 4 (GA4)
- Google Tag Manager (GTM)
- Facebook Pixel
- LinkedIn Insight Tag
- Twitter/X Pixel
- Microsoft Clarity
- Hotjar

### 2. Meta Tag Defaults

Set default values for:

- Meta description
- Author information
- Keywords
- Open Graph image

### 3. Schema.org Settings

Configure organization information for structured data:

- Organization name
- Legal name
- Social media profiles
- Price range

### 4. AI Bot Access Control

Control which AI bots can access your site:

- GPTBot (OpenAI)
- Claude-Web (Anthropic)
- PerplexityBot
- YouBot
- Cohere AI

## Setup Instructions

### 1. Database Setup

If you're using Supabase, run the migration file to create the necessary table:

```sql
-- Run the migration at: supabase/migrations/20250806_create_seo_config_table.sql
```

Or manually create the table in your Supabase dashboard using the SQL in that file.

### 2. Environment Variables (Optional)

You can still use environment variables as a fallback:

- `PUBLIC_GA_MEASUREMENT_ID` - Google Analytics 4 ID
- `PUBLIC_GTM_ID` - Google Tag Manager ID

The system will prefer database configuration over environment variables when available.

## Usage

### Saving Configuration

1. Navigate to `/admin/seo-analytics`
2. Enter your analytics IDs and configuration
3. Click "Save Configuration"
4. The configuration is saved to the database and immediately active

### How It Works

1. **API Endpoint**: `/api/seo-config` handles saving and retrieving configuration
2. **Database Storage**: Configuration is stored in the `seo_config` table
3. **Automatic Loading**: Analytics components automatically load configuration from the database
4. **Fallback**: If database is not configured, falls back to environment variables

### Components

- **GoogleAnalytics.astro**: Loads GA4 configuration from database or env vars
- **GoogleTagManager.astro**: Loads GTM configuration from database or env vars
- **AnalyticsHead.astro**: Loads other pixel types (Facebook, LinkedIn, etc.)

## API Reference

### GET /api/seo-config

Returns the current SEO configuration.

**Response:**

```json
{
  "data": {
    "analytics": {
      "ga4_id": "G-XXXXXXXXXX",
      "gtm_id": "GTM-XXXXXXX",
      "fb_pixel_id": "XXXXXXXXXXXXXXXX",
      "linkedin_id": "XXXXXXX",
      "twitter_pixel_id": "XXXXX",
      "clarity_id": "XXXXXXXXXX",
      "hotjar_id": "XXXXXXX"
    },
    "meta": { ... },
    "schema": { ... },
    "ai_bots": { ... }
  }
}
```

### POST /api/seo-config

Saves the SEO configuration.

**Request Body:**

```json
{
  "analytics": { ... },
  "meta": { ... },
  "schema": { ... },
  "ai_bots": { ... }
}
```

**Response:**

```json
{
  "success": true,
  "data": { ... },
  "message": "SEO configuration saved successfully"
}
```

## Troubleshooting

### Configuration Not Saving

1. **Check Supabase Configuration**: Ensure `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` are set
2. **Create Database Table**: Run the migration to create the `seo_config` table
3. **Check Browser Console**: Look for error messages when saving
4. **Check Network Tab**: Verify the API request is successful

### Pixels Not Loading

1. **Check Production Mode**: Many pixels only load in production (`npm run build && npm run preview`)
2. **Verify IDs**: Ensure the pixel IDs are correct and valid
3. **Check Browser Console**: Look for JavaScript errors
4. **Use Browser Extensions**: Use tools like Facebook Pixel Helper or Google Tag Assistant

### Database Not Available

If Supabase is not configured, the system will:

1. Show a warning message
2. Provide SQL to create the table manually
3. Fall back to environment variables for GA4 and GTM

## Security Notes

- The configuration is stored in a public-readable table (for performance)
- Sensitive data like API keys should NOT be stored here
- Analytics IDs are generally safe to expose as they're visible in page source
- Admin authentication should be implemented before production use
