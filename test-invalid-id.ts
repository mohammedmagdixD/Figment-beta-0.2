async function test() {
  const res = await fetch("https://www.googleapis.com/books/v1/volumes/OL12345W");
  console.log(res.status);
}
test();
