import setCounterOfTo from './movies-counter.js';

export default class MoviesListInterface {
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
    setCounterOfTo(this.counterSeen, howMany);
  }

  setAllCounter(howMany) {
    setCounterOfTo(this.counterAll, howMany);
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
