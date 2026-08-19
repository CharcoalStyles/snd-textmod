import { Header } from "@/components";
import { Footer } from "@/components/Footer";
import { TextmodCard, TextmodCardProps } from "@/components/TextmodCard";
import { Button, Input, Text, TagChip } from "@/components/ui";
import { sbToTextmods, supabase } from "@/utils/supabase";
import { ALL_TAGS, Tag } from "@/utils/tags";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [inputSearch, setInputSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [results, setResults] = useState<TextmodCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get("search") || "");
    const urlTags = params
      .getAll("tags")
      .filter((t): t is Tag => (ALL_TAGS as string[]).includes(t));
    setTags(urlTags);
    setInputSearch(params.get("search") || "");
    setSelectedTags(urlTags);
  }, []);

  useEffect(() => {
    if (search.length === 0 && tags.length === 0) {
      setResults([]);
      return;
    }

    (async () => {
      setIsLoading(true);

      let eligibleIds: number[] | undefined;
      if (tags.length > 0) {
        const { data, error } = await supabase
          .from("mod_tags")
          .select("mod_id, tag")
          .in("tag", tags);
        if (error) {
          console.error("Error fetching tagged mods:", error);
          setIsLoading(false);
          return;
        }
        eligibleIds = (data || [])
          .map((row) => row.mod_id)
          .filter((id): id is number => id !== null);
      }

      let query = supabase
        .from("mods")
        .select(
          "*,mod_votes(*), mod_comments(count), user_id(username), mod_tags(tag)"
        );

      if (search.length > 0) {
        query = query.textSearch("name", `'${search}'`);
      }
      if (eligibleIds) {
        query = query.in("id", eligibleIds);
      }

      const { data, error } = await query;
      setIsLoading(false);

      if (error) {
        console.error("Error fetching mods:", error);
        return;
      }

      setResults(sbToTextmods(data));

      const params = new URLSearchParams();
      if (search) params.set("search", search);
      tags.forEach((t) => params.append("tags", t));
      window.history.replaceState(null, "", `?${params.toString()}`);
    })();
  }, [search, tags]);

  return (
    <main className="h-screen min-h-screen w-screen contain-content">
      <Header />
      <div className="h-screen p-2 w-screen overflow-y-auto scrollbar scrollbar-thumb-primary">
        <div className="flex flex-col md:flex-row justify-center gap-8 w-full border-2 border-secondary p-4">
          <div className="flex flex-col flex-wrap justify-center w-full">
            <Input
              label="Search"
              value={inputSearch}
              onChange={setInputSearch}
            />
            <div className="flex flex-row flex-wrap justify-center md:justify-start gap-2">
              {ALL_TAGS.map((tag) => (
                <TagChip
                  key={tag}
                  tag={tag}
                  selected={selectedTags.includes(tag)}
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center w-full md:w-auto">
            <Button
              label="Search"
              onClick={() => {
                setSearch(inputSearch);
                setTags(selectedTags);
              }}
            />
          </div>
        </div>

        <div className="px-4 mx-auto w-full md:w-2/3 mb-52 flex flex-col gap-8">
          {!isLoading && (
            <div className="mt-10 flex flex-col gap-2">
              {results.length === 0 && (search.length > 0 || tags.length > 0) && (
                <div className="flex flex-col items-center justify-center">
                  <Text fontSize="xl">No mods found</Text>
                </div>
              )}
              {results.map((mod) => (
                <div key={mod.id}>
                  <TextmodCard {...mod} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
