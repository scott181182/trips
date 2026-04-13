import { Stack } from "@mui/material";
import { useCallback, useEffect } from "react";
import {
  type AutocompleteInputProps,
  BooleanInput,
  DateTimeInput,
  type DateTimeInputProps,
  useGetOne,
  type Validator,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";

import { TimeZoneInput } from "./enums";

export function DateTimeDateInput(props: DateTimeInputProps) {
  return (
    <DateTimeInput {...props} parse={(val) => (val ? new Date(val) : typeof val === "string" ? val : undefined)} />
  );
}

export interface DefaultTimeZoneInput extends AutocompleteInputProps {
  parentSource: string;
  parentResource: string;
  parentSourceLabel?: string;
  parentTimeZoneSource: string;
}

export function DefaultTimeZoneInput({
  source,
  parentSource,
  parentResource,
  parentSourceLabel,
  parentTimeZoneSource,
  ...rest
}: Readonly<DefaultTimeZoneInput>) {
  const { setValue } = useFormContext();
  const shouldInheritTimezone = useWatch({ name: "shouldInheritTimezone", defaultValue: true }) as boolean;
  const parentId = useWatch({ name: parentSource }) as string | undefined;
  const { data } = useGetOne(parentResource, { id: parentId }, { enabled: !!parentId });

  const inheritValidator = useCallback<Validator>(
    (value, allValues) => {
      if (value && !allValues[parentSource]) {
        return `You must specify a ${parentSourceLabel ?? parentSource} to use it's time zone`;
      }
    },
    [parentSource, parentSourceLabel],
  );

  useEffect(() => {
    if (source && data && shouldInheritTimezone) {
      console.log(`Update time zone to ${data[parentTimeZoneSource]}`);
      setValue(source, data[parentTimeZoneSource]);
    }
  }, [source, data, parentTimeZoneSource, setValue, shouldInheritTimezone]);

  return (
    <Stack direction="row" spacing={2}>
      <BooleanInput
        source="shouldInheritTimezone"
        label={`Use ${parentSourceLabel ?? parentSource} time zone?`}
        validate={inheritValidator}
        defaultValue={true}
      />
      {shouldInheritTimezone || <TimeZoneInput source={source} {...rest} />}
    </Stack>
  );
}
