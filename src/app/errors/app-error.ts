export default class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string, stack = "") {
    // calls the super (Error) constructor to initialize message property
    super(message);

    // initialize statusCode property of the AppError instance
    this.statusCode = statusCode;

    // if stack is provided
    if (stack) {
      this.stack = stack;
    } else {
      // using the captureStackTrace static method to capture the error stack trace
      // and set .stack property to the instance of the AppError class
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
