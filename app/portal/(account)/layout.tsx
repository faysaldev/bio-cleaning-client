import type { ReactNode } from "react";
import { PortalShell } from "@/src/components/Portal/PortalShell";
export default function PortalAccountLayout({ children }: { children: ReactNode }) { return <PortalShell>{children}</PortalShell>; }
