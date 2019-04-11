import React from 'react';
import {Button, Switch, Icon,Comment, Modal,message,Input } from 'antd';
import {post} from "../../axios/tools";
import "../../style/ztt/css/police.css";
import moment from "moment";
const ButtonGroup = Button.Group;
const { TextArea } = Input;
let vis=false;

class Alarmdetails extends React.Component{
	constructor(props){
      super(props);
      this.state={
      	data:{ //请求的数据
      		src:'',
      		name:'',
      		tags:'',
      		type:'1',
          atime:'',
      		field:[],
          finalresult:[],
      	},
      	field:true, //是否显示围界信息
      	obj:true, //是否显示报警对象
      	prev:'', //上一条数据code
      	next:'', //下一条数据code
        code:'', //当前数据的code
        videoopen:false, //视频开关
        returnmemo:[], //回访记录
        lookretrunSwitch:false, //回访弹层开关
        newreturnSwitch:false, //新增回访弹层开关
        visibleUser:false, //用户详情弹层
      };
  }
  componentWillMount() {
  	//此处拿到父页面参数
    this.setState({
      faths:this.props.toson,
    //   code:this.props.toson.code,
    });
  }
  componentDidMount() {
       this.request();
    } ;
  componentWillReceiveProps(nextProps){ //此处修改父页面参数
      if( nextProps.visible !== vis){
          vis=nextProps.visible;
          if(nextProps.visible){
              vis=nextProps.visible;
              this.setState({
                  code:nextProps.toson.code,
                  faths:nextProps.toson
              }, () => {
                  this.request()});
          }
      }        
  }
  request=()=>{
    post({url:"/api/alarmhandlehistory/getone",data:this.state.faths},(res)=>{
        console.log(res.alarmhandle.hstatus,"hstatus");
        console.log(res.alarmhandle.returnmemo,"returnmemo");
        this.setState({
          returnmemo:res.alarmhandle.returnmemo,
          data:res.data,
          prev:res.data.last,
          next:res.data.next, 
          videoopen:false,
          memo:res.data.memo,
          atype:res.alarmhandle.hstatus, 
      },()=>{
        this.draw();
        this.typetext()
      });
    })
  }
  typetext=()=>{//处理状态显示
  	let text=''; 
    let color=''; 
  	switch(this.state.data.type){
  		case 1:
  			text='确认';
        color='#2A8E39'
  			break;
  		case 2:
  			text='忽略';
        color='#00B5D0'
  			break;
  		case 3:
  			text='虚警';
        color='#F22727 '
  			break;
      default:
        text='未处理';
        color='rgb(247, 195, 93)'
        break;
    }
    this.setState({
  		typetext:text,
        color:color,
  	})
  }
  onChange=(checked,text)=>{ //控制显示围界与对象
  	this.setState({
        [text]: checked,
    },()=>{
    	this.draw()
    });	
  }
  onChangeVideo=()=>{ // 查看视频切换
    this.setState({
        videoopen: !this.state.videoopen,
    }); 
  }
  looknew=(text)=>{ //查看上下一条
    let faths=this.state.faths;
    faths.code=this.state[text];
  	this.setState({
  		field:true,
  		obj:true,
      faths:faths,
  		code:this.state[text]
    },()=>{
    	this.componentDidMount()
    });
  }
  draw = ()=>{ //画围界
  	let ele = document.getElementById("canvasobj");
    let area = ele.getContext("2d");
    area.clearRect(0,0,604,476);//清除之前的绘图
    area.lineWidth=1;
    const datafield=this.state.data.field;
  	if(this.state.field && datafield.length){
      const xi=604/704, yi=476/576;
      let areafield = ele.getContext("2d"); 
      area.lineWidth=1;    
  		areafield.strokeStyle='#f00';
        datafield.map((el,i)=>{
        areafield.beginPath();
        areafield.moveTo(parseInt(datafield[i][0][0]*xi),parseInt(datafield[i][0][1]*yi));
        areafield.lineTo(parseInt(datafield[i][1][0]*xi),parseInt(datafield[i][1][1]*yi));
        areafield.lineTo(parseInt(datafield[i][2][0]*xi),parseInt(datafield[i][2][1]*yi));
        areafield.lineTo(parseInt(datafield[i][3][0]*xi),parseInt(datafield[i][3][1]*yi));
        areafield.lineTo(parseInt(datafield[i][0][0]*xi),parseInt(datafield[i][0][1]*yi));
        areafield.stroke();
        areafield.closePath();
        return '';
      })
  	}
    const objs=this.state.data.finalresult1;
  	if(this.state.obj && objs.length){
      //计算缩放比例
      const x=604/this.state.data.pic_width, y=476/this.state.data.pic_height;
      objs.map((el,i)=>{
        area.strokeStyle='#ff0';
        area.beginPath();
        area.rect(parseInt(el.x*x),parseInt(el.y*y),parseInt(el.w*x),parseInt(el.h*y));
        area.stroke();
        area.closePath();
        return '';
      })
  		
  	}
  }
  drawSelectObj=(el)=>{ //画出当前选中的围界
    const x=604/this.state.data.pic_width, y=476/this.state.data.pic_height;
    let ele = document.getElementById("canvasobj");
    let area = ele.getContext("2d");
    area.clearRect(0,0,604,476);//清除之前的绘图
    area.lineWidth=1;
    area.strokeStyle='#ff0';
    area.beginPath();
    area.rect(parseInt(el.x*x),parseInt(el.y*y),parseInt(el.w*x),parseInt(el.h*y));
    area.stroke();
    area.closePath();
  };
      //报警状态
      atypetext =(code) =>{
        if(code === 0){
            return "未处理";
        }else if(code === 1){
            return "挂起";
        }else if(code === 2){
            return "报警未结束";
        }else if(code === 3){
            return "报警已结束";
        }else if(code === 4){
            return "虚警";
        }else if(code === 5){
            return "误报";
        }else if(code === -1){
            return "待处理";
        }else if(code === -3){
              return "过期";
          }
      };
      //报警状态颜色
      sanjiaose = (status)=>{
        if(status === 0){
            return("triangleOr");
        }else if(status === 1){
            return("trianglegg");
        }else if(status === 2){
            return(" trianglebl");
        }else if(status === 3){
            return(" trianglerr");
        }else if(status === 3){
            return(" trianglerr");
        }else if(status === 5){
            return(" triangleOr");
        }else if(status === -1){
            return(" trianglecc");
        }else if(status === -2){
            return(" trianglebb");
        }else if(status === -3){
            return(" triangleaa");
        }
    };
    lookretrun=(val,opt=true)=>{ //将val置为opt
      this.setState({[val]: opt})
    };
    pushinfo=()=>{ //推送给app，获取用户信息
    const _this=this;        
        post({url:"/api/company/getinfo_maintain",data:{code:this.state.data.companycode}},(res)=>{
            if(res.success){
                _this.setState({
                    userName:res.data.adminname,
                    userPhone:res.data.adminaccount,
                    visibleUser:true,
                })
            }
        });
    }
    typeAlarm=(type,name)=>{
        this.setState({
            name,
            visibleTips:true,
            type,
        });
    };
    pushOk=()=>{//确认报警
        this.setState({type:2},()=>this.handleOkTips());
    }
    handleOkTips=()=>{ //处理：2报警未结束  4虚警   5误报
      const _this=this;
      const atype=this.state.type;
        if(this.state.data.code){
            post({url:"/api/alarmhandle/alarmhandle",data:{code:this.state.data.code,hstatus:atype}},(res)=>{
                if(res.success){
                  message.success("修改成功");
                  _this.setState({
                      visibleTips:false,
                      visibleUser:false,
                      atype
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
    render(){      
        return(
            <div className="AlarmDetail">
            	<div className="alarmflex">
            		<div className="flexleft" id="flexleft">
                  <canvas id="canvasobj" width="604px" height="476px" style={{backgroundImage:'url('+this.state.data.picpath+')',backgroundSize:"100% 100%",display:this.state.videoopen?'none':'block'}} />
                	<div style={{display:this.state.videoopen?'block':'none',width:'604px',height:'513px'}}>
                      <video src={this.state.data.videopath} autoPlay="autoplay" controls="controls" width="600px" />
                    </div>
                  <div style={{textAlign:'center',marginTop:'10px'}}>
            				<ButtonGroup>
      							  <Button type="primary" onClick={()=>this.looknew('prev')} disabled={this.state.prev?false:true}>
      								<Icon type="left" />上一条
      							  </Button>&nbsp;&nbsp;&nbsp;
      							  <Button type="primary" onClick={()=>this.looknew('next')} disabled={this.state.next?false:true}>
      								 下一条<Icon type="right" />
      							  </Button> 　
                     
                       {this.state.data.videopath
                      ?<Button type="primary" onClick={()=>this.onChangeVideo()} style={{marginLeft:'20px'}}>
                      {this.state.videoopen?"查看图片":"查看视频"}
                      </Button>
                       :''} 
      							</ButtonGroup> 
            			</div>
            		</div>	
            		<div className="flexright">
            				<h4><b>{this.state.data.name}</b></h4>
            				<p><label>报警对象：<span>{this.state.data.tags}</span></label></p>
            				<p><label>围界信息: <Switch size="small" checked={this.state.field} onChange={(checked)=>this.onChange(checked,'field')} /></label></p>
            				<p><label>报警信息: <Switch size="small" checked={this.state.obj} onChange={(checked)=>this.onChange(checked,'obj')} /></label></p>
            				<p><label>报警时间：<span>{this.state.data.atime}</span></label></p>
                    <p><label>处理类型：</label><span className={this.sanjiaose(this.state.atype)}>
                        {this.atypetext(this.state.atype)}
                    </span></p>
                    {this.state.returnmemo.length
                    ?<p><label>回访记录：</label><span style={{cursor:'pointer'}} onClick={()=>this.lookretrun('lookretrunSwitch')} >{this.state.returnmemo.length} 条</span></p>
                    :null}
                    {
                      this.state.atype
                      ?<p><label>处理操作：</label><Button type="primary" style={{background:'#279AC6',borderColor:'#279AC6',outline:'none !import'}} onClick={()=>this.typeAlarm(4,"虚警")}>虚警</Button><Button  type="primary" style={{background:'#3F51B5',borderColor:'#3F51B5'}} onClick={()=>this.typeAlarm(5,"误报")}>误报</Button><Button type="primary" style={{background:'#313653',borderColor:'#313653'}} onClick={this.pushinfo}>警情推送</Button></p>
                      :null
                    }
                    <div><label style={{float:'left',color:'#444'}}>备注：</label>
                        <div className="memo">
                        {this.state.memo?this.state.memo:'暂无备注'}
                        </div> 
                    </div>
                    
            		</div>
            	</div>
              <Modal
                    title="用户详情"
                    visible={this.state.visibleUser}
                    onOk={this.pushOk}
                    onCancel={()=>this.lookretrun('visibleUser',false)}
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
                    title="回访记录"
                    visible={this.state.lookretrunSwitch}
                    onCancel={()=>this.lookretrun('lookretrunSwitch',false)} 
                    width={600}
                    footer={null}
                >
                  {this.state.returnmemo.map((el,i)=>(
                      <Comment key={'Comment'+i}
                                author={el.time}
                                avatar={(
                                  <Icon type="message" theme="filled" style={{color:'#6BAC20',fontSize:'1.5em'}} />
                                )}
                                content={(
                                  <p>{el.info}</p>
                                )}
                            />
                  ))}
                  <p>共<span>{this.state.returnmemo.length}</span>条记录 </p>
                </Modal>
                <Modal
                    title="提示信息"
                    visible={this.state.visibleTips}
                    onOk={this.handleOkTips}
                    onCancel={()=>this.lookretrun('visibleTips',false)}
                    width={400}
                    okText="确认"
                    cancelText="取消"
                >
                    <p><span>确定为</span><span>{this.state.name?this.state.name:""}</span>吗?</p>
                </Modal>
            </div>
        )
    }
}
export default Alarmdetails
