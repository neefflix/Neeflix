// TMDb API Configuration
const TMDB_API_KEY = 'ef2e1b6c18d1484a485308b9899dadbc';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// Fetch Popular Movies for Homepage with Error Handling
async function fetchPopularMovies() {
    try {
        const response = await fetch(`${CORS_PROXY}${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`);
        if (!response.ok) {
            throw new Error('Failed to fetch popular movies: ' + response.statusText);
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        return []; // Return empty array in case of error
    }
}

// Render Movies on Homepage
async function renderMovies() {
    const movies = await fetchPopularMovies();
    const movieGrid = document.getElementById('movies');

    if (movies.length === 0) {
        movieGrid.innerHTML = '<p>Unable to fetch movies. Please try again later.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
        `;
        movieCard.addEventListener('click', () => {
            window.location.href = `details.html?id=${movie.id}`;
        });
        movieGrid.appendChild(movieCard);
    });
}

// Fetch Movie Details by ID (Used in details.html)
async function fetchMovieDetails(movieId) {
    try {
        const response = await fetch(`${CORS_PROXY}${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`);
        if (!response.ok) {
            throw new Error('Failed to fetch movie details: ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Fetch Similar Movies (Used in details.html)
async function fetchSimilarMovies(movieId) {
    try {
        const response = await fetch(`${CORS_PROXY}${TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`);
        if (!response.ok) {
            throw new Error('Failed to fetch similar movies: ' + response.statusText);
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching similar movies:', error);
    }
}

// Initialize Video Player with Vidsrc API (Replace with actual API)
function initializeVideoPlayer(movieId) {
    const player = videojs('movie-player', {
        sources: [{
            src: `https://vidsrc.me/embed/${movieId}`,
            type: 'video/mp4'
        }]
    });
}

// Auto-Scroll Similar Movies Slider
function autoScrollSlider() {
    const slider = document.getElementById('similar-slider');
    let scrollAmount = 0;
    setInterval(() => {
        scrollAmount += 200;
        if (scrollAmount >= slider.scrollWidth) scrollAmount = 0;
        slider.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }, 3000);
}

// On Details Page Load
if (window.location.pathname.includes('details.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    // Load Movie Details
    fetchMovieDetails(movieId).then(movie => {
        document.getElementById('movie-title').textContent = movie.title;
        document.getElementById('movie-overview').textContent = movie.overview;
        document.getElementById('movie-rating').textContent = `Rating: ${movie.vote_average}/10`;
        document.getElementById('movie-poster').src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    });

    // Load Similar Movies
    fetchSimilarMovies(movieId).then(movies => {
        const slider = document.getElementById('similar-slider');
        movies.forEach(movie => {
            const sliderItem = document.createElement('div');
            sliderItem.className = 'slider-item';
            sliderItem.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
                <h4>${movie.title}</h4>
            `;
            slider.appendChild(sliderItem);
        });
    });

    // Initialize Video Player
    initializeVideoPlayer(movieId);
    autoScrollSlider();
}

// On Homepage Load
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    renderMovies();
}
