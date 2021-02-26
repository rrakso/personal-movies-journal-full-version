import moviesData from './initial-movies-data.js'; // Demo data

export default class MoviesStorage {
  constructor() {
    this.KEYNAME_MOVIES_DATA = 'userMoviesData';

    this.currentMoviesData = null;
    this.getMoviesDataFromStorage().initializeDemoData();
  }

  // This function will load all movies data from
  // web browser storage to local variable
  getMoviesDataFromStorage() {
    const localStorageRawData = localStorage[this.KEYNAME_MOVIES_DATA];
    try {
      this.currentMoviesData = JSON.parse(localStorageRawData);
    } catch {
      // Our localStorage movies data entry is empty or does not have any valid JSON string
    }

    return this;
  }

  // This function will save all contents from local variable into
  // web browser storage
  saveMoviesDataIntoStorage() {
    localStorage[this.KEYNAME_MOVIES_DATA] = JSON.stringify(this.currentMoviesData);

    return this;
  }

  // This function will "propagate" web browser storage with demo data
  initializeDemoData() {
    if (!Array.isArray(this.currentMoviesData)) {
      this.currentMoviesData = JSON.parse(moviesData);
      this.saveMoviesDataIntoStorage();
    }
  }

  // Returns the index of movie object in
  // movies array selected by movie ID
  searchForMovieObjectIndexByMovieId(id) {
    this.getMoviesDataFromStorage();

    return this.currentMoviesData.findIndex((x) => x.id == id);
  }

  get(id) {
    if (id === undefined) {
      // Returns all the movies
      return this.getMoviesDataFromStorage().currentMoviesData;
    } else {
      const movieObjectIndex = this.searchForMovieObjectIndexByMovieId(id);

      // Returns movie object selected by ID
      return this.currentMoviesData[movieObjectIndex];
    }
  }

  set(...args) {
    if (args.length === 1) {
      // Will add new movie to the list
      const data = args[0];
      this.currentMoviesData.push(data);
    } else {
      // Updates the movie selected by ID with new data
      const id = args[0];
      const data = args[1];
      const movieObjectIndex = this.searchForMovieObjectIndexByMovieId(id);
      this.currentMoviesData[movieObjectIndex] = data;
    }

    this.saveMoviesDataIntoStorage();

    return this;
  }

  // Will remove selected by ID movie from movies list
  remove(id) {
    const movieObjectIndex = this.searchForMovieObjectIndexByMovieId(id);
    this.currentMoviesData.splice(movieObjectIndex, 1);

    return this;
  }
}
