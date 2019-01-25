/** @format */

import {withRouter} from 'react-router-dom'
import React from 'react'
import {Container, Row, Col, Card, Button, Breadcrumb} from 'react-bootstrap'

import Tex1 from './assets/texture_01.png'
import Tex2 from './assets/texture_02.png'
import Tex3 from './assets/texture_03.png'
import Tex4 from './assets/texture_04.png'
// import Tex5 from './assets/texture_05.png';

class EnvironmentDetail extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.app = props.app
    this.auth = props.app.auth
    this.router = context.router

    this.state = {
      environmentId: props.match.params.environmentId,
      isAuthenticated: this.auth.isAuthenticated(),
    }
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
                <Breadcrumb.Item active>this</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row>
            <Col>
              <Card style={{width: '18rem'}}>
                <Card.Img variant="top" src={Tex1} />
                <Card.Body>
                  <Card.Title>Student Interaction Charts</Card.Title>
                  <Card.Text>
                    Sed convallis rhoncus lorem, ut condimentum diam fermentum
                    eget. Donec et massa velit.
                  </Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{width: '18rem'}}>
                <Card.Img variant="top" src={Tex2} />
                <Card.Body>
                  <Card.Title>Student/Teacher Interaction Charts</Card.Title>
                  <Card.Text>
                    Duis faucibus mattis nibh id commodo. Vestibulum pulvinar mi
                    ut nunc convallis, non facilisis elit faucibus.
                  </Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{width: '18rem'}}>
                <Card.Img variant="top" src={Tex3} />
                <Card.Body>
                  <Card.Title>Social Networks</Card.Title>
                  <Card.Text>
                    Cras suscipit dui et libero accumsan, ac mattis ipsum
                    accumsan. Etiam pretium facilisis erat.
                  </Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{width: '18rem'}}>
                <Card.Img variant="top" src={Tex4} />
                <Card.Body>
                  <Card.Title>Raw Data Sources</Card.Title>
                  <Card.Text>
                    Suspendisse faucibus dolor ac lacinia pretium. Sed ultricies
                    pulvinar eros, in finibus augue eleifend eget.
                  </Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}

export default withRouter(EnvironmentDetail)
