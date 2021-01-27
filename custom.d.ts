declare namespace Express {
  export interface Request {
    payload?: {
      aud?: string;
    };
  }
}
