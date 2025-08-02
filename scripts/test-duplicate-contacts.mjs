#!/usr/bin/env node
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const API_KEY = process.env.PUBLIC_HIGHLEVEL_API_KEY;
const LOCATION_ID = process.env.PUBLIC_HIGHLEVEL_LOCATION_ID;

console.log('🔄 Testing Duplicate Contact Handling\n');

const baseUrl = 'https://services.leadconnectorhq.com';
const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
  'Version': '2021-07-28'
};

async function createContact(email, additionalData = {}) {
  const contactData = {
    locationId: LOCATION_ID,
    email: email,
    ...additionalData
  };

  const response = await fetch(`${baseUrl}/contacts/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(contactData)
  });

  const data = await response.json();
  return { response, data };
}

async function searchContact(email) {
  const response = await fetch(`${baseUrl}/contacts/lookup?email=${encodeURIComponent(email)}`, {
    method: 'GET',
    headers
  });

  const data = await response.json();
  return { response, data };
}

async function updateContact(contactId, updateData) {
  const response = await fetch(`${baseUrl}/contacts/${contactId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updateData)
  });

  const data = await response.json();
  return { response, data };
}

async function testDuplicateScenarios() {
  const testEmail = `duplicate-test-${Date.now()}@example.com`;
  
  console.log(`Test email: ${testEmail}\n`);

  // Test 1: Create initial contact
  console.log('1️⃣ Creating initial contact...');
  const { response: createResponse1, data: createData1 } = await createContact(testEmail, {
    firstName: 'Test',
    lastName: 'User',
    phone: '+15551234567'
  });

  if (createResponse1.ok) {
    console.log('   ✅ Contact created successfully');
    console.log(`   Contact ID: ${createData1.contact?.id || createData1.id}`);
  } else {
    console.log('   ❌ Failed to create contact');
    console.log('   Error:', createData1);
    return;
  }

  const contactId = createData1.contact?.id || createData1.id;

  // Test 2: Try to create duplicate
  console.log('\n2️⃣ Attempting to create duplicate contact...');
  const { response: createResponse2, data: createData2 } = await createContact(testEmail, {
    firstName: 'Duplicate',
    lastName: 'Test'
  });

  if (!createResponse2.ok) {
    console.log('   ❌ Duplicate creation blocked (expected)');
    console.log(`   Error: ${createData2.message || JSON.stringify(createData2)}`);
  } else {
    console.log('   ⚠️  Duplicate was created (unexpected)');
    console.log(`   New Contact ID: ${createData2.contact?.id || createData2.id}`);
  }

  // Test 3: Search for contact
  console.log('\n3️⃣ Searching for contact by email...');
  const { response: searchResponse, data: searchData } = await searchContact(testEmail);

  if (searchResponse.ok) {
    console.log('   ✅ Contact found');
    if (searchData.contacts && searchData.contacts.length > 0) {
      console.log(`   Found ${searchData.contacts.length} contact(s)`);
      console.log(`   Contact ID: ${searchData.contacts[0].id}`);
    }
  } else {
    console.log('   ❌ Search failed');
    console.log('   Error:', searchData);
  }

  // Test 4: Update existing contact
  console.log('\n4️⃣ Updating existing contact...');
  const { response: updateResponse, data: updateData } = await updateContact(contactId, {
    firstName: 'Updated',
    lastName: 'Successfully',
    tags: ['updated-contact']
  });

  if (updateResponse.ok) {
    console.log('   ✅ Contact updated successfully');
  } else {
    console.log('   ❌ Update failed');
    console.log('   Error:', updateData);
  }

  // Test 5: Proper duplicate handling pattern
  console.log('\n5️⃣ Testing proper duplicate handling pattern...');
  const duplicateEmail = `proper-duplicate-${Date.now()}@example.com`;
  
  console.log('   Step 1: Search for existing contact');
  const { response: searchFirst, data: searchFirstData } = await searchContact(duplicateEmail);
  
  if (searchFirst.ok && searchFirstData.contacts && searchFirstData.contacts.length > 0) {
    console.log('   ✅ Contact exists, updating...');
    const existingId = searchFirstData.contacts[0].id;
    const { response: updateExisting } = await updateContact(existingId, {
      firstName: 'Updated',
      tags: ['existing-updated']
    });
    console.log(`   Update result: ${updateExisting.ok ? '✅ Success' : '❌ Failed'}`);
  } else {
    console.log('   ℹ️  Contact not found, creating new...');
    const { response: createNew } = await createContact(duplicateEmail, {
      firstName: 'New',
      lastName: 'Contact',
      tags: ['newly-created']
    });
    console.log(`   Create result: ${createNew.ok ? '✅ Success' : '❌ Failed'}`);
  }

  // Test 6: Check customFields format
  console.log('\n6️⃣ Testing customFields format...');
  const customFieldEmail = `customfield-test-${Date.now()}@example.com`;
  
  // Test wrong format (singular)
  console.log('   Testing wrong format (customField - singular)...');
  try {
    const wrongResponse = await fetch(`${baseUrl}/contacts/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        locationId: LOCATION_ID,
        email: customFieldEmail,
        customField: { source: 'test' } // Wrong - singular
      })
    });
    const wrongData = await wrongResponse.json();
    console.log(`   Result: ${wrongResponse.ok ? '✅ Accepted' : '❌ Rejected'}`);
    if (!wrongResponse.ok) {
      console.log(`   Error: ${wrongData.message}`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test correct format (plural)
  console.log('   Testing correct format (customFields - plural)...');
  const { response: correctResponse, data: correctData } = await createContact(
    `customfields-correct-${Date.now()}@example.com`,
    {
      customFields: [
        { key: 'source', value: 'test-script' },
        { key: 'test_field', value: 'test_value' }
      ]
    }
  );
  console.log(`   Result: ${correctResponse.ok ? '✅ Success' : '❌ Failed'}`);
  if (!correctResponse.ok) {
    console.log(`   Error: ${correctData.message}`);
  }
}

// Run tests
testDuplicateScenarios().then(() => {
  console.log('\n✨ Duplicate handling tests complete!');
});