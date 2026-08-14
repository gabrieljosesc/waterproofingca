import { cityMetadata, CityPageView } from "@/components/city/CityPageView";
import { london } from "@/lib/cities/london";

export const metadata = cityMetadata(london);

export default function Page() {
  return <CityPageView page={london} />;
}
