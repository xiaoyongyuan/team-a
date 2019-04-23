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
            isDeal: false,
            page:1,
        };
    }

    componentDidMount() {
        this.setState({
            list:data
        });
        //取数据
        this.requestdata()
    }
    requestdata=(params={}) => {//取数据
        this.setState({ loading: true });
        const bparams={
            pagesize:10,
            bdate:this.state.bdate,
            edate: this.state.edate,
            cname: this.state.cname,
            pageindex:this.state.page,
        }
        post({url:"/api/rollcall/getlist_maintain",data:bparams}, (res)=>{
            if(res.success){
                this.setState({
                    list: res.data,
                    total:res.totalcount,
                    loading: false 
                })
            }
        })

    }
    selectopt = (e) => { //检索
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                console.log('******************',values);

                this.setState({
                    bdate: values.clouddata&&values.clouddata.length?values.clouddata[0].format('YYYY-MM-DD'):"",
                    edate: values.clouddata&&values.clouddata.length?values.clouddata[1].format('YYYY-MM-DD'):"",
                    cname: values.name,
                    page:1
                },()=>{
                    this.requestdata();
                });
            }
        })
    }
    changePage=(page,pageSize)=>{ //分页  页码改变的回调，参数是改变后的页码及每页条数
        this.setState({
            page: page,
        },()=>{
            this.componentDidMount()
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
                dataIndex: 'cname',
                key: 'cname'
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
                        default:
                            return "";
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
                render: (text, record) =>{
                    if(record.rhandle){
                        return (<Link to={"/app/teamacc/adopt?code="+text.code } > <Button>查看</Button></Link>)
                    }else{
                        return (<div>
                                <Link to={"/app/teamacc/adopt?code="+text.code } > <Button>查看</Button></Link>
                                <Link to={"/app/teamacc/auditing?code="+text.code } > <Button>编辑</Button></Link>
                            </div>
                            )
                    }
                }
            }];

        function onChange_time(date, dateString) {
            console.log(date,dateString[0]);
            console.log(date,dateString[1]);
        }
        return (
            <div>
                <BreadcrumbCustom first="账号管理" second="点名区域审核" />
                <Row className="margin_top20 margin_bottom20">
                    <Col span={18}>
                        <Form layout="inline"onSubmit={this.selectopt}>
                            <FormItem label="查询用户">
                                {getFieldDecorator('name', {
                                    rules: [{ required: false, message: '请输入用户名称!' }],
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

                <Table columns={columns} dataSource={this.state.list} bordered={true}
                 pagination={{defaultPageSize:10,current:this.state.page, total:this.state.total,onChange:this.changePage ,hideOnSinglePage:true}}
                 rowKey={record => record.code}
                />

            </div>
        )
    }

}
export default Callalarm=Form.create()(Callalarm);

