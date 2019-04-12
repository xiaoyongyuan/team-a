import React, { Component } from 'react';
import { Row, Col } from 'antd';
import WorkStatistics from "./WorkStatistics";
import AlarmAnalysis from "./AlarmAnalysis";
import "../../style/ztt/css/groupLeader.css";
import {post} from "../../axios/tools";
import "../../style/ztt/icon/iconfont.css";
import nodatapic from "../../style/imgs/nopic320180.png";
import leaderpng from "../../style/imgs/icon_user.png";

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
        this.unAlarmNumber();
        this.handleImgs();
    }
    getOne=()=>{
        post({url:"/api/userworker/getone",data:{account:this.state.loginaccount}},(res)=>{
            if(res.success){
                this.setState({
                    realname:res.data.realname,
                    lastlogin:res.data.lastlogin,
                    usergender:res.data.usergender,
                    account:res.data.account
                })
            }
        })
    };
    //未处理报警数
    unAlarmNumber=()=>{
        post({url:"/api/alarmhandle/get_unhandle"},(res)=>{
            if(res.success){
                this.setState({
                    unAlarm:res.data
                });
            }
        })
    };
    //图片
    handleImgs=()=>{
        post({url:"/api/alarmhandle/get_alarminfo_list"},(res)=>{
            if(res.success){
                this.setState({
                    userImg:res.data.slice(0,4),
                })
            }
        })
    };
    //用户记录
    userSelect=()=>{
        post({url:"/api/alarmhandle/get_userinfo_list"},(res)=>{
            if(res.success){
                this.setState({
                    userList:res.data.slice(0,5),
                })
            }
        })
    };
    //近七日工作统计
    sevenDays=()=>{
        post({url:"/api/alarmhandlehistory/get_analysis_comid"},(res)=>{
            if(res.success){
                this.setState({
                    seveninfo:res.seveninfo,
                    alarm:res.data.alarm,
                    emptyalarm:res.data.emptyalarm,
                    falsealarm:res.data.falsealarm,
                    hangup:res.data.hangup,
                    todaysCount:res.data.alarm+res.data.emptyalarm+res.data.falsealarm+res.data.hangup,//今日处理数
                })
            }
        })
    };
    //今日报警分析 今日报警分析 今日处理总数
    HandleAlarm=()=>{
        post({url:"/api/alarmhandle/getinfo"},(res)=>{
            if(res.success){
                this.setState({
                    smpgr:res.data.smpgr,//个人用户
                    smpqy:res.data.smpqy,//企业用户
                    userCount:res.data.smpgr+res.data.smpqy,//用户总数
                    alarmhandle:res.statsstics.slice(0.6),//今日处理详情
                    alarmCount:res.statsstics.alarm+res.statsstics.alarmun
                })
            }
        })
    };
    Gender=(gen)=>{
        if(gen){
            if(gen===0){
                return "nickname iconfont icon-nanren genderMale";
            }else{
                return "nickname iconfont icon-nvren genderFemale";
            }
        }
    };
    endAlarm=(value)=>{
        if(value>0){
            return "details-body endAlarm";
        }else{
            return "details-body";
        }
    }
    render() {
        return (
            <div className="groupLeader">
                <Row className="group-flex">
                    <div className="group-height name groupLeader-border">
                        <div className="groupLeader-img">
                             <div className="groupIcon"style={{marginTop: '15px',borderRadius: '50%',background:'#cacaca'}}><img src={leaderpng} /></div>
                             <p className="groupLeaderName">{this.state.realname}</p>
                        </div>
                        <div className="groupLeader-img group-information">
                            <div>
                                <p><span>{this.state.account}</span><span className={this.Gender(this.state.usergender)} /></p>
                                <p style={{display:this.state.lastlogin?"block":"none"}} >上次登录时间：{this.state.lastlogin}</p>
                            </div>
                        </div>
                    </div>
                    <div className="group-height count groupLeader-border alarm-type untreatedAlarm">
                        <p className="alarm-type">未处理报警数</p>
                        <p className="alarm-number">{this.state.unAlarm}</p>
                    </div>
                    <div className="group-height count groupLeader-border alarm-type todayAlarm">
                        <p className="alarm-type">今日处理总数</p>
                        <p className="alarm-number">{this.state.todaysCount}</p>
                        <div className="misreporting">
                            <Row>
                                <Col span={6}>警情</Col>
                                <Col span={6}>误报</Col>
                                <Col span={6}>虚警</Col>
                                <Col span={6}>挂起</Col>
                            </Row>
                            <Row>
                                <Col span={6}>{this.state.alarm}</Col>
                                <Col span={6}>{this.state.falsealarm}</Col>
                                <Col span={6}>{this.state.emptyalarm}</Col>
                                <Col span={6}>{this.state.hangup}</Col>
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
                                    <AlarmAnalysis alarm={this.state.alarm} falsealarm={this.state.falsealarm} emptyalarm={this.state.emptyalarm} hangup={this.state.hangup} />
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
                                                <Row key={v.code}>
                                                    <Col span={8} className="record-body">{v.cname?v.cname:"无"}</Col>
                                                    <Col span={8} className="record-body overflow" title={v.gettime?v.gettime:"无"}>{v.gettime?v.gettime:"无"}</Col>
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
                                   <div className="toDaysImg" key={i}><img src={v.pic_min?v.pic_min:nodatapic} alt="" /></div>
                                ))
                            }
                        </div>
                        <div className="group-details groupLeader-border">
                            <p className="alarm-top">今日详情处理</p>
                            <table className="record todayDetails">
                                <thead>
                                    <tr>
                                        <th className="details-title">姓名</th>
                                        <th className="details-title">总数</th>
                                        <th className="details-title">误报</th>
                                        <th className="details-title">虚报</th>
                                        <th className="details-title">报警已结束</th>
                                        <th className="details-title">报警未结束</th>
                                        <th className="details-title">挂起</th>
                                    </tr>
                                </thead>
                                {
                                    this.state.alarmhandle.map((v,i)=>(
                                        <tbody key={i}>
                                            <tr>
                                                <td className="details-body">{v.account}</td>
                                                <td className="details-body">{v.falsealarm+v.emptyalarm+v.alarm+v.hangup}</td>
                                                <td className="details-body">{v.falsealarm}</td>
                                                <td className="details-body">{v.emptyalarm}</td>
                                                <td className="details-body">{v.alarm}</td>
                                                <td className={this.endAlarm(v.alarmun)}>{v.alarmun}</td>
                                                <td className="details-body">{v.hangup}</td>
                                            </tr>
                                        </tbody>
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
