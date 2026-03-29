import TradePlaceholderPage from "@/features/user/trade/TradePlaceholderPage";

export default async function Page({
  params,
}: {
  params: Promise<{ strategyId: string }>;
}) {
  const { strategyId } = await params;

  return <TradePlaceholderPage title={`Trade Strategy Details • ${strategyId}`} />;
}