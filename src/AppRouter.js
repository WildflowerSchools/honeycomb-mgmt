import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import Home from './routes/Home';
import Environments from './routes/Environments'

// TODO - state of the buttons of the button group

const AppRouter = () => (
  <Router>
    <Container fluid="true">
      <Row>
        <Col>
          <ButtonGroup>
            <Button variant="primary" href="/">Home</Button>
            <Button variant="primary" href="/environments/">Environments</Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Row>
        <Route path="/" exact component={Home} />
        <Route path="/environments/" component={Environments} />
      </Row>
    </Container>
  </Router>
);

export default AppRouter;
