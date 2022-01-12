const API_BASE = "http://localhost:8000/api/v1";
const categories_div = document.getElementById("categories");
//Add Arrow from carroussel at the right place
let nbr_of_row = 0;

const categories = [
  {
    id: "best_movie",
    title: "Meilleur film",
    query: "sort_by=-imdb_score",
    start: 0,
    end: 1,
  },

  {
    id: "best_rated",
    title: "Les mieux notés",
    query: "sort_by=-imdb_score",
    start: 1,
    end: 8,
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
  categories_div.appendChild(row);
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
  next.style.top = banner.offsetHeight + 85 + new_gap + 338 / 2 + "px";
  prev.style.top = banner.offsetHeight + 85 + new_gap + 338 / 2 + "px";

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

const displayMovieInformations = async (id) => {
  movie = await getMoviesInfos(id);
  content = generateContenteModalBody(movie);
  generateModal(content, movie.title);
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
  banner.addEventListener("click", (e) => {
    displayMovieInformations(movie.id);
  });

};

const generateModal = (content, title) => {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const span = document.createElement("span");
  span.classList.add("modal-backdrop");
  span.classList.add("close-modal");
  modal.append(span);

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modal.append(modalContent);

  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");
  modalContent.append(modalHeader);

  const modalTitle = document.createElement("h2");
  modalTitle.classList.add("modal-title");
  modalTitle.innerHTML = title;
  modalHeader.append(modalTitle);

  const closeModal = document.createElement("button");
  closeModal.classList.add("close-modal");
  closeModal.innerHTML = "&times";
  modalHeader.append(closeModal);

  const modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");
  modalBody.innerHTML = content;
  modalContent.append(modalBody);

  const modalFooter = document.createElement("div");
  modalFooter.classList.add("modal-footer");
  modalContent.append(modalFooter);

  const OkButton = document.createElement("button");
  OkButton.classList.add("close-modal");
  OkButton.innerHTML = "Close";
  modalFooter.append(OkButton);

  closeModal.addEventListener("click", (e) => {
    modal.classList.remove("visible");
  });

  OkButton.addEventListener("click", (e) => {
    modal.classList.remove("visible");
  });

  categories_div.append(modal);
  modal.classList.add("visible");
};

const generateContenteModalBody = (movie) => {
  html = `
  <div class="content-modal-body">
    <div class="content-modal-body-poster">
      <img src="${movie.image_url}" /><div>`;
  console.log(movie);
  movie.genres.map((genre) => {
    html += `<span class="content-modal-body-badge">${genre}</span>`;
  });

  html += `
    </div>
    </div>
    <div class="content-modal-description">
      <div class="date-and-real">
        <div>
          <span class="content-modal-body-badge">${movie.date_published} | </span>
          <span><i>Realised by : ${movie.directors[0]}</i> | </span>
          <span> ${movie.countries[0]} </span>
          </div>
        <span class="content-modal-body-badge big">Jury : ${movie.imdb_score}</span>
        <span class="content-modal-body-badge big-under">User : ${movie.avg_vote}</span>
      </div>
      <div> 
        <span class="content-modal-body-badge">${movie.duration} min |</span>`;
  if (movie.worldwide_gross_income == null) {
    html += `
          <span> Budget information not avaible </span>
          `;
  } else {
    html += `<span>${numberWithSpace(movie.worldwide_gross_income)} $ </span>`;
  }

  if (movie.long_description.length < 600 ) {
    html += `</div>
        <hr />
          <p>${movie.long_description}</p>`; 
  } else {
    html += `</div>
        <hr />
          <p>${(movie.long_description).substring(0,600)} [...]</p>`;
  }

    html += `<div class="content-actors">
        `;
  compteur = 0;
  elementNumber = 8;
  columnNumber = Math.ceil(movie.actors.length / elementNumber);
  for (i = 1; i <= columnNumber; i++) {
    html += '<div class="column-actors">';
    for (j = compteur; j < elementNumber * i; j++) {
      if (movie.actors[j] === undefined) {
        break;
      }
      html += `<li>
              ${movie.actors[j]}
              </li>`;
      compteur++;
    }
    html += "</div>";
  }

  html += "</div></div></div>";

  return html;
};

generateHTMLCategory(categories[1]).then(() => {
  for (i = 2; i < categories.length; i++) {
    generateHTMLCategory(categories[i]);
  }
});
generateBanner(categories[0]);

function numberWithSpace(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
