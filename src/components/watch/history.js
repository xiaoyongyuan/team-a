import React from 'react';
import { DatePicker, Row, Col, Button, Modal, Pagination, Form,LocaleProvider,Spin, Select,Input} from "antd";
import "../../style/ztt/css/police.css";
import "../../style/publicStyle/publicStyle.css";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import {post} from "../../axios/tools";
import AlarmDetail from "./Alarmdetails";
import nodata from "../../style/imgs/nopic320180.png";
import banditpic from "../../style/imgs/banditpic.png";
import firepic from "../../style/imgs/firepic.png";
import noImg from "../../style/imgs/nodata.png";
const { RangePicker } = DatePicker ;
const Option = Select.Option;
class history extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            type:[],
            visible: false,
            alarm:false,
            policeList:[],
            equipment:[],
            equipment1:[],
            alermType:[],
            loadding:true,
            alarmImgType:false,
            bdate:'',//检索的开始时间
            edate:'',//检索的结束时间
            cid:"", //检索选中的设备
            endOpen: false,
            page:1, //当前页数
            pageSize:18, //每页显示数量
            totalcount:0, //数据总量
            toson:{}, //传给详情页面的值
            displaygreen: 'block',
            displayred:'block',
            displayblue:'block',
            backColor:'',//背景颜色
            nodatapic:true,
        };
    }
    componentDidMount() {
        this.handleAlerm();//报警信息列表
    }
    handleCancelAlarmImg =()=>{
        this.setState({
            alarmImgType:false
        })
        this.handleAlerm();
    };
      //查看报警详情
      alarmImg =(code)=>{
        if(this.state.bdate!==null && this.state.edate!=null){
            var toson={
                code:code,
                bdate:this.state.bdate,
                edate:this.state.edate,
                hstatus:this.state.hstatus,
                account:this.state.account,
                pagesize:18,
                pageindex:this.state.page,
            };
        }
        this.setState({
            alarmImgType:true,
            toson:toson
        })
    }
    hanlePageSize = (page) => { //翻页
        this.setState({
            page:page,
        },()=>{
         this.handleAlerm()
        })
    };
    //报警信息列表
    handleAlerm = ()=>{
        this.setState({
            loadding:true,
        })
        var alarmmdata={
            bdate:this.state.bdate,
            edate:this.state.edate,
            hstatus:this.state.hstatus,
            account:this.state.account,
            pagesize:18,
            pageindex:this.state.page,
        }
        post({url:'/api/alarmhandlehistory/getlist',data:alarmmdata},(res)=>{
            if(res.success){
               
                if(res.data.length===0){
                    this.setState({
                      nodatapic:false,
                    })
                }else{
                    this.setState({
                        nodatapic:true,
                    })
                }
                if(res.data.length){
                    this.setState({
                        displaysearch:true,
                        policeList:res.data,
                        type:1,
                        totalcount:res.totalcount,
                        loadding:false
                    })
                }else{
                    this.setState({
                        type:0,
                        loadding:false
                    })
                }
            }else{
                this.setState({
                    loadding:false,
                    type:0,
                })
            }
        })
    };

    /*
    * 检索
    * 开始时间、结束时间
    * */
    handleSubmit =(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.setState({
                bdate:values.date&&values.date.length?values.date[0].format('YYYY-MM-DD')+" 00:00:00":'',
                edate:values.date&&values.date.length?values.date[1].format('YYYY-MM-DD')+" 23:59:59":'',
                hstatus:values.hstatus,
                account:values.account,
                pageindex:this.state.page,
            })
            if(!err){
                this.setState({
                    page:1,
                    loadding:true,
                },()=>{
                    this.handleAlerm()
                })
            }
       })
        this.setState({
            displaysearch:false,
        })
        
    };
    sanjiaose = (status)=>{
        if(status === 0){
            return("triangle-topright-green triangleOrange");
        }else if(status === 1){
            return("triangle-topright-green trianglegreen");
        }else if(status === 2){
            return("triangle-topright-green triangleblue");
        }else if(status === 3){
            return("triangle-topright-green trianglered");
        }else if(status === 4){
            return("triangle-topright-green trianglered");
        }else if(status === 5){
            return("triangle-topright-green triangleOrange");
        }else if(status === -1){
            return("triangle-topright-green trianglec");
        }else if(status === -2){
            return("triangle-topright-green triangleb");
        }else if(status === -3){
            return("triangle-topright-green trianglea");
        }
    }
      //报警状态
      handleState = (code)=>{
          switch (code) {
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
                  return "误报";
              case -1:
                  return "待处理";
              case -3:
                  return "过期";
              default:
                  return "";
          }
    };
     
      atypetext =(type) =>{
            switch(type){
              case 1:
                return '围界入侵';
              case 110:
                return '匪警';
              case 119:
                return '火警';
              case 12:
                return '整点打卡';
              default:
               return '未知类型 '+type;
            }
          }
    atypeimg =(type,img)=>{
        switch(type){
          case 1:
            return img;
          case 110:
            return banditpic;
          case 119:
            return firepic;
          case 12:
            return img;
          default:
           return nodata;
        }
      }
      changeCoord(e){ 
        this.setState({
            eee:e,
        });
      }
    render() {      
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="history">
                <LocaleProvider locale={zh_CN}>
                    <Row style={{marginTop:"20px",marginLeft:"20px"}}>
                        <Form onSubmit={this.handleSubmit} layout="inline">
                                <Form.Item label="日期" >
                                    {getFieldDecorator('date')(
                                        <RangePicker
                                            placeholder={['开始时间', '结束时间']}
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item label="操作人">
                                    {getFieldDecorator('account', {
                                        rules: [{ required: false, message: '请输入操作人' }],
                                    })(
                                        <Input placeholder="操作人" />
                                    )}
                                </Form.Item>
                                <Form.Item label="处理状态" >
                                    {getFieldDecorator('hstatus',{
                                        initialValue:"",
                                    } )(
                                        <Select style={{ width: 120 }}>
                                            <Option value="" >所有</Option>
                                            <Option value="0" >未处理</Option>
                                            <Option value="1" >挂起</Option>
                                            <Option value="2" >报警未结束</Option>
                                            <Option value="3" >报警已结束</Option>
                                            <Option value="4" >虚警</Option>
                                            <Option value="5" >误报</Option>
                                            <Option value="-1" >待处理</Option>
                                            <Option value="-3" >过期</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                                <Button type="primary" htmlType="submit" className="queryBtn">查询</Button>
                        </Form>
                    </Row>
                </LocaleProvider>
                <Spin size="large" spinning={this.state.loadding} tip="加载中..." className="loadding" />
                {this.state.nodatapic?"":
                <Row style={{marginTop:"70px",}}>
                     <Col style={{width:"100%",textAlign:"center"}}><div className="backImg"><img src={noImg} alt="" /></div></Col>
                </Row>}
               
                <Row style={{marginLeft:"10px",marginTop:"20px"}}>
                    {
                        this.state.policeList.map((v,i)=>(
                            <Col lg={11} xl={11} xxl={7} key={v.code} style={{margin:"0px 10px",display:this.state.displaysearch=== true?" block":"none"}}>
                                <div className="listmargintop">
                                    <div >
                                        <Row>
                                            <div className={this.sanjiaose(v.hstatus)} >  
                                                <span className="xuanzhuan">{this.handleState(v.hstatus)}</span>
                                            </div>
                                            <Col lg={10} xl={11} className="minstyle" >
                                                <div className="pliceImgyal"onClick={()=>this.alarmImg(v.code)}>
                                                    <img src={v.pic_min?v.pic_min:nodata} alt="" />
                                                </div>
                                            </Col>
                                            <Col lg={14} xl={13} className="r_flex">
                                                <div className="row-alarmlist-detail">
                                                    <div className="word-row">
                                                        <p className="fontstyle right_linr">{v.name?v.name:'暂无信息'}</p>
                                                        <p className="fontstyle right_linr">
                                                           {this.atypetext(v.atype)}
                                                        </p>
                                                    </div>
                                                    <div style={{float:'left',width:'100%'}}>
                                                        <p className="fontstyle right_linr1">{v.atime}</p>
                                                    </div>
                                                    <div className="remark">
                                                        <span>{v.memo?v.memo:'暂无备注'}</span>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                        ))
                    }
                </Row>
                <Pagination hideOnSinglePage={true} defaultCurrent={this.state.page} current={this.state.page} total={this.state.totalcount} pageSize={this.state.pageSize} onChange={this.hanlePageSize} className="pageSize" style={{display:this.state.type===1?"block":"none"}} />
                <div>
                    <Modal
                        width={1200}
                        title="报警详情"
                        visible={this.state.alarmImgType}
                        onCancel={this.handleCancelAlarmImg}
                        footer={null}
                    >
                        <AlarmDetail visible={this.state.alarmImgType} activecompcode={this.state.activecompcode} toson={this.state.toson} closeAlarm={this.handleCancelAlarmImg} />
                    </Modal>
                </div>
            </div>
        )
    }

}
export default history= Form.create()(history);
