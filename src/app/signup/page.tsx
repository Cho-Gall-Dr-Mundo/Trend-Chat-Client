import SignupForm from "@/components/signup/SignupForm";
import Image from "next/image";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-4">
      <Image
        src="/trendchat-logo.png"
        alt="Trend Chat Logo"
        width={250}
        height={250}
        className="mb-8"
        priority
      />
      <div className="w-full max-w-md bg-zinc-900 p-6 rounded-2xl shadow-xl border border-zinc-700">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">회원가입</h1>
        <SignupForm />
      </div>
    </div>
  );
}