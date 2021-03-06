import React from 'react';
import {Button, Switch, Icon,Spin } from 'antd';
import {post} from "../../axios/tools";
import "../../style/ztt/css/police.css";
const ButtonGroup = Button.Group;
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
        ifall:false,
        ifmis:false,//误报确认弹框
        loadding:true,//加载状态
      };
  }
  componentWillMount() {
  	//此处拿到父页面参数
    this.setState({
      faths:this.props.toson,
      code:this.props.toson.code,
      ifall:false,
      loadding:true,
    });
  }
  componentDidMount() {
       this.request();
       this.setState({
        loadding:true,
      });
    } ;
  componentWillReceiveProps(nextProps){ //此处修改父页面参数
      if( nextProps.visible !== vis){
          vis=nextProps.visible;
          if(nextProps.visible){
              vis=nextProps.visible;
              this.setState({
                  code:nextProps.toson.code,
                  faths:nextProps.toson,
                  ifall:false,
              }, () => {
                  this.componentDidMount()});
          }
      }        
  }
  request=()=>{
    post({url:"/api/alarm/getone_foradmin",data:this.state.faths},(res)=>{        
      let data={
          cid:res.data.cid,
          src:res.data.picpath,
          field:res.data.field,
          name:res.data.name,
          alarmtype:res.data.alarmtype,
          finalresult:res.data.finalresult1,
          atime:res.data.atime,
          type:res.data.status,   
          tags:res.data.tags, 
          pic_width:res.data.pic_width, //报警宽
          pic_height:res.data.pic_height, //报警高  
  
        }
        this.setState({
          data:data,
          eid:res.data.eid,
          prev:res.data.last,
          next:res.data.next, 
          loadding:false,
      },()=>{
        this.draw();
      });
    })
  }
  onChange=(checked,text)=>{ //控制显示围界与对象
  	this.setState({
        [text]: checked,
    },()=>{
    	this.draw()
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
    const objs=this.state.data.finalresult;
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
  }
  memo =(e)=>{ 
    var memoval=document.getElementById("memo").value;  
    this.setState({
      memo:memoval
    })
  }
  baojing=()=>{
    this.setState({
      ifall:false,
    });
    this.componentDidMount()
  }
    render(){      
        return(
            <div className="alarmDetails">
             <Spin size="large" spinning={this.state.loadding} tip="加载中..." className="loadding">
              <div style={this.state.ifall?{display:'none'}:{display:'block'}}>
                  <div className="alarmflex">
                    <div className="flexleft" id="flexleft">
                      <canvas id="canvasobj" width="604px" height="476px" style={{backgroundImage:'url('+this.state.data.src+')',backgroundSize:"100% 100%"}} />
                      <div style={{textAlign:'center'}}>
                        <ButtonGroup>
                          <Button type="primary" onClick={()=>this.looknew('prev')} disabled={this.state.prev?false:true}>
                          <Icon type="left" />上一条
                          </Button>&nbsp;&nbsp;&nbsp;
                          <Button type="primary" onClick={()=>this.looknew('next')} disabled={this.state.next?false:true}>
                          下一条<Icon type="right" />
                          </Button>
                        </ButtonGroup> 
                      </div>
                    </div>	
                    <div className="flexright">
                        <h4><b>{this.state.data.name}</b></h4>
                        <p><label>设备编号：<span>{this.state.eid}</span></label></p>
                        <p><label>报警对象：<span>{this.state.data.tags}</span></label></p>
                        <p><label>围界信息: <Switch size="small" checked={this.state.field} onChange={(checked)=>this.onChange(checked,'field')} /></label></p>
                        <p><label>报警信息: <Switch size="small" checked={this.state.obj} onChange={(checked)=>this.onChange(checked,'obj')} /></label></p>
                        <p><label>报警时间：<span>{this.state.data.atime}</span></label></p>
                   
                    </div>
                  </div>
              </div>
              <div style={this.state.ifall?{display:'block'}:{display:'none'}}>
                  <div className="alarmflex">
                    <div className="flexleft" id="flexleft">
                      <canvas id="canvasobjt" width="604px" height="476px" style={{backgroundImage:'url('+this.state.srct+')',backgroundSize:"100% 100%",}} /> 
                    </div>	
                  <div className="flexright">
                        <p><label>设备名称：<span>{this.state.eid}</span></label></p>
                        <p><label>误报数量：<span>{this.state.data.length?this.state.data.length:'0'}</span></label></p>
                        <Button type="primary" onClick={()=>this.baojing()} >
                          返回报警信息
                        </Button>
                    </div> 
                  </div>
              </div>
              </Spin>
            </div>
        )
    }
}
export default Alarmdetails
