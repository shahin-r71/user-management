// src/app/(auth)/register/page.tsx
import { RegisterForm } from "@/components/auth/RegistrationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | User Management",
  description: "Create a new account",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
