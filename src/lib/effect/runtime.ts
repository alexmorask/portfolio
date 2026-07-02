import { Layer } from "effect";
import { ContentServiceLive } from "./content-service";
import { EmailServiceLive } from "./email-service";

/**
 * Merge all Live layers into one. Call sites provide this to their Effects:
 *
 *   Effect.runPromise(program.pipe(Effect.provide(MainLive)))
 */
export const MainLive = Layer.merge(ContentServiceLive, EmailServiceLive);
