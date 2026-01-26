import { fetchSlogan } from "@/utils/fetchSlogan";
import { PageHeader } from "./PageHeader";

interface PageHeaderServerProps {
  title: string;
  subtitle: string;
  emoji: string;
}

/**
 * Server Component wrapper for PageHeader
 * Fetches slogan on the server and passes it to client component
 * Eliminates client-side API call delay
 */
export async function PageHeaderServer({
  title,
  subtitle,
  emoji,
}: PageHeaderServerProps): Promise<JSX.Element> {
  const slogan = await fetchSlogan();
  return (
    <PageHeader
      title={title}
      subtitle={subtitle}
      emoji={emoji}
      initialSlogan={slogan}
    />
  );
}
