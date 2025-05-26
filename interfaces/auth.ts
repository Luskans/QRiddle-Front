export interface Auth {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  image: string;
}

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