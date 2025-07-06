import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginFetch, RegisterFetch } from "../fetch/authentication";
import { toast } from "sonner";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => await LoginFetch(username, password),
    onError: (error) => {
      queryClient.setQueryData(["user"], null);
      toast(error.message);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data?.data);
      toast(data?.message);
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async ({
      name,
      businessName,
      email,
      username,
      password,
    }: {
      name: string;
      businessName: string;
      email: string;
      username: string;
      password: string;
    }) => await RegisterFetch(name, businessName, email, username, password),
    onError: (error) => {
      toast(error.message);
    },
    onSuccess: (data) => {
      toast(data?.message);
    },
  });
};
