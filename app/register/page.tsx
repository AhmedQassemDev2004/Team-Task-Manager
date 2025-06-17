"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import { registerSchema, RegisterFormValues } from "@/lib/validations/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Redirect to login page on successful registration
      router.push("/login?registered=true");
    } catch (error: any) {
      setError(error.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center px-4 overflow-hidden moving-grid-background">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-md p-8 border border-indigo-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-indigo-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-600 mt-2">Join our community</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-500 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-gray-700 text-sm font-medium"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <UserIcon className="h-5 w-5 text-indigo-500" />
                  </div>
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    {...form.register("username")}
                    className="pl-10 bg-white border-indigo-200 text-gray-800 placeholder:text-gray-400 focus:border-indigo-500"
                  />
                </div>
                {form.formState.errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-gray-700 text-sm font-medium"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MailIcon className="h-5 w-5 text-indigo-500" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    {...form.register("email")}
                    className="pl-10 bg-white border-indigo-200 text-gray-800 placeholder:text-gray-400 focus:border-indigo-500"
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-gray-700 text-sm font-medium"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LockIcon className="h-5 w-5 text-indigo-500" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...form.register("password")}
                    className="pl-10 pr-10 bg-white border-indigo-200 text-gray-800 placeholder:text-gray-400 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5 text-indigo-500" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-indigo-500" />
                    )}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-gray-700 text-sm font-medium"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LockIcon className="h-5 w-5 text-indigo-500" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...form.register("confirmPassword")}
                    className="pl-10 pr-10 bg-white border-indigo-200 text-gray-800 placeholder:text-gray-400 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="h-5 w-5 text-indigo-500" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-indigo-500" />
                    )}
                  </button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || form.formState.isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-all duration-300 hover:shadow-indigo-300/30 hover:shadow-lg"
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes moveGrid {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 50px 50px;
          } /* Controls how far the pattern moves */
        }

        .moving-grid-background {
          background-color:rgb(251, 251, 255); /* Light indigo background */
          background-image: radial-gradient(
            circle,
            rgba(0, 0, 0, 0.08) 2px,
            transparent 2.5px
          ); /* Increased dot size to 2px */
          background-size: 40px 40px; /* Increased background size */
          animation: moveGrid 5s linear infinite; /* Adjust time for speed (e.g., 10s for slower) */
        }
      `}</style>
    </div>
  );
}
