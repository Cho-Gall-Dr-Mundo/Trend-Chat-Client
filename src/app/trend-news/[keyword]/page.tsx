import { NewsDetailProvider } from "@/context/NewsDetailContext";
import NewsDetailPage from "./_NewsDetailPage";

export default function Page() {
  return (
    <NewsDetailProvider>
      <NewsDetailPage />
    </NewsDetailProvider>
  );
}
