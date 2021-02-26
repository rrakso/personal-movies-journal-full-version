import { countMovies, goLevelUpInTheTree } from './lib/utils.js';
import setCounterOfTo from './lib/movies-counter.js';

import MoviesStorage from './lib/movies-storage.js';
import MoviesListManager from './lib/movies-list-manager.js';

class UserInfoBar {
  constructor(userInfoBarElement) {
    this.infoBar = userInfoBarElement;
  }

  setText(textToSet) {
    this.infoBar.innerHTML = textToSet;
    return this;
  }

  showInfoMovieSaved() {
    this.setText('Movie was added to the list');
    return this;
  }

  clearAfter(seconds = 2) {
    setTimeout(() => {
      this.setText('&nbsp;');
    }, seconds * 1000);
    return this;
  }
}

function updateCounters(moviesStorage, counterAll, counterSeen) {
  const moviesDataObject = moviesStorage.get();
  const { countedAll, countedSeen } = countMovies(moviesDataObject);
  setCounterOfTo(counterAll, countedAll);
  setCounterOfTo(counterSeen, countedSeen);
}

window.addEventListener('DOMContentLoaded', () => {
  const counterAll = document.getElementById('anotherMoviesCounterAll');
  const counterSeen = document.getElementById('anotherMoviesCounterSeen');

  const movieTitleInput = document.getElementById('movieTitle');
  const movieYearInput = document.getElementById('movieYear');
  const movieGenreInput = document.getElementById('movieGenre');
  const movieWasWatched = document.getElementsByName('movieWasWatched');
  const movieSummaryInput = document.getElementById('movieSummary');
  const addMovieToListButton = document.getElementById('addMovieToList');
  const goToTheListButton = document.getElementById('goToTheList');

  const userInfoBar = document.getElementById('userInfoBar');
  const userInfo = new UserInfoBar(userInfoBar);

  const moviesStorage = new MoviesStorage();
  const moviesListManager = new MoviesListManager(
    moviesStorage,
    movieTitleInput,
    movieYearInput,
    movieGenreInput,
    movieWasWatched,
    movieSummaryInput,
  );

  updateCounters(moviesStorage, counterAll, counterSeen);

  addMovieToListButton.addEventListener('click', () => {
    if (moviesListManager.addMovieToTheList()) {
      updateCounters(moviesStorage, counterAll, counterSeen);
      userInfo.showInfoMovieSaved().clearAfter();
    }
  });

  goToTheListButton.addEventListener('click', goLevelUpInTheTree);
});
