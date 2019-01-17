import React, { Component } from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import ModalForm from './ModalForm.js';
import {Form,Input, Row, Col, Button, Modal, Table} from 'antd';
// import '../../style/sjg/home.css';
import {post} from "../../axios/tools";
const FormItem = Form.Item;
class Comemploye extends Component {
    constructor(props){
        super(props);
        this.state={
            visible:false,
            list:[],
            createinfo:[]
        };
    }
    componentDidMount() {
        this.requestdata()
        let utypes= localStorage.getItem("teamuser");
        let utypeObj=JSON.parse(utypes);

        this.setState({
            utype: utypeObj.utype
        })
    }
    requestdata=(params) => {//取数据
        post({url:"/api/companyuser/getlist"}, (res)=>{
            if(res.success){
                this.setState({
                    list: res.data
                })

                console.log(res.data)
            }
        })
    }
    showModalEdit= (code,index) => {
        this.setState({
            visible: true,
            type:code,
            index:index,
        });
        // this.formRef.updates()
    };
    showModal = (e) => { //新增弹窗
        e.preventDefault();
        this.setState({
            visible: true,
            type:0,
        });
    };
    handleCreate = (e) => {//modal提交
        // this.props.form.resetFields();
        e.preventDefault();
        const forms=this.formRef.formref();
        forms.validateFields((err, values) => {
            if (!err) {
                
                if(this.state.type){
                }else{
                    // console.log("新增接口",values.realname, values.account,values.emailaddress)
                    const data={
                        realname:values.realname,
                        account:values.account,
                        emailaddress:values.emailaddress,
                    }
                    post({url:"/api/companyuser/add",data:data}, (res)=>{
                        if(res.success){
                            data.utype=1;
                            data.code=res.code;
                            const list=this.state.list;
                            list.unshift(data);
                            this.setState({
                                list:list,
                            })
                        }
                    })

                }
                this.setState({
                    visible: false,
                });
                forms.resetFields() //清空
            }
        });
    };

    handleCancel = (e) => { //modal取消
        const forms=this.formRef.formref();
        e.preventDefault();
        this.setState({
            visible: false,
        });
        forms.resetFields();
    };
    showModaldelete = (code,index,record) =>{ //删除弹层
        this.setState({
            deleteshow: true,
            index:index,
            code:code
        });
        console.log(code)
    }
    deleteOk = (code,index) =>{//确认删除
        const data={
            code:this.state.code,
        }
        const list=this.state.list;
        list.splice(this.state.index,1);
        post({url:"/api/companyuser/del",data:data}, (res)=>{
            if(res.success){

                this.setState({
                    list:list,
                    deleteshow: false,
                })
            }
        })
    };

    deleteCancel = () =>{ //删除取消
        this.setState({
            deleteshow: false,
        });
    }
    selectopt = (e) => { //检索search
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                const data={
                    realname:values.realname,
                    account:values.account,
                }
                post({url:"/api/companyuser/getlist",data:data}, (res)=>{
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
        const _this=this;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render: (text, record,index) => (index+1)
            },{
                title: '账号',
                dataIndex: 'account',
                key: 'deveui',
                render: text => <span>{text}</span>,
            },{
                title: '姓名',
                dataIndex: 'realname',
                key: 'realname',
                render: text => <span>{text}</span>,
            }
            ,{
                title: '邮箱',
                dataIndex: 'emailaddress',
                key: 'emailaddress',
                render: text => <span>{text}</span>,
            },{
                title: '操作',
                dataIndex: 'code',
                key: 'operation',
                render: (text, record,index) => {
                    if(record.utype){
                        return (
                            <div>
                                <Button onClick={()=>_this.showModalEdit(text,index)}>编辑</Button>
                                <span className="ant-divider" />
                                <Button style={this.state.utype?{display:"inline-block"}:{display:"none"}} onClick={()=>_this.showModaldelete(text,index)}>删除</Button>
                            </div>
                        )
                    }
                }

                    
                
            }
        ];
        return (
            <div>
                <BreadcrumbCustom first="系统管理" second="人员管理" />
                <div className="shange">
                    <Row>
                        <Col span={16}>
                            <Form layout="inline" onSubmit={this.selectopt}>
                                <FormItem label="姓名">
                                    {getFieldDecorator('realname', {
                                        rules:[{
                                            required: false,
                                            message: '请输入名称!'
                                        }],

                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem label="账号">
                                    {getFieldDecorator('account', {
                                        rules: [{
                                            required: false,
                                            message: '请输入账号!',

                                        }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" htmlType="submit">
                                        查询
                                    </Button>
                                </FormItem>
                            </Form>
                        </Col>
                        <Col span={2}>
                            <Button style={this.state.utype?{display:"inline-block"}:{display:"none"}}type="primary" onClick={this.showModal}>新增</Button>
                        </Col>

                    </Row>
                    <Row>
                        <Table columns={columns} dataSource={this.state.list} />
                    </Row>
                </div>
                <Modal title={this.state.type?'查看维护团队':'新增维护团队'}
                       visible={this.state.visible}
                       onOk={this.handleCreate}
                       onCancel={this.handleCancel}
                >
                    <ModalForm visible={this.state.visible}
                               code={this.state.type}
                               wrappedComponentRef={(form) => this.formRef = form}
                    />
                </Modal>



                <Modal title="提示信息" visible={this.state.deleteshow} onOk={this.deleteOk}
                       onCancel={this.deleteCancel}
                >
                    <p>确认删除吗？</p>
                </Modal>
            </div>
        )
    }
}

export default Comemploye=Form.create()(Comemploye);