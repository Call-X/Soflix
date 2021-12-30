
const gap = 16;

const carousel = document.getElementById("carousel"),
  content = document.getElementById("content"),
  next = document.getElementById("next"),
  prev = document.getElementById("prev");


next.addEventListener("click", e => {
  carousel.scrollBy(width + gap, 0);
  if (carousel.scrollWidth !== 0) {
    prev.style.display = "flex";
  }

  if (content.scrollWidth - width - gap <= carousel.scrollLeft + width) {
    next.style.display = "none";
  }
});
prev.addEventListener("click", e => {
  carousel.scrollBy(-(width + gap), 0);
  if (carousel.scrollLeft - width - gap <= 0) {
    prev.style.display = "none";
  }
  if (!content.scrollWidth - width - gap <= carousel.scrollLeft + width) {
    next.style.display = "flex";
  }
});

let width = carousel.offsetWidth;
window.addEventListener("resize", e => (width = carousel.offsetWidth));

const carousel_trending = document.getElementById("carousel_trending"),
  content_trending = document.getElementById("content_trending"),
  next_trending = document.getElementById("next_trending"),
  prev_trending = document.getElementById("prev_trending");


next_trending.addEventListener("click", e => {
  carousel_trending.scrollBy(width + gap, 0);
  if (carousel_trending.scrollWidth !== 0) {
    prev_trending.style.display = "flex";
  }

  if (content_trending.scrollWidth - width - gap <= carousel_trending.scrollLeft + width) {
    next_trending.style.display = "none";
  }
});
prev_trending.addEventListener("click", e => {
  carousel_trending.scrollBy(-(width + gap), 0);
  if (carousel_trending.scrollLeft - width - gap <= 0) {
    prev_trending.style.display = "none";
  }
  if (!content_trending.scrollWidth - width - gap <= carousel_trending.scrollLeft + width) {
    next_trending.style.display = "flex";
  }
});

let width_trending = carousel_trending.offsetWidth_trending;
window.addEventListener("resize", e => (width_trending = carousel_trending.offsetWidth_trending));


const carousel_top_rated = document.getElementById("carousel_top_rated"),
  content_top_rated = document.getElementById("content_top_rated"),
  next_top_rated = document.getElementById("next_top_rated"),
  prev_top_rated = document.getElementById("prev_top_rated");


next_top_rated.addEventListener("click", e => {
  carousel_top_rated.scrollBy(width + gap, 0);
  if (carousel_top_rated.scrollWidth !== 0) {
    prev_top_rated.style.display = "flex";
  }

  if (content_top_rated.scrollWidth - width - gap <= carousel_top_rated.scrollLeft + width) {
    next_top_rated.style.display = "none";
  }
});
prev_top_rated.addEventListener("click", e => {
  carousel_top_rated.scrollBy(-(width + gap), 0);
  if (carousel_top_rated.scrollLeft - width - gap <= 0) {
    prev_top_rated.style.display = "none";
  }
  if (!content_top_rated.scrollWidth - width - gap <= carousel_top_rated.scrollLeft + width) {
    next_top_rated.style.display = "flex";
  }
});

let width_top_rated = carousel_top_rated.offsetWidth_top_rated;
window.addEventListener("resize", e => (width_top_rated = carousel_top_rated.offsetWidth_top_rated));


const searchInput = document.getElementById('search');
const results = document.getElementById('results');

let movies ;
let searchTerm = '';

// API REQUEST
const fetchMovies = async() => {
    movies = await fetch(
        'http://localhost:8000/api/v1/titles?genre_contains=fantasy').then(res => 
        res.json());
};

const showMovies = async() => {
    await fetchMovies();

    results.innerHTML = (
        movies
            .filters(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase() 
            ))
            .map(movie => (

                `
                  <li class="movie-item">
                    <img class="movie-flag" src="${movie.flag}" />
                    <h3 class="movie-title">${movie.title}</h3>
                    <div class="movie-info">
                        <h2 class="movie-category">${movie.category}
                    </div>    
                  </li>
                `


            )).join('')
    );
};
