import { apiLpGet, apiLpPost } from "@/infra/api-lp/client";
import type {
  PersistDepositEventRequest,
  PersistWithdrawEventRequest,
  VaultUserEvent,
  VaultUserEventsListResponse,
} from "@/domain/vault/events";

export async function persistVaultDepositEventApi(params: {
  accessToken?: string;
  vault: string; // alias or address
  payload: PersistDepositEventRequest;
}): Promise<VaultUserEvent> {
  return apiLpPost<VaultUserEvent>(
    `/vaults/${encodeURIComponent(params.vault)}/events/deposit`,
    params.payload,
    params.accessToken,
  );
}

export async function persistVaultWithdrawEventApi(params: {
  accessToken?: string;
  vault: string; // alias or address
  payload: PersistWithdrawEventRequest;
}): Promise<VaultUserEvent> {
  return apiLpPost<VaultUserEvent>(
    `/vaults/${encodeURIComponent(params.vault)}/events/withdraw`,
    params.payload,
    params.accessToken,
  );
}

export async function listVaultUserEventsApi(params: {
  accessToken?: string;
  vault: string; // alias or address
  limit?: number;
  offset?: number;
}): Promise<VaultUserEventsListResponse> {
  const qs =
    (typeof params.limit === "number" ? `limit=${encodeURIComponent(String(params.limit))}` : "limit=50") +
    (typeof params.offset === "number" ? `&offset=${encodeURIComponent(String(params.offset))}` : "&offset=0");

  return apiLpGet<VaultUserEventsListResponse>(
    `/vaults/${encodeURIComponent(params.vault)}/events?${qs}`,
    params.accessToken,
  );
}
