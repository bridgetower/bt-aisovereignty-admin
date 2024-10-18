import { gql } from '@apollo/client';

export const CREATE_DOC_REFERENCE = gql`
  mutation Mymutation(
    $refType: String!
    $websiteName: String!
    $websiteUrl: String!
    $depth: Int
    $file: RefFileInput
  ) {
    AddRefToKnowledgeBase(
      input: {
        refType: $refType
        websiteName: $websiteName
        websiteUrl: $websiteUrl
        depth: $depth
        file: $file
      }
    ) {
      data {
        name
        reftype
      }
      error
      status
    }
  }
`;

export const FETCH_DOC_REFERENCES = gql`
  query MyQuery($pageNo: Int!, $limit: Int!, $refType: String!) {
    ListReference(
      input: { pageNo: $pageNo, limit: $limit, refType: $refType }
    ) {
      data {
        total
        totalPages
        refs {
          createdat
          depth
          id
          ingested
          name
          reftype
          size
          url
        }
      }
      error
      status
    }
  }
`;
export const DELETE_DOC_REFERENCE = gql`
  query MyQuery($pageNo: Int!, $limit: Int!) {
    ListReference(input: { pageNo: $pageNo, limit: $limit }) {
      data {
        total
        totalPages
        refs {
          createdat
          id
          name
          reftype
          url
        }
      }
      error
      status
    }
  }
`;
