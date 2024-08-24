interface HttpErrorArgs {
  errorCode: number;
  httpCode: number;
  message: string;
}

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
}
