class APIError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

try {
  throw new APIError("test", 429);
} catch (e: any) {
  console.log("status:", e.status);
  console.log("message:", e.message);
}
