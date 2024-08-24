export const HTTP_ERR = {
  e400: {
    BadCredentials: {
      errorCode: 400001,
      httpCode: 400,
      message: 'Invalid credentials.',
    },
    ResourceConsumed: (name: string, value: string) => ({
      errorCode: 400002,
      httpCode: 400,
      message: `${name} with value ${value} has been used.`,
    }),
    ResourceExpired: (name: string, value: string) => ({
      errorCode: 400003,
      httpCode: 400,
      message: `${name} with value ${value} has expired.`,
    }),
    ParseError: (reason?: string) => {
      let message = 'Failed to parse data.';

      if (reason) {
        message += ` Reason(s): ${reason}`;
      }

      return {
        errorCode: 400004,
        httpCode: 400,
        message,
      };
    },
  },
  e401: {
    Unauthorized: {
      errorCode: 401001,
      httpCode: 401,
      message: 'Missing required authorization.',
    },
  },
  e404: {
    NotFound: (name: string, value: string) => ({
      errorCode: 404001,
      httpCode: 404,
      message: `${name} with value ${value} not found.`,
    }),
  },
  e500: {
    Unavailable: {
      errorCode: 500001,
      httpCode: 500,
      message: 'A service required is currently unavailable.',
    },
    ParseError: (reason?: string) => {
      let message = 'Failed to parse data.';

      if (reason) {
        message += ` Reason(s): ${reason}`;
      }

      return {
        errorCode: 500002,
        httpCode: 500,
        message,
      };
    },
  },
} as const;
