import { client } from "..";

export const AddBranchFetch = async (
  name: string,
  username: string,
  password: string
) => {
  const response = await client.branch.$post({
    form: {
      name,
      username,
      password,
    },
  });

  const data = await response.json();
  return data;
};

export const BranchDetailsFetch = async (id: string) => {
  const response = await client.branch.$get({
    query: {
      id,
    },
  });

  const data = await response.json();
  return data;
};

export const PermanentlyDeleteBranchFetch = async (id: string) => {
  const response = await client.branch.$delete({
    query: {
      id,
    },
  });
  const data = await response.json();
  return data;
};

export const UpdateBranchDetailsFetch = async (
  id: string,
  name: string,
  username: string
) => {
  const response = await client.branch.$patch({
    form: {
      name,
      username,
    },
    query: {
      id,
    },
  });

  const data = await response.json();
  return data;
};

export const PasswordChangeBranchFetch = async (
  id: string,
  password: string
) => {
  const response = await client.branch.password.$patch({
    form: {
      password,
    },
    query: {
      id,
    },
  });

  const data = await response.json();
  return data;
};

export const DeactivateBranchFetch = async (id: string) => {
  const response = await client.branch.deactivate.$patch({
    query: {
      id,
    },
  });

  const data = await response.json();
  return data;
};

export const ActivateBranchFetch = async (id: string) => {
  const response = await client.branch.activate.$patch({
    query: {
      id,
    },
  });

  const data = await response.json();
  return data;
};
