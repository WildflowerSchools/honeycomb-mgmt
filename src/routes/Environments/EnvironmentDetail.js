/** @format */

import { withRouter } from "react-router-dom";
import { withApollo } from "react-apollo";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import React from "react";
import {
  Container,
  Row,
  Col,
  ButtonGroup,
  Button,
  Form,
  Breadcrumb,
  Table,
  Modal
} from "react-bootstrap";
import { Query } from "react-apollo";

import "react-bootstrap-typeahead/css/Typeahead.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinusSquare,
  faBars,
  faPlusCircle
} from "@fortawesome/free-solid-svg-icons";

import {
  REMOVE_FROM_ENV,
  LOAD_ENVIRONMENT,
  ASSIGN_TO_ENV
} from "./Queries";

class EnvironmentDetail extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.app = props.app;
    this.auth = props.app.auth;
    this.router = context.router;
    this.client = props.client;

    this.state = {
      qvars: {
        environment_id: props.match.params.environmentId
      },
      isAuthenticated: this.auth.isAuthenticated(),
      environmentName: "",
      assignmentName: "",
      assignment_id: "",

      showAddAssignment: false
    };

    this.handleCloseAddAssignment = this.handleCloseAddAssignment.bind(this);
    this.handleShowAddAssignment = this.handleShowAddAssignment.bind(this);
  }

  handleCloseAddAssignment() {
    this.setState({ showAddAssignment: false });
  }

  handleShowAddAssignment() {
    this.setState({ showAddAssignment: true });
  }

  render() {
    return (
      <React.Fragment>
        <Container fluid>
          <Row>
            <Col>
              <Breadcrumb>
                <Breadcrumb.Item href="#/environments">
                  Environments
                </Breadcrumb.Item>
                <Breadcrumb.Item active>
                  {this.state.environmentName}
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </Container>
        <Query
          query={LOAD_ENVIRONMENT}
          variables={this.state.qvars}
          fetchPolicy="cache-and-network"
        >
          {({ data, error, loading }) => {
            if (error) {
              return <div>Error: {error.message}</div>;
            }
            if (loading || !data) {
              return (
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              );
            }
            var environment = data.getEnvironment;
            if (this.state.environmentName !== environment.name) {
              this.setState({
                environmentName: environment.name,
                environment: environment
              });
            }
            return (
              <React.Fragment>
                <AssignmentAddForm
                  environment={environment}
                  show={this.state.showAddAssignment}
                  close={this.handleCloseAddAssignment}
                  client={this.client}
                />
                <Container>
                  <Row>
                    <Col>
                      <dl className="row">
                        <dt className="col-sm-3">Name</dt>
                        <dd className="col-sm-9">{environment.name}</dd>

                        <dt className="col-sm-3">Location</dt>
                        <dd className="col-sm-9">{environment.location}</dd>

                        <dt className="col-sm-3">Description</dt>
                        <dd className="col-sm-9">
                          <p>{environment.description}</p>
                        </dd>
                      </dl>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ButtonGroup aria-label="Assignments">
                        <Button
                          variant="outline-secondary"
                          title="add assignment"
                          onClick={this.handleShowAddAssignment}
                        >
                          <FontAwesomeIcon icon={faPlusCircle} /> Assignment
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <AssignmentList
                        client={this.client}
                        environment={environment}
                      />
                    </Col>
                  </Row>
                </Container>
              </React.Fragment>
            );
          }}
        </Query>
      </React.Fragment>
    );
  }
}

class AssignmentList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.client = props.client;
    this.environment = props.environment;

    this.handleShowRemoverAssignment = this.handleShowRemoverAssignment.bind(
      this
    );
    this.handleCloseRemoverAssignment = this.handleCloseRemoverAssignment.bind(
      this
    );
    this.handleCloseAssignmentDetails = this.handleCloseAssignmentDetails.bind(
      this
    );
    this.handleShowAssignmentDetails = this.handleShowAssignmentDetails.bind(
      this
    );
    this.doRemove = this.doRemove.bind(this);

    this.state = {
      environmentName: "",
      assignmentName: "",
      assignment_id: "",
      showRemoveAssignment: false,
      showAssignmentDetails: false,
      assignment: null
    };
  }

  handleShowRemoverAssignment() {
    this.setState({ showRemoveAssignment: true });
  }

  handleCloseRemoverAssignment() {
    this.setState({ showRemoveAssignment: false });
  }

  handleShowAssignmentDetails() {
    this.setState({ showAssignmentDetails: true });
  }
  handleCloseAssignmentDetails() {
    this.setState({ showAssignmentDetails: false });
  }

  async doRemove() {
    var vars = {
      assignment_id: this.state.assignment_id,
      end: new Date().toISOString()
    };
    this.client.mutate({
      mutation: REMOVE_FROM_ENV,
      variables: vars,
      refetchQueries: () => ["getEnvironment"]
    });
    this.setState({ showRemoveAssignment: false });
  }

  render() {
    var self = this;
    function removeAssignment(assignment) {
      self.setState({
        assignmentName: assignment.assigned.name,
        assignment_id: assignment.assignment_id
      });
      self.handleShowRemoverAssignment();
    }
    function showAddAssignment(assignment) {
      self.setState({
        assignmentName: assignment.assigned.name,
        assignment_id: assignment.assignment_id,
        assignment: assignment
      });
      self.handleShowAssignmentDetails();
    }
    return (
      <React.Fragment>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Type</th>
              <th>Assigned Name</th>
              <th>start</th>
              <th>end</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.environment.assignments.map(function(assignment) {
              return (
                <tr key={assignment.assignment_id}>
                  <td>{assignment.assigned_type}</td>
                  <td>{assignment.assigned.name}</td>
                  <td>{assignment.start}</td>
                  <td>{assignment.end}</td>
                  <td>
                    <ButtonGroup aria-label="Actions">
                      <Button
                        variant="outline-secondary"
                        title="end assignment"
                        onClick={() => removeAssignment(assignment)}
                      >
                        <FontAwesomeIcon icon={faMinusSquare} />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        title="assignment details"
                        onClick={() => showAddAssignment(assignment)}
                      >
                        <FontAwesomeIcon icon={faBars} />
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Modal
          show={this.state.showRemoveAssignment}
          onHide={this.handleCloseRemoverAssignment}
        >
          <Modal.Body>
            Remove {this.state.assignmentName} from {this.state.environmentName}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={this.handleCloseRemoverAssignment}
            >
              Close
            </Button>
            <Button variant="primary" onClick={this.doRemove}>
              Remove
            </Button>
          </Modal.Footer>
        </Modal>
        <AssignmentDetail
          assignment={this.state.assignment}
          show={this.state.showAssignmentDetails}
          close={this.handleCloseAssignmentDetails}
        />
      </React.Fragment>
    );
  }
}

class AssignmentDetail extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      assignment: props.assignment,
      show: props.show
    };
    this.close = props.close;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show !== this.props.show) {
      this.setState({ show: nextProps.show });
    }
    if (nextProps.assignment !== this.props.assignment) {
      this.setState({ assignment: nextProps.assignment });
    }
  }

  render() {
    if (this.state.assignment) {
      return (
        <Modal show={this.state.show} onHide={this.close}>
          <Modal.Body>
            <dl className="row">
              <dt className="col-sm-3">Type</dt>
              <dd className="col-sm-9">
                {this.state.assignment && this.state.assignment.assigned_type}
              </dd>
            </dl>

            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Start</th>
                  <th>End</th>
                  <th>Properties</th>
                </tr>
              </thead>
              <tbody>
                {this.state.assignment.assigned.confgurations.map(function(
                  configuration
                ) {
                  return (
                    <tr key={configuration.device_configuration_id}>
                      <td>{configuration.start}</td>
                      <td>{configuration.end}</td>
                      <td>{configuration.properties.length}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.close}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      );
    } else {
      return "";
    }
  }
}

class AssignmentAddForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      environment: props.environment,
      show: props.show
    };
    this.close = props.close;
    this.client = props.client;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.assignedSelected = this.assignedSelected.bind(this);
    this.formRef = React.createRef();
  }

  handleSubmit(event) {
    event.preventDefault();
    let form = event.target;
    // wishlist.title = form.elements.title.value
    // wishlist.description = form.elements.description.value
    console.log(this.state.environment);
    console.log(form.elements);
    console.log(form.elements.location.value);
    console.log(form.elements.assigned.value);
    // this.client.mutate({
    //   mutation: ASSIGN_TO_ENV,
    //   variables: {"assignment": {"environment": this.state.environment.environment_id, "assigned": "532a8735-2657-4598-b565-22514f8fbb5e", "assigned_type": "DEVICE", "start": "2019-02-22T19:00:59.554259Z"}},
    //   refetchQueries: () => ["getEnvironment"]
    // });
    this.close();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show !== this.props.show) {
      this.setState({ show: nextProps.show });
    }
    if (nextProps.environment !== this.props.environment) {
      this.setState({ environment: nextProps.environment });
    }
  }

  assignedSelected(selected) {
    console.log(selected);
  }

  render() {
    return (
      <Modal show={this.state.show} onHide={this.close}>
        <Form onSubmit={this.handleSubmit} ref={this.formRef}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Assigned</Form.Label>
              <input type="hidden" id="assigned" />
              <AsyncTypeahead
                isLoading={this.state.isLoading}
                onSearch={query => {
                  console.log(this.formRef.current.elements);
                  this.setState({ isLoading: true });
                  fetch(`https://api.github.com/search/users?q=${query}`)
                    .then(resp => resp.json())
                    .then(json =>
                      this.setState({
                        isLoading: false,
                        options: json.items
                      })
                    );
                }}
                options={this.state.options}
                onChange={this.assignedSelected}
              />
            </Form.Group>

            <Form.Group controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control type="input" />
            </Form.Group>

            <p>Add Assignable to {this.state.environmentName}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.close}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export default withRouter(withApollo(EnvironmentDetail));
