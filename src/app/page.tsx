import Image from "next/image";
import HeroSection from "../components/homepage/heroSection";
import UpcomingEventsSlider from "../components/homepage/upcomingEventSlider";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <UpcomingEventsSlider />
    </div>
  );
}
