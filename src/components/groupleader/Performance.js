
import React, { Component } from 'react';
import { Table,DatePicker, Row,Button, Form,LocaleProvider,Input,Col} from "antd";
import "../../style/ztt/css/police.css";
import "../../style/publicStyle/publicStyle.css";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';
import {post} from "../../axios/tools";
const { RangePicker } = DatePicker ;
class Performance extends Component {
    constructor(props){
        super(props);
        this.state={
            page:1, //当前页
            total:{},
            bdate:'',
            edate:'',
            realname:''
        };
    }
    componentDidMount() {
        this.requestdata()
    }
    requestdata=() => {//取数据
        const datar={
            pagesize:10,
            pageindex:this.state.page,
        }
        post({url:"/api/alarmhandlehistory/get_analysis_user",data:datar}, (res)=>{
            if(res.success){
                this.setState({
                    list:res.data,
                    total:res.totalcount,
                })
            }
        })
    }
    changePage=(page,pageSize)=>{ //分页  页码改变的回调，参数是改变后的页码及每页条数
        this.setState({
            page: page,
        },()=>{
            this.requestdata()
        })
    }
    selectopt = (e) => { //检索search
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                var dataUseres = {
                    bdate: values.clouddata&&values.clouddata.length?values.clouddata[0].format('YYYY-MM-DD HH:mm:ss'):'',
                    edate: values.clouddata&&values.clouddata.length?values.clouddata[1].format('YYYY-MM-DD HH:mm:ss'):'',
                    realname: values.realname,
                    pagesize:10,
                    pageindex:this.state.page,
                }
                post({url:"/api/alarmhandlehistory/get_analysis_user",data:dataUseres}, (res)=>{
                    if(res.success){
                        this.setState({
                            list: res.data,
                            page:1,
                        })
                    }
                })
                this.setState({
                    bdate: values.clouddata&&values.clouddata.length?values.clouddata[0].format('YYYY-MM-DD HH:mm:ss'):'',
                    edate: values.clouddata&&values.clouddata.length?values.clouddata[1].format('YYYY-MM-DD HH:mm:ss'):'',
                    realname: values.realname?values.realname:'',
                })
            }
        })
    }

    render() {  
        function disabledDate(current) {
            // Can not select days before today and today
            return current && current > moment().endOf('day');
          }
          
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render: (text,record,index) => <span>{index+1}</span>,
            },{
                title: '姓名',
                dataIndex: 'realname',
                key: 'realname',
            },{
                title: '总数',
                dataIndex: 'etype',
                key: 'etype',
                render:(text,record)=>{
                    return(
                       <div>{record.falsealarm+record.emptyalarm+record.alarm}</div>
                    )
                }
            },{
                title: '误报',
                dataIndex: 'falsealarm',
                key: 'falsealarm',
            },{
                title: '虚报',
                dataIndex: 'emptyalarm',
                key: 'emptyalarm',
            },{
                title: '警报',
                dataIndex: 'alarm',
                key: 'alarm',
            },{
                title: '查询用户详情次数',
                dataIndex: 'alarm',
                key: 'userCount',
            }
        ];
        return (
            <div className="performance">
                 <LocaleProvider locale={zh_CN}>
                    <Row className="formstyle">
                        <Form onSubmit={this.selectopt} layout="inline">
                            <Form.Item label="日期" >
                                {getFieldDecorator('clouddata')(
                                    <RangePicker 
                                        disabledDate={disabledDate}
                                        placeholder={['开始时间', '结束时间']}
                                        showTime={{
                                            hideDisabledOptions: true,
                                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                          }}
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />
                                )}
                            </Form.Item>
                            <Form.Item
                               label="姓名"
                            >
                                {getFieldDecorator('realname', {
                                    rules: [{ required: false, message: '请输入操作人' }],
                                })(
                                    <Input placeholder="请输入姓名" />
                                )}
                            </Form.Item>
                                <Button type="primary" htmlType="submit" className="queryBtn" style={{marginTop:'4px'}}>查询</Button>
                                <a href={"#/app/groupleader/dataCharts?bdate="+this.state.bdate+"&edate="+this.state.edate+"&realname="+this.state.realname} className="tjt">查看统计图</a>
                        </Form>
                    </Row>
                </LocaleProvider>
                <Row>
                    <Col span={20}>
                        <Table rowKey={record => record.account} columns={columns} dataSource={this.state.list} bordered
                               pagination={{defaultPageSize:10,current:this.state.page, total:this.state.total,onChange:this.changePage}}
                        />
                    </Col>
                </Row>

            </div>
        )
    }
}
export default Performance= Form.create()(Performance);
