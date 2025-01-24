import { Header } from "@/components";
import { Search } from "@/components/Search";
import { TextmodList } from "@/components";
import { Button, Text } from "@/components/ui";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="h-screen min-h-screen w-screen contain-content">
      <Header />
      <div className="h-screen p-2 w-screen overflow-y-auto scrollbar scrollbar-thumb-primary">
        <div className="">
          <div className="mx-auto w-80">
            <Search />
          </div>
          <div className="flex flex-row gap-4 flex-wrap justify-center">
            <div className="basis-72 max-w-96 flex-grow">
              <div className="flex justify-center">
                <Text fontSize="3xl" fontType="heading">
                  Latest
                </Text>
              </div>
              <TextmodList cacheUrl="mods/latest" />
            </div>

            <div className="basis-72 max-w-96 flex-grow">
              <div className="flex justify-center">
                <Text fontSize="3xl" fontType="heading">
                  Highest Rated (All)
                </Text>
              </div>
              <TextmodList cacheUrl="mods/top" />
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
        </div>
        <div className="h-40"></div>
      </div>

      <Footer />
    </main>
  );
}
