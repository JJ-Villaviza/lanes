import { AuthOptions } from "@/service/options/authentication";
import { useAuthQuery } from "@/service/query/authentication";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { AuthData, AuthUtils } from "@/shared/types/client-auth";
import { router } from "../main";

export const useAuth = (): AuthData => {
  const userQuery = useAuthQuery();
  const queryClient = useQueryClient();

  useEffect(() => {
    router.invalidate();
  }, [userQuery.data]);

  const utils: AuthUtils = {
    signIn: () => {
      router.navigate({ to: "/login" });
    },
    signOut: () => {
      sessionStorage.removeItem("__session");
      queryClient.setQueryData(["user"], null);
    },
    ensureData: () => {
      return queryClient.ensureQueryData(AuthOptions());
    },
  };

  switch (true) {
    case userQuery.isPending:
      return { ...utils, user: null, status: "PENDING" };

    case !userQuery.data:
      return { ...utils, user: null, status: "UNAUTHENTICATED" };

    default:
      return { ...utils, user: userQuery.data, status: "AUTHENTICATED" };
  }
};
