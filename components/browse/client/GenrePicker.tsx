"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, use, useCallback, useState } from "react";
import { GenresQueryResult } from "@/types/server/genres";

export const GenrePicker: FC<{
  genresQueryPromise: Promise<GenresQueryResult>;
}> = ({ genresQueryPromise }) => {
  const genresQueryResult = use(genresQueryPromise);
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

  return (
    <div className="flex flex-col">
      {genresQueryResult.genres.map((g) => (
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
