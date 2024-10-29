import { gql } from '@apollo/client';

export const CREATE_DOC_REFERENCE = gql`
  mutation Mymutation(
    $projectId: String!
    $refType: String!
    $websiteName: String!
    $websiteUrl: String!
    $depth: Int
    $file: [FileInput]!
  ) {
    AddRefToKnowledgeBase(
      input: {
        projectId: $projectId
        refType: $refType
        websiteName: $websiteName
        websiteUrl: $websiteUrl
        depth: $depth
        file: $file
      }
    ) {
      data {
        createdat
        createdby
        description
        id
        isactive
        name
        organizationid
        projectstage
        projectstatus
        projecttype
      }
      error
      status
    }
  }
`;

export const FETCH_DOC_REFERENCES = gql`
  query MyQuery(
    $pageNo: Int!
    $limit: Int!
    $refType: String
    $projectId: String!
  ) {
    ListReference(
      input: {
        projectId: $projectId
        pageNo: $pageNo
        limit: $limit
        refType: $refType
      }
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
          datasourceid
          ingestionjobid
          s3prestorehash
          s3prestoretxhash
          s3poststorehash
          s3poststoretxhash
          chaintype
          chainid
        }
      }
      error
      status
    }
  }
`;
export const DELETE_DOC_REFERENCE = gql`
  mutation Mymutation($refId: String!) {
    DeleteRefToKnowledgeBase(input: { refId: $refId }) {
      data {
        createdat
        depth
        id
        ingested
        name
        reftype
        size
        url
      }
      error
      status
    }
  }
`;
