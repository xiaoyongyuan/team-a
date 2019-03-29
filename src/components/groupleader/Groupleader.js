import React, { Component } from 'react';
import { Row, Col } from 'antd';
import WorkStatistics from "./WorkStatistics";
import AlarmAnalysis from "./AlarmAnalysis";
import "../../style/ztt/css/groupLeader.css";
import {post} from "../../axios/tools";
class Groupleader extends Component {
    constructor(props) {
        super(props);
        this.state={
            userRecord:[
                {
                    name:"阿房宫",
                    context:"***********",
                    time:"2019.03.09",
                    operator:"黄昌华"
                },
                {
                    name:"西安文物局",
                    context:"***********",
                    time:"2019.02.12",
                    operator:"吕琳琳"
                },
                {
                    name:"阿房宫",
                    context:"***********",
                    time:"2019.03.24",
                    operator:"黄昌华"
                },
                {
                    name:"树莓派测试",
                    context:"***********",
                    time:"2019.03.10",
                    operator:"李江"
                },
                {
                    name:"阿房宫",
                    context:"***********",
                    time:"2019.03.21",
                    operator:"王城"
                },
            ],
            detailsHandling:[
                {
                    count:"4",
                    falsePositives:"0",
                    falseReport:"2",
                    alert:"2"
                },
                {
                    count:"3",
                    falsePositives:"0",
                    falseReport:"3",
                    alert:"0"
                },
                {
                    count:"0",
                    falsePositives:"0",
                    falseReport:"0",
                    alert:"0"
                },
                {
                    count:"2",
                    falsePositives:"0",
                    falseReport:"0",
                    alert:"2"
                },
                {
                    count:"4",
                    falsePositives:"1",
                    falseReport:"3",
                    alert:"1"
                },
                {
                    count:"3",
                    falsePositives:"2",
                    falseReport:"1",
                    alert:"0"
                },
                {
                    count:"1",
                    falsePositives:"0",
                    falseReport:"1",
                    alert:"0"
                }
            ]
        };
    }
    componentDidMount() {
        post({url:"/api/alarmhandle/getinfo"},(res)=>{
            if(res.success){
                this.setState({
                    cname:res.data.name,
                    adminName:res.data.adminname,
                    unhandle:res.unhandle,
                    falsealarm:res.statsstics.falsealarm,
                    emptyalarm:res.statsstics.emptyalarm,
                    hangup:res.statsstics.hangup,
                    alarmun:res.statsstics.alarmun,
                    smpgr:res.data.smpgr,
                    smpqy:res.data.smpqy
                })
            }
        })
    }

    render() {
        return (
            <div className="groupLeader">
                <Row className="group-flex">
                    <div className="group-height name groupLeader-border">
                        <div className="groupLeader-img">
                             <div className="groupIcon"><img src="http://ftp01.aokecloud.cn/alarm/1000021/photocatch/20190312/1000021_20190312163101.jpg" alt=""/></div>
                             <p className="groupLeaderName">{this.state.cname}</p>
                        </div>
                        <div className="groupLeader-img group-information">
                            <div>
                                <p className="nickname">{this.state.cname}</p>
                                <p>{this.state.adminName}</p>
                            </div>
                        </div>
                    </div>
                    <div className="group-height count groupLeader-border alarm-type untreatedAlarm">
                        <p className="alarm-type">未处理报警数</p>
                        <p className="alarm-number">{this.state.unhandle}</p>
                    </div>
                    <div className="group-height count groupLeader-border alarm-type todayAlarm">
                        <p className="alarm-type">今日处理总数</p>
                        <p className="alarm-number">{this.state.falsealarm+this.state.emptyalarm+this.state.hangup}</p>
                        <div className="misreporting">
                            <Row>
                                <Col span={8}>误报</Col>
                                <Col span={8}>虚警</Col>
                                <Col span={8}>挂起</Col>
                            </Row>
                            <Row>
                                <Col span={8}>{this.state.falsealarm}</Col>
                                <Col span={8}>{this.state.emptyalarm}</Col>
                                <Col span={8}>{this.state.hangup}</Col>
                            </Row>
                        </div>
                    </div>
                    <div className="group-height count groupLeader-border alarm-type userAlarm">
                        <p className="alarm-type">用户总数</p>
                        <p className="alarm-number">{this.state.smpgr+this.state.smpqy}</p>
                        <div className="misreporting">
                            <Row>
                                <Col span={8}>企业用户</Col>
                                <Col span={8}>个人用户</Col>
                            </Row>
                            <Row>
                                <Col span={8}>{this.state.smpgr}</Col>
                                <Col span={8}>{this.state.smpqy}</Col>
                            </Row>
                        </div>
                    </div>
                </Row>
                <Row>
                    <Col span={16}>
                        <Row>
                            <Col span={12}>
                                <div className="group-alarm groupLeader-border">
                                    <p className="alarm-top">报警分析</p>
                                    <AlarmAnalysis />
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="group-alarm groupLeader-border">
                                    <p className="alarm-top">查询用户记录</p>
                                    <div className="record">
                                        <Row>
                                            <Col span={6} className="record-center">用户</Col>
                                            <Col span={6} className="record-center">查询内容</Col>
                                            <Col span={6} className="record-center">查询时间</Col>
                                            <Col span={6} className="record-center">操作人</Col>
                                        </Row>
                                        {
                                            this.state.userRecord.map((v,i)=>(
                                                <Row ke={i}>
                                                    <Col span={6} className="record-body">{v.name}</Col>
                                                    <Col span={6} className="record-body">{v.context}</Col>
                                                    <Col span={6} className="record-body">{v.time}</Col>
                                                    <Col span={6} className="record-body">{v.operator}</Col>
                                                </Row>
                                            ))
                                        }
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="groupLeader-border">
                            <p className="alarm-top">近七日工作统计</p>
                            <WorkStatistics className="group-seven" />
                        </Row>
                    </Col>
                    <Col span={8}>
                        <div className="group-img groupLeader-border">
                            <Row>
                               <img src="http://pic01.aokecloud.cn/alarm/1000020/pic/20190329/EFGABC007_20190329185302_320X180.jpg" width="100%" alt="" />
                               <img src="http://pic01.aokecloud.cn/alarm/1000012/pic/20190329/JTJL00019_20190329191644_640X360.jpg" width="100%" alt="" />
                            </Row>
                            <Row>
                               <img src="http://pic01.aokecloud.cn/alarm/1000020/pic/20190329/EFGABC011_20190329191844_320X180.jpg" width="100%" alt="" />
                              <img src="http://pic01.aokecloud.cn/alarm/1000020/pic/20190329/EFGABC012_20190329191340_640X360.jpg" width="100%" alt="" />
                            </Row>
                        </div>
                        <div className="group-details groupLeader-border">
                            <p className="alarm-top">今日详情处理</p>
                            <table className="record todayDetails">
                                <tr>
                                    <td className="details-title">总数</td>
                                    <td className="details-title">误报</td>
                                    <td className="details-title">虚报</td>
                                    <td className="details-title">警报</td>
                                </tr>
                                {
                                    this.state.detailsHandling.map((v,i)=>(
                                        <tr key={i}>
                                            <td className="details-body">{v.count}</td>
                                            <td className="details-body">{v.falsePositives}</td>
                                            <td className="details-body">{v.falseReport}</td>
                                            <td className="details-body">{v.alert}</td>
                                        </tr>
                                    ))
                                }
                            </table>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

}
export default Groupleader;
