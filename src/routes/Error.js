/** @format */

import {withRouter} from 'react-router-dom'
import React, {Component} from 'react'
import {Container, Row, Col} from 'react-bootstrap'

class Error extends Component {
  render() {
    return (
      <Container fluid="true">
        <Row>
          <Col>
            <h2>Error {this.props.error}</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <p />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default withRouter(Error)
