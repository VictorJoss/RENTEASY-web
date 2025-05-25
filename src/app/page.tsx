import Header  from "@/components/home/Header";
import Hero  from "@/components/home/Hero";
import UserProfiles  from "@/components/home/UserProfiles";
import Features  from "@/components/home/Features";
import HowItWorks  from "@/components/home/HowItWorks";
import PropiedadesDestacadas from "@/components/home/PropiedadesDestacadas";
import MapaCobertura from "@/components/home/MapaCobertura";
import Testimonials  from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import CTA  from "@/components/home/CTA";
import Footer  from "@/components/home/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      <main className="pt-16">
        <Hero />
        <PropiedadesDestacadas />
       <UserProfiles />
        <HowItWorks />
        <Features />
        <MapaCobertura />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
