import React, { Component, Fragment } from "react";
import { post } from "../../axios/tools.js";
import { Icon } from "antd";
import redpoint from "../../style/jhy/imgs/redpoint.png";
import greenpoint from "../../style/jhy/imgs/greenpoint.png";
import graypoint from "../../style/jhy/imgs/graypoint.png";
import "../../style/jhy/css/overView.css";
import "../../style/jhy/css/mapslayer.css";

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markerList: [],
      zonename: "西安市",
      modalVisible: false, //详情弹层
      equipdat: {} //设备详情
    };
  }
  componentDidMount() {
    this.getMarkerList();
  }

  momenttime = bdate => {
    if (!bdate) return false;
    if (new Date().getTime() - new Date(bdate).getTime() > 60000) {
      return false;
    } else {
      return true;
    }
  };
  getMarkerList = () => {
    post({ url: "/api/equipment/getlist" }, res => {
      this.setState(
        {
          markerList: res.data
        },
        () => {
          console.log(this.state.markerList);
          const _this = this;
          this.initializeMap(_this);
        }
      );
    });
  };
  initializeMap = _this => {
    var BMap = window.BMap;
    var map = new BMap.Map("mapContainer"); // 创建Map实例
    var mapStyle = { style: "midnight" };
    map.setMapStyle(mapStyle);
    const defpoint = this.state.zonename;
    //以下写法我也很无奈，领导要求，就这样吧
    // defpoint && defpoint.indexOf("汉中市汉台区") > 0
    //   ? map.centerAndZoom(new BMap.Point(107.053349, 33.191015), 12)
    //   : map.centerAndZoom(defpoint, 10);
    map.centerAndZoom(defpoint, 10);
    map.setCurrentCity(defpoint);
    map.setDefaultCursor("hand");
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    const getBoundary = () => {
      var bdary = new BMap.Boundary();
      bdary.get(defpoint, function(rs) {
        //获取行政区域
        var count = rs.boundaries.length; //行政区域的点有多少个
        for (var i = 0; i < count; i++) {
          var ply = new BMap.Polygon(rs.boundaries[i], {
            strokeWeight: 2, //设置多边形边线线粗
            strokeColor: "#2eccff", //设置多边形边线颜色
            strokeOpacity: 1, //设置多边形边线透明度0-1
            strokeStyle: "dashed", //设置多边形边线样式为实线或虚线，取值 solid 或 dashed
            fillColor: "#2eccff",
            fillOpacity: 0.2
          }); //建立多边形覆盖物
          map.addOverlay(ply); //添加覆盖物
        }
      });
    };
    getBoundary();
    if (this.state.markerList && this.state.markerList.length > 0) {
      this.state.markerList.map((v, i) => {
        var pt = new BMap.Point(v.lng, v.lat);
        var myIcon = new BMap.Icon(
          `${v.count === "" ? greenpoint : redpoint}`,
          new BMap.Size(40, 40)
        );
        var offlineIcon = new BMap.Icon(graypoint, new BMap.Size(40, 40));
        var marker;
        marker = new BMap.Marker(pt); // 创建标注

        // if (!this.momenttime(v.lasttime) && !this.momenttime(v.hearttime)) {
        //   marker = new BMap.Marker(pt, { icon: offlineIcon });
        // } else {
        //   marker = new BMap.Marker(pt, { icon: myIcon }); // 创建标注
        // }
        map.addOverlay(marker);
        marker.addEventListener("click", function() {
          post(
            { url: "/api/equipment/getone", data: { code: v.code } },
            res => {
              if (res.success) {
                console.log(res, "huoquyige");
                _this.setState({
                  equipdat: Object.assign({}, res.data),
                  modalVisible: true
                });
              }
            }
          );
        });
      });
    }
  };
  modalVis = () => {
    this.setState({ modalVisible: false });
  };
  render() {
    return (
      <Fragment>
        <div id="mapContainer" style={{ width: "100%", height: "100%" }} />
        <div
          className="layerdatail"
          style={{
            display: this.state.modalVisible ? "block" : "none"
          }}
        >
          <h3>
            设备详情
            <Icon
              type="close"
              onClick={this.modalVis}
              style={{
                cursor: "pointer",
                color: "#444",
                position: "absolute",
                top: "10px",
                right: "10px"
              }}
            />
          </h3>
          <p>
            <label>用户名：</label> <span>{this.state.equipdat.ausername}</span>
          </p>
          {/* <p>
            <label>电话：</label>{" "}
            <span>{this.state.equipdat.adminaccount}</span>
          </p>
          <p>
            <label>设备名：</label> <span>{this.state.equipdat.name}</span>
          </p>
          <p>
            <label>设备状态：</label>{" "}
            <span>{this.state.equipdat.prestatus ? "在线" : "离线"}</span>
          </p>
          <p>
            <label>设备地址：</label>{" "}
            <span>{this.state.equipdat.location}</span>
          </p>
          {this.state.equipdat.atime ? (
            <Fragment>
              <p>
                <label>现场情况：</label>{" "}
                <span>{this.state.equipdat.atime}</span>
              </p>
              <div>
                <img src={this.state.equipdat.pic_min} width="100%" />
              </div>
            </Fragment>
          ) : null} */}
        </div>
      </Fragment>
    );
  }
}

export default Map;
