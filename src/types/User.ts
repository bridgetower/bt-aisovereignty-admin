export interface IUser {
  firstName: string;
  lastName: string;
  emailId: string;
  picture?: string;
  kycStatus?: boolean;
}

export interface IDBUser {
  __typename: string;
  createdat: string | null;
  id: string;
  emailid: string;
  tenantid: string;
  tenantuserid: string;
}
