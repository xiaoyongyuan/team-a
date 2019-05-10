import React, { Component, Fragment } from "react";
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
      <Fragment>
        <div className="overView">
          <Map />
          <button
            onClick={() => {
              window.location.href = "/#/app/alarm/shortvideo";
            }}
            style={{
              position: "absolute",
              right: "20px",
              top: "20px",
              background: "rgba(255,255,255,.9)",
              color: "#001529",
              display: "inline-block",
              border: "1px solid #001529",
              fontWeight: "bold",

              padding: "10px 30px",
              borderRadius: "2px"
            }}
          >
            报警短视频
          </button>
        </div>
      </Fragment>
    );
  }
}

export default OverView;
