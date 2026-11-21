"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServicesFilterBarProps {
  categories: string[];
  modes: string[];
  initialQ?: string;
  initialCategory?: string;
  initialMode?: string;
  initialSort?: string;
}

export default function ServicesFilterBar({
  categories,
  modes,
  initialQ = "",
  initialCategory = "all",
  initialMode = "all",
  initialSort = "newest",
}: ServicesFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState<string>(initialQ);
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);
  const [selectedMode, setSelectedMode] = useState<string>(initialMode);
  const [selectedSort, setSelectedSort] = useState<string>(initialSort);

  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (searchValue === currentQ) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmedQ = searchValue.trim();

      if (trimmedQ) {
        params.set("q", trimmedQ);
      } else {
        params.delete("q");
      }

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, searchParams, pathname, router]);

  const applyFilterChange = (next: {
    q?: string;
    category?: string;
    mode?: string;
    sort?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    const qVal = (next.q ?? searchValue).trim();
    const catVal = next.category ?? selectedCategory;
    const modeVal = next.mode ?? selectedMode;
    const sortVal = next.sort ?? selectedSort;

    if (qVal) {
      params.set("q", qVal);
    } else {
      params.delete("q");
    }

    if (catVal && catVal.toLowerCase() !== "all") {
      params.set("category", catVal);
    } else {
      params.delete("category");
    }

    if (modeVal && modeVal.toLowerCase() !== "all") {
      params.set("mode", modeVal);
    } else {
      params.delete("mode");
    }

    if (sortVal && sortVal !== "newest") {
      params.set("sort", sortVal);
    } else {
      params.delete("sort");
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleReset = () => {
    setSearchValue("");
    setSelectedCategory("all");
    setSelectedMode("all");
    setSelectedSort("newest");
    router.push(pathname);
  };

  const hasActiveFilter =
    Boolean(searchValue.trim()) ||
    selectedCategory.toLowerCase() !== "all" ||
    selectedMode.toLowerCase() !== "all" ||
    selectedSort !== "newest";

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-3.5 shadow-xs">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 items-center">
        {/* Search by title or category */}
        <div className="relative md:col-span-5">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyFilterChange({ q: searchValue });
              }
            }}
            placeholder="Search by title or category"
            className="w-full rounded-xl border border-border bg-background pl-10 pr-3.5 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        {/* Category Filter */}
        <div className="md:col-span-2">
          <select
            value={selectedCategory}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedCategory(val);
              applyFilterChange({ category: val });
            }}
            aria-label="Filter by category"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Service Mode Filter */}
        <div className="md:col-span-2">
          <select
            value={selectedMode}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedMode(val);
              applyFilterChange({ mode: val });
            }}
            aria-label="Filter by service mode"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="all">All Modes</option>
            {modes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className={hasActiveFilter ? "md:col-span-2" : "md:col-span-3"}>
          <select
            value={selectedSort}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedSort(val);
              applyFilterChange({ sort: val });
            }}
            aria-label="Sort services"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </div>

        {/* Reset Button */}
        {hasActiveFilter && (
          <div className="md:col-span-1 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleReset}
              title="Reset filters"
              aria-label="Reset filters"
              className="h-10 w-10 rounded-xl cursor-pointer shrink-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}