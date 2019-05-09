import React from 'react';
import { DatePicker, Row, Col, Button, Modal, Pagination, Form,LocaleProvider,Spin,notification,message} from "antd";
import "../../style/ztt/css/police.css";
import "../../style/publicStyle/publicStyle.css";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import {post} from "../../axios/tools";
import Alarmdetails from "./Alarmdetails";
import nodata from "../../style/imgs/nodata.png";
import moment from 'moment';
const { RangePicker } = DatePicker ;
class LookAlarm extends React.Component{
    constructor(props){
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
            bdate:moment().format('YYYY-MM-DD 00:00:00'),//检索的开始时间
            edate:moment().format('YYYY-MM-DD 23:59:59'),//检索的结束时间
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
            ifkai:false,//误报确认弹框
            ifmis:false,
            miscode:'',

        };
    }
    componentWillMount=()=>{
        this.setState({
            cid: this.props.query.cid,
        });
    }
    componentDidMount() {
        this.handleAlerm();//报警信息列表
        this.props.form.setFieldsValue({
            date:[moment(moment().format('YYYY-MM-DD 00:00:00')),moment(moment().format('YYYY-MM-DD 23:59:59'))]
        });
    }
    handleCancelAlarmImg =()=>{
        this.setState({
            alarmImgType:false
        })
    };

    //查看报警详情
    alarmImg =(code,v)=>{
        if(this.state.bdate!==null && this.state.edate!=null){
            var toson={
                code:code,
                bdate:this.state.bdate,
                edate:this.state.edate,
                ccode:v.companycode,
                cid:v.cid,
            };
        }
        this.setState({
            alarmImgType:true,
            toson:toson
        })
    }
    hanlePageSize = (page) => { //翻页
        this.setState({
            loadding:true,
            page:page,
        },()=>{
            this.handleAlerm()
        })
    };
    //报警信息列表
    handleAlerm = ()=>{
        var alarmmdata={
            bdate:this.state.bdate,
            edate:this.state.edate,
            pagesize:18,
            pageindex:this.state.page,
            cid:this.state.cid,
        };
        post({url:'/api/alarm/getlist_foradmin',data:alarmmdata},(res)=>{
            if(res.success){
                this.setState({
                    displaysearch:true,
                })
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
            if(values.date&&values.date.length){
                if(Date.parse(values.date[1].format('YYYY-MM-DD HH:mm:ss'))-Date.parse(values.date[0].format('YYYY-MM-DD HH:mm:ss'))<86400000){
                    this.setState({
                        bdate:values.date&&values.date.length?values.date[0].format('YYYY-MM-DD HH:mm:ss'):'',
                        edate:values.date&&values.date.length?values.date[1].format('YYYY-MM-DD HH:mm:ss'):'',
                        pageindex:this.state.page,
                    })
                    if(!err){
                        this.setState({
                            page:1,
                            loadding:true,
                            displaysearch:false,
                        },()=>{
                            this.handleAlerm()
                        })
                    }
                }else{
                    message.error('最多选择24小时');
                }
            }
        })
    };
    drawtwo = ()=>{ //画围界
        this.setState({
            createby:"",
            createon:"",
            memo:"",
            ifblock:false,
            eid:this.state.eid,
        })
        let ele = document.getElementById("canvasobjt");
        let area = ele.getContext("2d");
        area.clearRect(0,0,604,476);//清除之前的绘图
        const objs=this.state.data;
        if( objs.length>0){
            //计算缩放比例
            objs.map((el,i) => {
                this.setState({ x:604/el.pic_width,y:476/el.pic_height});
                const x=604/el.pic_width, y=476/el.pic_height;
                let fangquarr = []
                let finalareastring=el.finalarea;
                let zhuanhou= JSON.parse(finalareastring)
                fangquarr.push(zhuanhou); //属性
                fangquarr.map((item,j)=>{
                    area.strokeStyle='#ff0';
                    area.beginPath();
                    area.rect(parseInt(item.x*x),parseInt(item.y*y),parseInt(item.w*x),parseInt(item.h*y));
                    area.stroke();
                    area.closePath();
                })
            })
        }
    }
    drawSelectObj=(el)=>{ //画出当前选中的围界
        let pel= JSON.parse(el.finalarea);
        const x=this.state.x, y=this.state.y;
        let ele = document.getElementById("canvasobjt");
        let area = ele.getContext("2d");
        area.clearRect(0,0,604,476);//清除之前的绘图
        area.lineWidth=1;
        area.strokeStyle='#ff0';
        area.beginPath();
        area.rect(parseInt(pel.x*x),parseInt(pel.y*y),parseInt(pel.w*x),parseInt(pel.h*y));
        area.stroke();
        area.closePath();
    }
    queren=(key)=>{ //误报删除
        this.setState({ ifkai:false,})
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <div className="OneAlarm Alarmlist">
                <LocaleProvider locale={zh_CN}>
                    <Row style={{marginTop:"20px",marginLeft:"20px"}}>
                        <Form onSubmit={this.handleSubmit} layout="inline">
                            <Form.Item label="日期" >
                                {getFieldDecorator('date')(
                                    <RangePicker
                                        showTime={{ format: 'HH:mm:ss' }}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder={['开始时间', '结束时间']}
                                    />
                                )}
                            </Form.Item>
                            <Button type="primary" htmlType="submit" className="queryBtn">查询</Button>
                        </Form>
                    </Row>
                </LocaleProvider>
                <Spin size="large" spinning={this.state.loadding} tip="加载中..." className="loadding" >
                    {this.state.nodatapic?"":
                        <Row style={{marginTop:"70px",}}>
                            <Col style={{width:"100%",textAlign:"center"}}><div className="backImg"><img src={nodata} alt="" /></div></Col>
                        </Row>}

                    <Row style={{marginLeft:"10px",marginTop:"20px",display:this.state.type===0?"none":"block",}}>
                        {
                            this.state.policeList.map((v,i)=>(
                                <Col xm={11} sm={11} md={11} lg={11} xl={11} xxl={7} key={v.code} style={{margin:"0px 10px",display:this.state.displaysearch=== true?" block":"none"}}>
                                    <div className="listmargintop">
                                        <div >
                                            <Row>
                                                <Col span={8}>
                                                    <div className="pliceImgyal" onClick={()=>this.alarmImg(v.code,v)}>
                                                        <img src={v.pic_min?v.pic_min:nodata} alt="" />
                                                    </div>
                                                </Col>
                                                <Col span={16} className="r_flex">
                                                    <Row className="row-alarmlist-detail">
                                                        <Col span={20}>
                                                            <Row className="word-row">
                                                                <Col span={18}>
                                                                    <Row>
                                                                        <Col span={14} style={{marginLeft:'5px'}} push={1}>
                                                                            <p className="fontstyle">{v.cid}</p>
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
                                                                    <p className="fontstyle time-col">
                                                                        {v.atype===1? <span> 　
                                                                     <span> {v.s_est===-1?"误报":""}</span>
                                                                        <span>{v.s_est===0?"未处理":""}</span>
                                                                        <span>{v.s_est===1?"报警":""}</span>
                                                                     </span> : ""
                                                                        }</p>
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
                    </Row>
                </Spin>

                <Pagination hideOnSinglePage={true} defaultCurrent={this.state.page} current={this.state.page} total={this.state.totalcount} pageSize={this.state.pageSize} onChange={this.hanlePageSize} className="pageSize" style={{display:this.state.type===1?"block":"none"}} />
                <div>
                    <Modal
                        width={900}
                        title="报警详情"
                        visible={this.state.alarmImgType}
                        onCancel={this.handleCancelAlarmImg}
                        footer={null}
                    >
                        <Alarmdetails visible={this.state.alarmImgType} toson={this.state.toson} />
                    </Modal>
                </div>
            </div>
        )
    }
}

export default LookAlarm= Form.create()(LookAlarm);
