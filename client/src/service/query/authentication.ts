import { useQuery } from "@tanstack/react-query";
import { AuthOptions } from "../options/authentication";

export const useAuthQuery = () => {
  return useQuery(AuthOptions());
};
