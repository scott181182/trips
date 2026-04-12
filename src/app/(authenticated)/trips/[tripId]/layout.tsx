"use client";

import { useParams } from "next/navigation";
import type { PropsWithChildren } from "react";

import { dataProvider } from "@/lib/dataProvider";
import { TripStoreProvider } from "@/stores/trip/provider";

export default function TripLayout({ children }: PropsWithChildren) {
  const { tripId } = useParams<{ tripId: string }>();

  return (
    <TripStoreProvider dataProvider={dataProvider} tripId={tripId}>
      {children}
    </TripStoreProvider>
  );
}
