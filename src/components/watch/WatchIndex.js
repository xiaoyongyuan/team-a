import React, { Component,Fragment } from 'react';
import {Col, Row} from "antd";
import BeCuty from "./BeCuty";
import "../../style/ztt/css/watchIndex.css";
import {post} from "../../axios/tools";
import nodata from "../../style/imgs/nopic.png";
import ClassifiedStatistics from "./ClassifiedStatistics";
class WatchIndex extends Component {
    constructor(props) {
        super(props);
        this.state={
            hangUp:[],
            yesterdayHandled:{}
        };
    }
    componentDidMount() {
        this.alarmAnalysis();//报警分析
        this.mountList();

    }
    //挂载列表
    mountList=()=>{
        post({url:"/api/alarmhandle/getlist",data:{htype:"hangup"}},(res)=>{
            if(res.success){
                this.setState({
                    hangUp:res.data.slice(0,5)
                })
            }
        })
    };
    //报警分析 昨日处理总数  近七日工作统计
    alarmAnalysis=()=>{
        post({url:"/api/alarmhandlehistory/get_analysis"},(res)=>{
            if(res.success){
                this.setState({
                    alarmFalseList:res.data.falsealarm,
                    alarmEmptyList:res.data.emptyalarm,
                    alarmList:res.data.alarm,
                    alarmCount:res.data.falsealarm+res.data.emptyalarm+(res.data.alarm)*2,
                    yesterdayHandled:res.afterday,
                    yesterdayFalseList:res.afterday.falsealarm,
                    yesterdayEmptyList:res.afterday.emptyalarm,
                    yesterdayList:res.afterday.alarm,
                    yesterdayCount:res.afterday.falsealarm+res.afterday.emptyalarm+(res.afterday.alarm)*2,
                    nearlySeven:res.seveninfo,
                })
            }
        })
    };
    peddingType=(atype)=>{
        switch (atype) {
            case 0:
                return "未处理";
            case 1:
                return "挂起";
            case 2:
                return "报警未结束";
            case 3:
                return "报警已结束";
            case 4:
                return "虚警";
            case 5:
                return "挂起";
            case -1:
                return "待处理";
            case -3:
                return "过期";
            default:
                return "";
        }
    };
    alarmTypeColor=(colorType)=>{
        if(colorType===1){
            return "textCenter handupColor";
        }else if(colorType===2){
            return "textCenter alarmUntreated";
        }
    };
    render() {

        return (
            <div className="watchIndex">
               {/* <Row className="group-flex">
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
                </Row>*/}
                <Row>
                    <Col span={11}>
                        <Row>
                            <Col span={12}>
                                <div className="group-alarm groupLeader-border">
                                    <p className="watch-alarm">今日报警分析</p>
                                    <p className="watch-number watch-alarm">{this.state.alarmCount?this.state.alarmCount:0}</p>
                                    <Row>
                                        <Col span={12} className="police-Name"> 警情/条</Col>
                                        <Col span={12} className="police-Name">虚警/条</Col>
                                    </Row>
                                    <Row>
                                        <Col span={12} className="police-Name police-number policeFont1">{this.state.alarmList?this.state.alarmList:0}</Col>
                                        <Col span={12} className="police-Name police-number policeFont2">{this.state.alarmEmptyList?this.state.alarmEmptyList:0}</Col>
                                    </Row>
                                    <Row>
                                        <Col span={12} className="police-Name">误报/条</Col>
                                        <Col span={12} className="police-Name">查询用户/条</Col>
                                    </Row>
                                    <Row>
                                        <Col span={12} className="police-Name police-number policeFont3">{this.state.alarmFalseList?this.state.alarmFalseList:0}</Col>
                                        <Col span={12} className="police-Name police-number policeFont4">{this.state.alarmList?this.state.alarmList:0}</Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="group-alarm groupLeader-border">
                                    <p className="watch-alarm yesterdayData">昨日处理总数</p>
                                    <p className="watch-number statisticsNumber">{this.state.yesterdayCount?this.state.yesterdayCount:0}</p>
                                    <p className="statisticsNumber">分类统计</p>
                                    <ClassifiedStatistics yesterdayFalseList={this.state.yesterdayFalseList} yesterdayEmptyList={this.state.yesterdayEmptyList} yesterdayList={this.state.yesterdayList} style={{left:"-40px"}} />
                                </div>
                            </Col>
                        </Row>
                        <Col span={24}>
                            <Row className="groupLeader-border">
                                <p className="alarm-top">近七日工作统计</p>
                                <BeCuty nearlySeven={this.state.nearlySeven} className="group-seven" />
                            </Row>
                        </Col>
                    </Col>
                    <Col span={12}>
                      <div className="pending-list watchIndex-border groupLeader-border">
                          <p className="alarm-top"><span style={{float:"left"}}>挂起列表</span><span className="more"><a href="#/app/watch/workbench">更多</a></span></p>
                          {
                            !this.state.hangUp
                            ?<Fragment>{
                                this.state.hangUp.map((v,i)=>(
                                  <Row className="alarmList" key={i}>
                                      <div className="alarmListBorder">
                                          <Col span={6} className="listImg textCenter">
                                              <div className="handleUpImg"><img src={v.pic_min?v.pic_min:nodata} alt="" /></div>
                                          </Col>
                                          <Col span={6} className="textCenter">
                                              <Row className="Camera" style={{display:v.name?"block":"none"}}><span className="nameWeight">名称：</span>{v.name}</Row>
                                              <Row className="Camera" title={v.gettime}>{v.gettime}</Row>
                                              <Row className="Camera" title={v.memo?v.memo:"无"}><span className="nameWeight">备注信息：</span>{v.memo?v.memo:"无"}</Row>
                                          </Col>
                                          <Col span={4} className={this.alarmTypeColor(v.hstatus)}>{this.peddingType(v.hstatus)?this.peddingType(v.hstatus):"未知类型"}</Col>
                                          <Col span={5} className="textCenter">{v.atime?v.atime:"无"}</Col>
                                      </div>
                                  </Row>
                              ))
                            }</Fragment>
                            :<div style={{margin:'50px auto 0',width:'200px',textAlign:'center'}}>
                                <img src={nodata} width="100%"/>
                                <p>暂无数据</p>
                            </div>
                          }
                      </div>
                    </Col>
                </Row>
            </div>
        )
    }

}
export default WatchIndex;
