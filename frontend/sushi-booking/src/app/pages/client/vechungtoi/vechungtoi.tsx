import AboutHero from "../../../components/AboutPage/AboutHero";
import Introduction from "../../../components/AboutPage/Introduction";
import History from "../../../components/AboutPage/History";
import Philosophy from "../../../components/AboutPage/Philosophy";
import ChefTeam from "../../../components/AboutPage/ChefTeam";
import RestaurantGallery from "../../../components/AboutPage/RestaurantGallery";
import CoreValues from "../../../components/AboutPage/CoreValues";

export default function AboutUsPage() {
  return (
    <main className="text-[#594545]">
      <AboutHero />
      <Introduction />
      <History />
      <Philosophy />
      <ChefTeam />
      <RestaurantGallery />
      <CoreValues />
    </main>
  );
}
