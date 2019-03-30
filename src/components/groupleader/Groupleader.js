import React, { Component } from 'react';
import { Row, Col } from 'antd';
import WorkStatistics from "./WorkStatistics";
import AlarmAnalysis from "./AlarmAnalysis";
import "../../style/ztt/css/groupLeader.css";
import {post} from "../../axios/tools";
import nodatapic from "../../style/imgs/nopic320180.png";
class Groupleader extends Component {
    constructor(props) {
        super(props);
        this.state={
            userList:[],
            alarmhandle:[],
            userImg:[]
        };
    }
    componentWillMount() {
       var loginaccount=localStorage.getItem("loginaccount");
       this.setState({loginaccount})
    }

    componentDidMount() {
       this.HandleAlarm(); //处理报警 今日报警分析 今日详情处理
       this.sevenDays(); //近七日工作统计
        this.getOne();
        this.userSelect();
    }
    getOne=()=>{
        post({url:"/api/userworker/getone",data:{account:this.state.loginaccount}},(res)=>{
            if(res.success){
                this.setState({
                    realname:res.data.realname,
                    lastlogin:res.data.lastlogin,
                    usergender:res.data.usergender
                })
            }
        })
    };
    //用户记录
    userSelect=()=>{
        post({url:"/api/alarmhandle/getlist_homepage"},(res)=>{
            if(res.success){
                this.setState({
                    userList:res.data.slice(0,5),
                    userImg:res.data.slice(0,4),
                })
            }
        })
    }
    //近七日工作统计
    sevenDays=()=>{
        post({url:"/api/alarmhandlehistory/get_analysis_comid"},(res)=>{
            if(res.success){
                this.setState({
                    seveninfo:res.seveninfo
                })
            }
        })
    };
    //处理报警 今日报警分析 今日详情处理
    HandleAlarm=()=>{
        post({url:"/api/alarmhandle/getinfo"},(res)=>{
            if(res.success){
                this.setState({
                    unhandle:res.unhandle,//未处理报警数
                    falsealarm:res.statsstics.falsealarm,//误报
                    emptyalarm:res.statsstics.emptyalarm,//虚警
                    hangup:res.statsstics.hangup,//挂起
                    todaysCount:res.statsstics.falsealarm+res.statsstics.emptyalarm+res.statsstics.hangup,//今日处理数
                    smpgr:res.data.smpgr,//个人用户
                    smpqy:res.data.smpqy,//企业用户
                    userCount:res.data.smpgr+res.data.smpqy,//用户总数
                    alarmhandle:res.alarmhandle.slice(0.6),//今日处理详情
                })
            }
        })
    };

    render() {
        return (
            <div className="groupLeader">
                <Row className="group-flex">
                    <div className="group-height name groupLeader-border">
                        <div className="groupLeader-img">
                             <div className="groupIcon"><img src="http://ftp01.aokecloud.cn/alarm/1000021/photocatch/20190312/1000021_20190312163101.jpg" alt=""/></div>
                             <p className="groupLeaderName">{this.state.realname}</p>
                        </div>
                        <div className="groupLeader-img group-information">
                            <div>
                                <p className="nickname">{this.state.usergender===0?"女":"男"}</p>
                                <p style={{display:this.state.lastlogin?"block":"none"}} >{this.state.lastlogin}</p>
                            </div>
                        </div>
                    </div>
                    <div className="group-height count groupLeader-border alarm-type untreatedAlarm">
                        <p className="alarm-type">未处理报警数</p>
                        <p className="alarm-number">{this.state.unhandle}</p>
                    </div>
                    <div className="group-height count groupLeader-border alarm-type todayAlarm">
                        <p className="alarm-type">今日处理总数</p>
                        <p className="alarm-number">{this.state.todaysCount}</p>
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
                        <p className="alarm-number">{this.state.userCount}</p>
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
                                    <p className="alarm-top">今日报警分析</p>
                                    <AlarmAnalysis userCount={this.state.userCount} todaysCount={this.state.todaysCount} unhandle={this.state.unhandle} />
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="group-alarm groupLeader-border">
                                    <p className="alarm-top">查询用户记录</p>
                                    <div className="record">
                                        <Row>
                                            <Col span={8} className="record-center">用户</Col>
                                            <Col span={8} className="record-center">查询时间</Col>
                                            <Col span={8} className="record-center">操作人</Col>
                                        </Row>
                                        {
                                            this.state.userList.map((v,i)=>(
                                                <Row ke={i}>
                                                    <Col span={8} className="record-body">{v.cname?v.cname:"无"}</Col>
                                                    <Col span={8} className="record-body">{v.atime?v.atime:"无"}</Col>
                                                    <Col span={8} className="record-body">{v.realname}</Col>
                                                </Row>
                                            ))
                                        }
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="groupLeader-border">
                            <p className="alarm-top">近七日工作统计</p>
                            <WorkStatistics className="group-seven" seveninfo={this.state.seveninfo} />
                        </Row>
                    </Col>
                    <Col span={8}>
                        <div className="group-img groupLeader-border">
                            {
                                this.state.userImg.map((v,i)=>(
                                   <div className="toDaysImg"><img src={v.pic_min?v.pic_min:nodatapic} alt="" /></div>
                                ))
                            }
                        </div>
                        <div className="group-details groupLeader-border">
                            <p className="alarm-top">今日详情处理</p>
                            <table className="record todayDetails">
                                <tr>
                                    <td className="details-title">姓名</td>
                                    <td className="details-title">总数</td>
                                    <td className="details-title">误报</td>
                                    <td className="details-title">虚报</td>
                                    <td className="details-title">报警已结束</td>
                                    <td className="details-title">报警未结束</td>
                                    <td className="details-title">挂起</td>
                                </tr>
                                {
                                    this.state.alarmhandle.map((v,i)=>(
                                        <tr key={i}>
                                            <td className="details-body">{v.account}</td>
                                            <td className="details-body">{v.falsealarm+v.emptyalarm+v.alarm+v.hangup}</td>
                                            <td className="details-body">{v.falsealarm}</td>
                                            <td className="details-body">{v.emptyalarm}</td>
                                            <td className="details-body">{v.alarm}</td>
                                            <td className="details-body">{v.alarmun}</td>
                                            <td className="details-body">{v.hangup}</td>
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
