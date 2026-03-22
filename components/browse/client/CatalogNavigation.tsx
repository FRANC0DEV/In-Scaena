"use client";
import { getPagination } from "@/lib/pagination/pagination";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { FC } from "react";
export const CatalogNavigation: FC<{
  currentPage: number;
  totalPages: number;
}> = ({ currentPage,totalPages }) => {
  const pathname = usePathname();
  const readOnlySearchParams = useSearchParams();
  const { replace } = useRouter();
  const pages = getPagination(currentPage, totalPages);
  const handleClick = (page: number) => {
    const params = new URLSearchParams(readOnlySearchParams);
    params.set("page", page.toString());
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="flex">
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`${p}-${i}`}>...</span>
        ) : (
          <button
            key={p}
            className={`${p === currentPage ? "font-bold" : ""} border`}
            onClick={() => handleClick(p)}
          >
            {p}
          </button>
        )
      )}
    </div>
  );
};
