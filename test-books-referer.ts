import fetch from 'node-fetch';

async function run() {
  const res = await fetch("http://localhost:3000/api/books/volumes?q=harry+potter", {
    headers: {
      'referer': 'https://ais-dev-j5q6iyjzzzuoqpbezmgfn6-606305190525.europe-west2.run.app/'
    }
  });
  console.log(res.status);
  console.log(await res.text());
}
run();
