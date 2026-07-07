import type { NavLink } from "@/components/layout/nav";
import type { FeatureFlags } from "@/types/content/singletons";

export function buildNavLinks(cmsLinks: readonly NavLink[], flags: FeatureFlags): NavLink[] {
  return cmsLinks.filter((link) => {
    if (link.url === "/writing") return flags.showWriting;
    if (link.url === "/contact") return flags.showContact;
    return true;
  });
}
