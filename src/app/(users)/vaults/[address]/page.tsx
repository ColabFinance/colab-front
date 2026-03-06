import { VaultDetailsPage } from "@/features/user/vaultDetails/page";

export default function Page({ params }: { params: { address: string } }) {
  return <VaultDetailsPage address={params.address} />;
}