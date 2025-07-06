import { ErrorResponse } from "@/shared/response";
import { client } from "..";

export const LoginFetch = async (username: string, password: string) => {
  const response = await client.auth.login.$post({
    form: {
      username,
      password,
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }
};

export const RegisterFetch = async (
  name: string,
  businessName: string,
  email: string,
  username: string,
  password: string
) => {
  const response = await client.auth.register.$post({
    form: {
      name,
      businessName,
      email,
      username,
      password,
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }
};

export const MeFetch = async () => {
  const response = await client.auth.$get();
  if (response.ok) {
    const data = await response.json();
    return data.data;
  }
  return null;
};
