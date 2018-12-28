import React, { Component } from 'react';
import '../../style/sjg/home.css';
import {Table, DatePicker, Form, Input, Row, Col, Button} from 'antd';
// import moment from 'moment';
import BreadcrumbCustom from "../BreadcrumbCustom";
import { Link } from 'react-router-dom';
import axios from 'axios';
const {RangePicker } = DatePicker;
const FormItem = Form.Item;
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
        })
        //取数据
        this.requestdata()
    }
    requestdata=(params) => {//取数据
        axios.get("table.json",params)
        .then((res)=>{
            if(res.data.success){
                console.log(res.data.data);
                this.setState({
                    list: res.data.data
                })
            }
        })

    }
    selectopt = (e) => { //检索
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                console.log("1111",values.name,values.clouddata[0].format('YYYY-MM-DD'),values.clouddata[1].format('YYYY-MM-DD'))
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
                dataIndex: 'deveui',
                key: 'manage'
            }, {
                title: '摄像头',
                dataIndex: 'deveui',
                key: 'coordinate',
                render: text => <span>{text}</span>,
            },
            {
                title: '提交日期',
                dataIndex: 'type',
                key: 'usertype',
                render: text => <span>{text}</span>,
            },
            {
                title: '处理状态',
                dataIndex: 'type',
                key: 'state',
                render: text => <span>{text}</span>,
            },
            {
                title: '处理日期',
                dataIndex: 'teamname',
                key: 'riqi',
                render: text => <span>{text}</span>,
            },
            {
                title: '操作',
                key: 'manage3',
                render: (text, record) => {
                    let id=text.code
                    if(text.type){
                        return(
                            <Link to={"/app/teamacc/adopt?RowId="+id } > <Button>查看</Button></Link>
                        )
                    }else{
                        return(
                            <Link to={"/app/teamacc/auditing?RowId="+id}><Button>处理</Button> </Link>
                        )
                    }
                    },
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
                            <FormItem label="云服务到期日期">
                                {getFieldDecorator('clouddata', {
                                    rules: [{ required: false, message: '请选择!' }],
                                })(
                                    <RangePicker onChange={onChange_time} format={dateFormat} />
                                )}
                            </FormItem>
                            <FormItem>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>

                <Table columns={columns} dataSource={this.state.list} />

            </div>
        )
    }

}
export default Callalarm=Form.create()(Callalarm);

