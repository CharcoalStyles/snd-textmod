import { Header } from "@/components";
import { TextmodList } from "@/components/TextmodList";
import { Text } from "@/components/ui";

export default function Home() {
  return (
    <main className="h-screen pb-14 bg-right bg-cover w-screen">
      <Header>
        <a
          className="flex items-center text-indigo-400 no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
          href="#">
          <Text
            fontSize="4xl"
            scale
            fontType="heading"
            tag="h1"
            variant="primary">
            Slice &amp; Dice Textmod DB
          </Text>
        </a>
      </Header>
      <div className="mt-10 mx-4 flex flex-row gap-4 flex-wrap">
        <div className="basis-72 flex-grow">
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

        <div className="basis-72 flex-grow">
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
