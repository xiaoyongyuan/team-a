
import React, { Component } from 'react';
import { Table,DatePicker, Row,Button, Form,LocaleProvider,Input} from "antd";
import "../../style/ztt/css/police.css";
import "../../style/publicStyle/publicStyle.css";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import {post} from "../../axios/tools";
const { RangePicker } = DatePicker ;
class Performance extends Component {
    constructor(props){
        super(props);
        this.state={
        };
    }
    componentDidMount() {
        this.requestdata()
    }
    requestdata=() => {//取数据
        post({url:"/api/company/getlist"}, (res)=>{
            if(res.success){
                this.setState({
                    list:res.data,
                })
            }
        })
    }
    selectopt = (e) => { //检索search
        e.preventDefault();
        console.log('clouddata',);
        this.props.form.validateFields((err, values) => {
            if(!err){
                    var dataUseres = {
                        bdate: values.clouddata&&values.clouddata.length?values.clouddata[0].format('YYYY-MM-DD')+' 00:00:00':'',
                        edate: values.clouddata&&values.clouddata.length?values.clouddata[1].format('YYYY-MM-DD')+' 23:59:59':'',
                        adminname: values.adminname,
                    }
                post({url:"/api/company/getlist",data:dataUseres}, (res)=>{
                    if(res.success){
                        this.setState({
                            list: res.data
                        })
                    }
                })
            }
        })
    }
    render() {  
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render: (text,record,index) => <span>{index+1}</span>,
            },{
                title: '姓名',
                dataIndex: 'adminname',
                key: 'adminname',
            },{
                title: '总数',
                dataIndex: 'etype',
                key: 'etype',
                render: text => <span>45</span>,
            },{
                title: '误报',
                dataIndex: 'pname',
                key: 'pname',
                render: text => <span>{text}</span>,
            },{
                title: '虚报',
                dataIndex: 'createon',
                key: 'manage'
            }
            ,{
                title: '警报',
                dataIndex: 'createon',
                key: 'manage1'
            }
            ,{
                title: '查询用户详情次数',
                dataIndex: 'createon',
                key: 'manage2',
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
                                        placeholder={['开始时间', '结束时间']}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item
                               label="姓名"
                            >
                                {getFieldDecorator('adminname', {
                                    rules: [{ required: false, message: '请输入操作人' }],
                                })(
                                    <Input placeholder="请输入姓名" />
                                )}
                            </Form.Item>
                                <Button type="primary" htmlType="submit" className="queryBtn">查询</Button>
                                <a href="#/app/groupleader/dataCharts" className="tjt">查看统计图</a>
                        </Form>
                    </Row>
                </LocaleProvider>
                 <Table rowKey={record => record.code} columns={columns} dataSource={this.state.list} bordered={true}/> 
            </div>
        )
    }
}
export default Performance= Form.create()(Performance);
