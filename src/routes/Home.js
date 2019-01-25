/** @format */

import {withRouter} from 'react-router-dom'
import React, {Component} from 'react'
import {Container, Row, Col} from 'react-bootstrap'

// import './Home.css';

class Home extends Component {
  render() {
    return (
      <Container fluid="true">
        <Row>
          <Col>
            <h2>Honeycomb</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>TODO - add something here</p>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default withRouter(Home)
