import { useEffect, useState } from "react";
import { Input } from "@/components/ui";
import { useDebouncedCallback } from "use-debounce";
import { Text } from "@/components/ui";
import { useTextmodSearch } from "@/hooks/useTextmodSearch";
import { Database } from "@/utils/schema";
import clsx from "clsx";

export const Search = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<Database["public"]["Tables"]["mods"]["Row"]>
  >([]);
  const { data, error, isLoading } = useTextmodSearch({
    search: debouncedSearch,
  });

  const debounce = useDebouncedCallback((value) => {
    if (value.length > 2) setDebouncedSearch(value);
  }, 500);

  useEffect(() => {
    if (data) {
      setSearchResults(data);
    }
    if (error) {
      console.error("Error fetching records:", error);
    }
  }, [data, error]);

  return (
    <div className="flex flex-col relative w-full">
      <div>
        <Input
          label="Search"
          value={search}
          onChange={(v) => {
            setSearch(v);
            debounce(v);
            setSearchResults([]);
          }}
        />
      </div>
      {
        <div
          className={clsx(
            "dropdown-menu top-16 absolute h-auto border border-slate-600 bg-black w-full p-2",
            searchResults.length > 0 && search.length > 2 ? "block" : "hidden"
          )}>
            {searchResults.map((result) => {
              return (
                <div key={result.id}>
                  <Text>{result.name}</Text>
                </div>
              );
            })}
          </div>
      }
    </div>
  );
};
