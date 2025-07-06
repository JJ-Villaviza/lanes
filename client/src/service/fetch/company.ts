import { client } from "..";

export const AdditionalCompanyDetailsFetch = async (
  id: string,
  businessName: string,
  email: string,
  description: string,
  mission: string,
  vision: string
) => {
  const response = await client.company.$patch({
    form: {
      businessName,
      email,
      description,
      mission,
      vision,
    },
    query: {
      id,
    },
  });

  const data = await response.json();
  return data;
};

export const CompanyDetailsFetch = async (id: string) => {
  const response = await client.company.$get({
    query: {
      id,
    },
  });

  const data = await response.json();
  return data;
};

export const CompanyBranchesListFetch = async (id: string) => {
  const response = await client.company.list.$get({
    query: {
      id,
    },
  });

  const data = await response.json();
  return data;
};

export const DeactivateCompanyFetch = async (id: string) => {
  const response = await client.company.deactivate.$patch({
    query: {
      id,
    },
  });

  const data = await response.json();
  return data;
};

export const ActivateCompanyFetch = async (id: string) => {
  const response = await client.company.activate.$patch({
    query: {
      id,
    },
  });

  const data = await response.json();
  return data;
};

export const PermanentlyDeleteCompany = async (id: string) => {
  const response = await client.company.$delete({
    query: {
      id,
    },
  });

  const data = await response.json();
  return data;
};
