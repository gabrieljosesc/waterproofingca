import { cityMetadata, CityPageView } from "@/components/city/CityPageView";
import { mississauga } from "@/lib/cities/mississauga";

export const metadata = cityMetadata(mississauga);

export default function Page() {
  return <CityPageView page={mississauga} />;
}
