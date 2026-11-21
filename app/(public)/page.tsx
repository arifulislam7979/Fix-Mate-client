import Hero from "@/components/home/Hero";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import LatestService from "@/components/home/LatestService";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";

export default function Home() {
  return (
    <div>
      <Hero></Hero>
      <LatestService></LatestService>
      <HowItWorksSection></HowItWorksSection>
      <WhyChooseUsSection></WhyChooseUsSection>
    </div>
  );
}
