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
          isactive
          name
          organizationid
          projectstage
          projectstatus
          projecttype
        }
        stagedata {
          total
          totalPages
          stages {
            createdat
            description
            id
            isactive
            isdeleted
            name
            stagesequence
            stagetypeid
            status
            steps {
              createdat
              description
              id
              isactive
              isdeleted
              name
              stageid
              status
              stepsequence
              stepdetails {
                createdat
                id
                isactive
                isdeleted
                metadata
                status
                stepid
              }
            }
          }
        }
      }
      error
      status
    }
  }
`;
