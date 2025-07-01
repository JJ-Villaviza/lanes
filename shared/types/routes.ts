export type CompanyBranches = {
  id: string;
  company: string;
  branches: {
    id: string;
    name: string;
  }[];
};
