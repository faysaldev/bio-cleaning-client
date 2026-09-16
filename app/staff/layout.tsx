import { ReactNode } from "react";
import { StaffShell } from "@/src/components/Staff/StaffShell";

export default function StaffLayout({children}:{children:ReactNode}) { return <StaffShell>{children}</StaffShell>; }
