import { gql } from '@apollo/client';

export const CREATE_NEW_PROJECT = gql`
  mutation Mymutation(
    $name: String!
    $description: String
    $projectType: String!
    $organizationId: String!
  ) {
    CreateProject(
      input: {
        projectType: $projectType
        name: $name
        description: $description
        organizationId: $organizationId
      }
    ) {
      data {
        createdat
        createdby
        description
        id
        projecttype
        projectstatus
        projectstage
        organizationid
        name
        isactive
      }
      error
      status
    }
  }
`;
export const FETCH_PROJECT_LIST = gql`
  query MyQuery($pageNo: Int!, $limit: Int!, $organizationId: String!) {
    ListProject(
      input: { pageNo: $pageNo, limit: $limit, organizationId: $organizationId }
    ) {
      data {
        total
        totalPages
        projects {
          createdat
          createdby
          description
          id
          projecttype
          projectstatus
          projectstage
          organizationid
          name
          isactive
        }
      }
      error
      status
    }
  }
`;
