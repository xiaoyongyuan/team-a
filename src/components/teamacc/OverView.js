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

  componentDidMount() {
    // post({ url: "/api/camera_cop/getcount_e" }, res => {
    //   this.setState({
    //     statistic: res
    //   });
    // });
    // this.dynamic = setInterval(() => {
    //   post({ url: "/api/camera_cop/getcount_e" }, res => {
    //     this.setState({
    //       statistic: res
    //     });
    //   });
    // }, 1000 * 5);
  }
  componentWillUnmount() {
    // clearInterval(this.dynamic);
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
