"use client";

import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function UserNav() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <div className="flex items-center gap-6">
      {!isSignedIn ? (
        <SignInButton mode="modal">
          <button className="text-[11px] font-bold text-white/70 hover:text-[var(--accent-primary)] transition-colors uppercase tracking-[0.2em] cursor-pointer">
            Login
          </button>
        </SignInButton>
      ) : (
        <>
          <Link href="/portal" className="text-[11px] font-bold text-white/70 hover:text-[var(--accent-primary)] transition-colors uppercase tracking-[0.2em] hidden md:block cursor-pointer">
            Portal
          </Link>
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "h-8 w-8 rounded-full border-2 border-[var(--accent-primary)] p-0.5",
                userButtonPopoverCard: "rounded-lg border border-white/10 bg-[var(--background)]/90 backdrop-blur-xl shadow-2xl",
                userButtonPopoverActionButtonText: "font-sans text-[11px] uppercase tracking-widest text-white/70",
                userButtonPopoverFooter: "hidden"
              }
            }}
          />
        </>
      )}
    </div>
  );
}
