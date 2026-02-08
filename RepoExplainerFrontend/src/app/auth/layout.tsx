import { Navbar } from "../components/Navbar"; // Ensure this matches your file tree

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col font-[family-name:var(--font-geist-sans)]">
      {/* Navbar stays here so it applies to Login AND Register */}
      <Navbar />
      
      {/* Centered main content area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 pt-20 pb-12">
        <div className="mb-8">
          <div className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-700">
            <img src="/Octo-Icon.svg" alt="RepoExplainer" className="w-14 h-14" />
            <h2 className="text-3xl font-bold text-white tracking-tighter">RepoExplainer</h2>
          </div>
        </div>
        
        {/* Child pages (login/register) render here */}
        {children}
      </main>
    </div>
  );
}