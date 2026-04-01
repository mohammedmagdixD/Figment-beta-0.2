import fetch from 'node-fetch';

async function run() {
  const res = await fetch("https://www.googleapis.com/books/v1/volumes?q=harry+potter&key=BAD_KEY");
  console.log(res.status);
  console.log(await res.text());
}
run();
