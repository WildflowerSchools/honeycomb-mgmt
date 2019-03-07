/** @format */

import React, {Component} from 'react'
import {
  HashRouter as Router,
  Route,
  // withRouter,
} from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  // Form,
  // FormControl,
  Button,
} from 'react-bootstrap'

import Home from './routes/Home'
import Error from './routes/Error'
import Logout from './routes/Logout'
import Environments from './routes/Environments/Environments'
import EnvironmentDetail from './routes/Environments/EnvironmentDetail'
import { SensorVisualizer } from './routes/Environments/Sensors/Vis'
import Auth from './Auth/Auth'

import './App.css'
import logo from './logo.svg'

import {ApolloProvider} from 'react-apollo'
import {ApolloClient} from 'apollo-client'
import {HttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'


const cache = new InMemoryCache()

const HONEYCOMB_URL = 'https://honeycomb.api.wildflower-tech.org/graphql'
// const HONEYCOMB_URL = 'http://localhost:4000/graphql'



const auth = new Auth()

const handleAuthentication = (app, props) => {
  console.log(app)
  console.log(props)
  console.log('Checking the auth!!!!')
  if (/access_token|id_token|error/.test(window.location.hash)) {
    console.log('we see the things, passing to parse')
    auth.handleAuthentication()
  }
}

class App extends Component {
  constructor(props, context) {
    super(props, context)

    // Check to see if we could be logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
      console.log(window.location.hash)
      auth.renewSession(window.location.hash)
    }

    // tell auth that this is us.  TODO - evalate if there is a better way to handle this.
    auth.app = this
    this.auth = auth

    this.client = new ApolloClient({
      link: new HttpLink({uri: HONEYCOMB_URL}),
      cache,
    })
    this.resetClient()

    this.state = {
      isAuthenticated: auth.isAuthenticated(),
    }
  }

  resetClient() {
    console.log(`client resetting ${this.auth.isAuthenticated()} ${this.auth.getAccessToken()}`)
    var httpLink = new HttpLink({
      uri: HONEYCOMB_URL,
      headers: {
        Authorization: this.auth.isAuthenticated() ? `Bearer ${this.auth.getAccessToken()}` : "",
      },
    })
    this.client.link = httpLink
    this.client.resetStore()
    console.log(this.client)
  }

  authChanged(auth) {
    this.resetClient()
    this.setState({isAuthenticated: auth.isAuthenticated()})
  }

  render() {
    console.log(auth.isAuthenticated())
    return (
      <Router hashType="slash">
        <React.Fragment>
          <Navbar bg="dark" expand="lg" variant="dark">
            <Navbar.Brand href="#">
              <img src={logo} alt="honeycomb" height="24" />
              Wildflower:Honeycomb
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                {this.state.isAuthenticated && (
                  <React.Fragment>
                    <Nav.Link href="#/home">Home</Nav.Link>
                    <Nav.Link href="#/environments">Environments</Nav.Link>
                  </React.Fragment>
                )}
              </Nav>
              {!this.state.isAuthenticated && (
                <Button
                  id="loginButton"
                  variant="primary"
                  onClick={this.login.bind(this)}
                >
                  Login
                </Button>
              )}
              {this.state.isAuthenticated && (
                <Button
                  id="loginButton"
                  variant="primary"
                  onClick={this.logout.bind(this)}
                >
                  Logout
                </Button>
              )}
            </Navbar.Collapse>
          </Navbar>
          <Container fluid>
            <Row>
              <Col>
                <Route
                  path="/"
                  render={props => {
                    handleAuthentication(this, props)
                    return <></>
                  }}
                />
                {!this.state.isAuthenticated && (
                  <React.Fragment>
                    <h2>Welcome</h2>
                    <p>login or something</p>
                  </React.Fragment>
                )}
                {this.state.isAuthenticated && (
                  <ApolloProvider client={this.client}>
                    <Route
                      path="/home"
                      exact
                      render={props => <Home app={this} />}
                    />
                    <Route
                      path="/environments"
                      exact
                      render={props => <Environments app={this} />}
                    />
                    <Route
                      path="/login-error"
                      exact
                      render={props => (
                        <Error app={this} message="login-error" />
                      )}
                    />
                    <Route
                      path="/logged-out"
                      exact
                      render={props => <Logout app={this} />}
                    />
                    <Route
                      path="/environments/environment/:environmentId"
                      exact
                      render={props => <EnvironmentDetail app={this} />}
                    />
                    <Route
                      path="/environments/environment/:environmentId/sensors"
                      exact
                      render={props => <SensorVisualizer app={this} />}
                    />
                  </ApolloProvider>
                )}
              </Col>
            </Row>
          </Container>
        </React.Fragment>
      </Router>
    )
  }

  login() {
    auth.login()
  }

  logout() {
    auth.logout()
  }
}

export default App
