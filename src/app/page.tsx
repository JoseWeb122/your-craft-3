import { Hero } from "@/components/home/Hero";
import {
  BenefitStrip,
  Bestsellers,
  FeaturedStory,
  Inspiration,
  PrecisionFeature,
  ShopByNeed,
} from "@/components/home/Sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BenefitStrip />
      <FeaturedStory />
      <Bestsellers />
      <PrecisionFeature />
      <ShopByNeed />
      <Inspiration />
    </>
  );
}
