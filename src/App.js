import React, { Component } from 'react';
import AppRouter from "./AppRouter";
import { Container, Row, Col } from "react-bootstrap";

import './App.css';
import logo from './logo.svg'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="AppHeader">
          <Container fluid="true">
            <Row>
              <Col><img src={logo} alt="honeycomb" height="64" /></Col>
            </Row>
          </Container>
        </div>
        <div className="AppBody">
          <AppRouter />
        </div>
      </div>
    );
  }
}

export default App;
