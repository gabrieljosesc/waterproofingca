import { cityMetadata, CityPageView } from "@/components/city/CityPageView";
import { vaughan } from "@/lib/cities/vaughan";

export const metadata = cityMetadata(vaughan);

export default function Page() {
  return <CityPageView page={vaughan} />;
}
