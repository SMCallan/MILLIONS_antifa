// English copy — the full source of truth and canonical shape for every locale.
// Other locale files provide a deep-partial override; anything omitted there
// falls back to the strings below.

export const en = {
  meta: {
    siteName: "A Million Words Against Fascism",
    shortName: "MWAF",
    tagline: "European touring exhibition from the Solidarity Park project",
    description:
      "An international touring exhibition of art, memory, and education responding to the rise of far-right and fascist ideologies.",
  },

  nav: {
    home: "Home",
    tourDates: "Tour dates",
    moreInfo: "More information",
    menu: "Menu",
    tour: "Tour",
    concept: "Concept",
    contribute: "Contribute",
    donate: "Donate",
    host: "Host",
    gallery: "Gallery",
    collaborators: "Collaborators",
    links: "Links",
  },

  langSwitcher: {
    label: "Choose language",
    current: "Current language",
  },

  common: {
    skipToContent: "Skip to content",
    viewAllDates: "View all dates",
    learnMore: "Learn more",
    readConditions: "Read the conditions",
    backToHome: "Back to home",
    getInTouch: "Get in touch",
    comingSoon: "Coming soon",
    close: "Close",
    opensInNewTab: "Opens in a new tab",
    revealBody:
      "Confirm you are human and we will show you the address to send it to. This keeps it away from automated scrapers.",
    revealButton: "Show the email address",
    revealPending: "Checking…",
    revealError: "That check did not complete. Please try again.",
  },

  // Hero used on the home page (logo left, title + sub text right).
  hero: {
    title: "Million words against Fascism",
    subtitle: "European touring exhibition from the Solidarity Park project.",
    artworkCredit: "Animation & logo: Roberto Ford",
    lede: "If a picture tells a thousand words, what do a thousand artists create? A million words, each told from a unique perspective, forming an international touring exhibition against fascism.",
    primaryCta: "Tour dates",
    secondaryCta: "Contribute artwork",
    badges: [
      "Solidarity Park",
      "International Brigades",
      "1,000 young artists",
      "International Brigades",
      "Art, memory, education",
      "Catalunya 2027",
    ],
    statusLines: [
      "Touring toward the 90th anniversary of the Ciudad de Barcelona sinking",
      "Inspired by the Artists International Association and the legacy of anti-fascist solidarity",
    ],
  },

  home: {
    conceptBadge: "Concept and purpose",
    conceptTitle: "A thousand young artists. A million words against fascism.",
    conceptBody: [
      "If a picture tells a thousand words, a thousand artists create a million words. The exhibition brings those voices together as an international response to the rise of far-right and fascist ideologies.",
      "By June 2026, the Solidarity Park Project will have facilitated more than 1,000 visual artworks by young people through its porthole education initiative about the Spanish Civil War, the International Brigades, and the lessons of international solidarity.",
      "The 2027 tour builds toward the 90th anniversary of the sinking of the Ciudad de Barcelona on 30 May 2027, the story that helped launch Association Solidarity Park's work in art, memory, and education.",
    ],
    stats: [
      { value: "1,000+", label: "young artists' works" },
      { value: "4 x 4m", label: "Solidarity Room plan" },
      { value: "2027", label: "anniversary tour" },
    ],
    installationBadge: "Installation",
    installationTitle: "The Solidarity Room sits at the centre of the exhibition.",
    installationBody:
      "Inside, the room is planned as a wall-to-wall display of 1,000 postcard-sized images made through the Solidarity Park project. Outside, the street-facing walls can gather another 1,000 new images created by visitors, schools, colleges, and community participants during the tour.",
    commissionsTitle: "International artist commissions",
    commissionsBody:
      "Surrounding the Solidarity Room will be a curated programme inspired by millions of stories against fascism, including film, animation, sculpture, painting, illustration, and poetry.",
    tourBadge: "Tour route",
    tourTitle: "International tour dates",
    tourBody: "Dates and collaborators are subject to final agreements and confirmations.",
    hostBadge: "Host the exhibition",
    hostTitle: "Bring the tour to a school, union, venue, festival, or civic space.",
    hostBody:
      "Each event can combine the core installation with local International Brigades history, workshops, live music, poetry, and local anti-fascist artists where space allows.",
    hostCta: "Make a booking enquiry",
    contributeCta: "Contribute artwork",
  },

  tourDates: {
    heroTitle: "Million Words Against Fascism Tour.",
    heroSubtitle:
      "The tour is in collaboration with Artists across the world, Schools, Art Colleges, Trade Unions, Arts Venues, International Brigade groups, Poets, Radical Choirs, and Solidarity Campaign groups all building toward the Solidarity Park Festival in Catalunya May 2027.",
    heroPrimaryCta: "View route",
    heroSecondaryCta: "Host the exhibition",
    routeBadge: "Route notes",
    routeTitle: "Locations",
    routeBody:
      "Full venues, times and activities will be published when confirmed.",
    stop: "Stop",
    pause: "Pause",
    tbc: "TBC",
    ctaEyebrow: "The route is being finalised with partners across Europe",
    ctaTitle: "Interested in hosting or partnering with a future event?",
    ctaButton: "Start a booking enquiry",
    status: {
      Booked: "Booked",
      "In agreement": "In agreement",
      Break: "Break",
    } as Record<string, string>,
  },

  concept: {
    heroTitle: "The concept",
    heroSubtitle:
      "A thousand young artists answering the rise of fascism gathered into one touring exhibition where 1,000 more will add their art.",
    sections: [
      {
        heading: "A million words",
        body: "The saying goes, ‘an image is worth a thousand words.’ If so, then a thousand young international artists in this exhibition tour will create a million words. Each contribution is their unique critical historical understanding, and together they form an international, collective answer to far-right and fascist ideologies today.",
      },
      {
        heading: "Rooted in the Solidarity Park project",
        body: "The exhibition grows out of the Solidarity Park project's porthole education initiative, which introduces young people to the Spanish Civil War, the International Brigades, and the lessons of international solidarity. By June 2026 the project has facilitated more than 1,000 visual artworks by young people. This will be the main installation at the exhibition. The exhibition is curated by Solidarity Park artistic director Rob MacDonald.",
      },
      {
        heading: "A thousand more images",
        body: "As the tour rolls out across Europe, we invite young people and the public to add 1,000 more images to the exhibition, creating a movement of millions and millions of words against the rise of fascistic ideology.",
      },
      {
        heading: "International Artists",
        body: "Established international artists have also been invited to exhibit paintings, sculptures, performances, and multimedia pieces inspired by the exhibition title and the work of the Artists' International Association of the 1930s.",
      },
      {
        heading: "Towards Solidarity Park Festival 30th May 2027 in Catalunya",
        body: "The six-month tour builds towards the 90th anniversary of the sinking of the ship Ciudad de Barcelona on 30 May 1937—a forgotten story of the International Brigades in the Spanish Civil War that inspired the launching of the Solidarity Park Association, its community participation monument, and, since 2022, the annual international festival of art, memory, and education.",
      },
    ],
  },

  contribute: {
    heroTitle:
      "Contribute your Art",
    heroSubtitle:
      "We want to add your anti-fascist artistic voice to the Millions. Below we set out some conditions. Accepted works will form part of the physical touring exhibition main installation and/or parallel online galleries. We are especially interested in images and spoken words, but we are open to all artistic expressions. Where venues have space and time we will try to show your work or performance in real time.",
    revealTitle: "Send us your work",
    heroPrimaryCta: "Request link",
    heroSecondaryCta: "Tour dates",
    notesTitle: "Contribution notes",
    formTitle: "Request a secure contribution link",
    formDescription:
      "Enter the email address you want attached to the contribution. The link lets you create or update one active preview contribution for the tour.",
    emailLabel: "Email",
    submitButton: "Send secure contribution link",
    conditionsCta: "Read the contribution conditions",
    guidelines: [
      "The tour may include local anti-fascist artists where venue space allows, alongside the core Solidarity Room and commissioned international works.",
      "Artists, poets, film-makers, animators, sculptors, painters and community contributors are all welcome to send work or links by email.",
      "Send images and audio as JPG, PNG, WebP, PDF, MP3, M4A or WAV. Share video, and anything large, as a link.",
      "Keep attachments under roughly 20MB in total and send a link for anything bigger. Shortlisted artists may be asked separately for production-ready originals.",
      "If your work is part of a participating school, college or organisation, please ask for a Google Drive link connected to your institution for a quicker send and review process.",
    ],
  },

  contributeConditions: {
    heroTitle: "Contribution conditions",
    heroSubtitle:
      "Please read these conditions before sending your work by email.",
    intro:
      "Contributions are sent by email. We ask for review material only — not final production or master files.",
    sections: [
      {
        heading: "What to send",
        body: "Images and documents as JPG, PNG, WebP or PDF. Audio as MP3, M4A or WAV. Send video, or anything large, as a link — Vimeo, YouTube, Google Drive, Dropbox and WeTransfer all work.",
      },
      {
        heading: "Keep attachments small, or send a link",
        body: "Keep attachments under roughly 20MB in total, since larger messages are often bounced before they reach us. Above that, send a link instead. There is no limit on what a link can hold.",
      },
      {
        heading: "What not to send",
        body: "Please do not attach layered, print-ready, audio or video masters, or archives such as ZIP. Send review-quality material first. If your work is shortlisted we will ask for production-ready originals separately.",
      },
      {
        heading: "How your material is handled",
        body: "What you send is used only to consider your work for the exhibition. Nothing is published automatically, and nothing is made public without your agreement.",
      },
      {
        heading: "Rights and consent",
        body: "By sending work you confirm that you created it, or that you have permission to share it, and you agree it may be considered for display in the exhibition and its promotion. You keep the copyright in your work.",
      },
    ],
    uploaderTitle: "The uploader",
    uploaderBody:
      "Contributions are made through a secure email link. Request a link on the Contribute page; opening it lets you create or update one active preview contribution.",
    uploaderCta: "Go to Contribute",
  },

  donate: {
    heroTitle: "Support the tour",
    heroSubtitle:
      "A Million Words Against Fascism is a not-for-profit touring project. Donations help cover transport, installation, materials, and the participation of young artists and community groups.",
    introTitle: "Why donate",
    introBody:
      "The exhibition travels across Europe with a core Solidarity Room, street-facing postcard activity, and a programme of commissioned work. Your support keeps the tour free or low-cost for schools, colleges, unions, and community venues.",
    usesTitle: "What your support pays for",
    uses: [
      "Transport and installation of the exhibition between venues.",
      "Materials for the 1,000 postcard-sized artworks and street-facing activity.",
      "Participation costs for schools, colleges, and community groups.",
      "Commissioned work from anti-fascist artists, poets, and film-makers.",
    ],
    ctaTitle: "Make a donation",
    ctaBody:
      "A donation link will be published here. In the meantime, please get in touch to discuss supporting the tour or partnering with a stop near you.",
    ctaButton: "Contact the project",
    ctaPending: "Donation link coming soon.",
  },

  host: {
    heroTitle: "Host A Million Words Against Fascism.",
    heroSubtitle:
      "Share the basics about your venue, audience, education partners, and preferred dates. We will get back to you as soon as possible.",
    proposalTitle: "What to include in your proposal",
    proposalItems: [
      "Your organisation or venue, and who we should reply to.",
      "Where you are, and what kind of space it is — gallery, library, school, union hall, festival, or something else.",
      "The dates or period you are considering.",
      "The size of the space: wall length, room dimensions, and any street-facing walls.",
      "Public opening times, school or group access, and any access needs.",
      "Roughly how many visitors you expect.",
      "Any local International Brigades history, partners, or programme ideas you would like to include.",
    ],
    revealTitle: "Send your proposal",
    heroPrimaryCta: "Start enquiry",
    heroSecondaryCta: "Tour dates",
    formatsTitle: "Hosting formats",
    leadTimeTitle: "Flexible formats",
    leadTimeBody:
      "Event formats and lengths are flexible and agreed individually with each venue and its programme.",
    formTitle: "Host enquiry form",
    formDescription:
      "Tell us about the venue, audience, education links, local history, and dates you are considering.",
    conditionsCta: "Read the hosting conditions",
    features: [
      "The exhibition centres on the Solidarity Room, an installation of postcard-sized artworks made through the Solidarity Park project.",
      "Outward-facing walls can gather new postcards made by visitors, schools, and community participants during the tour.",
      "Venues can add local history, artist commissions, poetry, music, workshops, and local anti-fascist work where space allows.",
    ],
    fields: {
      organisation: "Organisation or centre",
      contactName: "Contact name",
      email: "Email",
      phone: "Phone",
      location: "Venue location",
      venueType: "Venue type",
      venueTypePlaceholder: "Select venue type",
      dateRange: "Preferred date range",
      dateRangePlaceholder: "e.g. September 2026",
      expectedAudience: "Expected audience",
      expectedAudiencePlaceholder: "e.g. 150 visitors",
      spaceDetails: "Space and access details",
      spaceDetailsPlaceholder:
        "Room size, wall length, street-facing areas, public opening times, school access, equipment, or access needs.",
      message: "Enquiry details",
      messagePlaceholder:
        "Tell us what you would like to host, any local International Brigades history, programme ideas, and what support you need.",
      submit: "Send host enquiry",
      required: "required",
    },
    venueTypes: [
      "Community centre",
      "Gallery or museum",
      "Library",
      "School, college, or university",
      "Union or workplace venue",
      "Festival or temporary space",
      "Other",
    ],
  },

  hostConditions: {
    heroTitle: "Hosting conditions",
    heroSubtitle:
      "An outline of what hosting a stop on the tour involves. Final terms are agreed individually with each venue.",
    intro:
      "These conditions give partners a sense of what is needed to host the exhibition. Nothing here is a fixed contract — each stop is confirmed by written agreement.",
    sections: [
      {
        heading: "Space",
        body: "The exhibition adapts to the available space. Wall space for the Solidarity Room, participant postcards, and local or commissioned work is agreed with each venue.",
      },
      {
        heading: "Programme and duration",
        body: "Event length and programme are shaped around each venue, from short runs to longer exhibitions, with school and community participation welcome.",
      },
      {
        heading: "Local partnership",
        body: "Hosts are encouraged to add local International Brigades history, workshops, live music, poetry, and local anti-fascist artists. The project can help connect you with regional partners.",
      },
      {
        heading: "Care and insurance",
        body: "Venues are asked to provide a secure, weather-appropriate space and reasonable supervision during opening hours. Insurance and handling arrangements are agreed per venue.",
      },
      {
        heading: "Costs",
        body: "The project aims to keep hosting free or low-cost for schools, unions, and community venues. Transport, installation, and any shared costs are discussed during your enquiry.",
      },
    ],
    ctaTitle: "Ready to enquire?",
    ctaBody: "Send the basics about your venue and preferred dates and the team will follow up.",
    ctaButton: "Start a host enquiry",
  },

  gallery: {
    heroTitle: "Gallery",
    heroSubtitle:
      "A selection of works from the Solidarity Park project and the touring exhibition. Images will be added as the collection grows.",
    placeholderTitle: "Gallery coming soon",
    placeholderBody:
      "As young artists' works and commissioned pieces are confirmed for the tour, a selection will be shown here. Contributions submitted through the secure link are reviewed privately and are not published automatically.",
    contributeCta: "Contribute artwork",
  },

  collaborators: {
    heroTitle: "Collaborators",
    heroSubtitle:
      "The artists, historians, educators, and organisations building the exhibition and the tour.",
    empty: "Profiles are being gathered and will be published here as they are confirmed.",
  },

  links: {
    heroTitle: "Links",
    heroSubtitle:
      "Partners, collaborators, and further reading connected to the Solidarity Park project and the anti-fascist memory it draws on.",
    // Keyed by the ids in `linkGroups` (src/data/site.ts), which holds the
    // destinations. Objects rather than arrays so a locale can translate one
    // entry without replacing the whole set — deepMerge overlays arrays
    // wholesale but merges objects key by key.
    groups: {
      project: {
        title: "The project",
        items: {
          association: { label: "Association Solidarity Park", note: "The organisation behind the exhibition." },
          festival: { label: "Solidarity Park Festival, Catalunya", note: "The festival the 2027 tour builds toward." },
          sunderland: { label: "Solidarity Sunderland History Hub", note: "Sunderland’s International Brigaders, the ships, and the Basque children of 1937." },
        },
      },
      memory: {
        title: "History and memory",
        items: {
          ibmt: { label: "International Brigade Memorial Trust", note: "Keeping the memory of the International Brigades alive." },
          basqueChildren: { label: "Basque Children of '37 Association", note: "The story of children evacuated during the Spanish Civil War." },
          alba: { label: "Abraham Lincoln Brigade Archives", note: "The American volunteers of the International Brigades, and the archive that keeps their record." },
        },
      },
      getInvolved: {
        title: "Get involved",
        items: {
          contribute: { label: "Contribute artwork", note: "Send preview material through a secure link." },
          host: { label: "Host the exhibition", note: "Bring a stop on the tour to your venue." },
        },
      },
    },
  },

  footer: {
    tagline: "European touring exhibition from the Solidarity Park project.",
    navTitle: "Explore",
  },
};

export type Translation = typeof en;
