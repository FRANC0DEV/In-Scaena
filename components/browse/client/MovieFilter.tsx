"use client";

import {
  MovieFilterByType,
  MovieFilterByTypeValuesObj,
} from "@/types/shared/browse";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useCallback, useState } from "react";

export const MovieFilter: FC = () => {
  const readOnlySearchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] =
    useState<MovieFilterByType | null>(
      readOnlySearchParams.get("filterBy") as MovieFilterByType | null
    );

  const handleChange = useCallback(
    (value: MovieFilterByType) => {
      const searchParams = new URLSearchParams(readOnlySearchParams);
      //eliminando parametros dependientes
      searchParams.delete("page");
      // Permite deseleccionar si se hace click en el mismo
      if (selectedFilter === value) {
        setSelectedFilter(null);
        searchParams.delete("filterBy");
      } else {
        setSelectedFilter(value);
        searchParams.set("filterBy", value);
      }
      router.replace(`${pathname}?${searchParams.toString()}`);
    },
    [readOnlySearchParams, pathname, router]
  );

  return (
    <fieldset>
      <legend>Select a filter:</legend>
      {Object.values(MovieFilterByTypeValuesObj).map((val, i) => (
        <div key={`${i}-${val}`}>
          <input
            type="radio"
            id={`${i}-${val}`}
            name="filter"
            value={val}
            checked={selectedFilter === val}
            onChange={() => handleChange(val)}
          />
          <label htmlFor={`${i}-${val}`}>{val}</label>
        </div>
      ))}
    </fieldset>
  );
};
