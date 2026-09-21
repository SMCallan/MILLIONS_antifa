export const site = {
  name: "A Million Words Against Fascism",
  shortName: "MWAF",
  tagline: "Solidarity Park International Tour",
  description:
    "An international touring exhibition of art, memory, and education responding to the rise of far-right and fascist ideologies.",
  email: "bookings@example.org",
  url: "https://millionwords.net",
  logo: "/million-words-logo.webp",
  logoAlt: "A Million Words Against Fascism project artwork",
  heroImage:
    "https://images.unsplash.com/photo-1766890410757-3abb563b3918?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=70&w=2200",
};

// Navigation, structured to match the site template: a primary "Tour dates"
// item plus a grouped "More information" menu. `key` indexes into the `nav`
// section of the i18n dictionaries so labels are localised; `href` is the
// canonical (English-root) path and is localised at render time.
export type NavItem = { key: string; href: string };

// Donate goes straight out to the crowdfunding project rather than to a page
// on this site. localizePath passes absolute URLs through untouched, so this
// works from every nav that renders a NavItem.
export const donateUrl = "https://chuffed.org/project/197805-millions-of-words-against-fascism";

export const primaryNav: NavItem[] = [
  { key: "tourDates", href: "/tour-dates" },
];

export const moreInfoNav: NavItem[] = [
  { key: "concept", href: "/concept" },
  { key: "contribute", href: "/contribute" },
  { key: "donate", href: donateUrl },
  { key: "host", href: "/host" },
  { key: "gallery", href: "/gallery" },
  { key: "links", href: "/links" },
  { key: "collaborators", href: "/collaborators" },
];

// Links page. `key` indexes into the `links.groups` section of the i18n
// dictionaries so titles, labels and notes stay translated; the destination
// lives here once, so correcting a URL is a single edit rather than seven.
// Internal paths are localised at render time; external URLs are used verbatim.
//
// External destinations were verified live in August 2026. If one starts
// 404ing, fix it here — nothing in the locale files needs touching.
export type LinkItem = { key: string; href: string; external?: boolean };
export type LinkGroup = { key: string; items: LinkItem[] };

export const linkGroups: LinkGroup[] = [
  {
    key: "project",
    items: [
      { key: "association", href: "https://solidaritypark.com/about/", external: true },
      { key: "festival", href: "https://solidaritypark.com/", external: true },
      { key: "sunderland", href: "https://solidaritypark.com/solidarity-sunderland/", external: true },
    ],
  },
  {
    key: "memory",
    items: [
      { key: "ibmt", href: "https://international-brigades.org.uk/", external: true },
      { key: "basqueChildren", href: "https://www.basquechildren.org/", external: true },
      { key: "alba", href: "https://alba-valb.org/", external: true },
    ],
  },
  {
    key: "getInvolved",
    items: [
      { key: "contribute", href: "/contribute" },
      { key: "host", href: "/host" },
    ],
  },
];

// Flat list used by the footer.
export const footerNav: NavItem[] = [
  { key: "home", href: "/" },
  ...primaryNav,
  ...moreInfoNav,
];

// Planned route for the touring exhibition. Dates and venues are shown when
// confirmed; stops without either remain visibly marked TBC.
//
// Place and venue names are written in their native form and shown that way
// in every locale. Only the words around them are localised, at render time:
// month names and day order, and the "and" joining two places.
export type TourStop = {
  /** Native place names. Two or more are joined with the locale's "and". */
  places: string[];
  /** Native region or country name, shown after the places. */
  region?: string;
  /** First and last day. Only day and month are displayed; the year keeps the dates real. */
  dates?: { start: string; end: string };
  venue?: string;
};

export const tourDates: TourStop[] = [
  { places: ["Hull"], dates: { start: "2026-12-01", end: "2026-12-17" } },
  {
    places: ["Dundee"],
    region: "Scotland",
    dates: { start: "2027-01-29", end: "2027-01-31" },
    venue: "Generator Projects, Units 25–26, Mid Wynd Industrial Estate, Dundee, DD1 4JG",
  },
  { places: ["Sunderland"] },
  {
    places: ["Pontypridd"],
    region: "South Wales",
    dates: { start: "2027-02-13", end: "2027-02-27" },
    venue: "Llyfrgell Pontypridd Library, 1 Gas Road, Taff Street, Pontypridd, CF37 4TH",
  },
  { places: ["Midlands"], region: "England" },
  { places: ["London", "South East"], region: "UK" },
  { places: ["Leeuwarden"], region: "Nederland" },
  { places: ["Stockholm"], region: "Sverige" },
  { places: ["Köln"], region: "Deutschland" },
  { places: ["Toulouse"], region: "France" },
  {
    places: ["Malgrat de Mar"],
    region: "Catalunya",
    dates: { start: "2027-05-26", end: "2027-05-30" },
    venue: "Festival Solidarity Park — Arxiu Municipal, Carrer de Mar",
  },
  { places: ["Hull"], venue: "Hull Art School" },
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
