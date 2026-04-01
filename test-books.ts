async function test() {
  const res = await fetch("https://www.googleapis.com/books/v1/volumes?q=harry+potter&maxResults=15&printType=books&orderBy=relevance");
  console.log(res.status);
  const text = await res.text();
  console.log(text.substring(0, 500));
}
test();
