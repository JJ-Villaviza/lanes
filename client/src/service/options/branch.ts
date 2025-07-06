import { queryOptions } from "@tanstack/react-query";
import { BranchDetailsFetch } from "../fetch/branch";

export const BranchOptions = ({ id }: { id: string }) => {
  return queryOptions({
    queryKey: ["branch", id],
    queryFn: async () => await BranchDetailsFetch(id),
    staleTime: Infinity,
  });
};
