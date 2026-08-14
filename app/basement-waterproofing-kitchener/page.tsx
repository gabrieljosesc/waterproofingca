import { cityMetadata, CityPageView } from "@/components/city/CityPageView";
import { kitchener } from "@/lib/cities/kitchener";

export const metadata = cityMetadata(kitchener);

export default function Page() {
  return <CityPageView page={kitchener} />;
}
