import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | User Management",
  description: "Login to access the user management dashboard",
};

export default function LoginPage() {
  return <LoginForm />;
}
