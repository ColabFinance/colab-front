"use client";

import { Pagination } from "@/presentation/components/Pagination";

type Props = {
  page: number;
  totalPages: number;
  limit: number;
  total: number;
  onChangePage: (page: number) => void;
  onChangeLimit: (limit: number) => void;
};

export function TradeStrategiesPagination(props: Props) {
  return <Pagination {...props} />;
}