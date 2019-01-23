import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Container, Row, Col, Table, ButtonGroup, Button, Modal, Form } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone, faEdit, faMinusSquare } from '@fortawesome/free-solid-svg-icons'


import './Environments.css';

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

const LOAD_ENVIRONMENT = gql`
query getEnvironment($environment_id: ID!) {
    getEnvironment(environment_id: $environment_id) {
        environment_id
        name
        description
        location
        assignments {
          assignment_id
          assigned_type
          assigned {
            ... on Device {
              name
              device_id
            }
            ... on Person {
              name
              person_id
            }
          }
        }
    }
}
`;


class Environments extends React.Component {
  render() {
    return (
        <Container fluid="true">
            <Row><Col><h2>Environments</h2></Col></Row>
            <Row>
                <Col>
                    <Query query={LOAD_ENVIRONMENTS}>
                    {({ data, loading }) => {
                      if (loading || !data) {
                        return <div>Loading ...</div>;
                      }
                      return (
                        <EnvironmentsList environments={data.environments.data} />
                      );
                    }}
                  </Query>
                </Col>
            </Row>
        </Container>
    );
  }
}

class EnvironmentsList extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false,
            environment_id: {},
        };
    }

    handleClose() {
        this.setState({ show: false, environment_id: {} });
    }

    handleShow() {
        this.setState({ show: true });
    }

    handleEdit(environment_id) {
        console.log(environment_id)
        this.setState({ show: true, environment_id: {environment_id: environment_id} });
        // this.handleShow()
    }

    render() {
        return (
            <>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.props.environments.map((environment) => {
                return (
                    <tr key={environment.environment_id}>
                        <td>{environment.name}</td>
                        <td>{environment.description}</td>
                        <td>{environment.system.created}</td>
                        <td>
                            <ButtonGroup aria-label="Basic example">
                                <Button variant="outline-secondary"><FontAwesomeIcon icon={faClone} /></Button>
                                <Button variant="outline-secondary" onClick={() => this.handleEdit(environment.environment_id)}><FontAwesomeIcon icon={faEdit} /></Button>
                                <Button variant="outline-secondary" disabled><FontAwesomeIcon icon={faMinusSquare} /></Button>
                            </ButtonGroup>
                        </td>
                    </tr>
                )})}
                </tbody>
            </Table>
            <Modal show={this.state.show} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Editing</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Query query={LOAD_ENVIRONMENT} variables={this.state.environment_id}>
                    {({ data, error, loading }) => {
                      if (loading || !data) {
                        return <div>Loading ...</div>;
                      }
                      if (error) {
                        return `Error!: ${error}`;
                      }
                      console.log(data)
                      return (
                        <EnvironmentEditForm environment={data.getEnvironment} close={this.handleClose} />
                      );
                    }}
                  </Query>
              </Modal.Body>
            </Modal>
            </>
        )
    }
}


class EnvironmentEditForm extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            environment_id: props.environment.environment_id,
            environment: props.environment,
        };

        this.close = props.close
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.environment);
        this.close();
    }

    handleChange(event) {
        console.log(this.state.environment_id)
        console.log(event.target.id)
        var environment = this.state.environment
        environment[event.target.id] = event.target.value
        this.setState({
            environment: environment
        })
        console.log(environment)
    }

    render() {
        return (
<Form onSubmit={this.handleSubmit.bind(this)}>
  <Form.Group controlId="name">
    <Form.Label>Email address</Form.Label>
    <Form.Control type="input" onChange={this.handleChange.bind(this)} defaultValue={this.state.environment.name} />
  </Form.Group>

  <Form.Group controlId="description">
    <Form.Label>Description</Form.Label>
    <Form.Control type="input" onChange={this.handleChange.bind(this)} defaultValue={this.state.environment.description} />
  </Form.Group>

  <Form.Group controlId="location">
    <Form.Label>Location</Form.Label>
    <Form.Control type="input" onChange={this.handleChange.bind(this)} defaultValue={this.state.environment.location} />
  </Form.Group>

  <Button variant="primary" type="submit">
    Save
  </Button>
  <Button variant="secondary" type="button" onClick={() => this.close()}>
    Cancel
  </Button>
</Form>
        );
    }
}


export default Environments;
