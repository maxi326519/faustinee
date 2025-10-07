import { LoginForm } from "@/components/LoginForm";

export default function Login() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex flex-col justify-center w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
