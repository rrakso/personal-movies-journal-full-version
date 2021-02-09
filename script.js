class MoviesListInterface {
  constructor(
    moviesCounterAllElement,
    moviesCounterSeenElement,
    moviesListElement
  ) {
    this.counterAll = moviesCounterAllElement;
    this.counterSeen = moviesCounterSeenElement;
    this.moviesList = moviesListElement;
  }

  static setSeenOrUnseen(element, setToSeen) {
    if (setToSeen) {
      element.classList.add("movieWasSeen");
    } else {
      element.classList.remove("movieWasSeen");
    }
  }

  setMovieElementToSeenByIndex(elementIndex) {
    this.constructor.setSeenOrUnseen(this.moviesList.children[elementIndex], 1);
  }

  setMovieElementToUnseenByIndex(elementIndex) {
    this.constructor.setSeenOrUnseen(this.moviesList.children[elementIndex], 0);
  }

  setSeenCounter(howMany) {
    this.counterSeen.innerText = howMany;
  }

  setAllCounter(howMany) {
    this.counterAll.innerText = howMany;
  }

  _createElementList(id, text, seen, { callback, context }) {
    const iconElement = document.createElement("img");
    iconElement.src = "popcornIcon.png";
    iconElement.classList.add("isSeenIcon");
    iconElement.addEventListener("click", (event) => {
      callback.call(context, id, event);
    });

    const movieTextElement = document.createTextNode(text);

    const elementList = document.createElement("li");
    elementList.appendChild(iconElement);
    elementList.appendChild(movieTextElement);

    this.moviesList.appendChild(elementList);

    const movieWasSeen = seen.toUpperCase() === "T" ? true : false;
    if (movieWasSeen)
      this.setMovieElementToSeenByIndex(this.moviesList.childElementCount - 1);
  }

  addMovieToList({ id, title, year, genre, summary, seen }, clickCallback) {
    const movieText = `„${title}“ - a ${genre} from ${year}. Sumary: ${summary}`;

    this._createElementList(id, movieText, seen, clickCallback);
  }
}

class SimpleCounter {
  constructor() {
    this._currentCounter = 0;
  }

  get currentCount() {
    return this._currentCounter;
  }

  set currentCount(newCount) {
    this._currentCounter = newCount;
  }

  up(by = 1) {
    this._currentCounter += by;
    return this;
  }

  down(by = 1) {
    this._currentCounter -= by;
    return this;
  }
}

function countMovies(moviesDataObject) {
  const countedAll = moviesDataObject.length;
  let countedSeen = 0;

  moviesDataObject.forEach((movieData) => {
    if (movieData.seen.toUpperCase() === "T") countedSeen += 1;
  });

  return { countedAll, countedSeen };
}

function movieClickAction(
  moviesInterface,
  moviesDataObject,
  moviesSeenCounter,
  listElement,
  clickedMovieId
) {
  const movieObjectIndex = moviesDataObject.findIndex(
    (x) => x.id == clickedMovieId
  );
  const selectedMovieObject = moviesDataObject[movieObjectIndex];

  if (selectedMovieObject.seen.toUpperCase() === "T") {
    selectedMovieObject.seen = "F";
    moviesInterface.setSeenCounter(moviesSeenCounter.down().currentCount);
    MoviesListInterface.setSeenOrUnseen(listElement, 0);
  } else {
    selectedMovieObject.seen = "T";
    moviesInterface.setSeenCounter(moviesSeenCounter.up().currentCount);
    MoviesListInterface.setSeenOrUnseen(listElement, 1);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const moviesCounterAllElement = document.getElementById("moviesCounterAll");
  const moviesCounterSeenElement = document.getElementById("moviesCounterSeen");
  const moviesListElement = document.getElementById("moviesList");

  const moviesSeenCounter = new SimpleCounter();

  const moviesInterface = new MoviesListInterface(
    moviesCounterAllElement,
    moviesCounterSeenElement,
    moviesListElement
  );

  const moviesDataObject = JSON.parse(moviesData);

  let { countedAll, countedSeen } = countMovies(moviesDataObject);
  moviesSeenCounter.currentCount = countedSeen;
  moviesInterface.setSeenCounter(countedSeen);
  moviesInterface.setAllCounter(countedAll);

  moviesDataObject.forEach((movieData) => {
    moviesInterface.addMovieToList(movieData, {
      callback: (clickedMovieId, event) => {
        const listElement = event.path[1];
        movieClickAction(
          moviesInterface,
          moviesDataObject,
          moviesSeenCounter,
          listElement,
          clickedMovieId
        );

        console.log(JSON.stringify(moviesDataObject));
      },
      context: this,
    });
  });
});
