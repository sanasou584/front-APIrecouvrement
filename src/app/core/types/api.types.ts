export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
  count?: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}