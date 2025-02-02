const fetch = require('node-fetch'); // Importing node-fetch for server-side requests

const TMDB_API_KEY = '405c12e739ace104234814bd5f4c3024';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

exports.handler = async (event, context) => {
    try {
        const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`);
        if (!response.ok) {
            throw new Error('Failed to fetch popular movies');
        }

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching movies', error: error.message })
        };
    }
};
