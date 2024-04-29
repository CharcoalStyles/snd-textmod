import { Header } from "@/components";
import { Search } from "@/components/Search";
import { TextmodList } from "@/components";
import { Text } from "@/components/ui";

export default function Home() {
  return (
    <main className="h-screen pb-14 bg-right bg-cover w-screen">
      <Header />
      <div className="w-full">
        <div className="mx-auto w-full md:w-2/3 lg:w-1/2">
          <Search />
        </div>
      </div>
      <div className="mt-10 mx-4 flex flex-row gap-4 justify-center flex-wrap">
        <div className="basis-72 max-w-96  flex-grow">
          <div className="flex justify-center">
            <Text fontSize="3xl" fontType="heading">
              Latest
            </Text>
          </div>
          <TextmodList
            query={{
              orderBy: "newest",
            }}
          />
        </div>

        <div className="basis-72 max-w-96 flex-grow">
          <div className="flex justify-center">
            <Text fontSize="3xl" fontType="heading">
              Highest Rated (All)
            </Text>
          </div>
          <TextmodList table="mods_rated_alltime" />
        </div>
        {/* 
        <div className="basis-72 flex-grow">
          <div className="flex justify-center">
            <Text fontSize="3xl" fontType="heading">
              Highest Rated (7 days)
            </Text>
          </div>
          <TextmodList table="mods_rated_7days" />
        </div> */}
      </div>
    </main>
  );
}
