async function testCORS() {
  const res = await fetch("https://www.googleapis.com/books/v1/volumes?q=harry+potter", {
    method: "OPTIONS",
    headers: {
      "Origin": "http://localhost:3000",
      "Access-Control-Request-Method": "GET"
    }
  });
  console.log(res.headers.get("access-control-allow-origin"));
}
testCORS();
