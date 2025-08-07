#!/bin/bash

# Test the SEO configuration API
# Run this with: bash test-seo-api.sh

echo "Testing SEO Configuration API..."

# Test saving configuration
curl -X POST http://localhost:4321/api/seo-config \
  -H "Content-Type: application/json" \
  -d '{
    "analytics": {
      "ga4_id": "G-TEST123",
      "gtm_id": "GTM-TEST456"
    },
    "meta": {
      "default_description": "Test description"
    }
  }' | json_pp

echo ""
echo "Now testing GET..."

# Test retrieving configuration  
curl http://localhost:4321/api/seo-config | json_pp