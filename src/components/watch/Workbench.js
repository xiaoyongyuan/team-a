import React, { Component,Fragment } from 'react';
import {Button,Collapse,Row,Col, Modal,message,Icon,Switch,Comment,Input, Select} from "antd";
import "../../style/ztt/css/workbench.css";
import nodata from "../../style/imgs/nopic.png";
import nodataleft from "../../style/imgs/nodata.png";

import {post} from "../../axios/tools";
import moment from "moment";
const Option = Select.Option;

var hangup=true;
const { TextArea } = Input;
const Panel = Collapse.Panel;
class Workbench extends Component {
    constructor(props) {
        super(props);
        this.state={
            visibleUser:false,
            visibleTips:false,
            pending:[],
            videoFalse:false,//视频开关
            nextPageBtn:false,//下一页
            page:1,
            field:true, //是否显示围界信息
            obj:true,
            newreturnSwitch:false,
            lookretrunSwitch:false, //回访开关
            returnmemo:[], //回访记录
            returnChange:'', //新增回访记录
            finishSwitch:false, //结束报警开关
            lightSwitch:false, //设备闪灯开关
        };
    }
    componentDidMount() {
        this.getOneAlarm();
        this.pendingList();
        this.padingLoad();
    }
    //值班人员报警
    getOneAlarm=(url="/api/alarmhandle/get_handle",data={})=>{
      post({url:url,data:data},(res)=>{
          if(res.success){
              this.setState({
              	 nextPageBtn:false,
                  oldHstatus:res.alarmhandle.hstatus,
                  code:res.data.code,
                  companycode:res.data.companycode,
                  eid:res.data.eid,
                  alarmname:res.data.name,
                  memo:res.alarmhandle.memo?res.alarmhandle.memo:'备注信息',
                  memochange:res.alarmhandle.memo?res.alarmhandle.memo:'备注信息',
                  videopath:res.data.videopath,
                  picpath:res.data.picpath,
                  atime:res.data.atime,
                  fieldInfor:res.data.field,
                  finalresult:res.data.finalresult1,
                  picWidth:res.data.pic_width,
                  picHeight:res.data.pic_height,
                  videoFalse:false,
                  returnmemo:res.alarmhandle.returnmemo, //回访记录
                  finishSwitch:false,
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
    pushinfo=()=>{ //推送给app，获取用户信息
    const _this=this;        
        post({url:"/api/company/getinfo_maintain",data:{code:this.state.companycode}},(res)=>{
            if(res.success){
                _this.setState({
                    userName:res.data.adminname,
                    userPhone:res.data.adminaccount,
                    visibleUser:true,
                })
            }
        });
    }
    pushOk=()=>{//确认报警
        this.setState({type:2},()=>this.handleOkTips());
    }
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
        const loginaccount=localStorage.getItem('loginaccount');
    	if(hangup && loginaccount){
        post({url:"/api/alarmhandle/getlist",data:{htype:"hangup",pageindex:this.state.page,pagesize:10,account:loginaccount}},(res)=>{
            if(res.success){
                if(res.data.length>0){
                	var pending=res.data;
                	if(this.state.page>1){
                		const listPending=this.state.pending;
                		pending=listPending.concat(res.data);
                	}
                	this.setState({
                      pending:pending,
                      pendingCount:res.totalcount,
                  })

                }else{
                	if(this.state.page>1) hangup=false;
                	message.info("没有更多了");
                }
            }else message.warning(res.errorinfo);
        })
      }
    };
    padingLoad=()=>{
        document.getElementById("hangUpPanel").onscroll=()=>{
            var pending=document.getElementById("hangUpPanel").scrollHeight;//内容的总体高度
            var scroll=document.getElementById("hangUpPanel").scrollTop;//距离顶部的高度
            var clice=document.getElementById("hangUpPanel").clientHeight;//可视的高度
            var bottom=pending-clice;
            var foot=bottom-scroll;//滚动条距离底部的高度
            console.log(pending,scroll,clice)
            if(foot===0){
            	let page=this.state.page;
                page++;
                this.setState({page},()=>{
                    this.pendingList();
                })
            }
        }
    }
    /*
    * 改变报警类型
    *  0未处理  1挂起   2报警未结束   3报警已结束  4虚警   5误报  -1待处理  -3过期
    * 如果为报警并获取用户的信息
    * */
    handleOkTips=()=>{
    	const _this=this;
    	const oldHstatus=this.state.type;
        if(this.state.code){
        	if(oldHstatus==3 && !this.state.returnmemo.length){
        		message.warning('请至少添加一条回访记录!');
        		_this.setState({visibleTips:false})
        		return;
        	} 
            post({url:"/api/alarmhandle/alarmhandle",data:{code:this.state.code,hstatus:oldHstatus}},(res)=>{
                if(res.success){
                	message.success("修改成功");
                  _this.setState({
                  		nextPageBtn:true,
                      visibleTips:false,
                      oldHstatus:oldHstatus,
                      page:1,
                      finishSwitch:oldHstatus==3?true:false,
                      visibleUser:false
                  },()=>{
                  	hangup=true;
                  	_this.pendingList() 
                  });                    
                }else{
                    message.warning(res.errorinfo);
                }
            });
        }else{
            message.warning("当前报警不存在");
            this.setState({
                visibleTips:false,
            })
        }
    };
    //下一页
    nextPage=()=>{
        if(this.state.nextPageBtn || this.state.oldHstatus===2){
            this.getOneAlarm();
        }else message.info("请先处理当前报警！");
    };
    memochange=(e)=>{ //备注信息改变
    	const memochange=e.target.value;
    	if(memochange !== this.state.memo) this.setState({memochange})
    }
    remarks=()=>{ //提价备注信息
        if(this.state.memo!==this.state.memochange){
            if(this.state.code){
                post({url:"/api/alarmhandle/alarmhandle",data:{code:this.state.code,memo:this.state.memochange}},(res)=>{
                    if(res.success){
                    		message.success("备注信息添加成功!");
                        this.setState({memo:this.state.memochange});
                    }else message.error("备注信息添加失败!");
                })
            }else message.warning("当前报警不存在");
        }
    };
    //挂载还原
    mountRestore=(code)=>{
        if((code && this.state.nextPageBtn) || this.state.oldHstatus===2){
        	this.getOneAlarm("/api/alarmhandle/get_hangup",{code:code})
        }else{
            message.warning("请先处理当前报警！");
        }

    };
    //报警类型
    alarmType=(type)=>{
        switch (type) {
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
            return "handupColor";
        }else if(colorType===2){
            return "alarmUntreated";
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
    };
    lookretrun=(val,opt=true)=>{ //查看回访
    	this.setState({
            [val]: opt,
    	})
    };
    newreturnCancel=()=>{ //取消新增回访记录
    	this.setState({returnChange: '',newreturnSwitch:false})
    };
    newreturnOk=()=>{ //新增回访
        if(!this.state.returnChange) return message.warning("请输入内容！");
    	const _this=this;
    	post({url:"/api/alarmhandle/alarmhandle",data:{code:this.state.code,returnmemo:this.state.returnChange}},(res)=>{
          if(res.success){
          		message.success("修改成功");
          		var returnmemo=this.state.returnmemo;
          		returnmemo.push({time:moment().format('YYYY-MM-DD hh:mm:ss'),info:this.state.returnChange})
    			this.setState({returnmemo:returnmemo},()=>_this.newreturnCancel())
          }
      });

    }
    returnChange=(e)=>{ //回访内容
    	this.setState({returnChange: e.target.value})
    }
    flashlightOk=()=>{ //设备闪灯
        this.setState({lightSwitch:false});
        if(this.state.eid){
            post({url:"/api/equipment/FlashLampV1",data:{eid:this.state.eid,seconds:this.state.lightValue}},(res)=>{
                if(res){
                  message.success("操作成功");  
                }
            })
        }
    };
    lightTime=(value)=>{//选择闪灯时长
        this.setState({
            defaultVal:value
        });
    };
    render() {
        return (
            <div className="workBench workToP">
                <div className="processingAlarm workbenchBorder">
                {
                	this.state.code
                	?<div className="processing-title">
                        <div className="processingAlarm-left">
                            <p><span className="nameWeight">名称：</span><span className="colorAlarmFont">{this.state.alarmname}</span><span className="switchInfor"><span className="atype">状态：</span><span style={{color:"red"}}>{this.alarmType(this.state.oldHstatus)}</span></span></p>
                            <p><span className="colorAlarmFont">{this.state.eid}</span><span className="atimeLeft">{this.state.atime}</span><span className="switchInfor"><span className="information">围界信息：<Switch size="small" checked={this.state.field} onChange={(checked)=>this.onChange(checked,'field')} /></span><span>报警信息：<Switch size="small" checked={this.state.obj} onChange={(checked)=>this.onChange(checked,'obj')} /></span></span></p>
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
                        {this.state.oldHstatus!==2 && this.state.oldHstatus!==3
                        		?<Fragment>
	                        			<div className="mount" style={{visibility:this.state.nextPageBtn?"hidden":"visible"}}><Icon className="IconMount" type="tag" size="large" theme="filled" title="挂起" onClick={()=>this.typeAlarm(1,"挂起")} /></div>
	                            	<div className="alarm-btn xuJing" style={{marginTop:"15px"}}><Button type="primary" onClick={()=>this.typeAlarm(4,"虚警")} disabled={this.state.nextPageBtn}>虚警</Button></div>
	                            	<div className="alarm-btn wuBao"><Button type="primary" onClick={()=>this.typeAlarm(5,"误报")} disabled={this.state.nextPageBtn}>误报</Button></div>
	                            	<div className="alarm-btn pushAlarm"><Button type="primary" onClick={this.pushinfo} disabled={this.state.nextPageBtn}>警情推送</Button></div>
                        		</Fragment>
                        		:<Fragment>
                        				<div className="mount" style={{visibility:"hidden"}}><Icon className="IconMount" type="tag" size="large" theme="filled" title="挂起" /></div>
                        				<div className="alarm-btn" style={{marginTop:"15px"}}>
                                        {this.state.returnmemo.length
                                            ?<Button type="primary" style={{background:"#86B94A",borderColor:"#86B94A"}} onClick={()=>this.lookretrun('lookretrunSwitch')}>查看回访</Button>
                                            :<Button type="primary" style={{background:"#86B94A",borderColor:"#86B94A"}} onClick={()=>this.lookretrun('newreturnSwitch')}>新增回访</Button>
                                        }
                                        </div>
	                            	<div className="alarm-btn" style={{marginBottom:"95px"}}><Button type="primary" style={{background:"red",borderColor:"red"}} this onClick={()=>this.typeAlarm(3,"结束")} disabled={this.state.finishSwitch}>结束</Button></div>
                        		</Fragment>
                        } 
                            <div className="alarm-btn"><Button icon="alert" type="danger" ghost onClick={()=>this.lookretrun('lightSwitch')}>设备闪灯</Button></div>
                            <div className="noteTriangle" />
                            <textarea className="remarks" id="remarks" value={this.state.memochange} onChange={this.memochange} onBlur={()=>this.remarks()} />
                            <div className="nextPage">
                                <Button type="primary" shape="circle" icon="right-circle" theme="filled" title="下一页" size="large" onClick={()=>this.nextPage()} />
                            </div>
                        </div>
                    </div>
                	:<div className="nodatastatus">
                		<img src={nodataleft}  />
                		<p>暂无数据</p>
                	</div>
                }
                    
                </div>
                <div className="hangUp">
                    <div className="garden">{this.state.pendingCount}</div>
                    <div className="mountUp">挂起列表</div>
                    <Collapse accordion defaultActiveKey={['1']} style={{marginTop:"52px"}}>
                        <Panel key="1" showArrow={false}>
                            <div className="hangUpPanel" id="hangUpPanel">
                                {
                                    this.state.pending.map((v,i)=>(
                                        <Row key={i} onClick={()=>this.mountRestore(v.code)} className="mountRestore">
                                            <Col xxl={15} xl={14}>
                                                <div className="hangUpImg"><img src={v.pic_min?v.pic_min:nodata} alt="" /></div>
                                            </Col>
                                            <Col xxl={9} xl={10}>
                                                <p className="overflow">{v.name}</p>
                                                <p className={this.alarmTypeColor(v.hstatus)}>{this.alarmType(v.hstatus)}</p>
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
                    onOk={this.pushOk}
                    onCancel={this.userHandleCancel}
                    okText="确认报警"
                    cancelText="取消"
                >
                    <div className="userDetails">
                        <p><label>姓名：</label><span>{this.state.userName}</span></p>
                        <p><label>联系电话：</label><span>{this.state.userPhone}</span></p>
                        <p><label>地址：</label><span>''</span></p>
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
                    <p><span>确定为</span><span>{this.state.name?this.state.name:""}</span>吗?</p>
                </Modal>
                <Modal
                    title="提示信息"
                    visible={this.state.lightSwitch}
                    onOk={this.flashlightOk}
                    onCancel={()=>this.lookretrun('lightSwitch',false)}
                    width={400}
                    okText="确认"
                    cancelText="取消"
                >
                    <p>请选择闪灯时长</p>
                    <Select defaultValue={5} style={{ width: 120 }} onChange={this.lightTime} >
                      <Option value="5">5秒</Option>
                      <Option value="10">10秒</Option>
                      <Option value="15">15秒</Option>
                    </Select>
                </Modal>
                <Modal
                    title="回访记录"
                    visible={this.state.lookretrunSwitch}
                    onCancel={()=>this.lookretrun('lookretrunSwitch',false)} 
                    width={600}
                    footer={null}
                >
                	{this.state.returnmemo.map((el,i)=>(
	                		<Comment
                                author={el.time}
                                avatar={(
                                  <Icon type="message" theme="filled" style={{color:'#6BAC20',fontSize:'1.5em'}} />
                                )}
                                content={(
                                  <p>{el.info}</p>
                                )}
                            />
	                ))}
	                <p>共<span>{this.state.returnmemo.length}</span>条记录 <span style={{cursor:'pointer',display:this.state.finishSwitch?'none':'inline-block'}} onClick={()=>this.lookretrun('newreturnSwitch')}><Icon type="plus-circle" theme="twoTone" />新增一条</span></p>
                </Modal>
                <Modal
                    zIndex="2000"
                    title="新增回访记录"
                    visible={this.state.newreturnSwitch}
                    width={400}
                    okText="确认"
                    cancelText="取消"
                    onOk={this.newreturnOk}
                    onCancel={this.newreturnCancel}   
                >
                	<TextArea rows={4} value={this.state.returnChange} onChange={this.returnChange} />
                </Modal>
            </div>
        )
    }

}
export default Workbench;
