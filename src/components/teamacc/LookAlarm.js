import React, { Component } from 'react';
import { DatePicker, Row, Col, Button, Modal, Pagination, Form,LocaleProvider,Spin,notification,message} from "antd";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import "../../style/ztt/css/lookAlarm.css";
import {post} from "../../axios/tools";
import nodata from "../../style/imgs/nodata.png";
import moment from 'moment';
const { RangePicker } = DatePicker ;
class LookAlarm extends Component {
    constructor(props){
        super(props);
        this.state= {
            loadding: false,
            policeList: []
        }
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
                                        showTime={{ format: 'HH:00:00' }}
                                        format="YYYY-MM-DD HH:00:00"
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
                                                                    {/* <p className="fontstyle time-col">报警对象：{v.tags===""?"无":v.tags}</p> */}
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
            </div>
        )
    }
}
export default LookAlarm=Form.create()(LookAlarm);