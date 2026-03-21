"use client";
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

type PaginationItem = number | "...";

export function getPagination(
  currentPage: number,
  totalPages: number,
  siblingCount = 2
): PaginationItem[] {
  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const left = Math.max(currentPage - siblingCount, 1);
  const right = Math.min(currentPage + siblingCount, totalPages);

  const pages: PaginationItem[] = [];

  // 🔹 Caso simple: mostrar todo
  if (totalPages <= 1 + siblingCount * 2 + 2) {
    return range(1, totalPages);
  }

  // 🔹 Siempre primera página
  pages.push(1);

  // 🔹 Dots izquierda
  if (left > 2) {
    pages.push("...");
  }

  // 🔹 Rango central (evitando duplicar 1 y last)
  const middleStart = Math.max(left, 2);
  const middleEnd = Math.min(right, totalPages - 1);

  pages.push(...range(middleStart, middleEnd));

  // 🔹 Dots derecha
  if (right < totalPages - 1) {
    pages.push("...");
  }

  // 🔹 Última página
  pages.push(totalPages);

  return pages;
}
