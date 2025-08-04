import type { APIRoute } from 'astro';

// Simple test endpoint to verify API methods work in production
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ 
    method: 'GET',
    message: 'GET method works!',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const POST: APIRoute = async () => {
  return new Response(JSON.stringify({ 
    method: 'POST',
    message: 'POST method works!',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const PATCH: APIRoute = async () => {
  return new Response(JSON.stringify({ 
    method: 'PATCH',
    message: 'PATCH method works!',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const PUT: APIRoute = async () => {
  return new Response(JSON.stringify({ 
    method: 'PUT',
    message: 'PUT method works!',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const DELETE: APIRoute = async () => {
  return new Response(JSON.stringify({ 
    method: 'DELETE',
    message: 'DELETE method works!',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Catch-all for debugging
export const ALL: APIRoute = async ({ request }) => {
  return new Response(JSON.stringify({ 
    method: request.method,
    message: `ALL handler caught ${request.method} method`,
    headers: Object.fromEntries(request.headers.entries()),
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};