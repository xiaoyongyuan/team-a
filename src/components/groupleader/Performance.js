
import React, { Component } from 'react';
import { Table,DatePicker, Row,Button, Form,LocaleProvider,Input,Pagination} from "antd";
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
            page:1, //当前页
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
        post({url:"/api/company/getlist",data:datar}, (res)=>{
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
        console.log('clouddata',);
        this.props.form.validateFields((err, values) => {
            if(!err){
                    var dataUseres = {
                        bdate: values.clouddata&&values.clouddata.length?values.clouddata[0].format('YYYY-MM-DD')+' 00:00:00':'',
                        edate: values.clouddata&&values.clouddata.length?values.clouddata[1].format('YYYY-MM-DD')+' 23:59:59':'',
                        adminname: values.adminname,
                        pagesize:10,
                        pageindex:this.state.page,
                    }
                post({url:"/api/company/getlist",data:dataUseres}, (res)=>{
                    if(res.success){
                        this.setState({
                            list: res.data,
                            page:1,
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
                render: text => <span>{9}</span>,
            },{
                title: '虚报',
                dataIndex: 'createon',
                key: 'manage',
                render: text => <span>{9}</span>,
            }
            ,{
                title: '警报',
                dataIndex: 'createon',
                key: 'manage1',
                render: text => <span>{9}</span>,
            }
            ,{
                title: '查询用户详情次数',
                dataIndex: 'createon',
                key: 'manage2',
                render: text => <span>{19}</span>,
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
                                <Button type="primary" htmlType="submit" className="queryBtn" style={{marginTop:'4px'}}>查询</Button>
                                <a href="#/app/groupleader/dataCharts" className="tjt">查看统计图</a>
                        </Form>
                    </Row>
                </LocaleProvider>
                 <Table rowKey={record => record.code} columns={columns} dataSource={this.state.list} bordered={true}
                  pagination={{defaultPageSize:10,current:this.state.page, total:this.state.total,onChange:this.changePage}}
                 /> 
            </div>
        )
    }
}
export default Performance= Form.create()(Performance);
