// Seed script (plain ESM JavaScript — runs with `node prisma/seed.mjs`,
// avoiding any esbuild/tsx binary so it works under Windows Smart App Control).
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Super admin bootstrap account.
const SUPER_ADMIN = {
  email: "hariharanjeyaramamoorthy@gmail.com",
  name: "Super Admin",
  password: "@Bb26614",
};

const img = (seed) => `https://picsum.photos/seed/${seed}/1200/800`;

// Default site-wide settings (kept in sync with lib/data.ts SETTING_DEFAULTS).
const SETTING_DEFAULTS = {
  companyName: "SunVolt Solar",
  tagline: "Powering Your Future with Clean Solar Energy",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  email: "info@sunvoltsolar.com",
  address: "123 Solar Street, Green Park, Bengaluru, Karnataka 560001",
  mapEmbed: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: "",
  logoUrl: "",
  metaTitle: "SunVolt Solar — Solar Panel Installation & Solar Products",
  metaDescription:
    "SunVolt Solar designs, supplies and installs rooftop and commercial solar power systems. Explore our solar services and products, and get a free quote.",
};

const blocks = [
  // HOME
  { key: "home.hero", page: "home", label: "Hero — main banner", heading: "Power Your Home & Business with the Sun", subheading: "Trusted Solar Installation & Energy Solutions", body: "We design, install and maintain high-efficiency solar power systems that cut your electricity bills and protect the planet. Get a free site survey and quote today.", imageUrl: img("solar-hero"), sort: 1 },
  { key: "home.about", page: "home", label: "Intro — why go solar", heading: "Why Go Solar?", body: "Solar energy is clean, renewable and increasingly affordable. A well-designed rooftop system can offset most of your power bill, give you energy independence, and pay for itself within a few years — all while reducing your carbon footprint.", imageUrl: img("why-solar"), sort: 2 },
  { key: "home.special", page: "home", label: "What makes us special — section heading", heading: "What Makes Us Special", subheading: "End-to-end solar, done right", body: "From your first enquiry to years of after-sales support, we handle everything so you can simply enjoy clean, cheaper power.", sort: 3 },
  { key: "home.feature.1", page: "home", label: "Feature card 1", heading: "Premium Tier-1 Panels", body: "We use only high-efficiency, long-warranty solar panels from globally trusted manufacturers.", sort: 4 },
  { key: "home.feature.2", page: "home", label: "Feature card 2", heading: "Certified Expert Installers", body: "Our in-house engineers are trained and certified for safe, code-compliant installations.", sort: 5 },
  { key: "home.feature.3", page: "home", label: "Feature card 3", heading: "Free Site Survey & Quote", body: "We assess your roof, shading and consumption, then design a system sized just for you.", sort: 6 },
  { key: "home.feature.4", page: "home", label: "Feature card 4", heading: "25-Year Performance Support", body: "Generation monitoring, maintenance and warranty support for the lifetime of your system.", sort: 7 },
  { key: "home.process", page: "home", label: "Installation process — section heading", heading: "Our Simple Installation Process", subheading: "From enquiry to switch-on in four easy steps", sort: 8 },
  { key: "home.process.1", page: "home", label: "Process step 1", heading: "Enquiry & Survey", body: "Share your details and we visit your site to assess roof space, shading and energy needs.", sort: 9 },
  { key: "home.process.2", page: "home", label: "Process step 2", heading: "Custom Design & Quote", body: "We design an optimal system and give you a clear, transparent quote with savings estimates.", sort: 10 },
  { key: "home.process.3", page: "home", label: "Process step 3", heading: "Professional Installation", body: "Our certified team installs your system safely and neatly, usually within 1–3 days.", sort: 11 },
  { key: "home.process.4", page: "home", label: "Process step 4", heading: "Switch On & Save", body: "We commission the system, set up monitoring and you start generating your own clean power.", sort: 12 },
  { key: "home.cta", page: "home", label: "Call-to-action band", heading: "Ready to Cut Your Electricity Bills?", subheading: "Get a free, no-obligation solar quote tailored to your roof and usage.", sort: 13 },

  // ABOUT
  { key: "about.hero", page: "about", label: "Hero banner", heading: "About SunVolt Solar", subheading: "Clean energy experts you can trust", imageUrl: img("about-hero"), sort: 1 },
  { key: "about.story", page: "about", label: "Our story", heading: "Our Story", body: "Founded with a simple mission — to make clean, affordable solar energy accessible to every home and business — SunVolt Solar has grown into a full-service solar provider. We have installed systems across hundreds of rooftops, helping families and companies save money while shrinking their carbon footprint.", imageUrl: img("about-story"), sort: 2 },
  { key: "about.mission", page: "about", label: "Mission", heading: "Our Mission", body: "To accelerate the shift to renewable energy by delivering reliable, high-quality solar systems backed by honest advice and dependable service.", sort: 3 },
  { key: "about.vision", page: "about", label: "Vision", heading: "Our Vision", body: "A future where every rooftop is a clean power plant and energy is affordable, sustainable and within everyone's reach.", sort: 4 },
  { key: "about.why", page: "about", label: "Why choose us — section heading", heading: "Why Choose Us", subheading: "Experience, quality and service you can rely on", sort: 5 },
  { key: "about.why.1", page: "about", label: "Why-us card 1", heading: "Experienced Team", body: "Years of hands-on experience designing and installing residential and commercial systems.", sort: 6 },
  { key: "about.why.2", page: "about", label: "Why-us card 2", heading: "Quality Components", body: "We never compromise — only tier-1 panels, reliable inverters and durable mounting.", sort: 7 },
  { key: "about.why.3", page: "about", label: "Why-us card 3", heading: "Transparent Pricing", body: "Clear quotes with no hidden costs, plus help with subsidies and financing where available.", sort: 8 },
  { key: "about.why.4", page: "about", label: "Why-us card 4", heading: "After-Sales Support", body: "Ongoing monitoring and prompt maintenance so your system keeps performing for decades.", sort: 9 },

  // SERVICES
  { key: "services.hero", page: "services", label: "Hero banner", heading: "Our Solar Services", subheading: "Complete solar solutions for homes and businesses", body: "From consultation and design to installation and maintenance, we offer everything you need to go solar with confidence.", imageUrl: img("services-hero"), sort: 1 },

  // PRODUCTS
  { key: "products.hero", page: "products", label: "Hero banner", heading: "Our Solar Products", subheading: "High-quality panels, inverters, batteries and more", body: "We supply and install premium solar equipment chosen for efficiency, reliability and long warranties.", imageUrl: img("products-hero"), sort: 1 },

  // CONTACT
  { key: "contact.hero", page: "contact", label: "Hero banner", heading: "Get in Touch", subheading: "Request a free quote or ask us anything about going solar", sort: 1 },
];

const services = [
  { title: "Residential Solar Installation", slug: "residential-solar-installation", icon: "🏠", summary: "Custom rooftop solar systems that cut your home electricity bills.", description: "We design and install grid-tied and hybrid rooftop solar systems tailored to your home's roof, shading and energy usage. Enjoy lower bills, energy independence and a cleaner footprint — backed by our full installation and support service.", imageUrl: img("svc-residential") },
  { title: "Commercial & Industrial Solar", slug: "commercial-industrial-solar", icon: "🏢", summary: "Large-scale solar to power businesses, factories and warehouses.", description: "Reduce operating costs and meet sustainability goals with commercial solar. We handle everything from feasibility and design to installation and net-metering for offices, factories, schools and warehouses.", imageUrl: img("svc-commercial") },
  { title: "Solar Water Heating", slug: "solar-water-heating", icon: "♨️", summary: "Efficient solar water heaters for homes and commercial use.", description: "Cut your water-heating costs with reliable solar thermal systems. Ideal for homes, hotels and hostels, our solar water heaters deliver hot water all year round with minimal running cost.", imageUrl: img("svc-waterheating") },
  { title: "Battery Storage & Backup", slug: "battery-storage-backup", icon: "🔋", summary: "Store solar energy and stay powered during outages.", description: "Add battery storage to your solar system to store excess energy and keep essential loads running during power cuts. We size and install reliable lithium and hybrid battery solutions.", imageUrl: img("svc-battery") },
  { title: "Maintenance & Cleaning (AMC)", slug: "maintenance-cleaning-amc", icon: "🧰", summary: "Keep your system performing at its best, year after year.", description: "Our Annual Maintenance Contracts include panel cleaning, performance checks, inverter servicing and fault resolution — so your system keeps generating maximum power for decades.", imageUrl: img("svc-maintenance") },
  { title: "Solar Consultation & Design", slug: "solar-consultation-design", icon: "📐", summary: "Expert advice and engineering for the perfect system.", description: "Not sure where to start? Our experts assess your needs, analyse your bills and roof, and engineer an optimal, cost-effective system design with clear savings projections.", imageUrl: img("svc-consultation") },
];

const products = [
  { title: "Monocrystalline Solar Panel 550W", slug: "monocrystalline-solar-panel-550w", summary: "High-efficiency mono PERC panel for maximum rooftop output.", description: "A premium tier-1 monocrystalline solar panel delivering excellent efficiency even in low light, with a robust frame built to withstand harsh weather and a 25-year performance warranty.", price: "Request a quote", featured: true, imageUrl: img("prod-panel"), specs: [ { label: "Power Output", value: "550 W" }, { label: "Efficiency", value: "21.3%" }, { label: "Cell Type", value: "Monocrystalline PERC" }, { label: "Warranty", value: "25-year performance" } ] },
  { title: "Hybrid Solar Inverter 5kW", slug: "hybrid-solar-inverter-5kw", summary: "Smart hybrid inverter with battery and grid support.", description: "An intelligent 5kW hybrid inverter supporting solar, battery and grid inputs with built-in Wi-Fi monitoring, high conversion efficiency and seamless backup switching.", price: "Request a quote", featured: true, imageUrl: img("prod-inverter"), specs: [ { label: "Rated Power", value: "5 kW" }, { label: "Type", value: "Hybrid (on/off-grid)" }, { label: "Efficiency", value: "97.6%" }, { label: "Monitoring", value: "Wi-Fi app" } ] },
  { title: "Lithium Solar Battery 5.1kWh", slug: "lithium-solar-battery-5kwh", summary: "Safe, long-life LiFePO4 battery for reliable backup.", description: "A high-cycle-life lithium iron phosphate (LiFePO4) battery for storing your solar energy, with a built-in BMS for safety and a long service life.", price: "Request a quote", featured: true, imageUrl: img("prod-battery"), specs: [ { label: "Capacity", value: "5.1 kWh" }, { label: "Chemistry", value: "LiFePO4" }, { label: "Cycle Life", value: "6000+ cycles" }, { label: "Warranty", value: "10 years" } ] },
  { title: "On-Grid Solar Kit 3kW", slug: "on-grid-solar-kit-3kw", summary: "Complete grid-tied kit for typical homes.", description: "A ready-to-install 3kW on-grid solar package including panels, inverter, mounting structure and cabling — perfect for reducing the electricity bill of an average home.", price: "Request a quote", featured: false, imageUrl: img("prod-kit"), specs: [ { label: "System Size", value: "3 kW" }, { label: "Type", value: "On-grid / net-metering" }, { label: "Includes", value: "Panels, inverter, mounting, cables" }, { label: "Ideal For", value: "Homes" } ] },
  { title: "Solar Water Heater 200L", slug: "solar-water-heater-200l", summary: "Evacuated-tube water heater for family-sized hot water.", description: "A 200-litre evacuated-tube collector solar water heater that provides ample hot water for a family while drastically cutting electricity or gas heating costs.", price: "Request a quote", featured: false, imageUrl: img("prod-waterheater"), specs: [ { label: "Capacity", value: "200 L" }, { label: "Type", value: "Evacuated tube collector" }, { label: "Best For", value: "4–6 person household" }, { label: "Warranty", value: "5 years" } ] },
  { title: "Solar Panel Mounting Structure", slug: "solar-panel-mounting-structure", summary: "Durable, corrosion-resistant mounting for rooftops.", description: "Hot-dip galvanised and aluminium mounting structures engineered for high wind loads, ensuring your panels stay secure and optimally tilted for years.", price: "Request a quote", featured: false, imageUrl: img("prod-mounting"), specs: [ { label: "Material", value: "Galvanised steel / aluminium" }, { label: "Wind Rating", value: "Up to 150 km/h" }, { label: "Roof Types", value: "RCC, tin, tile" }, { label: "Warranty", value: "10 years" } ] },
];

async function main() {
  console.log("Seeding database...");

  for (const [key, value] of Object.entries(SETTING_DEFAULTS)) {
    await prisma.setting.upsert({ where: { key }, update: {}, create: { key, value } });
  }

  for (const b of blocks) {
    await prisma.contentBlock.upsert({
      where: { key: b.key },
      update: { page: b.page, label: b.label, sort: b.sort ?? 0 },
      create: {
        key: b.key, page: b.page, label: b.label,
        heading: b.heading ?? "", subheading: b.subheading ?? "",
        body: b.body ?? "", imageUrl: b.imageUrl ?? "", sort: b.sort ?? 0,
      },
    });
  }

  let s = 0;
  for (const svc of services) {
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {},
      create: { ...svc, sort: s++, published: true },
    });
  }

  let p = 0;
  for (const prod of products) {
    const { specs, ...rest } = prod;
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: { ...rest, specs: JSON.stringify(specs), sort: p++, published: true },
    });
  }

  // Super admin (created once; re-seeding never overwrites the password).
  const email = SUPER_ADMIN.email.toLowerCase();
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (!existing) {
    await prisma.adminUser.create({
      data: {
        email,
        name: SUPER_ADMIN.name,
        passwordHash: await bcrypt.hash(SUPER_ADMIN.password, 10),
        role: "SUPERADMIN",
        mustChangePassword: false,
        active: true,
      },
    });
    console.log(`Super admin created: ${email}`);
  } else {
    console.log(`Super admin already exists: ${email}`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
