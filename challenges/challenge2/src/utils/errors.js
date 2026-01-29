class TimeoutError extends Error {
  constructor(message = "timeout") {
    super(message);
    this.name = "TimeoutError";
  }
}

module.exports = { TimeoutError };
