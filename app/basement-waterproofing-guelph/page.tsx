import { cityMetadata, CityPageView } from "@/components/city/CityPageView";
import { guelph } from "@/lib/cities/guelph";

export const metadata = cityMetadata(guelph);

export default function Page() {
  return <CityPageView page={guelph} />;
}
