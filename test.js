const fetch = require('node-fetch');
fetch('https://api.themoviedb.org/3/movie/550?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&append_to_response=credits,release_dates,watch/providers,videos')
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
