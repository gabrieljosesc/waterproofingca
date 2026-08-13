import { cityMetadata, CityPageView } from "@/components/city/CityPageView";
import { richmondHill } from "@/lib/cities/richmond-hill";

export const metadata = cityMetadata(richmondHill);

export default function Page() {
  return <CityPageView page={richmondHill} />;
}
