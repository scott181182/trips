import { Alert, CircularProgress } from "@mui/material";
import type { ReactNode } from "react";

export interface AsyncDataProps<T> {
  data?: T;
  error?: unknown;
  loading?: boolean;
  children?: ReactNode | ((data: T) => ReactNode);
}
export function AsyncData<T>({ data, error, loading, children }: Readonly<AsyncDataProps<T>>) {
  if (loading) {
    return <CircularProgress />;
  }
  if (error) {
    console.error(error);
    if (error instanceof Error) {
      return <Alert severity="error">{error.message}</Alert>;
    } else {
      return <Alert severity="error">An unexpected error occurred. See console logs for details.</Alert>;
    }
  }

  if (data) {
    return typeof children === "function" ? children(data) : children;
  } else {
    return <Alert severity="error">Could not load data, but no error occurred.</Alert>;
  }
}
