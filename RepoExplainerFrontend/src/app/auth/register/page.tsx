"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import api from "@/lib/axios"; 
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner"; // 1. Import Toaster

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is too short"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Security requirement: 8+ characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);

    try {
      // 1. REGISTER CALL
      await api.post("/api/user/register", {
        userName: data.fullName, // Logic: maps fullName to userName expected by backend
        email: data.email,
        password: data.password,
      });

      // 2. AUTO-LOGIN CALL
      await api.post("/api/user/login", {
        email: data.email,
        password: data.password,
      });

      // 3. Save Name for UI
      localStorage.setItem("fullName", data.fullName);

      // 4. Success Toast
      toast.success("Account created! Redirecting...");

      // 5. UX Delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 6. Redirect
      router.push("/chat");

    } catch (error: any) {
      console.error("Full Registration Error:", error);

      // --- LOGIC TO HANDLE BACKEND RESPONSE ---
      // Your backend returns: res.status(X).json({ message: '...' })
      // So we look for error.response.data.message
      
      const backendMessage = error.response?.data?.message;
      
      // Fallback text if the server crashes completely without JSON
      const displayMessage = backendMessage || "Registration failed. Please try again.";

      toast.error(displayMessage);
      
      setIsLoading(false); // Re-enable button
    }
  };

  return (
    <div className="w-full max-w-[480px] animate-in slide-in-from-bottom-8 fade-in duration-700 relative">
      
      {/* --- CRITICAL: Add Toaster for Pop-ups --- */}
      <Toaster position="top-center" richColors theme="dark" />

      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Join the community</h1>
          <p className="text-[#8b949e] text-lg">Start exploring codebases with AI.</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="group">
            <label className="block text-sm font-bold mb-2 text-[#c9d1d9] group-focus-within:text-[#58a6ff] transition-colors ml-1 uppercase tracking-tighter">Full Name</label>
            <input 
              {...register("fullName")}
              placeholder="Abdur Rahim"
              className={`w-full px-4 py-3 bg-[#0d1117] text-white border rounded-xl outline-none transition-all focus:ring-4 focus:ring-[#1f6feb]/20 focus:border-[#1f6feb] placeholder:text-gray-700 ${
                errors.fullName ? "border-[#f85149]" : "border-[#30363d]"
              }`}
            />
            {errors.fullName && <p className="mt-2 text-xs text-[#f85149] font-medium ml-1">{errors.fullName.message}</p>}
          </div>

          <div className="group">
            <label className="block text-sm font-bold mb-2 text-[#c9d1d9] group-focus-within:text-[#58a6ff] transition-colors ml-1 uppercase tracking-tighter">Email</label>
            <input 
              {...register("email")}
              placeholder="name@example.com"
              className={`w-full px-4 py-3 bg-[#0d1117] text-white border rounded-xl outline-none transition-all focus:ring-4 focus:ring-[#1f6feb]/20 focus:border-[#1f6feb] placeholder:text-gray-700 ${
                errors.email ? "border-[#f85149]" : "border-[#30363d]"
              }`}
            />
            {errors.email && <p className="mt-2 text-xs text-[#f85149] font-medium ml-1">{errors.email.message}</p>}
          </div>

          <div className="group">
            <label className="block text-sm font-bold mb-2 text-[#c9d1d9] group-focus-within:text-[#58a6ff] transition-colors ml-1 uppercase tracking-tighter">Password</label>
            <input 
              {...register("password")}
              type="password" 
              placeholder="Create a strong password"
              className={`w-full px-4 py-3 bg-[#0d1117] text-white border rounded-xl outline-none transition-all focus:ring-4 focus:ring-[#1f6feb]/20 focus:border-[#1f6feb] placeholder:text-gray-700 ${
                errors.password ? "border-[#f85149]" : "border-[#30363d]"
              }`}
            />
            {errors.password && <p className="mt-2 text-xs text-[#f85149] font-medium ml-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer flex items-center justify-center gap-2 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white font-extrabold py-4 rounded-xl transition-all active:scale-[0.99] text-lg shadow-[0_10px_20px_rgba(35,134,54,0.2)]"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Create Account"}
          </button>
        </form>
      </div>

      <p className="mt-8 text-center text-[#8b949e] text-md">
        Already an explorer? <Link href="/auth/login" className="text-[#58a6ff] hover:underline font-bold transition-all">Sign in here</Link>
      </p>
    </div>
  );
}