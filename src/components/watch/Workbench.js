import React, { Component } from 'react';
import {Button,Collapse,Row,Col, Modal,message,Icon} from "antd";
import "../../style/ztt/css/workbench.css";
import {post} from "../../axios/tools";
const Panel = Collapse.Panel;
class Workbench extends Component {
    constructor(props) {
        super(props);
        this.state={
            visibleUser:false,
            visibleTips:false,
            pending:[],
            videoFalse:false,//视频开关
            falseAlarmBtn:false,
            falsePositivesBtn:false,
            pushBtn:false
        };
    }
    componentDidMount() {
        this.getOneAlarm();
        this.pendingList();
    }
    //值班人员报警
    getOneAlarm=()=>{
      post({url:"/api/alarmhandle/get_handle"},(res)=>{
          if(res.success){
            this.setState({
                oldHstatus:res.alarmhandle.hstatus,
                code:res.data.code,
                companycode:res.data.companycode,
                eid:res.data.eid,
                memo:res.data.memo,
                videopath:res.data.videopath,
                picpath:res.data.picpath,
                atime:res.data.atime,
                field:res.data.field,
                finalresult:res.data.finalresult1,
                picWidth:res.data.pic_width,
                picHeight:res.data.pic_height,
                videoFalse:false
            },()=>{
                this.paintingBoundary();//围界
            });
          }
      })
    };
    typeAlarm=(type,name)=>{
        this.setState({
            name,
            visibleTips:true,
            type,
        });
    };
    //围界
    paintingBoundary=()=> {
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        ctx.lineWidth=1;
        ctx.clearRect(0,0,704,576);//清除之前的绘图

        if(this.state.field){
            const datafield=this.state.field;
            ctx.strokeStyle='#f00';
            ctx.lineWidth=1;
            datafield.map((el,i)=>{
                ctx.beginPath();
                ctx.moveTo(parseInt(datafield[i][0][0]),parseInt(datafield[i][0][1]));
                ctx.lineTo(parseInt(datafield[i][1][0]),parseInt(datafield[i][1][1]));
                ctx.lineTo(parseInt(datafield[i][2][0]),parseInt(datafield[i][2][1]));
                ctx.lineTo(parseInt(datafield[i][3][0]),parseInt(datafield[i][3][1]));
                ctx.lineTo(parseInt(datafield[i][0][0]),parseInt(datafield[i][0][1]));
                ctx.stroke();
                ctx.closePath();
                return '';
            });
        }

        if(this.state.finalresult){
            const objs = this.state.finalresult;
            const x=704/this.state.picWidth,y=576/this.state.picHeight;
            objs.map((el,)=>{
                ctx.strokeStyle="#ff0";
                ctx.beginPath();
                ctx.rect(parseInt(el.x*x),parseInt(el.y*y),parseInt(el.w*x),parseInt(el.h*y));
                ctx.stroke();
                ctx.closePath();
                return '';
            })
        }

    };
    //挂在列表显示
    pendingList=()=>{
      post({url:"/api/alarmhandle/getlist",data:{hstatus:"-2"}},(res)=>{
          if(res.success){
            this.setState({
                pending:res.data,
                pendingCount:res.totalcount,
                mountLength:res.data.length
            })
          }else{
              message.warning(res.errorinfo);
          }
      })
    };
    /*
    * 改变报警类型
    * 1虚警 2误报 3报警 -2挂起 -1以获取未处理 0未处理
    * 如果为报警并获取用户的信息
    * */
    handleOkTips=()=>{
        if(this.state.code){
            post({url:"/api/alarmhandle/alarmhandle",data:{code:this.state.code,hstatus:this.state.type}},(res)=>{
                if(res.success){
                    var alarmold=this.state.oldHstatus;
                    alarmold=this.state.type;
                    message.success("修改成功");
                    this.setState({
                        visibleTips:false,
                        alarmold,
                    });
                    if(this.state.type===1){
                        this.setState({
                            falseAlarmBtn:true,
                        })
                    }else if(this.state.type===2){
                        this.setState({
                            falsePositivesBtn:true,
                        })
                    }
                    if(this.state.type===3){
                        post({url:"/api/company/getinfo_maintain",data:{code:this.state.companycode}},(res)=>{
                            if(res.success){
                                this.setState({
                                    userName:res.data.adminname,
                                    userPhone:res.data.adminaccount,
                                    pushBtn:true
                                })
                            }
                        });
                        this.setState({
                            visibleUser:true
                        })
                    }
                }else{
                    message.warning(res.errorinfo);
                }
            });
        }else{
            message.warning("报警code不存在");
            this.setState({
                visibleTips:false,
            })
        }
    };
    //挂载列表
    mountProcessing=()=>{
        if(this.state.code){
            post({url:"/api/alarmhandle/alarmhandle",data:{code:this.state.code,hstatus:"-2"}},(res)=>{
                if(res.success){
                    var old=this.state.oldHstatus=-2;
                    this.setState({old,},()=>{
                        this.pendingList();
                    });
                }else {
                    message.warning(res.errorinfo);
                }
            })
        }else{
            message.warning("报警code不存在");
        }

    };
    //下一页
    nextPage=()=>{
        this.getOneAlarm();
    };
    remarks=()=>{
        var remarks=document.getElementById("remarks").value;
        if(this.state.code){
            post({url:"/api/alarmhandle/alarmhandle",data:{code:this.state.code,memo:remarks}},(res)=>{
                if(res.success){
                    var memo=this.state.memo;
                    memo=remarks;
                    this.setState({memo},()=>{
                        this.getOneAlarm();
                    });
                    message.success("备注信息添加成功!");
                }else{
                    message.error("备注信息添加失败!");
                }
            })
        }else{
            message.warning("报警code不存在");
        }
    };
    //挂载还原
    mountRestore=(code)=>{
        post({url:"/api/alarmhandle/get_hangup",data:{code:code}},(res)=>{
            if(res.success){
                this.setState({
                    oldHstatus:res.alarmhandle.hstatus,
                    code:res.data.code,
                    companycode:res.data.companycode,
                    eid:res.data.eid,
                    memo:res.data.memo,
                    videopath:res.data.videopath,
                    picpath:res.data.picpath,
                    atime:res.data.atime,
                    field:res.data.field,
                    finalresult:res.data.finalresult1,
                    picWidth:res.data.pic_width,
                    picHeight:res.data.pic_height,
                    videoFalse:false,
                    falseAlarmBtn:false,
                    falsePositivesBtn:false,
                    pushBtn:false
                },()=>{
                    this.paintingBoundary();//围界
                });
            }
        })
    };
    playPause=()=>{
        this.setState({
            videoFalse:!this.state.videoFalse,
        })
    };
    handleCancelTips=()=>{
        this.setState({
            visibleTips:false
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
                            <p><span>{this.state.eid}</span><span className="atimeLeft">{this.state.atime}</span></p>
                            <div className="alarmImg">
                                <canvas id="myCanvas" width="704px" height="576px" style={{backgroundImage:'url('+this.state.picpath+')',backgroundSize:"100% 100%",display:this.state.videoFalse?"none":"block"}} />
                                <video id="videopath" src={this.state.videopath} controls="controls" autoPlay="autoplay" style={{display:this.state.videoFalse?"block":"none"}} />
                            </div>
                            <div className="alarm-video">
                                {
                                    this.state.videopath?<Button type="primary" onClick={()=>this.playPause()}>{this.state.videoFalse?"图片":"短视频"}</Button>:""
                                }
                                <Button type="primary">直播</Button>
                            </div>
                        </div>
                        <div className="processingAlarm-right">
                            <div className="mount"><Icon type="paper-clip" title="挂载" style={{fontSize:"30px",float:"right",color:"#6188C1",cursor:"pointer"}} onClick={()=>this.mountProcessing()} /></div>
                            <div className="alarm-btn"><Button type="primary" onClick={()=>this.typeAlarm(1,"虚警")} disabled={this.state.falseAlarmBtn}>虚警</Button></div>
                            <div className="alarm-btn"><Button type="primary" onClick={()=>this.typeAlarm(2,"误报")} disabled={this.state.falsePositivesBtn}>误报</Button></div>
                            <div className="alarm-btn Push"><Button type="primary" onClick={()=>this.typeAlarm(3,"报警")} disabled={this.state.pushBtn}>推送</Button></div>
                            <textarea className="remarks" id="remarks" placeholder="备注信息" onBlur={()=>this.remarks()} />
                            <div className="nextPage"><Icon type="right-circle" theme="filled" title="下一页" style={{fontSize:"75px",float:"right",color:"#2E75E4",cursor:"pointer",padding:"10px 0"}} onClick={()=>this.nextPage()} /></div>
                        </div>
                    </div>

                </div>
                <div className="hangUp">
                    <div className="garden">{this.state.mountLength}</div>
                    <div className="mountUp" />
                    <Collapse accordion defaultActiveKey={['1']} style={{marginTop:"30px"}}>
                        <Panel  key="1" showArrow={false}>
                            <div className="hangUpPanel" >
                                {
                                    this.state.pending.map((v,i)=>(
                                        <Row key={i} onClick={()=>this.mountRestore(v.code)} className="mountRestore">
                                            <Col xxl={15} xl={14}>
                                                <div className="hangUpImg"><img src={v.pic_min} alt="" /></div>
                                            </Col>
                                            <Col  xxl={9} xl={10}>
                                                <p>{v.name}</p>
                                                <p>{v.memo?v.memo:"无"}</p>
                                            </Col>
                                        </Row>
                                    ))
                                }
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
                        <p><label>姓名：</label><span>{this.state.userName}</span></p>
                        <p><label>联系电话：</label><span>{this.state.userPhone}</span></p>
                        <p><label>地址：</label><span>西安雁塔区西安理工大科技园</span></p>
                        <p><label>紧急联系人1：</label><span>李**</span><span>***********</span></p>
                        <p><label>紧急联系人2：</label><span>王**</span><span>***********</span></p>
                    </div>
                </Modal>
                <Modal
                    title="提示信息"
                    visible={this.state.visibleTips}
                    onOk={this.handleOkTips}
                    onCancel={this.handleCancelTips}
                    width={400}
                    okText="确认"
                    cancelText="取消"
                >
                   <span>为确定{this.state.name?this.state.name:""}吗?</span>
                </Modal>
            </div>
        )
    }

}
export default Workbench;
