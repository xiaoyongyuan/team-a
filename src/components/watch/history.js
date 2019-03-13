import React from 'react';
import { DatePicker, Row, Col, Button, Modal, Pagination, Form,LocaleProvider,Spin, Select,Input,Icon } from "antd";
import "../../style/ztt/css/police.css";
import "../../style/publicStyle/publicStyle.css";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import {post} from "../../axios/tools";
import AlarmDetail from "./Alarmdetails";
import nodata from "../../style/imgs/nodata.png";
import banditpic from "../../style/imgs/banditpic.png";
import firepic from "../../style/imgs/firepic.png";
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
            loadding:false,
            alarmImgType:false,
            bdate:'',//检索的开始时间
            edate:'',//检索的结束时间
            cid:"", //检索选中的设备
            endOpen: false,
            page:1, //当前页数
            pageSize:18, //每页显示数量
            totalcount:0, //数据总量
            toson:{}, //传给详情页面的值
            loading:1,
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
    };
      //查看报警详情
      alarmImg =(code)=>{
        if(this.state.bdate!==null && this.state.edate!=null){
            var toson={
                code:code,
                bdate:this.state.bdate,
                edate:this.state.edate
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
            // this.handleAlerm()
        })
    };
    //报警信息列表
    handleAlerm = ()=>{
        // var alarmmdata={
        //     bdate:this.state.bdate,
        //     edate:this.state.edate,
        //     pagesize:18,
        //     pageindex:this.state.page,
        // }
        // post({url:'/api/alarm/getlist_foradmin',data:alarmmdata},(res)=>{
        //     if(res.success){
        //         this.setState({
        //             displaysearch:true,
        //         })
        //         if(res.data.length===0){
        //             this.setState({
        //               nodatapic:false,
        //             })
        //         }else{
        //             this.setState({
        //                 nodatapic:true,
        //             })
        //         }
        //         if(res.data.length){
        //             this.setState({
        //                 policeList:res.data,
        //                 type:1,
        //                 totalcount:res.totalcount,
        //                 loadding:false
        //             })
        //         }else{
        //             this.setState({
        //                 type:0,
        //                 loadding:false
        //             })
        //         }
        //     }else{
        //         this.setState({
        //             loadding:false,
        //             type:0,
        //         })
        //     }
        // })
    };

    /*
    * 检索
    * 开始时间、结束时间
    * */
    handleSubmit =(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.setState({
                bdate:values.date.length?values.date[0].format('YYYY-MM-DD'):'',
                edate:values.date.length?values.date[1].format('YYYY-MM-DD'):'',
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
    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    };
    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
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
        }
    }
      //报警状态
      handleState = (code)=>{
        if(code === 0){
            return "未处理";
        }else if(code === 1){
            return "确认";
        }else if(code === 2){
            return "忽略";
        }else if(code === 3){
            return "虚警";
        }
    };
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
                            <Col xl={5} xxl={5}>
                                <Form.Item label="日期" >
                                    {getFieldDecorator('date')(
                                        <RangePicker
                                            showTime={{ format: 'HH:00:00' }}
                                            format="YYYY-MM-DD HH:00:00"
                                            placeholder={['开始时间', '结束时间']}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xl={3} xxl={3}>
                            <Form.Item
                               label="操作人"
                            >
                                {getFieldDecorator('setuser', {
                                    rules: [{ required: false, message: '请输入操作人' }],
                                })(
                                    <Input placeholder="操作人" />
                                )}
                                </Form.Item>

                            </Col>
                          

                            <Col xl={3} xxl={3}>
                                <Form.Item label="处理状态" >
                                    {getFieldDecorator('cid',{
                                        initialValue:"",
                                    } )(
                                        <Select style={{ width: 120 }}>
                                            <Option value="" >虚警</Option>
                                            <Option value="" >误警</Option>
                                            <Option value="" >警报</Option>
                                            {/* {
                                                this.state.equipment.map((v,i)=>(
                                                    <Option value={v.code} key={v.code}>{v.name}</Option>
                                                ))
                                            } */}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xl={2} xxl={2} lg={4} className="mt">
                                <Button type="primary" htmlType="submit" className="queryBtn">查询</Button>
                            </Col>
                        </Form>
                    </Row>
                </LocaleProvider>
                <Spin size="large" spinning={this.state.loadding} tip="加载中..." className="loadding" />
                {this.state.nodatapic?"":
                <Row style={{marginTop:"70px",}}>
                     <Col style={{width:"100%",textAlign:"center"}}><div className="backImg"><img src={nodata} alt="" /></div></Col>
                </Row>}
               
                {/* <Row style={{marginLeft:"10px",marginTop:"20px"}}>
                    {
                        this.state.policeList.map((v,i)=>(
                            <Col xm={11} sm={11} md={11} lg={11} xl={11} xxl={7} key={v.code} style={{margin:"0px 10px",display:this.state.displaysearch=== true?" block":"none"}}>
                                <div className="listmargintop">
                                    <div >
                                        <Row>
                                            <Col span={8}>
                                                <div className="pliceImgyal" onClick={()=>this.alarmImg(v.code)}>
                                                    <img src={v.pic_min} alt="" />
                                                </div>
                                            </Col>
                                            <Col span={16} className="r_flex">
                                                <Row className="row-alarmlist-detail">
                                                    <Col span={20}>
                                                        <Row className="word-row">
                                                            <Col span={18}>
                                                                <Row>
                                                                    <Col span={14} style={{marginLeft:'5px'}} push={1}>
                                                                        <p className="fontstyle">{v.name}</p>
                                                                    </Col>
                                                                    <Col span={9} push={4} style={{textAlign:'right' }}>
                                                                        <p className="fontstyle time-col">{v.atype===1?"入侵检测":""}</p>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <Row className="word-row">
                                                            <Col span={13} push={1}>
                                                                <p className="time-col fontstyle fontstyletime">{v.atime}</p>
                                                            </Col>
                                                            <Col span={9} push={1} style={{marginLeft:'13px'}}>
                                                                <p className="fontstyle time-col">报警对象：{v.tags===""?"无":v.tags}</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                        ))
                    }


                </Row> */}
                 <Row style={{marginLeft:"10px",marginTop:"20px"}}>
                 
                            
                 <Col xm={11} sm={11} md={11} lg={11} xl={11} xxl={7} style={{margin:"0px 10px"}}>
                                <div className="listmargintop">
                                    <div >
                                        <Row>
                                        <div className={this.sanjiaose(1)} >
                                                <span className="xuanzhuan">{this.handleState(2)}</span>
                                            </div>
                                            
                                            <Col span={8}>
                                                <div className="pliceImgyal" onClick={()=>this.alarmImg()}>
                                                    <img src={nodata} alt="" />
                                                </div>
                                            </Col>
                                            <Col span={16} className="r_flex">
                                                <div className="row-alarmlist-detail">
                                                        <div className="word-row">
                                                            <p className="fontstyle right_linr">asdasc</p>
                                                            <p className="fontstyle right_linr">火警报警</p>
                                                        </div>
                                                        <div style={{float:'left',width:'100%'}}>
                                                            <p className="fontstyle right_linr" style={{float:'left',width:'70%'}}>2019.3.19</p>
                                                        </div>
                                                        <div className="remark">
                                                            <Input placeholder="此处为备注内容" onChange={(e)=>this.changeCoord(e)} />
                                                        </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>



                            <Col xm={11} sm={11} md={11} lg={11} xl={11} xxl={7} style={{margin:"0px 10px"}}>
                                <div className="listmargintop">
                                    <div >
                                        <Row>
                                        <div className={this.sanjiaose(1)} >
                                                <span className="xuanzhuan">{this.handleState(2)}</span>
                                            </div>
                                            
                                            <Col span={8}>
                                                <div className="pliceImgyal" onClick={()=>this.alarmImg()}>
                                                    <img src={nodata} alt="" />
                                                </div>
                                            </Col>
                                            <Col span={16} className="r_flex">
                                                <div className="row-alarmlist-detail">
                                                        <div className="word-row">
                                                            <p className="fontstyle right_linr">asdasc</p>
                                                            <p className="fontstyle right_linr">火警报警</p>
                                                        </div>
                                                        <div style={{float:'left',width:'100%'}}>
                                                            <p className="fontstyle right_linr" style={{float:'left',width:'70%'}}>2019.3.19</p>
                                                        </div>
                                                        <div className="remark">
                                                            <Input placeholder="此处为备注内容" onChange={(e)=>this.changeCoord(e)} />
                                                        </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>


                </Row>
                <Pagination defaultCurrent={this.state.page} current={this.state.page} total={this.state.totalcount} pageSize={this.state.pageSize} onChange={this.hanlePageSize} className="pageSize" style={{display:this.state.type===1?"block":"none"}} />
                <div>
                    <Modal
                        width={1200}
                        title="报警详情"
                        visible={this.state.alarmImgType}
                        onCancel={this.handleCancelAlarmImg}
                        footer={null}
                    >
                    
                        <AlarmDetail />
                    </Modal>
                </div>
            </div>
        )
    }

}
export default history= Form.create()(history);
