import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { getCategories } from "@/features/categories/services/categories.service";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <>
      <Header />

      <main className="flex-1">{children}</main>

      <Footer />

      <MobileNavDrawer categories={categories} />

      <SearchOverlay />
    </>
  );
}
