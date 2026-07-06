import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--background)] p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <div className="flex flex-col items-center mb-6">
            <span className="text-3xl font-[var(--font-display)] font-medium tracking-tight text-[var(--foreground)]">
              Sierra-Blu 
            </span>
            <span className="text-[10px] font-sans tracking-[0.5em] text-[#AEB4C6] uppercase -mt-1">
              Realty
            </span>
          </div>
          <span className="text-[10px] font-sans tracking-[0.4em] text-[#4E5872] uppercase block">
            Private Access / Secured Portal
          </span>
        </div>
        
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-[var(--accent-primary)] text-[var(--background)] hover:bg-[#00B4D8] text-[11px] font-sans font-bold uppercase tracking-[0.3em] rounded-none h-14 transition-all shadow-[0_10px_30px_rgba(0,229,255,0.1)]",
              card: "shadow-none border border-white/10 bg-[var(--surface)]/50 backdrop-blur-md rounded-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "rounded-none border-white/10 bg-transparent text-[10px] font-sans uppercase tracking-[0.2em] text-[var(--foreground)] hover:bg-white/5 transition-all",
              formFieldInput: "rounded-none border-white/10 bg-[var(--background)]/50 text-sm font-sans text-[var(--foreground)] focus:ring-1 ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] placeholder:text-[#4E5872]",
              footerActionLink: "text-[var(--accent-primary)] font-sans text-[11px] uppercase tracking-[0.2em] hover:text-[var(--foreground)] transition-colors",
              identityPreviewText: "font-sans text-[11px] uppercase text-[var(--foreground)]",
              identityPreviewEditButtonIcon: "text-[var(--accent-primary)]",
              formFieldLabel: "text-[10px] font-sans uppercase tracking-[0.2em] text-[#4E5872]",
              dividerText: "text-[10px] font-sans uppercase text-[#4E5872]",
              dividerLine: "bg-white/10",
            }
          }}
        />
      </div>
    </main>
  );
}
