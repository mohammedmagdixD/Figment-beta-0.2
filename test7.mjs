import fetch from 'node-fetch';
fetch('https://api.themoviedb.org/3/movie/550?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&append_to_response=credits,release_dates,watch%2Fproviders,videos', {
  headers: {
    'Origin': 'http://localhost:3000'
  }
})
  .then(res => {
    console.log(res.status);
    return res.json();
  })
  .then(data => console.log(Object.keys(data)))
  .catch(console.error);
