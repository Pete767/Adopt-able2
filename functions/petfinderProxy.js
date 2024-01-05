//const fetch = require('node-fetch').default;
import fetch from 'node-fetch';

exports.handler = async function (event, context) {
  try {
    const petfinderApiKey = process.env.PETFINDER_API_KEY;

    if (!petfinderApiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Petfinder API key is missing.' }),
      };
    }

    const response = await fetch('https://api.petfinder.com/v2/types', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${petfinderApiKey}`,
      },
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
