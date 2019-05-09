import React, { Component } from "react";
import { post } from "../../axios/tools.js";
import Map from "./Map";
import "../../style/jhy/css/overView.css";
class OverView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statistic: {}
    };
  }
  render() {
    return (
      <div className="overView">
        <Map />
      </div>
    );
  }
}

export default OverView;
