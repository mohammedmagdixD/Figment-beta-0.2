import fetch from 'node-fetch';
fetch('https://api.themoviedb.org/3/movie/550?api_key=invalid_key')
  .then(res => {
    console.log(res.status);
    console.log(res.headers.raw());
  })
  .catch(console.error);
