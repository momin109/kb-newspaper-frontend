import { TopUtilityBar } from "./TopUtilityBar";
import { MainHeader } from "./MainHeader";
import { CategoryNavBar } from "./CategoryNavBar";
import { CollapsibleTopBar } from "./CollapsibleTopBar";
import { getCategories } from "@/features/categories/services/categories.service";

/**
 * TopUtilityBar + MainHeader এখন CollapsibleTopBar-এর ভেতরে — স্ক্রল করলে
 * সাথে সাথেই (২৪px পার হওয়া মাত্র) হাইড হয়ে যায়। CategoryNavBar একাই
 * sticky (top-0), তাই স্ক্রল করলে সেটা সাথে সাথেই উপরে আটকে যাবে।
 */
export async function Header() {
  const categories = await getCategories();

  return (
    <header className="bg-background shadow-sm">
      <CollapsibleTopBar>
        <TopUtilityBar />
        <MainHeader />
      </CollapsibleTopBar>
      <CategoryNavBar categories={categories} />
    </header>
  );
}
