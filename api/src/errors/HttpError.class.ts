// TODO (Valle) -> should this be typed to enforce using the errors object?
interface HttpErrorArgs {
  errorCode: number;
  httpCode: number;
  message: string;
}

// TODO (Valle) -> add a way to provide a function that returns a string as the message
// and if this is the case, the constructor should accept arguments for message formatting.
// I.e. (id) => `The product with ID ${id} was not found`
export class HttpError extends Error {
  public errorCode: number;
  public httpCode: number;
  public message: string;

  constructor({ errorCode, httpCode, message }: HttpErrorArgs) {
    super(message);

    this.errorCode = errorCode;
    this.httpCode = httpCode;
    this.message = message;
  }

  // TODO (Valle) -> add a toString() method?
}
