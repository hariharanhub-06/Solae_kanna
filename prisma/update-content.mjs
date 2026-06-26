// One-off: replace the generic placeholder content with real Sri Sastha Solar
// content. Idempotent (upserts settings/blocks, rebuilds services). Run:
//   node --env-file=.env prisma/update-content.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const settings = {
  companyName: "Sri Sastha Solar",
  tagline: "Powering a Sustainable Future",
  logoUrl: "/logo.png",
  phone: "9176444114",
  phone2: "8838075327",
  phone3: "7904202501",
  whatsapp: "919176444114",
  email: "kamalakannan632004@gmail.com",
  address: "No-5105, Arimalam Road, Near Ram Theatre, Pudukkottai - 622003",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3924.767064747539!2d78.81020107503606!3d10.360500989764112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTDCsDIxJzM3LjgiTiA3OMKwNDgnNDYuMCJF!5e0!3m2!1sen!2sin!4v1782458276498!5m2!1sen!2sin",
  mapDirections: "https://goo.gl/maps/oohcWSZNpLTJgzoM8?g_st=aw",
  metaTitle:
    "Sri Sastha Solar — Solar Panels, EV Charging & Renewable Energy in Pudukkottai",
  metaDescription:
    "Sri Sastha Solar (Pudukkottai) installs on-grid, off-grid & hybrid rooftop solar, EV charging stations, solar water heaters, pumps, street lights, BESS and more — using WAAREE, EMMVEE & Adani panels. Free site survey & quote.",
};

const blocks = {
  "home.hero": {
    page: "home",
    label: "Hero — main banner",
    heading: "Power Your Home & Business with the Sun",
    subheading: "Complete Solar & Renewable Energy Solutions",
    body: "Sri Sastha Solar designs, installs and maintains high-efficiency solar power systems, EV charging and energy storage for homes, businesses and industries across Pudukkottai and Tamil Nadu. Free site survey and quote.",
    imageUrl: "/work/work-4.jpg",
  },
  "home.about": {
    page: "home",
    label: "Intro — about",
    heading: "A Leading Name in Clean, Reliable Solar",
    subheading: "About Sri Sastha Solar",
    body: "Sri Sastha Solar is a leading provider of innovative and sustainable energy solutions. We specialise in solar power systems, energy storage, EV charging infrastructure and other clean-energy products designed to meet the growing needs of homes, businesses, industries and communities. Our mission is to deliver high-quality, reliable and cost-effective solutions that drive a cleaner, greener and self-reliant future.",
    imageUrl: "/work/work-5.jpg",
  },
  "home.special": {
    page: "home",
    label: "What makes us special — heading",
    heading: "What Makes Us Special",
    subheading: "Why Sri Sastha Solar",
    body: "From your first enquiry to years of after-sales support, we handle everything — so you simply enjoy clean, cheaper power.",
    imageUrl: "",
  },
  "home.feature.1": { page: "home", label: "Value 1", heading: "Sustainable Solutions", subheading: "", body: "Clean, renewable energy systems engineered to cut bills and carbon for decades.", imageUrl: "" },
  "home.feature.2": { page: "home", label: "Value 2", heading: "Trust & Reliability", subheading: "", body: "High-quality products and dependable installations, backed by genuine after-sales service.", imageUrl: "" },
  "home.feature.3": { page: "home", label: "Value 3", heading: "Advanced Technology", subheading: "", body: "Latest panels, inverters, BESS and EV-charging tech for maximum generation and uptime.", imageUrl: "" },
  "home.feature.4": { page: "home", label: "Value 4", heading: "Expert Team", subheading: "", body: "Skilled engineers delivering customised, end-to-end solutions for every requirement.", imageUrl: "" },
  "home.process": { page: "home", label: "Process — heading", heading: "From Enquiry to Switch-On in 4 Steps", subheading: "How We Work", body: "", imageUrl: "" },
  "home.process.1": { page: "home", label: "Step 1", heading: "Enquiry & Site Survey", subheading: "", body: "Share your details and we assess your roof, shading and energy needs on-site.", imageUrl: "" },
  "home.process.2": { page: "home", label: "Step 2", heading: "Custom Design & Quote", subheading: "", body: "We design an optimal system and give a clear, transparent quote with savings estimates.", imageUrl: "" },
  "home.process.3": { page: "home", label: "Step 3", heading: "Professional Installation", subheading: "", body: "Our certified team installs your system safely and neatly, with quality components.", imageUrl: "" },
  "home.process.4": { page: "home", label: "Step 4", heading: "Switch On & Save", subheading: "", body: "We commission, set up monitoring and you start generating your own clean power.", imageUrl: "" },
  "home.cta": { page: "home", label: "CTA band", heading: "Ready to Switch to Solar?", subheading: "Get a free, no-obligation quote tailored to your roof, load and budget.", body: "", imageUrl: "" },

  "home.partners": { page: "home", label: "Panel partners — heading", heading: "Panels We Install", subheading: "Genuine Tier-1 Modules", body: "We build only with globally trusted, high-efficiency solar panels.", imageUrl: "" },
  "home.partner.1": { page: "home", label: "Panel partner 1 — logo", heading: "WAAREE", subheading: "", body: "", imageUrl: "/brands/waaree.jpg" },
  "home.partner.2": { page: "home", label: "Panel partner 2 — logo", heading: "EMMVEE", subheading: "", body: "", imageUrl: "/brands/emmvee.jpg" },
  "home.partner.3": { page: "home", label: "Panel partner 3 — logo", heading: "Adani Solar", subheading: "", body: "", imageUrl: "/brands/adani.jpg" },

  "about.hero": { page: "about", label: "Hero", heading: "About Sri Sastha Solar", subheading: "Powering a sustainable future", body: "", imageUrl: "/work/work-4.jpg" },
  "about.story": { page: "about", label: "Our story", heading: "Our Story", subheading: "", body: "Sri Sastha Solar (a Virgin Power & Engineering initiative) is a leading provider of innovative, sustainable energy solutions — solar power plants, EV charging stations, PV modules, battery storage, solar trackers, lithium batteries, O&M and hybrid projects. We serve homes, businesses, industries and communities with high-quality, reliable and cost-effective clean energy.", imageUrl: "/work/work-7.jpg" },
  "about.mission": { page: "about", label: "Mission", heading: "Our Mission", subheading: "", body: "To deliver high-quality, reliable and cost-effective solutions that drive a cleaner, greener and self-reliant future.", imageUrl: "" },
  "about.vision": { page: "about", label: "Vision", heading: "Our Vision", subheading: "", body: "A future where every rooftop is a clean power plant and renewable energy is affordable and within everyone's reach.", imageUrl: "" },
  "about.why": { page: "about", label: "Why choose us — heading", heading: "Why Choose Sri Sastha Solar", subheading: "Experience, quality & service you can rely on", body: "", imageUrl: "" },
  "about.why.1": { page: "about", label: "Why-us 1", heading: "End-to-End Solutions", subheading: "", body: "Complete solar & renewable-energy solutions — survey, design, supply, install and maintain.", imageUrl: "" },
  "about.why.2": { page: "about", label: "Why-us 2", heading: "Quality Products & Work", subheading: "", body: "High-quality modules, inverters and neat, code-compliant installations built to last.", imageUrl: "" },
  "about.why.3": { page: "about", label: "Why-us 3", heading: "Customised For You", subheading: "", body: "Solutions tailored to your exact load, roof, site and budget — never one-size-fits-all.", imageUrl: "" },
  "about.why.4": { page: "about", label: "Why-us 4", heading: "Expert After-Sales Support", subheading: "", body: "A skilled technical team and dependable service, committed to sustainability & innovation.", imageUrl: "" },

  "services.hero": { page: "services", label: "Hero", heading: "Our Range of Solutions", subheading: "Complete solar & renewable energy", body: "From rooftop solar to EV charging, water heating, pumping and storage — engineered for homes, businesses and industries.", imageUrl: "/work/work-5.jpg" },
  "products.hero": { page: "products", label: "Hero", heading: "Solar Products & Equipment", subheading: "Quality panels, inverters, batteries & more", body: "Genuine Tier-1 modules and reliable balance-of-system components for long-lasting performance.", imageUrl: "/work/work-1.jpg" },
  "contact.hero": { page: "contact", label: "Hero", heading: "Contact Sri Sastha Solar", subheading: "Free site survey & no-obligation quote", body: "", imageUrl: "/work/work-7.jpg" },
};

const SOLUTIONS = [
  ["On-Grid / Off-Grid / Hybrid Systems", "🔆", "Grid-tied, battery-backed and hybrid solar systems sized precisely to your load."],
  ["Domestic & Industrial Solar", "🏭", "Rooftop and ground-mount solar for homes, shops, factories and institutions."],
  ["EV Charging Stations", "⚡", "AC & DC EV charging infrastructure for homes, businesses and public sites."],
  ["Solar Street & Garden Lights", "💡", "All-in-one solar lighting for streets, campuses, parks and gardens."],
  ["Solar Dryers", "🌾", "Solar drying systems for agriculture and food processing."],
  ["Solar Water Heaters", "♨️", "Energy-saving solar water heating for homes and industry."],
  ["Solar Water Pumps", "🚜", "Reliable solar pumping for agriculture and water supply."],
  ["Solar Fencing Solutions", "🛡️", "Secure, solar-powered fencing for farms and properties."],
  ["BESS — Battery Energy Storage", "🔋", "Battery storage for backup, peak-shaving and energy independence."],
  ["Rooftop Solar Solutions", "🏠", "Turnkey rooftop solar — survey, design, install and maintain."],
  ["Solar Power Back-up Systems", "🔌", "Uninterrupted clean power with solar + battery backup."],
  ["Solar Inverters & Accessories", "🧰", "Quality inverters, mounting, cables and balance-of-system components."],
];

function slugify(s) {
  return s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  let sort = 1;
  for (const [key, b] of Object.entries(blocks)) {
    await prisma.contentBlock.upsert({
      where: { key },
      update: { ...b, sort },
      create: { key, ...b, sort },
    });
    sort++;
  }
  // Rebuild services as the 12 real solutions.
  await prisma.service.deleteMany({});
  await prisma.service.createMany({
    data: SOLUTIONS.map(([title, icon, summary], i) => ({
      title,
      slug: slugify(title),
      summary,
      description: summary,
      icon,
      imageUrl: `/work/work-${(i % 9) + 1}.jpg`,
      sort: i + 1,
      published: true,
    })),
  });
  console.log(`Updated ${Object.keys(settings).length} settings, ${Object.keys(blocks).length} blocks, ${SOLUTIONS.length} services.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
