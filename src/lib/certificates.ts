import { withBasePath } from "@/lib/basePath";

// Real certificates, shared between the License page and the brand story
// section that links to it — one source of fact instead of two copies
// that could drift apart.
export const CERTIFICATES = [
  {
    src: withBasePath("/license/kp-registration.jpg"),
    title: "Brand/Product Registration",
    meta: "KP Food Safety and Halal Food Authority · No. 100012/DG/KPFSHFA/2026 · Valid to 11 Feb 2027",
  },
  {
    src: withBasePath("/license/kp-license.jpg"),
    title: "Food Business License",
    meta: "KP Food Safety and Halal Food Authority · No. 98396/DG/KPFSHA/2025 · Valid to 10 Dec 2027",
  },
  {
    src: withBasePath("/license/pakistan-standards.jpg"),
    title: "Pakistan Standard Mark License",
    meta: "Pakistan Standards and Quality Control Authority · No. CM/CR2-513/2026 · Valid to 23 Feb 2027",
  },
];
