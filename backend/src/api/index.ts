export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message: string;
};

export function wrapResponse<T>(data: T, success = true, message = ''): ApiResponse<T> {
  return {
    success,
    message,
    data,
  };
}
