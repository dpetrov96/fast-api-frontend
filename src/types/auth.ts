export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface AuthResponse {
  user: User;
  token: Token;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (credentials: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export interface DashboardData {
  message: string;
  user_id: string;
  features: string[];
}

export interface ProfileUpdate {
  full_name?: string;
}

export interface ChangePassword {
  current_password: string;
  new_password: string;
}

export interface ForgotPassword {
  email: string;
}

export interface ResetPassword {
  token: string;
  new_password: string;
}

export interface MessageResponse {
  message: string;
}