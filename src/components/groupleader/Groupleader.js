import React, { Component } from 'react';
import { Row, Col } from 'antd';
import WorkStatistics from "./WorkStatistics";
import AlarmAnalysis from "./AlarmAnalysis";
import "../../style/ztt/css/groupLeader.css";
class Groupleader extends Component {
    constructor(props) {
        super(props);
        this.state={
            userRecord:[
                {
                    name:"阿房宫",
                    context:"电话1",
                    time:"2019.03.12",
                    operator:"李四"
                },
                {
                    name:"西安文物局",
                    context:"电话2",
                    time:"2019.03.12",
                    operator:"王五"
                },
                {
                    name:"阿房宫",
                    context:"电话1",
                    time:"2019.03.12",
                    operator:"李四"
                },
                {
                    name:"文艺路",
                    context:"电话4",
                    time:"2019.03.12",
                    operator:"王二"
                },
                {
                    name:"阿房宫",
                    context:"电话1",
                    time:"2019.03.12",
                    operator:"李四"
                },
            ],
            detailsHandling:[
                {
                    name:"李四",
                    count:"34",
                    falsePositives:"56",
                    falseReport:"67",
                    alert:"89"
                },
                {
                    name:"李四",
                    count:"34",
                    falsePositives:"56",
                    falseReport:"67",
                    alert:"89"
                },
                {
                    name:"李四",
                    count:"34",
                    falsePositives:"56",
                    falseReport:"67",
                    alert:"89"
                },
                {
                    name:"李四",
                    count:"34",
                    falsePositives:"56",
                    falseReport:"67",
                    alert:"89"
                },
                {
                    name:"李四",
                    count:"34",
                    falsePositives:"56",
                    falseReport:"67",
                    alert:"89"
                },
                {
                    name:"李四",
                    count:"34",
                    falsePositives:"56",
                    falseReport:"67",
                    alert:"89"
                },
                {
                    name:"李四",
                    count:"34",
                    falsePositives:"56",
                    falseReport:"67",
                    alert:"89"
                },
            ]
        };
    }
    render() {
        return (
            <div className="groupLeader">
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
                    <div className="group-height count groupLeader-border alarm-type untreatedAlarm">
                        <p className="alarm-type">未处理报警数</p>
                        <p className="alarm-number">409</p>
                    </div>
                    <div className="group-height count groupLeader-border alarm-type todayAlarm">
                        <p className="alarm-type">今日处理总数</p>
                        <p className="alarm-number">253</p>
                        <div className="misreporting">
                            <Row>
                                <Col span={8}>误报</Col>
                                <Col span={8}>虚警</Col>
                                <Col span={8}>虚报</Col>
                            </Row>
                            <Row>
                                <Col span={8}>123</Col>
                                <Col span={8}>454</Col>
                                <Col span={8}>565</Col>
                            </Row>
                        </div>
                    </div>
                    <div className="group-height count groupLeader-border alarm-type userAlarm">
                        <p className="alarm-type">用户总数</p>
                        <p className="alarm-number">34</p>
                        <div className="misreporting">
                            <Row>
                                <Col span={8}>企业用户</Col>
                                <Col span={8}>个人用户</Col>
                            </Row>
                            <Row>
                                <Col span={8}>234</Col>
                                <Col span={8}>454</Col>
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
                                <img src="http://pic01.aokecloud.cn/alarm/1000020/pic/20190312/1000020_20190312113157_320X180.jpg" alt=""/>
                                <img src="http://pic01.aokecloud.cn/alarm/1000020/pic/20190312/1000020_20190312113157_320X180.jpg" alt=""/>
                            </Row>
                            <Row>
                                <img src="http://pic01.aokecloud.cn/alarm/1000020/pic/20190312/1000020_20190312113157_320X180.jpg" alt=""/>
                                <img src="http://pic01.aokecloud.cn/alarm/1000020/pic/20190312/1000020_20190312113157_320X180.jpg" alt=""/>
                            </Row>
                        </div>
                        <div className="group-details groupLeader-border">
                            <p className="alarm-top">今日详情处理</p>
                            <table className="record todayDetails">
                                <tr>
                                    <td className="details-title">姓名</td>
                                    <td className="details-title">总数</td>
                                    <td className="details-title">误报</td>
                                    <td className="details-title">虚报</td>
                                    <td className="details-title">警报</td>
                                </tr>
                                {
                                    this.state.detailsHandling.map((v,i)=>(
                                        <tr key={i}>
                                            <td className="details-body">{v.name}</td>
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
