import { Temporal } from "@js-temporal/polyfill";
import d3 from "d3";

export interface NarrativeStay {
  location: string;
  start: Date;
  end: Date;
}
export interface NarrativeCharacter {
  stays: NarrativeStay[];
}
export interface NarrativeLocation {
  name: string;
  color?: string;
}

export interface NarrativeChartOptions {
  characters: NarrativeCharacter[];
  locations: NarrativeLocation[];
}
export function NarrativeChart({ characters }: Readonly<NarrativeChartOptions>) {
  if (characters.length > 10) {
    console.warn("Characters above 10 will result in reused colors.");
  }

  const characterColor = d3.scaleOrdinal(d3.schemeCategory10);
  const locationColor = d3.scaleOrdinal(d3.schemeAccent);

  const { startTime, endTime } = characters
    .flatMap((c) => c.stays)
    .reduce(
      (acc, val) => ({
        startTime: val.start < acc.startTime ? val.start : acc.startTime,
        endTime: val.end < acc.startTime ? val.end : acc.startTime,
      }),
      { startTime: characters[0].stays[0].start, endTime: characters[0].stays[0].end },
    );

  const startDate = new Temporal.PlainDate(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());
  const endDate = new Temporal.PlainDate(endTime.getFullYear(), endTime.getMonth(), endTime.getDate());
  const timeRange = endDate.since(startDate);

  const timeScale = d3.scaleTime(
    Array.from({ length: timeRange.days }, (_, idx) => {
      const pd = startDate.add({ days: idx });
      return new Date(pd.year, pd.month - 1, pd.day);
    }),
  );

  return (
    <svg>
      <title>Narrative Chart</title>
    </svg>
  );
}
