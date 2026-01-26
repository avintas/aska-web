import { fetchSlogan } from "@/utils/fetchSlogan";
import { PageSlogan } from "./PageSlogan";

/**
 * Server Component wrapper for PageSlogan
 * Fetches slogan on the server and passes it to client component
 * Eliminates client-side API call delay
 */
export async function PageSloganServer(): Promise<JSX.Element> {
  const slogan = await fetchSlogan();
  return <PageSlogan initialSlogan={slogan} />;
}
