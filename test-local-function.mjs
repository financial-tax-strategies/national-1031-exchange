// Test PATCH locally to see the response
const testUpdate = async () => {
  const baseUrl = 'http://localhost:8888';
  const data = {
    id: '550e8400-e29b-41d4-a716-446655440003',
    job_title: 'Senior Tax Attorney - Test Update'
  };

  try {
    console.log('Testing locally first...');
    console.log('URL:', baseUrl + '/.netlify/functions/team-members-update');
    console.log('Data:', JSON.stringify(data, null, 2));
    
    const response = await fetch(baseUrl + '/.netlify/functions/team-members-update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    console.log('Status:', response.status);
    const result = await response.text();
    console.log('Response:', result);
    
    try {
      const json = JSON.parse(result);
      console.log('Parsed JSON:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Not JSON response');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

testUpdate();
EOF < /dev/null