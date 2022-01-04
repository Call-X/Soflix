const API_BASE = "http://localhost:8000/api/v1";
const categories_div = document.getElementById("categories");
//Add Arrow from carroussel at the right place
let nbr_of_row = 0;

const categories = [
  {
    id: "best_rated",
    title: "Les mieux notés",
    query: "sort_by=-imdb_score",
    start: 1,
    end: 8,
  },

  {
    id: "best_movie",
    title: "Meilleur film",
    query: "sort_by=-imdb_score",
    start: 0,
    end: 1,
  },
  
  {
    id: "fantasy",
    title: "Films fantastiques",
    query: "genre_contains=fantasy&sort_by=-imdb_score",
    start: 0,
    end: 7,
  },
  {
    id: "anime",
    title: "Films d'animation",
    query: "genre_contains=animation&sort_by=-imdb_score",
    start: 0,
    end: 7,
  },
  {
    id: "horror",
    title: "Films d'horreur",
    query: "genre_contains=horror&sort_by=-imdb_score",
    start: 0,
    end: 7,
  },
];

// Retrieve our movie results
const getMovies = async (query, start, end) => {
  let movies = [];
  let apiURL = `${API_BASE}/titles/?${query}`;
  while (movies.length < end - start && apiURL) {
    let response = await fetch(apiURL);
    let data = await response.json();
    movies.push(...data.results);
    apiURL = data.next;
  }

  return movies.slice(start, end);
};

// Retrieve our extra movie informations on click
const getMoviesInfos = async (movieID) => {
  const extraInfos = [];
  // const urlBase = "http://localhost:8000/api/v1/titles/";
  // alert(movieID);
  const url = `http://localhost:8000/api/v1/titles/${movieID}`;
  const response = await fetch(url);
  // alert(apiURL);
  const data = await response.json();
  console.log(data);
  return data;
};

const generateHTMLCategory = async (category) => {
  movies = await getMovies(category.query, category.start, category.end);
  
  // Create element for a categories
  // First, add the <div.row>
  const row = document.createElement("div");
  row.classList.add("row");

  // Create h2 title
  const h2 = document.createElement("h2");
  h2.classList.add("category_title");
  h2.appendChild(document.createTextNode(category.title));
  row.appendChild(h2);

  // Create <div.row__posters>
  const posters = document.createElement("div");
  posters.classList.add("row__posters");
  posters.id = "posters_" + category.id; 
  row.append(posters);

  // Add the loader
  //const loader =
   // '<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
  //posters.innerHTML = loader;

  // Create prev button
  const prev = document.createElement("button");
  prev.classList.add("prev");
  prev.id = "prev_" + category.id;
  const svgPrevHTMLcontent =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" > <path fill="none" d="M0 0h24v24H0V0z" /> <path d="M15.61 7.41L14.2 6l-6 6 6 6 1.41-1.41L11.03 12l4.58-4.59z" /> </svg>';
  prev.innerHTML = svgPrevHTMLcontent;
  row.append(prev);

  // Create next button
  const next = document.createElement("button");
  next.classList.add("next");
  next.id = "next_" + category.id;
  const svgNextHTMLcontent =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" > <path fill="none" d="M0 0h24v24H0V0z" /> <path d="M10.02 6L8.61 7.41 13.19 12l-4.58 4.59L10.02 18l6-6-6-6z" /> </svg>';
  next.innerHTML = svgNextHTMLcontent;
  row.append(next);

  categories_div.append(row);

  posters.innerHTML = "";

  movies.forEach((movie) => {
    const img = document.createElement("img");
    img.src = movie.image_url;
    img.alt = movie.title;
    img.classList.add("row__poster");
    img.classList.add("row__posterLarge");
    posters.append(img);

    img.addEventListener("click", (e) => {
      displayMovieInformations(movie.id);
    });
  });

  const banner = document.querySelector(".banner");
  const new_gap = 338 * nbr_of_row;
  next.style.top = banner.offsetHeight + new_gap + 338 / 2 + "px";
  prev.style.top = banner.offsetHeight + new_gap + 338 / 2 + "px";

  //Incrément le nombre de ligne de 1 vu qu'on va rajouter une catégorie entière
  nbr_of_row++;

  const gap = 18;
  let width = posters.firstElementChild.offsetWidth;
  next.addEventListener("click", (e) => {
    posters.scrollBy(width + gap, 0);
    if (posters.scrollWidth !== 0) {
      prev.style.display = "flex";
    }
    if (posters.scrollWidth / 2 - width - gap <= posters.scrollLeft + width) {
      next.style.display = "none";
    }
  });

  prev.addEventListener("click", (e) => {
    posters.scrollBy(-(width + gap), 0);
    if (posters.scrollLeft - width - gap <= 0) {
      prev.style.display = "none";
    }
    if (!posters.scrollWidth / 2 - width - gap <= posters.scrollLeft + width) {
      next.style.display = "flex";
    }
  });
};

const displayMovieInformations = (id) => {
  console.log("ça marche : " + id);
};

const generateBanner = async (category) => {
  //Fetch movies
  movies = await getMovies(category.query, category.start, category.end);
  movie = await getMoviesInfos(movies[0].id);
  const banner = document.getElementById("banner");
  const bannerTitle = document.getElementById("banner__title");
  const bannerDescription = document.getElementById("banner__description");
  banner.style.background = `url(${movie.image_url})`;
  banner.style.backgroundRepeat = "no-repeat";
  banner.style.backgroundSize = "contain";
  banner.style.backgroundPosition = "center";
  bannerTitle.innerText = movie.title;
  bannerDescription.innerText = movie.long_description;
};

categories.forEach((category) => {
  console.log(category.title)
  if (category.id !== "best_movie") {
    generateHTMLCategory(category);
    
  } else {
    generateBanner(category);
  }
});
