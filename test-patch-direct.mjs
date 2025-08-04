// Test PATCH directly to Netlify Function
const testUpdate = async () => {
  const url = 'https://national1031exchange.com/.netlify/functions/team-members-update';
  const data = {
    id: '550e8400-e29b-41d4-a716-446655440003', // Ruth Thompson's ID
    job_title: 'Senior Tax Attorney - Updated ' + new Date().toISOString()
  };

  try {
    console.log('Sending PATCH to:', url);
    console.log('Data:', JSON.stringify(data, null, 2));
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.json();
    console.log('Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
};

testUpdate();