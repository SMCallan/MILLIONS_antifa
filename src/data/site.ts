export const site = {
  name: "A Million Words Against Fascism",
  shortName: "MWAF",
  tagline: "Solidarity Park International Tour",
  description:
    "An international touring exhibition of art, memory, and education responding to the rise of far-right and fascist ideologies.",
  email: "bookings@example.org",
  url: "https://www.millionwords.net",
  logo: "/million-words-logo.png",
  logoAlt: "A Million Words Against Fascism project artwork",
  heroImage:
    "https://images.unsplash.com/photo-1766890410757-3abb563b3918?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=70&w=2200",
};

// Navigation, structured to match the site template: a primary "Tour dates"
// item plus a grouped "More information" menu. `key` indexes into the `nav`
// section of the i18n dictionaries so labels are localised; `href` is the
// canonical (English-root) path and is localised at render time.
export type NavItem = { key: string; href: string };

export const primaryNav: NavItem[] = [
  { key: "tourDates", href: "/tour-dates" },
];

export const moreInfoNav: NavItem[] = [
  { key: "concept", href: "/concept" },
  { key: "contribute", href: "/contribute" },
  { key: "donate", href: "/donate" },
  { key: "host", href: "/host" },
  { key: "gallery", href: "/gallery" },
  { key: "links", href: "/links" },
];

// Flat list used by the footer.
export const footerNav: NavItem[] = [
  { key: "home", href: "/" },
  ...primaryNav,
  ...moreInfoNav,
];

export const tourDates = [
  {
    date: "3-19 Dec 2026",
    city: "Hull, England",
    venue: "Hull History Centre",
    status: "Booked",
    format: "Exhibition run",
    collaborators: ["Hull Trades Council", "Hull Art School"],
  },
  {
    date: "20 Dec 2026 - 20 Jan 2027",
    city: "Tour pause",
    venue: "Christmas break",
    status: "Break",
    format: "No public stop",
    collaborators: [],
  },
  {
    date: "22 Jan - 7 Feb 2027",
    city: "Sunderland, England",
    venue: "Sunderland",
    status: "In agreement",
    format: "Exhibition run",
    collaborators: ["Sunderland College", "Sunderland Culture", "Solidarity Sunderland"],
  },
  {
    date: "12-14 Feb 2027",
    city: "Dundee, Scotland",
    venue: "Dundee",
    status: "In agreement",
    format: "Long weekend",
    collaborators: ["Mike Arnott", "S-IBMT", "Dundee Trades Council"],
  },
  {
    date: "19 Feb - 6 Mar 2027",
    city: "South Wales",
    venue: "Rhondda Cynon Taf",
    status: "In agreement",
    format: "Exhibition run",
    collaborators: ["Rhondda Cynon Taf Council", "Porth Community School", "Solidarity Cymru"],
  },
  {
    date: "12-14 Mar 2027",
    city: "Woking, Surrey",
    venue: "Woking",
    status: "In agreement",
    format: "Long weekend",
    collaborators: ["Surrey UNISON", "Basque Children of 37 Association", "Solidarity Surrey", "David Maples", "Robert Ford"],
  },
  {
    date: "19-21 Mar 2027",
    city: "Greenwich Peninsula, London",
    venue: "Fire Pit",
    status: "In agreement",
    format: "Long weekend",
    collaborators: ["International Brigade Memorial Trust", "Fire Pit Artist Collective"],
  },
  {
    date: "23 Mar - 3 Apr 2027",
    city: "Tour pause",
    venue: "Easter break",
    status: "Break",
    format: "No public stop",
    collaborators: [],
  },
  {
    date: "9-11 Apr 2027",
    city: "Leeuwarden, Holland",
    venue: "Leeuwarden",
    status: "In agreement",
    format: "Long weekend",
    collaborators: ["Holland International Brigade Association", "Piter Jelle's De Dyk School"],
  },
  {
    date: "16-18 Apr 2027",
    city: "Cologne, Germany",
    venue: "Cologne",
    status: "In agreement",
    format: "Long weekend",
    collaborators: ["Conny Dahmen"],
  },
  {
    date: "23-25 Apr 2027",
    city: "Hamburg, Germany or Gothenburg / Malmo, Sweden",
    venue: "To be confirmed",
    status: "In agreement",
    format: "Long weekend",
    collaborators: ["Jonas Langer", "Claudia Matero", "Reclaim with Song Choir", "Natalia Medina", "Sweden International Brigade Association"],
  },
  {
    date: "1 May 2027",
    city: "Toulouse, France",
    venue: "Toulouse",
    status: "In agreement",
    format: "May Day event",
    collaborators: ["La Cri choir"],
  },
  {
    date: "28-30 May 2027",
    city: "Malgrat de Mar, Catalunya",
    venue: "Solidarity Park Festival",
    status: "Booked",
    format: "Festival centrepiece",
    collaborators: ["Solidarity Park"],
  },
  {
    date: "14 Jun 2027",
    city: "Hull, England",
    venue: "Hull Art School",
    status: "Booked",
    format: "Return event",
    collaborators: ["Hull Art School"],
  },
];

export const submissionGuidelines = [
  "The tour may include local anti-fascist artists where venue space allows, alongside the core Solidarity Room and commissioned international works.",
  "Artists, poets, film-makers, animators, sculptors, painters, and community contributors can use this form to send preview material or links.",
  "Submit preview files only: JPG, JPEG, PNG, WebP, PDF, MP3, M4A, or WAV. Video previews are best shared as links.",
  "Upload up to five preview files, maximum 20MB each and 75MB total. Shortlisted artists may be asked separately for production-ready originals.",
];

export const bookingFeatures = [
  "The central Solidarity Room is planned as a 4 x 4m space with walls covered by 1,000 postcard-sized images created through Solidarity Park.",
  "The outside street-facing walls can host another 1,000 postcards made by participants during the tour or through schools and colleges.",
  "Venues can add local history, International Brigades material, artist commissions, poetry, music, workshops, and local anti-fascist work where space allows.",
];

export const artistCommissions = [
  "Juan Pedro Flores Gonzalez, painter - Barcelona, Catalunya",
  "Craig Knowles, sculptor - Sunderland, England",
  "Natalia Medina, film director - Stockholm, Sweden",
  "Robert Ford, illustrator and poet - Worthing, England",
  "Tad Davies, animator - Cardiff, Wales",
];
