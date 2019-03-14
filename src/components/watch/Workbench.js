import React, { Component } from 'react';
import {Button,Collapse,Row,Col, Modal } from "antd";
import "../../style/ztt/css/workbench.css";
const Panel = Collapse.Panel;
class Workbench extends Component {
    constructor(props) {
        super(props);
        this.state={
            visibleUser:false
        };
    }
    userInformation=()=>{
        this.setState({
            visibleUser:true
        })
    };
    userHandleCancel=()=>{
        this.setState({
            visibleUser:false
        })
    };
    render() {
        return (
            <div className="workBench workToP">
                <div className="processingAlarm workbenchBorder">
                    <div className="processing-title">
                        <div className="processingAlarm-left">
                            <p><span>yy摄像头</span><span>2019-12-3 16:00</span></p>
                            <div className="alarmImg"><img src="http://pic01.aokecloud.cn/alarm/1000020/pic/20190313/1000020_20190313105125_640X360.jpg" alt=""/></div>
                            <div className="alarm-video">
                                <Button type="primary">短视频</Button>
                                <Button type="primary">直播</Button>
                            </div>
                        </div>
                        <div className="processingAlarm-right">
                            <div className="alarm-btn"><Button type="primary" >虚警</Button></div>
                            <div className="alarm-btn"><Button type="primary">误报</Button></div>
                            <div className="alarm-btn Push"><Button type="primary" onClick={()=>this.userInformation()}>推送</Button></div>
                            <textarea className="remarks" placeholder="备注信息" ></textarea>
                        </div>
                    </div>

                </div>
                <div className="hangUp workbenchBorder">
                    <Collapse accordion defaultActiveKey={['1']}>
                        <Panel header="挂载" key="1">
                            <div  className="hangUpPanel">
                                <Row>
                                    <Col span={12}>
                                        <div className="hangUpImg"><img src="http://pic01.aokecloud.cn/alarm/1000020/pic/20190313//1000020_20190313155219.jpg" alt=""/></div>
                                    </Col>
                                    <Col span={10}>
                                        <p>yy摄像头</p>
                                        <p>备注信息</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <div className="hangUpImg"><img src="http://pic01.aokecloud.cn/alarm/1000020/pic/20190313//1000020_20190313155219.jpg" alt=""/></div>
                                    </Col>
                                    <Col span={10}>
                                        <p>yy摄像头</p>
                                        <p>备注信息</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <div className="hangUpImg"><img src="http://pic01.aokecloud.cn/alarm/1000020/pic/20190313//1000020_20190313155219.jpg" alt=""/></div>
                                    </Col>
                                    <Col span={10}>
                                        <p>yy摄像头</p>
                                        <p>备注信息</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <div className="hangUpImg"><img src="http://pic01.aokecloud.cn/alarm/1000020/pic/20190313//1000020_20190313155219.jpg" alt=""/></div>
                                    </Col>
                                    <Col span={10}>
                                        <p>yy摄像头</p>
                                        <p>备注信息</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <div className="hangUpImg"><img src="http://pic01.aokecloud.cn/alarm/1000020/pic/20190313//1000020_20190313155219.jpg" alt=""/></div>
                                    </Col>
                                    <Col span={10}>
                                        <p>yy摄像头</p>
                                        <p>备注信息</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <div className="hangUpImg"><img src="http://pic01.aokecloud.cn/alarm/1000020/pic/20190313//1000020_20190313155219.jpg" alt=""/></div>
                                    </Col>
                                    <Col span={10}>
                                        <p>yy摄像头</p>
                                        <p>备注信息</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <div className="hangUpImg"><img src="http://pic01.aokecloud.cn/alarm/1000020/pic/20190313//1000020_20190313155219.jpg" alt=""/></div>
                                    </Col>
                                    <Col span={10}>
                                        <p>yy摄像头</p>
                                        <p>备注信息</p>
                                    </Col>
                                </Row>
                            </div>
                        </Panel>
                    </Collapse>
                </div>
                <Modal
                    title="用户详情"
                    visible={this.state.visibleUser}
                    onCancel={this.userHandleCancel}
                    footer={null}
                >
                    <div className="userDetails">
                        <p><label>姓名：</label><span>李四</span></p>
                        <p><label>联系电话：</label><span>13678976336</span></p>
                        <p><label>地址：</label><span>西安雁塔区西安理工大科技园</span></p>
                        <p><label>紧急联系人1：</label><span>李**</span><span>***********</span></p>
                        <p><label>紧急联系人2：</label><span>王**</span><span>***********</span></p>
                    </div>
                </Modal>
            </div>
        )
    }

}
export default Workbench;
