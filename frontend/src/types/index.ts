export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  notes_count: number;
  created_at: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  category: number | null;
  category_name: string | null;
  category_color: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}

export interface ApiError {
  detail?: string;
  [key: string]: string | string[] | undefined;
}
