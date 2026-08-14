import { cityMetadata, CityPageView } from "@/components/city/CityPageView";
import { brantford } from "@/lib/cities/brantford";

export const metadata = cityMetadata(brantford);

export default function Page() {
  return <CityPageView page={brantford} />;
}
