// Turns a technical axios error into a message a normal person can read
export function getErrorMessage(error) {
  // No response at all: no internet, server unreachable, or timed out
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'The request took too long. Please check your connection and try again.';
    }
    return 'Cannot reach the server. Please check your internet connection and try again.';
  }

  // The server answered, but with an error
  if (error.response.status === 404) {
    return 'We could not find what you were looking for.';
  }
  if (error.response.status >= 500) {
    return 'The server is having problems. Please try again in a little while.';
  }
  return 'Something went wrong. Please try again.';
}