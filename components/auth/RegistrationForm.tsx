"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { createClient } from "@/lib/utils/supabase/client";

import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/utils/validation";
// import { handleDatabaseError } from "@/lib/utils/errors";

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      description: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);

    try {
      // 1. Create auth user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Failed to create user account");
      }

      // 2. Create user in our database through API route
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          authId: authData.user.id,
          description: data.description,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        // If database insertion fails, we should clean up the auth user
        await supabase.auth.signOut();
        throw new Error(error.message || "Failed to register user");
      }

      toast.success("Registration successful");
      router.push("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      console.error("Registration error:", error);

      if (error instanceof Error) {
        if (error.message.includes("already in use")) {
          toast.error("Email address is already in use");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to register. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-indigo-100 p-3 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>  
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Create a new account</h2>
                    <p className="text-gray-600 mt-2">Start Your Journey</p>
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                        >
                        Name
                        </label>
                        <div className="mt-2">
                        <input
                            id="name"
                            type="text"
                            autoComplete="name"
                            className="block w-full rounded-md px-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                            {errors.name.message}
                            </p>
                        )}
                        </div>
                    </div>

                    <div>
                        <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                        >
                        Email address
                        </label>
                        <div className="mt-2">
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            className="block w-full rounded-md border-0 px-2 focus:outline-none py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                            {errors.email.message}
                            </p>
                        )}
                        </div>
                    </div>

                    <div>
                        <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                        >
                        Password
                        </label>
                        <div className="mt-2">
                        <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            className="block w-full rounded-md border-0 px-2 focus:outline-none py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                            {errors.password.message}
                            </p>
                        )}
                        </div>
                    </div>

                    <div>
                        <label
                        htmlFor="description"
                        className="block text-sm font-medium leading-6 text-gray-900"
                        >
                        Description (optional)
                        </label>
                        <div className="mt-2">
                        <textarea
                            id="description"
                            rows={3}
                            className="block w-full rounded-md border-0 px-2 focus:outline-none py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            {...register("description")}
                        />
                        </div>
                    </div>

                    <div>
                        <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full justify-center rounded-md cursor-pointer bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-none focus-visible:outline-indigo-600"
                        >
                        {isLoading ? "Creating account..." : "Register"}
                        </button>
                    </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                    >
                        Sign in here
                    </Link>
                    </p>
                </div>
            </div>
        </div>    
    );
}
