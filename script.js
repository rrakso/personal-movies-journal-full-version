class MoviesListInterface {
  constructor(moviesCounterAllElement, moviesCounterSeenElement, moviesListElement) {
    this.counterAll = moviesCounterAllElement;
    this.counterSeen = moviesCounterSeenElement;
    this.moviesList = moviesListElement;

    this._ICON_PATH = 'assets/popcornIcon.png';
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
      alert(html);
    });

    const button = document.createElement('button');
    button.innerText = 'Seen this';
    button.addEventListener('click', (event) => {
      try {
        callback.call(context, id, event);
        alert(html);
      } catch (error) {
        alert(error);
      }
    });

    const movieTextElement = document.createElement('span');
    movieTextElement.innerHTML = html;

    const elementList = document.createElement('li');
    elementList.appendChild(button);
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

  const moviesDataObject = JSON.parse(moviesData);

  let { countedAll, countedSeen } = countMovies(moviesDataObject);
  moviesSeenCounter.currentCount = countedSeen;
  moviesInterface.setSeenCounter(countedSeen);
  moviesInterface.setAllCounter(countedAll);

  moviesDataObject.forEach((movieData) => {
    moviesInterface.addMovieToList(movieData, {
      callback: (clickedMovieId, event) => {
        alert(JSON.stringify(event));
        const listElement = event.path[1];
        movieClickAction(
          moviesInterface,
          moviesDataObject,
          moviesSeenCounter,
          listElement,
          clickedMovieId,
        );

        console.log(JSON.stringify(moviesDataObject));
      },
      context: this,
    });
  });
});
