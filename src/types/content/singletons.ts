export interface Experience {
  readonly title: string;
  readonly date: string;
  readonly company: string;
  readonly description: string;
  readonly sortOrder: number | null;
}

export interface HomePage {
  readonly hero: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly introParagraph: string;
    readonly secondaryParagraph: string;
  };
  readonly focusAreas: {
    readonly heading: string;
    readonly items: readonly string[];
  };
  readonly experience: {
    readonly heading: string;
    readonly items: readonly Experience[];
  };
}

export interface AboutPage {
  readonly intro: {
    readonly heading: string;
    readonly introParagraph: string;
    readonly secondaryParagraph: string;
  };
  readonly background: {
    readonly body: string;
  };
  readonly howIWork: {
    readonly heading: string;
    readonly items: readonly string[];
  };
  readonly beyondTheLedger: {
    readonly heading: string;
    readonly body: string;
  };
}

export interface WritingPage {
  readonly title: string;
  readonly description: string;
  readonly featuredPostSlug: string | null;
}

export interface FeatureFlags {
  readonly showWriting: boolean;
  readonly showContact: boolean;
}

export interface ContactPage {
  readonly eyebrow: string;
  readonly heading: string;
  readonly description: string;
  readonly availabilityLabel: string;
  readonly email: string;
  readonly github: string;
  readonly linkedin: string;
  readonly location: string;
}
