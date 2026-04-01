import fetch from 'node-fetch';
fetch('https://api.themoviedb.org/3/movie/movie 123?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb', {
  headers: {
    'Origin': 'http://localhost:3000'
  }
})
  .then(res => {
    console.log(res.status);
    console.log(res.headers.raw());
  })
  .catch(console.error);
