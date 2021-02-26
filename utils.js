function countMovies(moviesDataObject) {
  const countedAll = moviesDataObject.length;
  let countedSeen = 0;

  moviesDataObject.forEach((movieData) => {
    if (movieData.seen.toUpperCase() === 'T') countedSeen += 1;
  });

  return { countedAll, countedSeen };
}

function movieClickAction(
  moviesStorage,
  moviesInterface,
  moviesSeenCounter,
  listElement,
  clickedMovieId,
) {
  const selectedMovieObject = moviesStorage.get(clickedMovieId);

  if (selectedMovieObject.seen.toUpperCase() === 'T') {
    selectedMovieObject.seen = 'F';
    moviesInterface.setSeenCounter(moviesSeenCounter.down().currentCount);
    moviesInterface.setSeenOrUnseen(listElement, 0);
  } else {
    selectedMovieObject.seen = 'T';
    moviesInterface.setSeenCounter(moviesSeenCounter.up().currentCount);
    moviesInterface.setSeenOrUnseen(listElement, 1);
  }

  moviesStorage.set(clickedMovieId, selectedMovieObject);
}

export { countMovies, movieClickAction };
