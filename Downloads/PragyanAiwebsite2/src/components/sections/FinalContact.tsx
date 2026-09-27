import Image from "next/image";
import ContactSection from "./ContactSection";

/**
 * The contact block (#contact): the details and enquiry form over the horizon that closes the
 * page, then the footer.
 */
export default function FinalContact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative isolate overflow-hidden">
      {/* Decorative horizon: full-bleed, scoped to this section */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image
          src="/images/ready-to-explore-horizon.jpg"
          alt=""
          fill
          quality={90}
          sizes="100vw"
          className="contact-horizon object-cover object-[60%_50%] lg:object-center"
        />
        <div className="contact-scrims absolute inset-0" />
      </div>
      <ContactSection />
    </section>
  );
}
