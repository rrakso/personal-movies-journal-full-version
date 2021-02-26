import MoviesStorage from './movies-storage.js';
import MoviesListInterface from './movies-list-interface.js';
import SimpleCounter from './simple-counter.js';
import { countMovies, movieClickAction } from './utils.js';

window.addEventListener('DOMContentLoaded', () => {
  const moviesCounterAllElement = document.getElementById('moviesCounterAll');
  const moviesCounterSeenElement = document.getElementById('moviesCounterSeen');
  const moviesListElement = document.getElementById('moviesList');

  const moviesStorage = new MoviesStorage();

  const moviesSeenCounter = new SimpleCounter();

  const moviesInterface = new MoviesListInterface(
    moviesCounterAllElement,
    moviesCounterSeenElement,
    moviesListElement,
  );

  const moviesDataObject = moviesStorage.get();

  let { countedAll, countedSeen } = countMovies(moviesDataObject);
  moviesSeenCounter.currentCount = countedSeen;
  moviesInterface.setSeenCounter(countedSeen);
  moviesInterface.setAllCounter(countedAll);

  moviesDataObject.forEach((movieData) => {
    moviesInterface.addMovieToList(movieData, {
      callback: (clickedMovieId, event) => {
        const listElement = event.composedPath()[1];

        movieClickAction(
          moviesStorage,
          moviesInterface,
          moviesSeenCounter,
          listElement,
          clickedMovieId,
        );
      },
      context: this,
    });
  });
});
