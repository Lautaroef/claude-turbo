import type {
  AuthTokens,
  Category,
  LoginCredentials,
  Note,
  RegisterCredentials,
  User,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

class ApiClient {
  private accessToken: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("access_token");
    }
  }

  setTokens(tokens: AuthTokens) {
    this.accessToken = tokens.access;
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", tokens.access);
      localStorage.setItem("refresh_token", tokens.refresh);
    }
  }

  clearTokens() {
    this.accessToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken =
      typeof window !== "undefined"
        ? localStorage.getItem("refresh_token")
        : null;

    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_URL}/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.accessToken = data.access;
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", data.access);
        }
        return true;
      }
    } catch {
      // Refresh failed
    }

    this.clearTokens();
    return false;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.accessToken) {
      (headers as Record<string, string>)["Authorization"] =
        `Bearer ${this.accessToken}`;
    }

    let response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // If unauthorized, try to refresh token
    if (response.status === 401 && this.accessToken) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        (headers as Record<string, string>)["Authorization"] =
          `Bearer ${this.accessToken}`;
        response = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          headers,
        });
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw error;
    }

    // Handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  }

  // Auth endpoints
  async login(
    credentials: LoginCredentials
  ): Promise<{ access: string; refresh: string }> {
    const data = await this.request<AuthTokens>("/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    this.setTokens(data);
    return data;
  }

  async register(
    credentials: RegisterCredentials
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const data = await this.request<{ user: User; tokens: AuthTokens }>(
      "/auth/register/",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    );
    this.setTokens(data.tokens);
    return data;
  }

  async getMe(): Promise<User> {
    return this.request<User>("/auth/me/");
  }

  logout() {
    this.clearTokens();
  }

  // Categories endpoints
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>("/categories/");
  }

  async createCategory(
    data: Omit<Category, "id" | "notes_count" | "created_at">
  ): Promise<Category> {
    return this.request<Category>("/categories/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async seedDefaultCategories(): Promise<{
    message: string;
    created: Category[];
  }> {
    return this.request("/categories/seed_defaults/", {
      method: "POST",
    });
  }

  // Notes endpoints
  async getNotes(categoryId?: number): Promise<Note[]> {
    const params = categoryId ? `?category=${categoryId}` : "";
    const response = await this.request<{ results: Note[] } | Note[]>(`/notes/${params}`);
    // Handle both paginated and non-paginated responses
    if (Array.isArray(response)) {
      return response;
    }
    return response.results;
  }

  async getNote(id: number): Promise<Note> {
    return this.request<Note>(`/notes/${id}/`);
  }

  async createNote(
    data: Omit<Note, "id" | "category_name" | "category_color" | "created_at" | "updated_at">
  ): Promise<Note> {
    return this.request<Note>("/notes/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateNote(
    id: number,
    data: Partial<Omit<Note, "id" | "category_name" | "category_color" | "created_at" | "updated_at">>
  ): Promise<Note> {
    return this.request<Note>(`/notes/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteNote(id: number): Promise<void> {
    return this.request(`/notes/${id}/`, {
      method: "DELETE",
    });
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}

export const api = new ApiClient();
