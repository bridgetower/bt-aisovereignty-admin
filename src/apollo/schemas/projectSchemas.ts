import { gql } from '@apollo/client';

export const CREATE_NEW_PROJECT = gql`
  mutation Mymutation(
    $name: String!
    $description: String
    $projectType: String!
    $organizationId: String!
    $chainType: String!
    $files: [ProjectFileInput]!
  ) {
    AddProjectAndReference(
      input: {
        projectType: $projectType
        name: $name
        description: $description
        organizationId: $organizationId
        files: $files
        chainType: $chainType
      }
    ) {
      data {
        project {
          references {
            createdat
            datasourceid
            depth
            id
            ingested
            ingestionjobid
            name
            referencestage
            reftype
            size
            status
            url
          }
          chaintype
          createdat
          isactive
          id
          description
          name
          organizationid
          projectstage
          projectstatus
          projecttype
          createdby
        }
        urls {
          key
          url
          id
        }
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
          chaintype
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
          references {
            createdat
            datasourceid
            depth
            id
            ingested
            ingestionjobid
            name
            referencestage
            reftype
            size
            status
            url
          }
          chaintype
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
              stepdetails {
                createdat
                id
                isactive
                isdeleted
                metadata
                status
                stepid
              }
              stepsequence
            }
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
export const UPDATE_PROJECT_STATUS = gql`
  mutation Mymutation($projectId: String!, $files: [FileStatusInput]!) {
    UpdateProjectStatus(input: { projectId: $projectId, files: $files }) {
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
export const UPDATE_PROJECT_STATUS_BY_ADMIN = gql`
  mutation MyMutation($files: [UpdateRefFileInput]!) {
    UpdateReferenceStatusByAdmin(input: { files: $files }) {
      data {
        createdat
        datasourceid
        depth
        id
        ingested
        ingestionjobid
        name
        referencestage
        reftype
        size
        url
      }
      error
      status
    }
  }
`;
export const UPDATE_USERS_REF_STATUS_BY_ADMIN = gql`
  mutation MyMutation($files: [UpdateRefFileInput]!) {
    UpdateRefStatus(input: { files: $files }) {
      data {
        createdat
        datasourceid
        depth
        id
        ingested
        name
        reftype
        status
        url
        referencestage
        projectid
      }
      error
      status
    }
  }
`;
export const ADD_FILE_TO_PROJECT = gql`
  mutation Mymutation($files: [ProjectFileInput]!, $projectId: String!) {
    AddFileToProjectByAdmin(input: { files: $files, projectId: $projectId }) {
      error
      status
      data {
        refs {
          createdat
          datasourceid
          depth
          id
          ingested
          ingestionjobid
          name
          referencestage
          reftype
          size
          status
          url
        }
        urls {
          key
          url
          id
        }
      }
    }
  }
`;
export const FETCH_REFERENCES_BY_PROJECT_ID = gql`
  query MyQuery(
    $limit: Int!
    $pageNo: Int!
    $refType: String!
    $status: String!
  ) {
    ListReference(
      input: {
        limit: $limit
        pageNo: $pageNo
        refType: $refType
        status: $status
      }
    ) {
      data {
        refs {
          createdat
          depth
          id
          projectid
          ingested
          name
          referencestage
          reftype
          size
          status
          url
          datasourceid
          ingestionjobid
        }
        total
        totalPages
      }
      error
      status
    }
  }
`;

export const FETCH_STAGE_BY_REFID = gql`
  query MyQuery($refId: String!) {
    GetStepsByRefId(input: { refId: $refId }) {
      data {
        reference {
          createdat
          datasourceid
          depth
          id
          ingested
          ingestionjobid
          name
          projectid
          referencestage
          reftype
          size
          status
          url
        }
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
            stepdetails {
              createdat
              id
              isactive
              isdeleted
              metadata
              refid
              status
              stepid
            }
            stepsequence
          }
        }
      }
      error
      status
    }
  }
`;
export const DELETE_DOC_REFERENCE = gql`
  mutation Mymutation($refId: String!, $refType: String!) {
    DeleteRefToKnowledgeBase(input: { refId: $refId, refType: $refType }) {
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
