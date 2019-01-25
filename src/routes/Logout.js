/** @format */

import {withRouter} from 'react-router-dom'
import React, {Component} from 'react'
import {Container, Row, Col} from 'react-bootstrap'

class Logout extends Component {
  render() {
    return (
      <Container fluid="true">
        <Row>
          <Col>
            <h2>
              Bye now!{' '}
              <span role="img" aria-label="Hand waving">
                👋
              </span>
            </h2>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default withRouter(Logout)
