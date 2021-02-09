class MoviesListInterface {
  constructor(moviesCounterAllElement, moviesCounterSeenElement, moviesListElement) {
    this.counterAll = moviesCounterAllElement;
    this.counterSeen = moviesCounterSeenElement;
    this.moviesList = moviesListElement;

    this._ICON_PATH = 'assets/popcornIcon.png';
    this._CLASSNAME_MOVIE_RECORD = 'movieRecord';
    this._CLASSNAME_SEEN = 'movieWasSeen';
    this._CLASSNAME_ICON = 'isSeenIcon';
    this._WAS_SEEN_DATA_TAG = 'T';
  }

  setSeenOrUnseen(element, setToSeen) {
    if (setToSeen) {
      element.classList.add(this._CLASSNAME_SEEN);
    } else {
      element.classList.remove(this._CLASSNAME_SEEN);
    }
  }

  setMovieElementToSeenByIndex(elementIndex) {
    this.setSeenOrUnseen(this.moviesList.children[elementIndex], 1);
  }

  setMovieElementToUnseenByIndex(elementIndex) {
    this.setSeenOrUnseen(this.moviesList.children[elementIndex], 0);
  }

  setSeenCounter(howMany) {
    this.counterSeen.innerText = howMany;
  }

  setAllCounter(howMany) {
    this.counterAll.innerText = howMany;
  }

  _createElementList(id, html, seen, { callback, context }) {
    const iconElement = document.createElement('img');
    iconElement.src = this._ICON_PATH;
    iconElement.classList.add(this._CLASSNAME_ICON);
    iconElement.addEventListener('click', (event) => {
      callback.call(context, id, event);
    });

    const movieTextElement = document.createElement('span');
    movieTextElement.innerHTML = html;

    const elementList = document.createElement('li');
    elementList.classList.add(this._CLASSNAME_MOVIE_RECORD);
    elementList.appendChild(iconElement);
    elementList.appendChild(movieTextElement);

    this.moviesList.appendChild(elementList);

    const movieWasSeen = seen.toUpperCase() === this._WAS_SEEN_DATA_TAG ? true : false;
    if (movieWasSeen) this.setMovieElementToSeenByIndex(this.moviesList.childElementCount - 1);
  }

  addMovieToList({ id, title, year, genre, summary, seen }, clickCallback) {
    const movieText = `„${title}“ - a ${genre} from ${year}.<br>Sumary: ${summary}`;

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
    if (movieData.seen.toUpperCase() === 'T') countedSeen += 1;
  });

  return { countedAll, countedSeen };
}

function movieClickAction(
  moviesInterface,
  moviesDataObject,
  moviesSeenCounter,
  listElement,
  clickedMovieId,
) {
  const movieObjectIndex = moviesDataObject.findIndex((x) => x.id == clickedMovieId);
  const selectedMovieObject = moviesDataObject[movieObjectIndex];

  if (selectedMovieObject.seen.toUpperCase() === 'T') {
    selectedMovieObject.seen = 'F';
    moviesInterface.setSeenCounter(moviesSeenCounter.down().currentCount);
    moviesInterface.setSeenOrUnseen(listElement, 0);
  } else {
    selectedMovieObject.seen = 'T';
    moviesInterface.setSeenCounter(moviesSeenCounter.up().currentCount);
    moviesInterface.setSeenOrUnseen(listElement, 1);
  }
}

const cookie = {
  set: (cname, cvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = `${expires}=${d.toGMTString()}`;
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
  },
  get: (cname) => {
    var name = `${cname}=`;
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return undefined;
  },
};

function getOrSetMovieData(moviesData, forceSave = false) {
  const MOVIE_DATA_COOKIE_NAME = 'user-movie-data';
  const userMovieData = cookie.get(MOVIE_DATA_COOKIE_NAME);
  if (userMovieData === undefined || forceSave) {
    cookie.set(MOVIE_DATA_COOKIE_NAME, moviesData, 5 * 360);
    return getOrSetMovieData(moviesData);
  }

  return userMovieData;
}

window.addEventListener('DOMContentLoaded', () => {
  const moviesCounterAllElement = document.getElementById('moviesCounterAll');
  const moviesCounterSeenElement = document.getElementById('moviesCounterSeen');
  const moviesListElement = document.getElementById('moviesList');

  const moviesSeenCounter = new SimpleCounter();

  const moviesInterface = new MoviesListInterface(
    moviesCounterAllElement,
    moviesCounterSeenElement,
    moviesListElement,
  );

  const moviesDataObject = JSON.parse(getOrSetMovieData(moviesData));

  let { countedAll, countedSeen } = countMovies(moviesDataObject);
  moviesSeenCounter.currentCount = countedSeen;
  moviesInterface.setSeenCounter(countedSeen);
  moviesInterface.setAllCounter(countedAll);

  moviesDataObject.forEach((movieData) => {
    moviesInterface.addMovieToList(movieData, {
      callback: (clickedMovieId, event) => {
        const listElement = event.composedPath()[1];

        movieClickAction(
          moviesInterface,
          moviesDataObject,
          moviesSeenCounter,
          listElement,
          clickedMovieId,
        );

        // Used to show that the content of "moviesData" is changing
        getOrSetMovieData(JSON.stringify(moviesDataObject), true);
      },
      context: this,
    });
  });
});
