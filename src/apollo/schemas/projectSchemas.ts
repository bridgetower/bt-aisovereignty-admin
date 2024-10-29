import { gql } from '@apollo/client';

export const CREATE_NEW_PROJECT = gql`
  mutation Mymutation(
    $name: String!
    $description: String
    $projectType: String!
    $organizationId: String!
    $files: [FileInput]!
  ) {
    AddProjectAndReference(
      input: {
        projectType: $projectType
        name: $name
        description: $description
        organizationId: $organizationId
        files: $files
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
        files
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
export const FETCH_PROJECT_BY_ID = gql`
  query MyQuery($pageNo: Int!, $limit: Int!, $projectId: String!) {
    GetProjectById(
      input: { pageNo: $pageNo, limit: $limit, projectId: $projectId }
    ) {
      data {
        project {
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
        references {
          refs {
            chainid
            chaintype
            createdat
            datasourceid
            depth
            id
            ingested
            ingestionjobid
            name
            referencestage
            reftype
            s3poststorehash
            url
            size
            s3prestoretxhash
            s3prestorehash
            s3poststoretxhash
          }
          total
          totalPages
        }
      }
      error
      status
    }
  }
`;
