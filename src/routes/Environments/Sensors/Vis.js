/** @format */

import { withRouter } from "react-router-dom";
import { withApollo } from "react-apollo";
import React from "react";
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Breadcrumb,
} from "react-bootstrap";
import { Query } from "react-apollo";
import Map from "./Map";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube, faGlobe, faChartBar } from "@fortawesome/free-solid-svg-icons";

import {
  ASSIGNMENTS,
} from "../Queries";

class SensorVisualizer extends React.Component {

    constructor(props, context) {
      super(props, context);
      this.app = props.app;
      this.auth = props.app.auth;
      this.client = props.client;

      this.state = {
          environment_id: {environment_id: props.match.params.environmentId},
      };
    }

    render() {
        return (
              <Query
                query={ASSIGNMENTS}
                variables={this.state.environment_id}
              >
                {({data, error, loading}) => {
                    console.log(data)
                  if (loading || !data) {
                    return (<div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>)
                  }
                  if (error) {
                    return `Error!: ${error}`
                  }
                  return (
                      <React.Fragment>
                      <Container fluid>
                        <Row>
                          <Col>
                            <Breadcrumb>
                              <Breadcrumb.Item href="#/environments">
                                Environments
                              </Breadcrumb.Item>
                              <Breadcrumb.Item href={"#/environments/environment/" + this.state.environment_id.environment_id}>
                                {data.getEnvironment.name}
                              </Breadcrumb.Item>
                              <Breadcrumb.Item active>
                                sensors
                              </Breadcrumb.Item>
                            </Breadcrumb>
                          </Col>
                        </Row>
                      </Container>
                      <Container fluid>
                        <Row>
                          <Col>
                            <Tabs defaultActiveKey="map2d" id="uncontrolled-tab-example">
                              <Tab eventKey="map2d" title="Sensor Map 2D">
                                <Map id="roomMap" assignments={data.getEnvironment.assignments} app={this.app} />
                              </Tab>
                              <Tab eventKey="map3d" title="Sensor Map 3D">
                                <p>hello</p>
                              </Tab>
                            </Tabs>
                        </Col>
                      </Row>
                    </Container>
                    </React.Fragment>
                  )
                }}
              </Query>
        )
    }
}


SensorVisualizer = withRouter(withApollo(SensorVisualizer))

export {
    SensorVisualizer
}
