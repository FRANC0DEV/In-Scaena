"use client";

import { DiscoverMovieObj } from "@/types/shared/browse";
import Image from "next/image";
import { FC } from "react";

export const MovieCard: FC<DiscoverMovieObj> = ({
  poster_path,
  title,
  overview,
}) => {
  return (
    <div className="flex flex-col w-75 gap-2 relative">
      <div className="w-fit relative group">
        <Image
          src={`https://image.tmdb.org/t/p/w780${poster_path}`}
          alt={`${title}-poster-img`}
          width={600}
          height={200}
        ></Image>
        {/* Overlay con sinopsis */}
        <div
          className="
          absolute inset-0
          bg-black/70
          text-white
          opacity-0
          group-hover:opacity-100
          transition-opacity duration-300
          flex items-center justify-center
          p-3 text-sm text-center
        "
        >
          {overview}
        </div>
      </div>

      <h3 className="text-center wrap-break-word">{title}</h3>
    </div>
  );
};
