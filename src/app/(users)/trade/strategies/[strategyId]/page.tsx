import TradeStrategyDetailsPage from "@/features/user/tradeStrategyDetails/page";

export default async function Page({
  params,
}: {
  params: Promise<{ strategyId: string }>;
}) {
  const { strategyId } = await params;
  return <TradeStrategyDetailsPage strategyId={strategyId} />;
}