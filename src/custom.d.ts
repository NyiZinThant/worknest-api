declare namespace Express {
  interface Request {
    profile?: {
      id: string;
      type: 'user' | 'company';
    };
  }
}
