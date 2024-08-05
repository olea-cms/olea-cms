export class AuthenticationError extends Error {
  constructor(
    public httpCode: number,
    public message: string,
  ) {
    super(message);
  }
}
