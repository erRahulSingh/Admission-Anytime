"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminContactRequestsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/admission-forms");
  }, [router]);

  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
