import { Header, Loader } from "@/components";
import { TextmodList } from "@/components";
import { TextmodCard, TextmodCardProps } from "@/components/TextmodCard";
import { Text } from "@/components/ui";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useModOfTheDay = () => {
  return useQuery({
    queryKey: ["motd"],
    queryFn: async () => {
      const { data } = await axios.get<TextmodCardProps | null>(
        "/api/mods/motd"
      );
      if (!data) return null;
      return {
        ...data,
        createdDate: new Date(data.createdDate),
        lastModified: data.lastModified ? new Date(data.lastModified) : null,
      };
    },
  });
};

export default function Home() {
  const { data: motd, isLoading: motdLoading } = useModOfTheDay();

  return (
    <main className="h-screen min-h-screen w-screen contain-content">
      <Header />
      <div className="h-screen p-2 overflow-y-auto md:scrollbar md:scrollbar-thumb-primary">
        <div className="w-screen pr-6 pl-3 md:pr-12 md:pl-6">
          <div className="flex flex-col md:flex-row flex-wrap justify-center gap-2 md:gap-4 mb-8 mx-auto w-80 md:w-full text-xl text-secondary font-bold underline text-center">
            <p>
              <a href="#motd">Mod of the Day</a>
            </p>
            <p>
              <a href="#latest">Newest Mods</a>
            </p>
            <p>
              <a href="#latestUpdated">Latest Updated Mods</a>
            </p>
            <p>
              <a href="#topmods">Top Rated Mods</a>
            </p>
          </div>

          <div
            id="motd"
            className="mb-8 md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto">
            <div className="flex justify-center border-2 border-primary mb-4">
              <Text fontSize="3xl" fontType="heading" variant="primary">
                Mod of the Day
              </Text>
            </div>
            {motdLoading && (
              <div className="w-full text-center">
                <Loader />
              </div>
            )}
            {motd && <TextmodCard {...motd} />}
            {!motd && !motdLoading && (
              <Text fontType="body" variant="secondary">
                No Mod of the Day available.
              </Text>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center items-start">
            <div>
              <div
                id="topmods"
                className="flex justify-center border-2 border-primary mb-4">
                <Text fontSize="3xl" fontType="heading" variant="primary">
                  Top Rated Mods
                </Text>
              </div>
              <TextmodList cacheUrl="mods/top" />
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <div
                  id="latest"
                  className="flex justify-center border-2 border-primary mb-4">
                  <Text fontSize="3xl" fontType="heading" variant="primary">
                    Newest Mods
                  </Text>
                </div>
                <TextmodList query={{ limit: 5, orderBy: "newest" }} />
              </div>

              <div>
                <div
                  id="latestUpdated"
                  className="flex justify-center border-2 border-primary mb-4">
                  <Text fontSize="3xl" fontType="heading" variant="primary">
                    Latest Updated Mods
                  </Text>
                </div>
                <TextmodList query={{ limit: 5, orderBy: "lastUpdated" }} />
              </div>
            </div>
          </div>
        </div>
        <div className="h-40"></div>
      </div>

      <Footer />
    </main>
  );
}
