import { cityMetadata, CityPageView } from "@/components/city/CityPageView";
import { waterloo } from "@/lib/cities/waterloo";

export const metadata = cityMetadata(waterloo);

export default function Page() {
  return <CityPageView page={waterloo} />;
}
