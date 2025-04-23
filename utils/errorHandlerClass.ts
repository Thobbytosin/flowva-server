class ErrorHandler extends Error {
  statusCode: Number;

  constructor(message: any, statusCode: Number) {
    super(message); // inherit this message from the error class
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
