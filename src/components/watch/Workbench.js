import React, { Component } from 'react';
import {Button,Collapse,Row,Col, Modal,message,Icon,Switch} from "antd";
import "../../style/ztt/css/workbench.css";
import nodata from "../../style/imgs/nopic.png";
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
            falseAlarmBtn:false,//虚警按钮
            falsePositivesBtn:false,//误报按钮
            pushBtn:false,//推送按钮
            nextPageBtn:false,//下一页
            mountBtn:false,//挂载按钮图标,
            page:1,
            ifPedding:true,
            field:true, //是否显示围界信息
            obj:true,
        };
    }
    componentDidMount() {
        this.getOneAlarm();
        this.pendingList();
        this.padingLoad();
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
                  name:res.data.name,
                  memo:res.alarmhandle.memo,
                  videopath:res.data.videopath,
                  picpath:res.data.picpath,
                  atime:res.data.atime,
                  fieldInfor:res.data.field,
                  finalresult:res.data.finalresult1,
                  picWidth:res.data.pic_width,
                  picHeight:res.data.pic_height,
                  videoFalse:false,
                  falseAlarmBtn:false,//虚警按钮
                  pushBtn:false,//推送按钮
                  falsePositivesBtn:false,//误报按钮
                  mountBtn:false,//挂载按钮图标,
              },()=>{
                  this.paintingBoundary();//围界
              });
          }else{
              this.getOneAlarm();
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
        ctx.clearRect(0,0,704,576);//清除之前的绘图
        ctx.lineWidth=1;
        const datafield=this.state.fieldInfor;
        if(this.state.field && datafield.length){
            let areafield = c.getContext("2d");
            ctx.lineWidth=1;
            areafield.strokeStyle='#f00';
            datafield.map((el,i)=>{
                areafield.beginPath();
                areafield.moveTo(parseInt(datafield[i][0][0]),parseInt(datafield[i][0][1]));
                areafield.lineTo(parseInt(datafield[i][1][0]),parseInt(datafield[i][1][1]));
                areafield.lineTo(parseInt(datafield[i][2][0]),parseInt(datafield[i][2][1]));
                areafield.lineTo(parseInt(datafield[i][3][0]),parseInt(datafield[i][3][1]));
                areafield.lineTo(parseInt(datafield[i][0][0]),parseInt(datafield[i][0][1]));
                areafield.stroke();
                areafield.closePath();
                return '';
            });
        }
        const objs = this.state.finalresult;
        if(this.state.obj && objs.length){
            const x=704/this.state.picWidth,y=576/this.state.picHeight;
            objs.map((el,i)=>{
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
        if(this.state.ifPedding){
            post({url:"/api/alarmhandle/getlist",data:{hstatus:"-2",pageindex:this.state.page,pagesize:10}},(res)=>{
                if(res.success){
                    if(res.data.length>0){
                        var  listPending=this.state.pending;
                        const pending =listPending.concat(res.data);
                        this.setState({
                            pending,
                            pendingCount:res.totalcount,
                        });
                    }else{
                        message.info("没有更多了");
                        this.setState({
                            ifPedding:false
                        })
                    }
                }else{
                    message.warning(res.errorinfo);
                }
            })
        }
    };
    padingLoad=()=>{
        let page=1;
        document.getElementById("hangUpPanel").onscroll=()=>{
            var pending=document.getElementById("hangUpPanel").scrollHeight;//内容的总体高度
            var scroll=document.getElementById("hangUpPanel").scrollTop;//距离顶部的高度
            var clice=document.getElementById("hangUpPanel").clientHeight;//可视的高度
            var bottom=pending-clice;
            var foot=bottom-scroll;//滚动条距离底部的高度
            if(foot==0 && pending>700){
                page++;
                this.setState({page},()=>{
                    this.pendingList();
                })
            }
        }
    }
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
                            falsePositivesBtn:true,
                            pushBtn:true,
                            oldHstatus:1,
                            mountBtn:true,
                        },()=>{
                            this.pendingList();
                            this.setState({
                                nextPageBtn:false,
                            })
                        })
                    }else if(this.state.type===2){
                        this.setState({
                            falseAlarmBtn:true,
                            falsePositivesBtn:true,
                            pushBtn:true,
                            oldHstatus:2,
                            mountBtn:true,
                        },()=>{
                            this.pendingList();
                            this.setState({
                                nextPageBtn:false,
                            })
                        })
                    }
                    if(this.state.type===3){
                        post({url:"/api/company/getinfo_maintain",data:{code:this.state.companycode}},(res)=>{
                            if(res.success){
                                this.setState({
                                    userName:res.data.adminname,
                                    userPhone:res.data.adminaccount,
                                    falseAlarmBtn:true,
                                    falsePositivesBtn:true,
                                    pushBtn:true,
                                    mountBtn:true,
                                    oldHstatus:3,
                                },()=>{
                                    this.pendingList();
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
    //置该条数据状态为挂起
    mountProcessing=()=>{
        if(this.state.code){
            post({url:"/api/alarmhandle/alarmhandle",data:{code:this.state.code,hstatus:"-2"}},(res)=>{
                if(res.success){
                    var old=this.state.oldHstatus;
                    old=-2;
                    this.setState({old,},()=>{
                        this.pendingList();
                        this.setState({
                            mountBtn:true,
                            falseAlarmBtn:true,
                            falsePositivesBtn:true,
                            pushBtn:true,
                            oldHstatus:-2,
                            ifPedding:true
                        });
                        message.success("挂载成功");
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
       document.getElementById("remarks").value="";
        if(this.state.falseAlarmBtn===true && this.state.falsePositivesBtn===true && this.state.pushBtn===true && this.state.mountBtn===true){
            this.getOneAlarm();
        }else if(this.state.falseAlarmBtn===false && this.state.falsePositivesBtn===false && this.state.pushBtn===false && this.state.mountBtn===false ){
            message.info("请先处理报警！");
        }
    };
    remarks=()=>{
        var remarks=document.getElementById("remarks").value;
        if(this.state.memo!==remarks){
            if(this.state.code){
                post({url:"/api/alarmhandle/alarmhandle",data:{code:this.state.code,memo:remarks}},(res)=>{
                    if(res.success){
                        var memo=this.state.memo;
                        memo=remarks;
                        this.setState({memo});
                        message.success("备注信息添加成功!");
                    }else{
                        message.error("备注信息添加失败!");
                    }
                })
            }else{
                message.warning("报警code不存在");
            }
        }
    };
    //挂载还原
    mountRestore=(code)=>{
        if(code){
            post({url:"/api/alarmhandle/get_hangup",data:{code:code}},(res)=>{
                if(res.success){
                    this.setState({
                        oldHstatus:res.alarmhandle.hstatus,
                        code:res.data.code,
                        companycode:res.data.companycode,
                        eid:res.data.eid,
                        name:res.data.name,
                        memo:res.alarmhandle.memo,
                        videopath:res.data.videopath,
                        picpath:res.data.picpath,
                        atime:res.data.atime,
                        fieldInfor:res.data.field,
                        finalresult:res.data.finalresult1,
                        picWidth:res.data.pic_width,
                        picHeight:res.data.pic_height,
                        videoFalse:false,
                        falseAlarmBtn:false,//虚警按钮
                        pushBtn:false,//推送按钮
                        falsePositivesBtn:false,//误报按钮
                        mountBtn:false,//挂载按钮图标,
                    },()=>{
                        document.getElementById("remarks").value=this.state.memo;
                        this.paintingBoundary();//围界
                    });
                }
            })
        }else{
            message.warning("报警code不存在");
        }

    };
    //报警类型
    alarmType=(type)=>{
        switch (type) {
            case 0:
                return "未处理";
            case 1:
                return "虚警";
            case 2:
                return "误报";
            case 3:
                return "警报";
            case -1:
                return "已获取未处理";
            case -2:
                return "挂起";
            case -3:
                return "已过期";
        }
    };
    playPause=()=>{
        this.setState({
            videoFalse:!this.state.videoFalse,
        })
    };
    handleCancelTips=()=>{
        this.setState({
            visibleTips:false,
        })
    };
    userHandleCancel=()=>{
        this.setState({
            visibleUser:false,
        })
    };
    onChange=(checked,text)=>{ //控制显示围界与对象
         this.setState({
            [text]: checked,
        },()=>{
            this.paintingBoundary();
        });
    }
    render() {
        return (
            <div className="workBench workToP">
                <div className="processingAlarm workbenchBorder">
                    <div className="processing-title">
                        <div className="processingAlarm-left">
                            <p style={{display:this.state.name?"block":"none"}}><span style={{fontWeight:"bolder"}}>名称：</span><span style={{color:"#184a79"}}>{this.state.name}</span><span style={{float:"right"}}><span className="atype">状态：</span><span style={{color:"red"}}>{this.alarmType(this.state.oldHstatus)}</span></span></p>
                            <p style={{display:this.state.oldHstatus?"block":"none"}}><span style={{color:"#184a79"}}>{this.state.eid}</span><span className="atimeLeft">{this.state.atime}</span><span style={{float:"right"}}><span className="information">围界信息：<Switch size="small" checked={this.state.field} onChange={(checked)=>this.onChange(checked,'field')} /></span><span>报警信息：<Switch size="small" checked={this.state.obj} onChange={(checked)=>this.onChange(checked,'obj')} /></span></span></p>
                            <div className="alarmImg">
                                <canvas id="myCanvas" width="704px" height="576px" style={{backgroundImage:'url('+this.state.picpath+')',backgroundSize:"100% 100%",display:this.state.videoFalse?"none":"block"}} />
                                <video id="videopath" src={this.state.videopath} controls="controls" autoPlay="autoplay" loop="loop" style={{display:this.state.videoFalse?"block":"none"}} />
                            </div>
                            <div className="alarm-video">
                                {
                                    this.state.videopath?<Button className="videoBtn" type="primary" onClick={()=>this.playPause()}>{this.state.videoFalse?"图片":"短视频"}</Button>:""
                                }
                                <Button type="primary">直播</Button>
                            </div>
                        </div>
                        <div className="processingAlarm-right">
                            <div className="mount" style={{visibility:this.state.mountBtn?"hidden":"visible"}}><Icon className="IconMount" type="tag"  size="large" theme="filled" title="挂载"  onClick={()=>this.mountProcessing()} /></div>
                            <div className="alarm-btn xuJing" style={{marginTop:"15px"}}><Button type="primary" onClick={()=>this.typeAlarm(1,"虚警")} disabled={this.state.falseAlarmBtn}>虚警</Button></div>
                            <div className="alarm-btn wuBao"><Button type="primary" onClick={()=>this.typeAlarm(2,"误报")} disabled={this.state.falsePositivesBtn}>误报</Button></div>
                            <div className="alarm-btn pushAlarm"><Button type="primary" onClick={()=>this.typeAlarm(3,"报警")} disabled={this.state.pushBtn}>警情推送</Button></div>
                            <div className="noteTriangle" />
                            <textarea className="remarks" id="remarks" placeholder="备注信息" onBlur={()=>this.remarks()} />
                            <div className="nextPage">
                                <Button type="primary" disabled={this.state.nextPageBtn} shape="circle" icon="right-circle" theme="filled" title="下一页" size="large" onClick={()=>this.nextPage()} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hangUp">
                    <div className="garden">{this.state.pendingCount}</div>
                    <div className="mountUp">挂载列表</div>
                    <Collapse accordion defaultActiveKey={['1']} style={{marginTop:"52px"}}>
                        <Panel  key="1" showArrow={false}>
                            <div className="hangUpPanel" id="hangUpPanel">
                                {
                                    this.state.pending.map((v,i)=>(
                                        <Row key={i} onClick={()=>this.mountRestore(v.code)} className="mountRestore">
                                            <Col xxl={15} xl={14}>
                                                <div className="hangUpImg"><img src={v.pic_min?v.pic_min:nodata} alt="" /></div>
                                            </Col>
                                            <Col xxl={9} xl={10}>
                                                <p className="overflow">{v.name}</p>
                                                <p>{v.atime}</p>
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
                       {/* <p><label>紧急联系人1：</label><span>李**</span><span>***********</span></p>
                        <p><label>紧急联系人2：</label><span>王**</span><span>***********</span></p>*/}
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
