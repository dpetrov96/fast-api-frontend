export interface ApiError {
  detail: string;
  message?: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  status: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}