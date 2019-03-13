import React, { Component } from 'react';
import {Col, Row} from "antd";
import WorkStatistics from "../groupleader/WorkStatistics";
import "../../style/ztt/css/watchIndex.css";
import ClassifiedStatistics from "./ClassifiedStatistics";
class WatchIndex extends Component {
    constructor(props) {
        super(props);
        this.state={

        };
    }
    
    render() {      

        return (
            <div className="watchIndex">
                <Row className="group-flex">
                    <div className="group-height name groupLeader-border">
                        <div className="groupLeader-img">
                            <div className="groupIcon"><img src="http://ftp01.aokecloud.cn/alarm/1000021/photocatch/20190312/1000021_20190312163101.jpg" alt=""/></div>
                            <p className="groupLeaderName">组长</p>
                        </div>
                        <div className="groupLeader-img group-information">
                            <div>
                                <p className="nickname">张晓</p>
                                <p>开发管理</p>
                            </div>
                        </div>
                    </div>
                    <div className="group-height count groupLeader-border alarm-type untreatedAlarm" />
                </Row>
                <Row>
                    <Col span={12}>
                        <Row>
                            <Col span={12}>
                                <div className="group-alarm groupLeader-border">
                                    <p className="watch-alarm">报警分析</p>
                                    <p className="watch-number watch-alarm">678</p>
                                    <Row>
                                        <Col span={12} className="police-Name">误报/条</Col>
                                        <Col span={12} className="police-Name">虚警/条</Col>
                                    </Row>
                                    <Row>
                                        <Col span={12} className="police-Name police-number">45</Col>
                                        <Col span={12} className="police-Name police-number">43</Col>
                                    </Row>
                                    <Row>
                                        <Col span={12} className="police-Name">警报/条</Col>
                                        <Col span={12} className="police-Name">查询用户/条</Col>
                                    </Row>
                                    <Row>
                                        <Col span={12} className="police-Name police-number">67</Col>
                                        <Col span={12} className="police-Name police-number">23</Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="group-alarm groupLeader-border">
                                    <p className="watch-alarm">昨日处理总数</p>
                                    <p className="watch-number statisticsNumber">454</p>
                                    <p className="statisticsNumber">分类统计</p>
                                    <ClassifiedStatistics />
                                </div>
                            </Col>
                        </Row>
                        <Row className="groupLeader-border">
                            <p className="alarm-top">近七日工作统计</p>
                            <WorkStatistics className="group-seven" />
                        </Row>
                    </Col>
                    <Col span={12}>
                      <div className="pending-list watchIndex-border groupLeader-border">
                          <p className="alarm-top">挂起列表</p>
                          <Row className="alarmList">
                                  <Col span={6} className="listImg textCenter">
                                      <div><img src="http://pic01.aokecloud.cn/alarm/1000020/pic/20190313//1000020_20190313105209.jpg" alt=""/></div></Col>
                                  <Col span={8} className="textCenter">
                                      <Row className="Camera">摄像头</Row>
                                      <Row className="Camera">12:45:34 挂起</Row>
                                      <Row className="Camera">备注内容</Row>
                                  </Col>
                                  <Col span={4} className="textCenter">警报</Col>
                                  <Col span={6} className="textCenter">2019-3-12 14:34:00</Col>
                          </Row>
                          <Row className="alarmList">
                              <Col span={6} className="listImg textCenter">
                                  <div><img src="http://pic01.aokecloud.cn/alarm/1000020/pic/20190313//1000020_20190313105209.jpg" alt=""/></div></Col>
                              <Col span={8} className="textCenter">
                                  <Row className="Camera">摄像头</Row>
                                  <Row className="Camera">12:45:34 挂起</Row>
                                  <Row className="Camera">备注内容</Row>
                              </Col>
                              <Col span={4} className="textCenter">警报</Col>
                              <Col span={6} className="textCenter">2019-3-12 14:34:00</Col>
                          </Row>
                          <Row className="alarmList">
                              <Col span={6} className="listImg textCenter">
                                  <div><img src="http://pic01.aokecloud.cn/alarm/1000020/pic/20190313//1000020_20190313105209.jpg" alt=""/></div></Col>
                              <Col span={8} className="textCenter">
                                  <Row className="Camera">摄像头</Row>
                                  <Row className="Camera">12:45:34 挂起</Row>
                                  <Row className="Camera">备注内容</Row>
                              </Col>
                              <Col span={4} className="textCenter">警报</Col>
                              <Col span={6} className="textCenter">2019-3-12 14:34:00</Col>
                          </Row>
                          <Row className="alarmList">
                              <Col span={6} className="listImg textCenter">
                                  <div><img src="http://pic01.aokecloud.cn/alarm/1000020/pic/20190313//1000020_20190313105209.jpg" alt=""/></div></Col>
                              <Col span={8} className="textCenter">
                                  <Row className="Camera">摄像头</Row>
                                  <Row className="Camera">12:45:34 挂起</Row>
                                  <Row className="Camera">备注内容</Row>
                              </Col>
                              <Col span={4} className="textCenter">警报</Col>
                              <Col span={6} className="textCenter">2019-3-12 14:34:00</Col>
                          </Row>
                          <Row className="alarmList">
                              <Col span={6} className="listImg textCenter">
                                  <div><img src="http://pic01.aokecloud.cn/alarm/1000020/pic/20190313//1000020_20190313105209.jpg" alt=""/></div></Col>
                              <Col span={8} className="textCenter">
                                  <Row className="Camera">摄像头</Row>
                                  <Row className="Camera">12:45:34 挂起</Row>
                                  <Row className="Camera">备注内容</Row>
                              </Col>
                              <Col span={4} className="textCenter">警报</Col>
                              <Col span={6} className="textCenter">2019-3-12 14:34:00</Col>
                          </Row>
                      </div>
                    </Col>
                </Row>
            </div>
        )
    }

}
export default WatchIndex;
