import { cityMetadata, CityPageView } from "@/components/city/CityPageView";
import { toronto } from "@/lib/cities/toronto";

export const metadata = cityMetadata(toronto);

export default function Page() {
  return <CityPageView page={toronto} />;
}
