"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import type { ApiError } from "@/types";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirm: "",
  });

  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        if (formData.password !== formData.password_confirm) {
          setError("Passwords don't match");
          setIsLoading(false);
          return;
        }
        await register({
          email: formData.email,
          password: formData.password,
          password_confirm: formData.password_confirm,
        });
      }
      router.push("/");
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.detail) {
        setError(apiError.detail);
      } else if (apiError.email) {
        setError(
          Array.isArray(apiError.email) ? apiError.email[0] : apiError.email
        );
      } else if (apiError.password) {
        setError(
          Array.isArray(apiError.password)
            ? apiError.password[0]
            : apiError.password
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
      <div className="w-full max-w-md">
        {/* Illustration */}
        <div className="flex justify-center mb-6">
          <Image
            src={isLogin ? "/cactus.png" : "/boba.png"}
            alt={isLogin ? "Cute cactus" : "Cute boba tea"}
            width={isLogin ? 95 : 188}
            height={isLogin ? 114 : 134}
            priority
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-heading)] text-center mb-8 font-heading">
          {isLogin ? "Yay, You're Back!" : "Yay, New Friend!"}
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <Input
            name="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            showPasswordToggle
            required
          />

          {!isLogin && (
            <Input
              name="password_confirm"
              type="password"
              placeholder="Confirm password"
              value={formData.password_confirm}
              onChange={handleChange}
              showPasswordToggle
              required
            />
          )}

          <Button
            type="submit"
            className="w-full h-[43px]"
            isLoading={isLoading}
          >
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>

        {/* Toggle link */}
        <p className="mt-4 text-center">
          <Link
            href={isLogin ? "/signup" : "/login"}
            className="text-sm text-[var(--text-accent)] underline hover:text-[var(--text-heading)] transition-colors"
          >
            {isLogin
              ? "Oops! I've never been here before"
              : "We're already friends!"}
          </Link>
        </p>
      </div>
    </div>
  );
}
