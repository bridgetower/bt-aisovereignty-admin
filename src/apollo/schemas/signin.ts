import { gql } from '@apollo/client';

export const SIGN_IN_QUERY = gql`
  query MyQuery($tenantUserId: String!) {
    AdminSignin(input: { tenantUserId: $tenantUserId }) {
      data {
        createdat
        id
        emailid
        tenantid
        tenantuserid
      }
      error
      status
    }
  }
`;
