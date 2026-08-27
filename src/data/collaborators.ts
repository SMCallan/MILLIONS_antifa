// Collaborator profiles for /collaborators.
//
// Add an entry per person or organisation. Keep `bio` to roughly 100 words —
// the page is a directory, not a set of essays. `image` is a path under
// public/collaborators/; `href` is wherever they want people sent (portfolio,
// organisation, social). Both are optional: a profile without an image gets
// initials, and one without a link renders as plain text rather than a dead
// anchor.
//
// Bios are published as written, in the language the collaborator supplied
// them in, so they are not part of the i18n dictionaries.
export type Collaborator = {
  name: string;
  role?: string;
  bio: string;
  image?: string;
  href?: string;
};

export const collaborators: Collaborator[] = [];
