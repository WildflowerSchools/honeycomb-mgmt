import gql from "graphql-tag";

const LOAD_ENVIRONMENT = gql`
  query getEnvironment($environment_id: ID!) {
    getEnvironment(environment_id: $environment_id) {
      environment_id
      name
      location
      description
      assignments(current: true) {
        assignment_id
        assigned_type
        start
        end
        assigned {
          ... on Device {
            name
            device_id
            part_number
            confgurations(current: true) {
              start
              end
              properties {
                name
                value
                type
              }
            }
          }
        }
      }
    }
  }
`;

const REMOVE_FROM_ENV = gql`
  mutation updateAssignment($assignment_id: ID!, $end: DateTime) {
    updateAssignment(assignment_id: $assignment_id, assignment: { end: $end }) {
      assignment_id
      start
      end
    }
  }
`;

const LOAD_ENVIRONMENTS = gql`
  {
    environments {
      data {
        name
        environment_id
        description
        system {
          created
          last_modified
        }
      }
    }
  }
`;

const ASSIGN_TO_ENV = gql`
  mutation assignToEnvironment($assignment: AssignmentInput) {
    assignToEnvironment(assignment: $assignment) {
      assignment_id
    }
  }
`;

const ASSIGNMENTS = gql`
query getEnv($environment_id: ID!) {
  getEnvironment(environment_id: $environment_id) {
    name
    assignments(current: true) {
      assignment_id
      assigned_type
      data(query: {field: "format", operator: EQ, value: "application/json"}, page: {max: 1, sort: [{field: "observed_time", direction: DESC}]}) {
        data_id
        format
        observed_time
        file {
          data
        }
      }
      assigned {
        ... on Device {
          name
          device_id
          part_number
          confgurations(current: true, page: {max: 1, sort: [{field: "start", direction: DESC}]}) {
            properties {
              name
              value
              type
            }
          }
        }
      }
    }
  }
}
`;

const OBSERVER_DATA_FOR_RANGE = gql`
query findDatapoints($start: String, $end: String, $observer: String) {
  findDatapoints(query: {
    operator: AND,
    children: [
      {field: "observed_time", operator: LTE, value: $end},
      {field: "observed_time", operator: GTE, value: $start},
      {field: "observer", operator: EQ, value: $observer}
    ]
  }) {
    data {
      data_id
      observed_time
      format
      file {
        data
      }
    }
  }
}
`

export {
  LOAD_ENVIRONMENT,
  REMOVE_FROM_ENV,
  LOAD_ENVIRONMENTS,
  ASSIGN_TO_ENV,
  ASSIGNMENTS,
  OBSERVER_DATA_FOR_RANGE,
};
