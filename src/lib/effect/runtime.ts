import { Config, Effect, Layer } from "effect";
import { ContentServiceLive } from "./content-service";
import { EmailServiceLive, EmailServiceLocal } from "./email-service";

const emailProvider = Config.literal(
  "local",
  "live",
)("EMAIL_PROVIDER").pipe(Config.withDefault("live" as const));

const EmailLayer = Layer.unwrapEffect(
  Effect.gen(function* () {
    const provider = yield* emailProvider;
    return provider === "local" ? EmailServiceLocal : EmailServiceLive;
  }),
);

export const MainLive = Layer.merge(ContentServiceLive, EmailLayer);
