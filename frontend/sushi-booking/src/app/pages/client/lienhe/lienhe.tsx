import ContactHero from "../../../components/ContactPage/ContactHero";
import ContactInfo from "../../../components/ContactPage/ContactInfo";
import ContactMap from "../../../components/ContactPage/ContactMap";
import ContactFAQ from "../../../components/ContactPage/ContactFAQ";
import ContactTestimonials from "../../../components/ContactPage/ContactTestimonials";

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactInfo />
      <ContactFAQ />
      <ContactTestimonials />
      <ContactMap />
    </main>
  );
}
