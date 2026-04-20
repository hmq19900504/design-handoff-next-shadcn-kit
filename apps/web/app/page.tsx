import bundle from "@/src/generated/handoff.bundle.json";
import { HandoffDashboard } from "@/components/handoff/handoff-dashboard";
import type { DhpBundle } from "@/lib/dhp";

export default function Page() {
  return <HandoffDashboard bundle={bundle as DhpBundle} />;
}
