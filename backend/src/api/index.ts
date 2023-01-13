export function wrapResponse<T>(data: T, success = true, message = '') {
  return {
    success,
    message,
    data,
  };
}
