import { collection, config, fields, singleton } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    tags: collection({
      label: "Tags",
      slugField: "name",
      path: "content/tags/*/",
      schema: {
        name: fields.slug({
          name: {
            label: "Slug",
            validation: { length: { min: 1 } },
          },
        }),
        label: fields.text({
          label: "Display Name",
          validation: { length: { min: 1 } },
        }),
      },
    }),
    navLinks: collection({
      label: "Nav Links",
      slugField: "label",
      path: "content/nav-links/*/",
      schema: {
        label: fields.slug({
          name: {
            label: "Label",
            validation: { length: { min: 1 } },
          },
        }),
        url: fields.text({
          label: "URL",
          validation: { length: { min: 1 } },
        }),
        sortOrder: fields.integer({
          label: "Sort Order",
          defaultValue: 0,
        }),
      },
    }),
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "content/posts/*/",
      format: { contentField: "body" },
      schema: {
        title: fields.slug({
          name: {
            label: "Title",
            validation: { length: { min: 1 } },
          },
        }),
        summary: fields.text({
          label: "Summary",
          multiline: true,
        }),
        tags: fields.multiRelationship({
          label: "Tags",
          collection: "tags",
        }),
        publishedAt: fields.date({
          label: "Published",
          defaultValue: "",
        }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" },
          ],
          defaultValue: "draft",
        }),
        body: fields.mdx({
          label: "Content",
          description:
            "MDX body. Embed diagrams as JSX components (e.g., <IdempotentWritePathDiagram />). Images can be referenced via standard Markdown syntax.",
        }),
      },
    }),
  },
  singletons: {
    home: singleton({
      label: "Home Page",
      path: "content/home/",
      schema: {
        hero: fields.object(
          {
            eyebrow: fields.text({
              label: "Eyebrow",
              description:
                'Mono text above the heading (e.g., "STAFF SOFTWARE ENGINEER — BILLING, PAYMENTS & MONETIZATION")',
            }),
            heading: fields.text({
              label: "Heading",
              description: "Your name / main heading",
            }),
            introParagraph: fields.text({
              label: "Intro Paragraph",
              multiline: true,
            }),
            secondaryParagraph: fields.text({
              label: "Secondary Paragraph",
              multiline: true,
            }),
          },
          { label: "Hero", description: "Primary hero section at the top of the page" },
        ),
        focusAreas: fields.object(
          {
            heading: fields.text({
              label: "Section Heading",
              defaultValue: "01 / FOCUS AREAS",
            }),
            items: fields.array(
              fields.object({
                text: fields.text({
                  label: "Focus Area",
                }),
                sortOrder: fields.integer({
                  label: "Sort Order",
                  defaultValue: 0,
                }),
              }),
              {
                label: "Items",
                itemLabel: (item) =>
                  (
                    (item as { fields?: { text?: { value?: string } } })?.fields?.text?.value ??
                    "New focus area"
                  ).slice(0, 60),
              },
            ),
          },
          { label: "Focus Areas", description: "Grid of focus / specialty areas" },
        ),
        experience: fields.object(
          {
            heading: fields.text({
              label: "Section Heading",
              defaultValue: "02 / EXPERIENCE",
            }),
            items: fields.array(
              fields.object({
                title: fields.text({ label: "Title" }),
                date: fields.text({ label: "Date" }),
                company: fields.text({ label: "Company" }),
                companyUrl: fields.url({
                  label: "Company URL",
                  validation: { isRequired: false },
                }),
                description: fields.text({
                  label: "Description",
                  multiline: true,
                }),
                sortOrder: fields.integer({
                  label: "Sort Order",
                  defaultValue: 0,
                }),
              }),
              {
                label: "Roles",
                itemLabel: (item) =>
                  (
                    (item as { fields?: { title?: { value?: string } } })?.fields?.title?.value ??
                    "New role"
                  ).slice(0, 60),
              },
            ),
          },
          { label: "Experience", description: "Timeline of professional experience" },
        ),
      },
    }),
    about: singleton({
      label: "About Page",
      path: "content/about/",
      schema: {
        intro: fields.object(
          {
            heading: fields.text({
              label: "Heading",
              description: 'e.g., "Hi, I\'m Alex."',
            }),
            introParagraph: fields.text({
              label: "Intro Paragraph",
              multiline: true,
            }),
            secondaryParagraph: fields.text({
              label: "Secondary Paragraph",
              multiline: true,
            }),
          },
          { label: "Intro", description: "Opening section of the About page" },
        ),
        background: fields.object(
          {
            body: fields.text({
              label: "Body",
              multiline: true,
            }),
          },
          { label: "Background", description: "Professional background and experience" },
        ),
        howIWork: fields.object(
          {
            heading: fields.text({
              label: "Section Heading",
              defaultValue: "HOW I WORK",
            }),
            items: fields.array(
              fields.object({
                text: fields.text({
                  label: "Bullet",
                  multiline: true,
                }),
              }),
              {
                label: "Bullets",
                itemLabel: (item) =>
                  (
                    (item as { fields?: { text?: { value?: string } } })?.fields?.text?.value ??
                    "New bullet"
                  ).slice(0, 60),
              },
            ),
          },
          { label: "How I Work", description: "Bulleted list of work principles" },
        ),
        beyondTheLedger: fields.object(
          {
            heading: fields.text({
              label: "Section Heading",
              defaultValue: "BEYOND THE LEDGER",
            }),
            body: fields.text({
              label: "Body",
              multiline: true,
              description: "Personal/hobby paragraph",
            }),
          },
          { label: "Beyond the Ledger", description: "Personal interests and hobbies" },
        ),
      },
    }),
    writing: singleton({
      label: "Writing",
      path: "content/writing/",
      schema: {
        title: fields.text({
          label: "Title",
          validation: { length: { min: 1 } },
        }),
        description: fields.text({
          label: "Description",
          multiline: true,
        }),
        featuredPost: fields.relationship({
          label: "Featured Post",
          collection: "posts",
          validation: { isRequired: false },
        }),
      },
    }),
    featureFlags: singleton({
      label: "Feature Flags",
      path: "content/feature-flags/",
      schema: {
        showWriting: fields.checkbox({
          label: "Show Writing page",
          defaultValue: false,
        }),
        showContact: fields.checkbox({
          label: "Show Contact page",
          defaultValue: false,
        }),
      },
    }),
    contact: singleton({
      label: "Contact",
      path: "content/contact/",
      schema: {
        eyebrow: fields.text({
          label: "Eyebrow",
          defaultValue: "05 / CONTACT",
        }),
        heading: fields.text({
          label: "Heading",
        }),
        description: fields.text({
          label: "Description",
          multiline: true,
        }),
        availabilityLabel: fields.text({
          label: "Availability Badge",
          defaultValue: "OPEN TO CONSULTING",
        }),
        email: fields.text({
          label: "Email",
        }),
        github: fields.text({
          label: "GitHub URL",
        }),
        linkedin: fields.text({
          label: "LinkedIn URL",
        }),
        location: fields.text({
          label: "Location",
          defaultValue: "Remote",
        }),
      },
    }),
  },
});
