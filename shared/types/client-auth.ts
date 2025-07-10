export type AuthResUser = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    username: string;
    type: string;
    accountId: string;
    companyId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  } | null;
};

export type AuthState =
  | { user: null; status: "PENDING" }
  | { user: null; status: "UNAUTHENTICATED" }
  | { user: AuthResUser; status: "AUTHENTICATED" };

export type AuthUtils = {
  signIn: () => void;
  signOut: () => void;
  ensureData: () => Promise<AuthResUser | undefined>;
};

export type AuthData = AuthState & AuthUtils;
