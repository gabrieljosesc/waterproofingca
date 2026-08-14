import { cityMetadata, CityPageView } from "@/components/city/CityPageView";
import { oakville } from "@/lib/cities/oakville";

export const metadata = cityMetadata(oakville);

export default function Page() {
  return <CityPageView page={oakville} />;
}
