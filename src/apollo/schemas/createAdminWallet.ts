import { gql } from '@apollo/client';

export const CREATE_ADMIN_WALLET_QUERY = gql`
  query MyQuery($chainType: String!, $tenantUserId: String!) {
    CreateAdminWallet(
      input: { chainType: $chainType, tenantUserId: $tenantUserId }
    ) {
      status
      error
      data {
        chaintype
        createdat
        customerid
        emailid
        tenantid
        tenantuserid
        walletaddress
      }
    }
  }
`;
