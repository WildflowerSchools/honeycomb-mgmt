import React, {Component} from 'react';
import './map.css'
import * as d3 from "d3";


class Map extends Component {
    datapoints = []

    constructor(props, context) {
        super(props, context);
        this.app = props.app;
        this.auth = props.app.auth;
        this.client = props.client;

        this.observations = this.prepareAssignmentData(props.assignments)

        this.layouts = props.layouts
        this.spaces = this.things = []
        if(this.layouts) {
            this.spaces = this.layouts[0].spaces
            this.things = this.layouts[0].objects
        }

        this.x_domain = [
            0,
            d3.max(this.spaces, space => { return space.x + space.width }),
        ]
        this.y_domain = [
            0,
            d3.max(this.spaces, space => { return space.y + space.height }),
        ]
        this.x_scale = d3.scaleLinear()
            .domain(this.x_domain)
            .range([0, 1200])

        var height = this.x_scale(this.y_domain[1])
        this.y_scale = d3.scaleLinear()
            .domain(this.y_domain)
            .range([0, height])

        this.state = {
            assignments: props.assignments,
            height: height,
            width: 1200,
            observations: this.observations,
        };


    }

    prepareAssignmentData(assignments) {
        return assignments.map(observer => {
            if(observer.assigned.configurations) {
                const config = propertiesToObj(observer.assigned.configurations[0].properties)
                if(config.device_type_name) {
                    var result = {
                        device_type_name: config.device_type_name,
                        name: observer.assigned.part_number,
                    }
                    if(observer.data) {
                        const observation = JSON.parse(observer.data[0].file.data)
                        result.ts = observer.data[0].observed_time
                        result.position = [
                            observation.position_data ? observation.position_data.x_position : 0,
                            observation.position_data ? observation.position_data.y_position : 0,
                            observation.position_data ? observation.position_data.z_position : 0,
                        ]
                        result.position_quality = observation.position_data ? observation.position_data.quality: 0
                        if(observation.distance_data) {
                            result.distances = observation.distance_data
                        }
                    }
                    return result
                }
            }
            return []
        })
    }

    render() {
        return (<div id={this.props.id}></div>)
    }

    componentDidMount() {
        this.tooltip = d3.select("body").append("div")
            .attr("class", "sensor-tip")
            .style("opacity", 0);
        this.svg = d3.select("#"+this.props.id)
            .append("svg")
                .attr("viewBox", [-60, -60, this.state.width + 120, this.state.height + 120].join(" "))

        var hatch = this.svg.append("pattern")
            .attr("id", "diagonalHatch")
            .attr("width", "6")
            .attr("height", "6")
            .attr("patternTransform", "rotate(45 0 0)")
            .attr("patternUnits", "userSpaceOnUse")

        hatch.append("rect")
                .attr("x", "0")
                .attr("y", "0")
                .attr("width", "10")
                .attr("height", "10")
                .attr("style", "fill: #777;")

        hatch.append("line")
                .attr("x1", "0")
                .attr("y1", "0")
                .attr("x2", "0")
                .attr("y2", "6")
                .attr("style", "stroke: #999; stroke-width: 4")

        this.drawSpace()
        this.drawObservations()
    }

    drawSpace() {
        var clip = this.svg.append("mask")
            .attr("id", "openSpaceMask")

        clip.append("rect")
            .attr("class", "closed")
            .attr("x", -60)
            .attr("y", -60)
            .attr("width", this.state.width + 120)
            .attr("height", this.state.height + 120)
            .attr("fill", "white")

        clip.selectAll("rect.open")
            .data(this.spaces)
            .enter()
            .append("rect")
                .attr("class", "open")
                .attr("x", (d) => { return this.x_scale(d.x) })
                .attr("y", (d) => { return this.y_scale(d.y) })
                .attr("width", (d) => { return this.x_scale(d.width) })
                .attr("height", (d) => { return this.y_scale(d.height) })
                .attr("fill", "black")

        this.svg.append("g")
            .attr("class", "negSpaceGroup")
            .append("rect")
                .attr("fill", "url(#diagonalHatch)")
                .attr("mask", "url(#openSpaceMask)")
                .attr("class", "negSpace")
                .attr("x", -60)
                .attr("y", -60)
                .attr("width", this.state.width + 120)
                .attr("height", this.state.height + 120)

        this.svg.append("g")
            .attr("class", "posSpace")
            .selectAll("rect")
                .data(this.spaces)
                .enter()
                .append("rect")
                    .attr("x", (d) => { return this.x_scale(d.x) })
                    .attr("y", (d) => { return this.y_scale(d.y) })
                    .attr("width", (d) => { return this.x_scale(d.width) })
                    .attr("height", (d) => { return this.y_scale(d.height) })

        var thing = this.svg.selectAll("g.thing")
            .data(this.things)
            .enter()
            .append("g")
                .attr("class", "thing")

        thing.append("rect")
            .attr("x", (d) => { return this.x_scale(d.x) })
            .attr("y", (d) => { return this.y_scale(d.y) })
            .attr("width", (d) => { return this.x_scale(d.width) })
            .attr("height", (d) => { return this.y_scale(d.height) })

        var label = thing.append("text")
            .text((d) => { return d.name })

            label.attr("x", (d, i) => {
                var box = label.nodes()[i].getBBox()
                return this.x_scale(d.x) + ((this.x_scale(d.width)/2) - (box.width/2))
            })
            label.attr("y", (d, i) => {
                var box = label.nodes()[i].getBBox()
                return this.x_scale(d.y) + ((this.x_scale(d.height)/2) - (box.height/2))
            })

    }

    drawObservations() {
        const self = this
        this.svg.selectAll("line.hgrid")
            .data(d3.range(0, this.x_domain[1], 500))
            .enter()
            .append("line")
                .attr("class", "grid hgrid")
                .attr("x1", d => { return this.x_scale(d)})
                .attr("x2", d => { return this.x_scale(d)})
                .attr("y1", this.y_scale(this.y_domain[0]))
                .attr("y2", this.y_scale(this.y_domain[1]))

        this.svg.selectAll("line.vgrid")
            .data(d3.range(0, this.y_domain[1], 500))
            .enter()
            .append("line")
                .attr("class", "grid vgrid")
                .attr("y1", d => { return this.y_scale(d)})
                .attr("y2", d => { return this.y_scale(d)})
                .attr("x1", this.x_scale(this.x_domain[0]))
                .attr("x2", this.x_scale(this.x_domain[1]))

        var observationGroups = this.svg.selectAll("g.observation")
            .data(this.state.observations)
            .enter()
            .append("g")

        observationGroups.attr("class", "observation")
            .on("mouseover", function(d) {
                self.tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                self.tooltip.html(`<strong>${d.name}</strong>
                        <ul>
                        <li><strong>time</strong>: <em>${( d.ts)}</em></li>
                        <li><strong>mode</strong>: <em>${( d.device_type_name)}</em></li>
                        <li><strong>quality</strong>: <em>${( d.position_quality)}</em></li>
                        <li><strong>x</strong>: <em>${(d.position[0] / 1000)} m</em></li>
                        <li><strong>y</strong>: <em>${(d.position[1] / 1000)} m</em></li>
                        <li><strong>z</strong>: <em>${(d.position[2] / 1000)} m</em></li>
                        </ul>`)
                    .style("left", (d3.event.pageX + 2) + "px")
                    .style("top", (d3.event.pageY + 10) + "px");
            })
            .on("mouseout", function(d) {
                self.tooltip.transition()
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
    if(typ === "INT" || typ === "FLOAT") return Number(val)
    if(typ === "BOOL") return val && val.toLowerCase() === "true"
    if(typ === "NULL") return null
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
