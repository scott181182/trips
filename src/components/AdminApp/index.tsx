"use client";

import dynamic from "next/dynamic";

// Necessary indirection so React Admin can be happy in Next.js
// See https://marmelab.com/react-admin/NextJs.html
export const AdminApp = dynamic(() => import("./AdminApp").then((res) => res.AdminApp), {
  ssr: false, // Required to avoid react-router related errors
});
