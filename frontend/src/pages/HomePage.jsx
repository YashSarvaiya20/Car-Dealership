import HeroSection from '../components/HeroSection';
import FeaturedCategories from '../components/FeaturedCategories';
import WhyChooseUs from '../components/WhyChooseUs';
import FeaturedVehicles from '../components/FeaturedVehicles';
import Statistics from '../components/Statistics';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="flex-grow flex flex-col w-full bg-slate-950">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Featured Categories */}
      <FeaturedCategories />

      {/* 3. Why Choose Us */}
      <WhyChooseUs />

      {/* 4. Featured Vehicles */}
      <FeaturedVehicles />

      {/* 5. Statistics */}
      <Statistics />

      {/* 6. Testimonials */}
      <Testimonials />

      {/* 7. Call To Action */}
      <CallToAction />

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
