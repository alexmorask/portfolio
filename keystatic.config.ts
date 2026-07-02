import { collection, config, fields, singleton } from "@keystatic/core";

const tagOptions = [
  { label: "Billing", value: "billing" },
  { label: "Payments", value: "payments" },
  { label: "Distributed Systems", value: "distributed-systems" },
  { label: "Reliability", value: "reliability" },
  { label: "Idempotency", value: "idempotency" },
  { label: "Ledger", value: "ledger" },
  { label: "Reconciliation", value: "reconciliation" },
  { label: "Monetization", value: "monetization" },
  { label: "Pricing", value: "pricing" },
  { label: "Architecture", value: "architecture" },
  { label: "API Design", value: "api-design" },
  { label: "Database Design", value: "database-design" },
];

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    writeUps: collection({
      label: "Write-ups",
      slugField: "title",
      path: "content/write-ups/*/",
      format: { contentField: "body" },
      schema: {
        title: fields.slug({
          name: {
            label: "Title",
            validation: { length: { min: 1 } },
          },
        }),
        kind: fields.select({
          label: "Kind",
          options: [
            { label: "Personal Project", value: "personal-project" },
            { label: "Case Study", value: "case-study" },
          ],
          defaultValue: "personal-project",
        }),
        summary: fields.text({
          label: "Summary",
          multiline: true,
        }),
        tags: fields.multiselect({
          label: "Tags",
          options: tagOptions,
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
        heroEyebrow: fields.text({
          label: "Hero Eyebrow",
          description:
            'Mono text above the heading (e.g., "STAFF SOFTWARE ENGINEER — BILLING, PAYMENTS & MONETIZATION")',
        }),
        heroHeading: fields.text({
          label: "Hero Heading",
          description: "Your name / main heading",
        }),
        heroParagraph1: fields.text({
          label: "Intro Paragraph",
          multiline: true,
        }),
        heroParagraph2: fields.text({
          label: "Secondary Paragraph",
          multiline: true,
        }),
        focusAreas: fields.array(
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
            label: "Focus Areas",
            itemLabel: (item) =>
              (
                (item as { fields?: { text?: { value?: string } } })?.fields?.text?.value ??
                "New focus area"
              ).slice(0, 60),
          },
        ),
        experience: fields.array(
          fields.object({
            title: fields.text({ label: "Title" }),
            date: fields.text({ label: "Date" }),
            company: fields.text({ label: "Company" }),
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
            label: "Experience",
            itemLabel: (item) =>
              (
                (item as { fields?: { title?: { value?: string } } })?.fields?.title?.value ??
                "New role"
              ).slice(0, 60),
          },
        ),
      },
    }),
    about: singleton({
      label: "About Page",
      path: "content/about/",
      schema: {
        heading: fields.text({
          label: "Heading",
          description: 'e.g., "Hi, I\'m Alex."',
        }),
        introParagraph1: fields.text({
          label: "Intro Paragraph 1",
          multiline: true,
        }),
        introParagraph2: fields.text({
          label: "Intro Paragraph 2",
          multiline: true,
        }),
        backgroundParagraph1: fields.text({
          label: "Background Paragraph 1",
          multiline: true,
        }),
        backgroundParagraph2: fields.text({
          label: "Background Paragraph 2",
          multiline: true,
        }),
        howIWork: fields.array(
          fields.object({
            text: fields.text({
              label: "Bullet",
              multiline: true,
            }),
          }),
          {
            label: "How I Work",
            itemLabel: (item) =>
              (
                (item as { fields?: { text?: { value?: string } } })?.fields?.text?.value ??
                "New bullet"
              ).slice(0, 60),
          },
        ),
        beyondTheLedger: fields.text({
          label: "Beyond the Ledger",
          multiline: true,
          description: "Personal/hobby paragraph",
        }),
      },
    }),
  },
});
