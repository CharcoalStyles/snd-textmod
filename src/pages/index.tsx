import { Header } from "@/components";
import { Search } from "@/components/Search";
import { TextmodList } from "@/components";
import { Button, Text } from "@/components/ui";

export default function Home() {
  return (
    <main className="h-screen min-h-screen bg-right bg-cover w-screen contain-content">
      <div className="sticky">
        <Header />
      </div>
      <div className="h-screen p-2 w-screen overflow-y-auto scrollbar scrollbar-thumb-primary">
        <div className="">
          <div className="">
            <Search />
          </div>
          <div className="flex flex-row gap-4 flex-wrap justify-center">
            <div className="basis-72 max-w-96 flex-grow">
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

            <div className="basis-72 max-w-96 flex-grow">
              <div className="flex justify-center">
                <Text fontSize="3xl" fontType="heading">
                  Highest Rated (All)
                </Text>
              </div>
              <TextmodList table="mods_rated_alltime" />
            </div>

            <div className="basis-72 max-w-96 flex-grow">
              <div className="flex justify-center">
                <Text fontSize="3xl" fontType="heading">
                  Highest Rated (All)
                </Text>
              </div>
              <TextmodList table="mods_rated_alltime" />
            </div>

            <div className="basis-72 max-w-96 flex-grow">
              <div className="flex justify-center">
                <Text fontSize="3xl" fontType="heading">
                  Highest Rated (All)
                </Text>
              </div>
              <TextmodList table="mods_rated_alltime" />
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
        </div>
        <div className="h-40"></div>
      </div>

      <footer className="sticky h-min-6 px-8 bg-secondary z-50 bottom-0 flex flex-row gap-2 justify-center">
        <Text
          variant="black"
          onHover
          showHoverable
          onClick={() => {
            window.open("https://www.charcoalstyles.com", "_blank");
          }}>
          charcoalstyles.com
        </Text>
        |
        <Text
          variant="black"
          onHover
          showHoverable
          onClick={() => {
            window.open("https://ko-fi.com/charcoalstyles", "_blank");
          }}>
          Ko-Fi
        </Text>
        |
        <Text
          variant="black"
          onHover
          showHoverable
          onClick={() => {
            window.open(
              "mailto:aaron@charcoalstyles.com?subject=SnD TextMod DB Feedback",
              "_blank"
            );
          }}>
          Feedback
        </Text>
      </footer>
    </main>
  );
}
