import React, { Component } from 'react';
import '../../style/sjg/home.css';
import {Table, DatePicker, Form, Input, Row, Col, Button, LocaleProvider} from 'antd';
import zh_CN from "antd/lib/locale-provider/zh_CN";
import 'moment/locale/zh-cn';
import BreadcrumbCustom from "../BreadcrumbCustom";
import { Link } from 'react-router-dom';
import {post} from "../../axios/tools";
const {RangePicker } = DatePicker;
const FormItem = Form.Item;
const data=[{
    code:1,
    type:1
},{
    code:2,
    type:0
}]
class Callalarm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list:[],
            isDeal: false
        };
    }

    componentDidMount() {
        this.setState({
            list:data
        })
        //取数据
        this.requestdata()
    }
    requestdata=(params={}) => {//取数据
        post({url:"/api/rollcall/getlist_maintain",data:params}, (res)=>{
            if(res.success){
                this.setState({
                    list: res.data,
                    total:res.totalcount
                })
            }
        })

    }
    selectopt = (e) => { //检索
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.requestdata(values)
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const dateFormat = 'YYYY/MM/DD';
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render: (text,record,index) => <span>{index+1}</span>,
            },
            {
                title: '用户',
                dataIndex: 'qpplyname',
                key: 'qpplyname'
            },{
                title: '摄像头',
                dataIndex: 'cameraname',
                key: 'cameraname',
            },
            {
                title: '点名对象',
                dataIndex: 'rname',
                key: 'rname',
            },
            {
                title: '提交日期',
                dataIndex: 'applydate',
                key: 'applydate',
            },
            {
                title: '处理状态',
                dataIndex: 'rhandle',
                key: 'rhandle',
                render: text =>{
                    switch(text){
                        case 0:
                        return('未处理');
                        case 1:
                        return('通过');
                        case 2:
                        return('未通过');
                    }
                },
            },
            {
                title: '处理日期',
                dataIndex: 'handledate',
                key: 'handledate',
            },
            {
                title: '操作',
                key: 'option',
                render: (text, record) => 
                    <Link to={"/app/teamacc/adopt?code="+text.code } > <Button>查看</Button></Link>
                ,
            }];

        function onChange_time(date, dateString) {
            console.log(date,dateString[0]);
            console.log(date,dateString[1]);
        }
        return (
            <div>
                <BreadcrumbCustom first="账号管理" second="维护团队管理" />
                <Row className="margin_top80 margin_bottom40">
                    <Col span={18}>
                        <Form layout="inline"onSubmit={this.selectopt}>
                            <FormItem label="名称">
                                {getFieldDecorator('name', {
                                    rules: [{ required: false, message: '请输入名称!' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <LocaleProvider locale={zh_CN}>
                                <FormItem label="云服务到期日期">
                                {getFieldDecorator('clouddata', {
                                    rules: [{ required: false, message: '请选择!' }],
                                })(
                                    <RangePicker onChange={onChange_time} format={dateFormat} />
                                )}
                            </FormItem>
                            </LocaleProvider>
                            <FormItem>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>

                <Table columns={columns} dataSource={this.state.list} bordered={true}/>

            </div>
        )
    }

}
export default Callalarm=Form.create()(Callalarm);

