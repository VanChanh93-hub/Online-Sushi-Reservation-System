import { useMemo } from "react";

type KeyOf<T> = keyof T;

export function useSearchFilter<T>(
  data: T[],
  searchText: string,
  keysToSearch: KeyOf<T>[]
): T[] {
const filteredData = useMemo(() => {
  const lowerSearch = searchText.toLowerCase();

  if (!searchText.trim()) return data;

  return data.filter((item) =>
    keysToSearch.some((key) => {
      const value = item[key];
      return (
        typeof value === "string" &&
        value.toLowerCase().includes(lowerSearch)
      );
    })
  );
}, [data, searchText, keysToSearch]);

  return filteredData;
}
