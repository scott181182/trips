import { group } from "radashi";

import type { NarrativeCharacter, NarrativeLocation } from ".";

export interface RouteLeg {
  id: string;
  start: Date;
  end: Date;
  location: string;
  characters: NarrativeCharacter[];
}
export interface RouteCharacterLeg {
  location: string;
  start: Date;
  end: Date;
  index: number;
}
export interface RouteCharacter extends NarrativeCharacter {
  route: RouteCharacterLeg[];
}
export interface RoutePlan {
  routeCharacters: RouteCharacter[];
  legs: RouteLeg[];
}
export function calculateRoutes(characters: NarrativeCharacter[], locations: NarrativeLocation[]): RoutePlan {
  const startLocationGroups = group(characters, (c) => c.startLocation ?? "");
  const startLocations = Object.keys(startLocationGroups)
    .filter((l) => !!l)
    .toSorted((a, b) => {
      const aLocationSize = startLocationGroups[a]!.length;
      const bLocationSize = startLocationGroups[b]!.length;

      if (aLocationSize === bLocationSize) {
        return a.localeCompare(b);
      } else {
        return aLocationSize - bLocationSize;
      }
    });

  const characterLocations = characters.map((c) => ({
    id: c.id,
    name: c.name,
    locations: c.stays.map((s) => s.location),
  }));

  const sortedCharacters = characters.toSorted((a, b) => {
    if (!a.startLocation) return 1;
    if (!b.startLocation) return -1;

    if (a.startLocation === b.startLocation) {
      return a.name.localeCompare(b.name);
    } else {
      return startLocations.indexOf(a.startLocation) - startLocations.indexOf(b.startLocation);
    }
  });

  const legStayMap = group(
    sortedCharacters.flatMap((c) => c.stays),
    (stay) => stay.id,
  );
  const legs = Object.entries(legStayMap)
    .map<RouteLeg | undefined>(
      ([legId, stays]) =>
        stays && {
          id: legId,
          location: stays[0].location,
          start: stays.reduce((earliest, stay) => (stay.start < earliest ? stay.start : earliest), stays[0].start),
          end: stays.reduce((latest, stay) => (stay.end > latest ? stay.end : latest), stays[0].end),
          characters: sortedCharacters.filter((c) => stays.some((s) => c.stays.includes(s))),
        },
    )
    .filter((l) => !!l)
    .toSorted((a, b) => a.start.getTime() - b.start.getTime());

  const routeCharacters = sortedCharacters.map<RouteCharacter>((c) => {
    return {
      ...c,
      route: c.stays
        .map<RouteCharacterLeg>((s) => ({
          location: s.location,
          start: s.start,
          end: s.end,
          index: legStayMap[s.id]?.indexOf(s) ?? 0,
        }))
        .toSorted((a, b) => a.start.getTime() - b.start.getTime()),
    };
  });

  console.log({ legs });

  return {
    routeCharacters,
    legs,
  };
}

export function pathSimilarity(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) {
    return 0;
  }

  const aSet = new Set(a);
  const bSet = new Set(b);

  const matching = aSet.intersection(bSet).size;
  const total = aSet.union(bSet).size;

  return matching / total;
}

function clusterOrder<T extends { id: string; path: string[] }>(items: T[]): T[] {
  if (items.length <= 2) {
    return items;
  }

  const allSimilarities = items.map((a) => items.map((b) => pathSimilarity(a.path, b.path)));
}
