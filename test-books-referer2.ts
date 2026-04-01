import fetch from 'node-fetch';

async function run() {
  const res = await fetch("http://localhost:3000/api/books/volumes?q=harry+potter");
  console.log(res.status);
  console.log(await res.text());
}
run();
