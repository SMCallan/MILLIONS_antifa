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

// Planned route for the touring exhibition. Dates and event formats are
// intentionally not listed: every stop renders as "TBC" (see tourDates.tbc in
// the i18n dictionaries) until agreements are confirmed by the project team.
// `venue` is optional — leave it empty until a venue is confirmed.
export const tourDates: { city: string; venue?: string }[] = [
  { city: "Hull, England", venue: "Hull History Centre" },
  { city: "Sunderland, England" },
  { city: "Dundee, Scotland" },
  { city: "South Wales", venue: "Rhondda Cynon Taf" },
  { city: "Woking, Surrey" },
  { city: "Greenwich Peninsula, London", venue: "Fire Pit" },
  { city: "Leeuwarden, Holland" },
  { city: "Cologne, Germany" },
  { city: "Hamburg, Germany or Gothenburg / Malmo, Sweden" },
  { city: "Toulouse, France" },
  { city: "Malgrat de Mar, Catalunya", venue: "Solidarity Park Festival" },
  { city: "Hull, England", venue: "Hull Art School" },
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
