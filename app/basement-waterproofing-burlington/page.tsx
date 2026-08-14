import { cityMetadata, CityPageView } from "@/components/city/CityPageView";
import { burlington } from "@/lib/cities/burlington";

export const metadata = cityMetadata(burlington);

export default function Page() {
  return <CityPageView page={burlington} />;
}
