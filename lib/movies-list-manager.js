import { getCheckedRadioValue } from './utils.js';

export default class MoviesListManager {
  constructor(
    moviesStorage,
    movieTitleInput,
    movieYearInput,
    movieGenreInput,
    wasWatchedRadios,
    movieSummaryInput,
  ) {
    this.storage = moviesStorage;

    this.input = {
      title: movieTitleInput,
      year: movieYearInput,
      genre: movieGenreInput,
      watched: wasWatchedRadios,
      summary: movieSummaryInput,
    };

    this.genres = { 1: 'action', 2: 'biography', 3: 'crime', 4: 'drama', 5: 'western' };

    this.formErrors = [];
    this.movieObject = {};
  }

  checkIfThereIsTitle() {
    if (this.input.title.value.length > 2) return true;
    return false;
  }

  checkIfThereIsYear() {
    if (this.input.year.value > 1800) return true;
    return false;
  }

  checkIfThereIsGenre() {
    if (this.input.genre.selectedIndex !== 0) return true;
    return false;
  }

  checkIfWeDontHaveSuchMovieAlready() {
    const titleToSearch = this.input.title.value.trim();
    return this.storage.searchForMovieObjectIndexByMovieTitle(titleToSearch) > -1;
  }

  movieWasWatched() {
    switch (getCheckedRadioValue(this.input.watched)) {
      case 'notWatched':
        return 'F';

      case 'alreadyWatched':
        return 'T';
    }
  }

  clearAllInputs() {
    this.input.title.value = null;
    this.input.year.value = null;
    this.input.genre.selectedIndex = 0;
    this.input.summary.value = null;

    this.input.watched[0].checked = true;
  }

  validateForm() {
    this.formErrors = [];

    if (this.checkIfThereIsTitle()) {
      if (this.checkIfWeDontHaveSuchMovieAlready()) {
        this.formErrors.push('A movie with such title already exists on list');
      }
    } else {
      this.formErrors.push('Title of added movie is required');
    }

    if (!this.checkIfThereIsYear()) {
      this.formErrors.push('Entered movie year is invalid');
    }

    if (!this.checkIfThereIsGenre()) {
      this.formErrors.push('Genre of added movie is missing');
    }

    return !this.formErrors.length;
  }

  checkErrors() {
    if (!this.validateForm()) {
      let userString = 'This form has some errors:\n';
      this.formErrors.forEach((error) => {
        userString += `- ${error}\n`;
      });
      return userString;
    }
    return null;
  }

  generateMoviesListObject() {
    this.movieObject = {};
    this.movieObject.id = this.storage.getLastMovieId() + 1;
    this.movieObject.title = this.input.title.value;
    this.movieObject.year = this.input.year.value;
    this.movieObject.genre = this.genres[this.input.genre.selectedIndex];
    this.movieObject.seen = this.movieWasWatched();
    this.movieObject.summary = this.input.summary.value.trim();
    return this;
  }

  save() {
    this.storage.set(this.movieObject);
  }

  addMovieToTheList() {
    const formErrors = this.checkErrors();
    if (formErrors !== null) {
      alert(formErrors);
      return false;
    }

    this.generateMoviesListObject().save();
    this.clearAllInputs();
    return true;
  }
}
