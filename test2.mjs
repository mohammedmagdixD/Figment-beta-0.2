import fetch from 'node-fetch';
fetch('https://api.themoviedb.org/3/movie/undefined?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&append_to_response=credits,release_dates,watch/providers,videos')
  .then(res => {
    console.log(res.status);
    return res.json();
  })
  .then(console.log)
  .catch(console.error);
