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
    concept: "Concept",
    contribute: "Contribute",
    donate: "Donate",
    host: "Host",
    gallery: "Gallery",
    links: "Links",
  },

  langSwitcher: {
    label: "Choose language",
    current: "Current language",
  },

  common: {
    viewAllDates: "View all dates",
    learnMore: "Learn more",
    readConditions: "Read the conditions",
    backToHome: "Back to home",
    getInTouch: "Get in touch",
    comingSoon: "Coming soon",
    draftNotice: "Draft content — to be finalised by the project team.",
  },

  // Hero used on the home page (logo left, title + sub text right).
  hero: {
    title: "Million words against Fascism",
    subtitle: "European touring exhibition from the Solidarity Park project.",
    lede: "If a picture tells a thousand words, what do a thousand artists create? A million words, each told from a unique perspective, forming an international touring exhibition against fascism.",
    primaryCta: "Tour dates",
    secondaryCta: "Contribute artwork",
    badges: [
      "Solidarity Park",
      "International tour",
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
    heroTitle: "Solidarity Park International Tour.",
    heroSubtitle:
      "The tour is planned around schools, unions, arts venues, International Brigade groups, choirs, colleges, and civic partners, building toward the Solidarity Park Festival in Catalunya.",
    heroPrimaryCta: "View route",
    heroSecondaryCta: "Host the exhibition",
    routeBadge: "Route notes",
    routeTitle: "Planned locations and principal collaborators.",
    routeBody:
      "Event lengths will vary by venue. The outline below reflects the current tour proposal from the exhibition brief.",
    stop: "Stop",
    pause: "Pause",
    ctaEyebrow: "The tour builds toward 30 May 2027 in Catalunya",
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
      "A thousand young artists answering the rise of fascism with a million words, gathered into one touring exhibition.",
    sections: [
      {
        heading: "A million words",
        body: "If a picture tells a thousand words, a thousand artists create a million words. Each contribution is a single perspective, and together they form an international, collective answer to far-right and fascist ideologies.",
      },
      {
        heading: "Rooted in the Solidarity Park project",
        body: "The exhibition grows out of the Solidarity Park project's porthole education initiative, which introduces young people to the Spanish Civil War, the International Brigades, and the lessons of international solidarity. By June 2026 the project will have facilitated more than 1,000 visual artworks by young people.",
      },
      {
        heading: "Toward the Ciudad de Barcelona anniversary",
        body: "The 2027 tour builds toward the 90th anniversary of the sinking of the Ciudad de Barcelona on 30 May 2027 — the story that helped launch Association Solidarity Park's work in art, memory, and education.",
      },
      {
        heading: "Art, memory, and education",
        body: "Around the central Solidarity Room, a curated programme of film, animation, sculpture, painting, illustration, and poetry carries millions of stories against fascism, connecting historical memory with the work of a new generation.",
      },
    ],
  },

  contribute: {
    heroTitle: "Contribute artwork, poetry, or local material.",
    heroSubtitle:
      "Where venues have space, the tour can include local anti-fascist artists, poets, film-makers, animators, sculptors, painters, and community contributors alongside the core exhibition.",
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
      "Artists, poets, film-makers, animators, sculptors, painters, and community contributors can use this form to send preview material or links.",
      "Submit preview files only: JPG, JPEG, PNG, WebP, PDF, MP3, M4A, or WAV. Video previews are best shared as links.",
      "Upload up to five preview files, maximum 20MB each and 75MB total. Shortlisted artists may be asked separately for production-ready originals.",
    ],
  },

  contributeConditions: {
    heroTitle: "Contribution conditions",
    heroSubtitle:
      "Please read these conditions before requesting a secure contribution link and uploading preview material.",
    intro:
      "The public contribution flow accepts review and preview material only. It must not be used for final production or master files.",
    sections: [
      {
        heading: "Accepted preview formats",
        body: "JPG/JPEG, PNG, WebP, PDF for images and documents; MP3, M4A, or WAV for audio previews. Video previews are best shared as links (Vimeo, YouTube, Google Drive, Dropbox, or WeTransfer).",
      },
      {
        heading: "Upload limits",
        body: "Up to 5 preview files per contribution, a maximum of 20MB per file, and 75MB in total. Selecting new files replaces your previous preview set after validation.",
      },
      {
        heading: "Not accepted through the public form",
        body: "Do not upload PSD, TIFF, ZIP, EXE, arbitrary binaries, layered masters, print-ready masters, audio masters, or video masters. Shortlisted artists are contacted separately for production-ready originals through a controlled process.",
      },
      {
        heading: "How your material is handled",
        body: "Preview files are stored privately and are used only for reviewing your contribution to the exhibition. Files are not made public and are retained according to the project's retention policy.",
      },
      {
        heading: "Rights and consent",
        body: "By submitting, you confirm you created the work or have permission to share it, and you agree it may be considered for display within the exhibition and its promotion. You keep the copyright in your work.",
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
      "Share the basics about your venue, audience, education partners, and preferred dates. The tour can adapt the Solidarity Room, street-facing postcard activity, local history, and live programme to each setting.",
    heroPrimaryCta: "Start enquiry",
    heroSecondaryCta: "Tour dates",
    formatsTitle: "Hosting formats",
    leadTimeTitle: "Typical lead time",
    leadTimeBody:
      "Event lengths will vary by venue, but most stops are envisaged as long weekends with school or college participation on Friday and wider public activity on Saturday.",
    formTitle: "Host enquiry form",
    formDescription:
      "Tell us about the venue, audience, education links, local history, and dates you are considering.",
    conditionsCta: "Read the hosting conditions",
    features: [
      "The central Solidarity Room is planned as a 4 x 4m space with walls covered by 1,000 postcard-sized images created through Solidarity Park.",
      "The outside street-facing walls can host another 1,000 postcards made by participants during the tour or through schools and colleges.",
      "Venues can add local history, International Brigades material, artist commissions, poetry, music, workshops, and local anti-fascist work where space allows.",
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
        body: "The central Solidarity Room is planned as a 4 x 4m space. Additional street-facing or interior wall space is welcome for the second set of 1,000 postcards and for local and commissioned work.",
      },
      {
        heading: "Programme and duration",
        body: "Most stops are envisaged as long weekends, with school or college participation on Friday and wider public activity on Saturday. Longer exhibition runs are possible where a venue can host them.",
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

  links: {
    heroTitle: "Links",
    heroSubtitle:
      "Partners, collaborators, and further reading connected to the Solidarity Park project and the anti-fascist memory it draws on.",
    groups: [
      {
        title: "The project",
        items: [
          { label: "Association Solidarity Park", note: "The organisation behind the exhibition." },
          { label: "Solidarity Park Festival, Catalunya", note: "The festival the 2027 tour builds toward." },
        ],
      },
      {
        title: "History and memory",
        items: [
          { label: "International Brigade Memorial Trust", note: "Keeping the memory of the International Brigades alive." },
          { label: "Basque Children of '37 Association", note: "The story of children evacuated during the Spanish Civil War." },
        ],
      },
      {
        title: "Get involved",
        items: [
          { label: "Contribute artwork", note: "Send preview material through a secure link." },
          { label: "Host the exhibition", note: "Bring a stop on the tour to your venue." },
        ],
      },
    ],
    note: "Link destinations will be finalised by the project team.",
  },

  footer: {
    tagline: "European touring exhibition from the Solidarity Park project.",
    navTitle: "Explore",
  },
};

export type Translation = typeof en;
