
export const AUTH_RATE_LIMITS = {
  register: {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  },

  login: {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  },

  refresh: {
    limit: 30,
    windowMs: 60 * 1000,
  },
};
