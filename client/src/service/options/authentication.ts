import { queryOptions } from "@tanstack/react-query";
import { MeFetch } from "../fetch/authentication";

export const AuthOptions = () => {
  return queryOptions({
    queryKey: ["user"],
    queryFn: async () => await MeFetch(),
    staleTime: Infinity,
  });
};
