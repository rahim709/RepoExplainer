"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import api from "@/lib/axios"; 
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner"; 

const loginSchema = z.object({
  identifier: z.string().min(3, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      await api.post("/api/user/login", {
        email: data.identifier,
        password: data.password,
      });

      localStorage.setItem("fullName", data.identifier);
      
      // Success Message
      toast.success("Welcome back!");
      
      // Delay for 2 seconds to let user read the success message
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      router.push("/chat");

    } catch (error: any) {
      console.log("Full Error Object:", error); // Debugging helper

      // --- LOGIC TO EXTRACT BACKEND MESSAGE ---
      // 1. Check if the server sent a response with data
      // 2. Access .message because your backend sends json({ message: "..." })
      const backendErrorMessage = error.response?.data?.message;

      // 3. Fallback to generic error if backend didn't send a message
      const displayMessage = backendErrorMessage || "Something went wrong. Please try again.";
      
      toast.error(displayMessage);
      
      setIsLoading(false); // Enable button again so they can retry
    }
  };

  return (
    <div className="w-full max-w-[480px] animate-in fade-in zoom-in duration-500 relative">
      
      <Toaster position="top-center" richColors theme="dark" />

      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="text-[#8b949e] text-lg">Enter your details to sign in</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#c9d1d9] ml-1">Email</label>
            <input
              {...register("identifier")}
              placeholder="octocat@gmail.com"
              className={`w-full px-4 py-3 bg-[#0d1117] text-white border rounded-xl outline-none transition-all focus:ring-4 focus:ring-[#1f6feb]/20 focus:border-[#1f6feb] placeholder:text-gray-700 ${
                errors.identifier ? "border-[#f85149]" : "border-[#30363d]"
              }`}
            />
            {errors.identifier && <p className="text-xs text-[#f85149] font-medium mt-1 ml-1">{errors.identifier.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="block text-sm font-semibold text-[#c9d1d9]">Password</label>
            </div>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className={`w-full px-4 py-3 bg-[#0d1117] text-white border rounded-xl outline-none transition-all focus:ring-4 focus:ring-[#1f6feb]/20 focus:border-[#1f6feb] placeholder:text-gray-700 ${
                errors.password ? "border-[#f85149]" : "border-[#30363d]"
              }`}
            />
            {errors.password && <p className="text-xs text-[#f85149] font-medium mt-1 ml-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex cursor-pointer items-center justify-center gap-2 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(35,134,54,0.3)] active:scale-[0.99] text-lg mt-2"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Sign In"}
          </button>
        </form>
      </div>

      <p className="mt-8 text-center text-[#8b949e] text-md">
        New here? <Link href="/auth/register" className="text-[#58a6ff] hover:underline font-bold transition-all">Create an account</Link>
      </p>
    </div>
  );
}