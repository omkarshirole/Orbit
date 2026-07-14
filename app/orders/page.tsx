import { SectionPage } from "@/components/SectionPage";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search = "" } = await searchParams;
  return <SectionPage kind="orders" initialSearch={search} />;
}
