"use client";

import { MediaType } from "@/types/shared/browse";
import { getMovieGenres } from "@/lib/client/browse/get-movie-genres";
import { getTvSeriesGenres } from "@/lib/client/browse/get-tvSeries-genres";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useCallback, useState } from "react";

export const GenrePicker: FC<{ mediaType: MediaType }> = ({ mediaType }) => {
  const pathname = usePathname();
  const readOnlySearchParams = useSearchParams();
  const router = useRouter();
  const [selectedGenresIds, setSelectedGenresIds] = useState<number[]>(() => {
    return (
      readOnlySearchParams
        .get("genres")
        ?.split(",")
        .map((g) => Number(g)) || []
    );
  });

  const handleCheckChange = useCallback(
    (checked: boolean, id: number) => {
      let next: number[];

      if (checked) {
        next = [...selectedGenresIds, id];
      } else {
        next = selectedGenresIds.filter((gid) => gid !== id);
      }

      setSelectedGenresIds(next);

      const params = new URLSearchParams(readOnlySearchParams.toString());

      if (next.length > 0) {
        params.set("genres", next.join(","));
      } else {
        params.delete("genres");
      }

      params.set("page", "1");

      router.replace(`${pathname}?${params.toString()}`);
    },
    [selectedGenresIds, readOnlySearchParams, router, pathname]
  );

  const { data, status, error } = useQuery({
    queryKey: [mediaType, "genres"],
    queryFn: mediaType === "movie" ? getMovieGenres : getTvSeriesGenres,
  });

  if (status === "pending") {
    return <p>Loading...</p>;
  }

  if (status === "error") {
    return <p className="text-destructive">error: {error.message}</p>;
  }

  return (
    <div className="flex flex-row">
      {data.genres.map((g) => (
        <label key={`${g.id}-${g.name}`}>
          <input
            type="checkbox"
            name={g.name}
            id={g.id.toString()}
            onChange={(e) => {
              handleCheckChange(e.currentTarget.checked, g.id);
            }}
            checked={selectedGenresIds.includes(g.id)}
          />
          {g.name}
        </label>
      ))}
    </div>
  );
};
