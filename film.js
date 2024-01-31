const searchMovie = document.getElementById('search-movie');
const searchTime = document.getElementById('search-time');
const movieInfo = document.getElementById('movie-info');

async function loadMovies(searchType) {
    const url = `http://www.omdbapi.com/?s=${searchType}&page=1&apikey=896ecd8c`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(data.Search);
    if (data.Response == "True") {
        displayMovies(data.Search);
    }
}

searchMovie.addEventListener('input', function () {
    const searchType = searchMovie.value.trim();
    if (searchType.length > 0) {
        searchTime.classList.remove('hide-search');
        loadMovies(searchType);
    } else {
        searchTime.classList.add('hide-search');
    }
});

function displayMovies(movies) {
    searchTime.innerHTML = ``;
    if (movies) {
        movies.forEach(movie => {
            const thumbnailElement = document.createElement('div');
            thumbnailElement.dataset.id = movie.imdbID;
            thumbnailElement.classList.add('search-list-element');
            thumbnailElement.innerHTML = `
                    <div class="search-list-thumbnail">
                        <img src="${movie.Poster}" alt="${movie.Title}">
                    </div>
                    <div class="search-info">
                        <h3 class="movie-title">${movie.Title}</h3>
                        <p>${movie.Year}</p>
                    </div>
                </div>`;

            searchTime.appendChild(thumbnailElement);
        });
    }
    loadMovieDetails();
}

async function loadMovieDetails() {
    const searchListElement = searchTime.querySelectorAll('.search-list-element');
    searchListElement.forEach(movie => {
        movie.addEventListener('click', async () => {
            console.log(movie.dataset.id);
            searchTime.classList.add('hide-search');
            searchMovie.value = "";
            try {
                const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=896ecd8c`);
                
                if (!result.ok) {
                    throw new Error(`HTTP error! Status: ${result.status}`);
                }

                const responseText = await result.text();
                console.log('API Response Text:', responseText);

                const movieDetails = JSON.parse(responseText);
                console.log('Parsed Movie Details:', movieDetails);
                displayMovieDetails(movieDetails);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        });
    });
}


function displayMovieDetails(moviesList) {
    movieInfo.innerHTML =``;
    const moviesElement = document.createElement('div');
    moviesElement.innerHTML = `
        <div class="movie-poster">
            <img src="${moviesList.Poster}" alt="${moviesList.Title}">
        </div>
        <ul class="movie-info-li">
            <li class="movie-title"><b>Title:</b>${moviesList.Title}</li>
            <li class="movie-actor"><b>Actors:</b>${moviesList.Actors}</li>
            <li class="movie-writer"><b>Writer:</b>${moviesList.Writer}</li>
            <li class="movie-released"><b>Released:</b>${moviesList.Released}</li>
            <li class="movie-language"><b>Language:</b>${moviesList.Language}</li>
        </ul>`;
    movieInfo.appendChild(moviesElement);
}
