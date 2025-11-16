import { Hero } from '../components/Hero';
import { SocialProof } from '../components/SocialProof';
import { Features } from '../components/Features';
import { PricingTiers } from '../components/PricingTiers';
import { Showcase } from '../components/Showcase';
import { Testimonials } from '../components/Testimonials';
import { LoyaltyProgram } from '../components/LoyaltyProgram';
import { LeadCapture } from '../components/LeadCapture';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <SocialProof />
      <Features />
      <PricingTiers />
      <Showcase />
      <Testimonials />
      <LoyaltyProgram />
      <LeadCapture />
    </div>
  );
};