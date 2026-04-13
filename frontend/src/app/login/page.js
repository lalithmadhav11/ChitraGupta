'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    fetch('http://localhost:5000/api/auth/me', { credentials: 'include' })
      .then(res => {
        if (res.ok) router.replace('/dashboard');
      })
      .catch(() => {});
  }, [router]);

  return (
    <>
      <main className="min-h-screen flex flex-col md:flex-row bg-[#0f0f0f] font-inter text-onSurface antialiased">
        {/* Left Side: Abstract Geometric & Quote */}
        <section className="hidden md:flex md:w-1/2 geometric-bg flex-col justify-center items-center p-12 relative overflow-hidden">
          <div className="shape-circle w-96 h-96 -top-20 -left-20 border-[#C96442]/10"></div>
          <div className="shape-circle w-[500px] h-[500px] bottom-10 -right-40 opacity-20"></div>
          <div className="shape-line top-1/4 rotate-12"></div>
          <div className="shape-line top-2/3 -rotate-12 opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#C96442]/5 blur-3xl"></div>
          
          <div className="relative z-10 max-w-md text-center">
            <blockquote className="space-y-6">
               <p className="font-manrope text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-onSurface">
                   Knowledge is power. Organization is key.
               </p>
               <footer className="flex items-center justify-center gap-3">
                   <span className="h-[1px] w-8 bg-primary"></span>
                   <cite className="not-italic font-inter uppercase tracking-widest text-xs text-primary">ChitraGupta</cite>
               </footer>
            </blockquote>
          </div>
          
          <div className="absolute bottom-12 left-12 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-[10px] font-inter uppercase tracking-[0.2em] text-onSurfaceVariant/50">Academic Curator v2.0</span>
          </div>
        </section>

        {/* Right Side: Login Card */}
        <section className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-[#0f0f0f]">
          <div className="w-full max-w-[420px] space-y-10">
            {/* Branding & Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surfaceContainer border border-outlineVariant/10">
                 <div className="w-3 h-3 rounded-full bg-primary"></div>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-[#ebebeb] tracking-tight">Welcome back</h1>
                <p className="text-sm text-[#a0a0a0] font-inter">Sign in to your academic assistant</p>
              </div>
            </div>

            {/* Sign In Actions */}
            <div className="space-y-6">
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-outlineVariant/10"></div>
                <span className="flex-shrink mx-4 text-[10px] font-inter uppercase tracking-widest text-[#606060]">Continue with</span>
                <div className="flex-grow border-t border-outlineVariant/10"></div>
              </div>

              <a 
                href="http://localhost:5000/api/auth/google"
                className="w-full group flex items-center justify-center gap-3 px-6 py-4 bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl hover:bg-[#222222] transition-all duration-200 active:scale-[0.98]"
              >
                 <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                 </svg>
                 <span className="text-sm font-medium text-[#ebebeb]">Continue with Google</span>
              </a>
            </div>

            {/* Manual Login Fallback */}
            <div className="pt-4 text-center">
              <a href="#" className="text-xs text-onSurfaceVariant hover:text-primary transition-colors duration-200 underline underline-offset-4 decoration-outlineVariant/30">
                 Use institutional email instead
              </a>
            </div>

            {/* Bottom Disclosure */}
            <div className="pt-8 border-t border-outlineVariant/10">
               <p className="text-xs leading-relaxed text-[#606060] text-center max-w-[340px] mx-auto">
                   By signing in, you grant access to your Gmail and Google Classroom data. This allows Chitragupta to curate your academic materials and sync your assignments automatically.
               </p>
            </div>

            {/* Footer Links */}
            <footer className="flex items-center justify-center gap-6 pt-4">
              <a href="#" className="text-[10px] font-inter uppercase tracking-widest text-[#606060] hover:text-[#a0a0a0] transition-colors">Privacy</a>
              <span className="w-1 h-1 rounded-full bg-outlineVariant/30"></span>
              <a href="#" className="text-[10px] font-inter uppercase tracking-widest text-[#606060] hover:text-[#a0a0a0] transition-colors">Terms</a>
              <span className="w-1 h-1 rounded-full bg-outlineVariant/30"></span>
              <a href="#" className="text-[10px] font-inter uppercase tracking-widest text-[#606060] hover:text-[#a0a0a0] transition-colors">Support</a>
            </footer>
          </div>
        </section>
      </main>
      
      {/* Overlay Grain for Premium Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-50">
         <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
               <feTurbulence baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" type="fractalNoise"></feTurbulence>
            </filter>
            <rect filter="url(#noiseFilter)" height="100%" width="100%"></rect>
         </svg>
      </div>
    </>
  );
}
