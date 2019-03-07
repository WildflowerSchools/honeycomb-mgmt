/** @format */

import {withRouter, Link} from 'react-router-dom'
import React from 'react'
import {Query} from 'react-apollo'
import {
  Container,
  Row,
  Col,
  Table,
  ButtonGroup,
  Button,
  Modal,
  Form,
  Breadcrumb,
} from 'react-bootstrap'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faClone, faEdit, faMinusSquare, faCubes} from '@fortawesome/free-solid-svg-icons'

import './Environments.css'

import {LOAD_ENVIRONMENTS, LOAD_ENVIRONMENT} from "./Queries"


class Environments extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.app = props.app
    this.auth = props.app.auth
    this.router = context.router

    this.state = {
      isAuthenticated: this.auth.isAuthenticated(),
    }
  }

  render() {
    return (
      <Container fluid="true">
        <Row>
          <Col>
            <h2>Environments</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <Query query={LOAD_ENVIRONMENTS}>
              {({data, loading, error}) => {
                console.log("loading the environments?")
                if(error) {
                  console.log(error)
                  return <div>Error: {error.message}</div>
                } else if (loading || !data) {
                  return (<div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>)
                } else if (data) {
                  return (
                    <EnvironmentsList environments={data.environments.data} />
                  )
                }
              }}
            </Query>
          </Col>
        </Row>
      </Container>
    )
  }
}

class EnvironmentsList extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.state = {
      show: false,
      environment_id: {},
    }
  }

  handleClose() {
    this.setState({show: false, environment_id: {}})
  }

  handleShow() {
    this.setState({show: true})
  }

  handleEdit(environment_id) {
    console.log(environment_id)
    this.setState({
      show: true,
      environment_id: {environment_id: environment_id},
    })
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
              </Breadcrumb>
            </Col>
          </Row>
        </Container>
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
            {this.props.environments.map(environment => {
              return (
                <tr key={environment.environment_id}>
                  <td>
                    <Link
                      to={`/environments/environment/${
                        environment.environment_id
                      }`}
                    >
                      {environment.name}
                    </Link>
                  </td>
                  <td>{environment.description}</td>
                  <td>{environment.system.created}</td>
                  <td>
                    <ButtonGroup aria-label="Basic example">
                      <Button variant="outline-secondary">
                        <FontAwesomeIcon icon={faClone} />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={() =>
                          this.handleEdit(environment.environment_id)
                        }
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button variant="outline-secondary" disabled>
                        <FontAwesomeIcon icon={faMinusSquare} />
                      </Button>
                      <Button variant="outline-secondary">
                      <Link
                        to={`/environments/environment/${
                          environment.environment_id
                        }/sensors`}
                      >
                        <FontAwesomeIcon icon={faCubes} />
                    </Link>
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Editing</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Query
              query={LOAD_ENVIRONMENT}
              variables={this.state.environment_id}
            >
              {({data, error, loading}) => {
                if (loading || !data) {
                  return (<div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>)
                }
                if (error) {
                  return `Error!: ${error}`
                }
                console.log(data)
                return (
                  <EnvironmentEditForm
                    environment={data.getEnvironment}
                    close={this.handleClose}
                  />
                )
              }}
            </Query>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    )
  }
}

class EnvironmentEditForm extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      environment_id: props.environment.environment_id,
      environment: props.environment,
    }

    this.close = props.close
  }

  handleSubmit(event) {
    event.preventDefault()
    console.log(this.state.environment)
    this.close()
  }

  handleChange(event) {
    console.log(this.state.environment_id)
    console.log(event.target.id)
    var environment = this.state.environment
    environment[event.target.id] = event.target.value
    this.setState({
      environment: environment,
    })
    console.log(environment)
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <Form.Group controlId="name">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="input"
            onChange={this.handleChange.bind(this)}
            defaultValue={this.state.environment.name}
          />
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="input"
            onChange={this.handleChange.bind(this)}
            defaultValue={this.state.environment.description}
          />
        </Form.Group>

        <Form.Group controlId="location">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="input"
            onChange={this.handleChange.bind(this)}
            defaultValue={this.state.environment.location}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Save
        </Button>
        <Button variant="secondary" type="button" onClick={() => this.close()}>
          Cancel
        </Button>
      </Form>
    )
  }
}

export default withRouter(Environments)
