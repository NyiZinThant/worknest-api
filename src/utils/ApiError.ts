export default class ApiError extends Error {
  status: 'error';
  code: number;
  path: string;
  timestamp: Date;
  constructor(
    message: string,
    path: string,
    timestamp: Date,
    statusCode?: number
  ) {
    super(message);
    this.status = 'error';
    this.code = statusCode || 500;
    this.path = path;
    this.timestamp = timestamp;
  }
}
