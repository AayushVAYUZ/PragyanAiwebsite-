import ReadyToExplore from "./ReadyToExplore";
import ContactSection from "./ContactSection";

/**
 * Final CTA + contact as one continuous block (#contact): the closing question over the
 * horizon, then the contact details and form directly beneath it.
 */
export default function FinalContact() {
  return (
    <section id="contact" aria-labelledby="ready-to-explore-heading" className="relative">
      <ReadyToExplore />
      <ContactSection />
    </section>
  );
}
