import { FloatingNavbar } from "@/components/floating-navbar";
import {
  BackgroundDots,
  BackgroundGrid,
} from "@/components/ui/background-grid";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import ChronoSplitMain from "@/app/split/_components/ChronoSplitMain";

export default function SplitPage() {
  return (
    <SmoothScrollProvider>
      <BackgroundDots className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] frosted-glass-bg">
        {/* Floating Navbar */}
        <FloatingNavbar />
        <BackgroundGrid className="absolute inset-0">
          <p></p>
        </BackgroundGrid>

        {/* Layered Visual Effects - Full Page */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl" />
          <div className="absolute top-3/4 left-1/3 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-56 h-56 bg-cyan-500/6 rounded-full blur-2xl" />
        </div>

        {/* Main Content */}
        <div className="relative pt-16 sm:pt-20">
          <div className="relative z-10">
            {/* Import and render the comprehensive ChronoSplitMain component */}
            <ChronoSplitMain />
          </div>
        </div>
      </BackgroundDots>
    </SmoothScrollProvider>
  );
}
