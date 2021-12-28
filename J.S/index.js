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
