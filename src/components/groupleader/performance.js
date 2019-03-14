import React, { Component } from 'react';
import { Table,DatePicker, Row, Col, Button, Modal, Pagination, Form,LocaleProvider,Spin, Select,Input,Icon } from "antd";
import "../../style/ztt/css/police.css";
import "../../style/publicStyle/publicStyle.css";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import {post} from "../../axios/tools";
const { RangePicker } = DatePicker ;
const Option = Select.Option;
class performance extends Component {
    constructor(props) {
        super(props);
        
    }
    
    render() {  
        const list=[
                {
                code: 1000281,
                companycode: 1000002,
                createon: "562",
                echange: "",
                ecode: "张三",
                estatus: 0,
                etype: 0,
                pname: "11",
               },
               {
                code: 1000281,
                companycode: 1000002,
                createon: "562",
                echange: "",
                ecode: "张三",
                estatus: 0,
                etype: 0,
                pname: "11",
               },
               {
                code: 1000281,
                companycode: 1000002,
                createon: "562",
                echange: "",
                ecode: "张三",
                estatus: 0,
                etype: 0,
                pname: "11",
               },
               

        ]  
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render: (text,record,index) => <span>{index+1}</span>,

            },{
                title: '姓名',
                dataIndex: 'ecode',
                key: 'ecode',
                render: text => <span>{text}</span>,
            },{
                title: '总数',
                dataIndex: 'etype',
                key: 'etype',
                render: text => <span>树莓派</span>,
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
                key: 'manage2'
            }];

        return (
            <div className="performance">
                 <LocaleProvider locale={zh_CN}>
                    <Row className="formstyle">
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
                            <Form.Item
                               label="姓名"
                            >
                                {getFieldDecorator('setuser', {
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
                 <Table columns={columns} dataSource={list} bordered={true}/> 

            </div>
        )
    }

}
export default performance= Form.create()(performance);
