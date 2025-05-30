export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  // email_verified_at: string | null;
  image: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Auth {
  user: User;
  token: string;
}
