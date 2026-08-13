import { cityMetadata, CityPageView } from "@/components/city/CityPageView";
import { hamilton } from "@/lib/cities/hamilton";

export const metadata = cityMetadata(hamilton);

export default function Page() {
  return <CityPageView page={hamilton} />;
}
