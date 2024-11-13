import { gql } from '@apollo/client';

export const CREATE_PROJECT_STAGE_TYPE = gql`
  mutation MyMutation($name: String!, $description: String) {
    CreateStageType(input: { name: $name, description: $description }) {
      error
      status
      data {
        createdat
        description
        id
        name
      }
    }
  }
`;

export const CREATE_PROJECT_STEP_TYPE = gql`
  mutation MyMutation($name: String!, $description: String) {
    CreateStepType(input: { name: $name, description: $description }) {
      data {
        createdat
        description
        id
        name
      }
      error
      status
    }
  }
`;
export const GET_PROJECT_STAGE_AND_STEP_TYPES = gql`
  query MyQuery($limit: Int!, $pageNo: Int!, $type: String!) {
    ListStageTypeAndStepType(
      input: { limit: $limit, pageNo: $pageNo, type: $type }
    ) {
      data {
        total
        totalPages
        data {
          createdat
          description
          id
          isactive
          isdeleted
          name
        }
      }
    }
  }
`;
