import { cityMetadata, CityPageView } from "@/components/city/CityPageView";
import { niagaraFalls } from "@/lib/cities/niagara-falls";

export const metadata = cityMetadata(niagaraFalls);

export default function Page() {
  return <CityPageView page={niagaraFalls} />;
}
