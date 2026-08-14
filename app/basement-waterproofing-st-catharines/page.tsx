import { cityMetadata, CityPageView } from "@/components/city/CityPageView";
import { stCatharines } from "@/lib/cities/st-catharines";

export const metadata = cityMetadata(stCatharines);

export default function Page() {
  return <CityPageView page={stCatharines} />;
}
