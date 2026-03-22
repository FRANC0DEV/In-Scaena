"use client";

import { MediaType } from "@/app/browse/page";
import { FC, useCallback, useState } from "react";
import { MediaTypeValuesObj } from "@/app/browse/page";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
export const MediaSelector: FC<{ initialValue: MediaType }> = ({
  initialValue,
}) => {
  const pathname = usePathname();
  const readOnlySearchParams = useSearchParams();
  const router = useRouter();
  const [mediaType, setMediaType] = useState<MediaType>(initialValue);
  const handleMediaTypeChange = useCallback(
    (mt: MediaType) => {
      setMediaType(mt);
      const searchParams = new URLSearchParams(readOnlySearchParams);
      /**Cambiamos el tipo de media*/
      searchParams.set("type", mt);
      /**Reseteamos los fields dependientes a este (generos, filtro, pagina y ordenamiento) a sus valores predeterminados*/
      searchParams.delete("page");
      searchParams.delete("genres");
      searchParams.delete("sortBy");
      searchParams.delete("filterBy");
      /**Actualizamos la URL*/
      router.replace(`${pathname}?${searchParams.toString()}`);
    },
    [pathname, readOnlySearchParams, router]
  );
  return (
    <>
      <label htmlFor="mediaTypeSelectField">Select Media Type</label>
      <select
        name="media-type"
        id="mediaTypeSelectField"
        onChange={(e) => handleMediaTypeChange(e.target.value as MediaType)}
        value={mediaType}
      >
        {Object.values(MediaTypeValuesObj).map((val, i) => (
          <option key={`${i}-${val}`} value={val}>
            {mediaTypeToLabelMap.get(val) ?? val}
          </option>
        ))}
      </select>
    </>
  );
};

const mediaTypeToLabelMap = new Map<MediaType, string>([
  ["movie", "Movies"],
  ["tvSeries", "Series"],
]);
