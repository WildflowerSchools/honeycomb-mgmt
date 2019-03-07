import React, {Component} from 'react';
import './map.css'
import * as d3 from "d3";

import { Query } from "react-apollo";

import {
  OBSERVER_DATA_FOR_RANGE,
} from "../Queries";


class Map extends Component {
    datapoints = []

    constructor(props, context) {
      super(props, context);
      this.app = props.app;
      this.auth = props.app.auth;
      this.client = props.client;

      this.observations = this.prepareAssignmentData(props.assignments)

      this.state = {
          assignments: props.assignments,
          height: 600,
          width: 600,
          observations: this.observations,
      };
      // TODO - maintain aspect ratio
      this.x_domain = [
          0,
          d3.max(this.observations, observation => { return observation.position[0] }),
      ]
      this.y_domain = [
          0,
          d3.max(this.observations, observation => { return observation.position[1] }),
      ]
      this.x_scale = d3.scaleLinear()
            .domain(this.x_domain)
            .range([40, 520])

      this.y_scale = d3.scaleLinear()
            .domain(this.y_domain)
            .range([40, 520])
    }

    prepareAssignmentData(assignments) {
        return assignments.map(observer => {
            if(observer.assigned.confgurations) {
                const config = propertiesToObj(observer.assigned.confgurations[0].properties)
                if(config.device_type_name) {
                    var result = {
                        device_type_name: config.device_type_name,
                        name: observer.assigned.part_number,
                    }
                    if(observer.data) {
                        const observation = JSON.parse(observer.data[0].file.data)
                        result.ts = observer.data[0].observed_time
                        result.position = [
                            observation.position_data.x_position,
                            observation.position_data.y_position,
                            observation.position_data.z_position,
                        ]
                        result.position_quality = observation.position_data.quality
                        if(observation.distance_data) {
                            result.distances = observation.distance_data
                        }
                    }
                    return result
                }
            }
        })
    }

    render() {
        const self = this
        console.log(this.state.assignments)
        return (<div id={this.props.id}></div>)
    }

    componentDidMount() {
        var div = d3.select("body").append("div")
            .attr("class", "sensor-tip")
            .style("opacity", 0);

        const svg = d3.select("#"+this.props.id).append("svg").attr("width", this.state.width).attr("height", this.state.height);

        svg.selectAll("line.hgrid")
            .data(d3.range(0, this.x_domain[1], 500))
            .enter()
            .append("line")
                .attr("class", "grid hgrid")
                .attr("x1", d => { return this.x_scale(d)})
                .attr("x2", d => { return this.x_scale(d)})
                .attr("y1", this.y_scale(this.y_domain[0]))
                .attr("y2", this.y_scale(this.y_domain[1]))

        svg.selectAll("line.vgrid")
            .data(d3.range(0, this.y_domain[1], 500))
            .enter()
            .append("line")
                .attr("class", "grid vgrid")
                .attr("y1", d => { return this.y_scale(d)})
                .attr("y2", d => { return this.y_scale(d)})
                .attr("x1", this.x_scale(this.x_domain[0]))
                .attr("x2", this.x_scale(this.x_domain[1]))

        var observationGroups = svg.selectAll("g.observation")
            .data(this.state.observations)
            .enter()
            .append("g")

        observationGroups.attr("class", "observation")
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(`<strong>${d.name}</strong>
                        <ul>
                        <li><strong>time</strong>: <em>${( d.ts)}</em></li>
                        <li><strong>mode</strong>: <em>${( d.device_type_name)}</em></li>
                        <li><strong>quality</strong>: <em>${( d.position_quality)}</em></li>
                        <li><strong>x</strong>: <em>${(d.position[0] / 1000)} m</em></li>
                        <li><strong>y</strong>: <em>${(d.position[1] / 1000)} m</em></li>
                        <li><strong>z</strong>: <em>${(d.position[2] / 1000)} m</em></li>
                        </ul>`)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY +10) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })

        observationGroups.append("circle")
                .attr("class", d => { return d.device_type_name.toLowerCase()})
                .attr("r", 4)
                .attr("transform", (d) => {
                    return `translate(${this.x_scale(d.position[0])}, ${this.y_scale(d.position[1])})`
                })

        observationGroups.append("circle")
                .attr("class", "qualityRing")
                .attr("r", (d) => {
                    return d.position_quality/5
                })
                .attr("transform", (d) => {
                    return `translate(${this.x_scale(d.position[0])}, ${this.y_scale(d.position[1])})`
                })
    }
}


function asType(val, typ) {
    if(typ == "INT" || typ == "FLOAT") return Number(val)
    if(typ == "BOOL") return val && val.toLowerCase() == "true"
    if(typ == "NULL") return null
    return val
}

function propertiesToObj(properties) {
    var obj = {}
    for(var prop of properties) {
        obj[prop.name] = asType(prop.value, prop.type)
    }
    return obj
}

export default Map;
