import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { TrackingManager } from "@/components/TrackingManager";
import { TrackingPlaceholders } from "@/components/TrackingPlaceholders";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TrackingPlaceholders />
      <TrackingManager />
      <Header />
      <main>{children}</main>
      <Footer />
      <CookieBanner />
      <StickyMobileCTA />
    </>
  );
}
