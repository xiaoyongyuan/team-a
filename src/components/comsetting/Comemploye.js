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
            createinfo:[],
            page:1, //当前页
        };
    }
    componentDidMount() {
        this.requestdata()
        let utypes= localStorage.getItem("teamuser");
        let utypeObj=JSON.parse(utypes);
        this.setState({
            utype: utypeObj.userpower
        })
    }
    requestdata=(params) => {//取数据
        this.props.form.validateFields((err, values) => {
            if(!err){
                const datar={
                    realname:values.realname,
                    account:values.account,
                    pagesize:10,
                    pageindex:this.state.page,
                }
                post({url:"/api/userworker/getlist",data:datar}, (res)=>{
                    if(res.success){
                        this.setState({
                            list: res.data,
                            account:res.account,
                            total:res.totalcount,
                        })
                    }
                })
            }
        })
    }
    showModalEdit= (code,record,index) => { //编辑用户       
        this.setState({
            visible: true,
            codetype:code,
            index:index,
            account:record.account,
            type:1,
        });
    };
    showModal = (e) => { //新增弹窗
        e.preventDefault();
        this.setState({
            visible: true,
            type:0,
            account:'',
            codetype:'',
        });
    };
    handleCreate = (e) => {//modal提交
    	e.preventDefault();
        this.setState({
            value:1    
        })
        const forms=this.formRef.formref();
        forms.validateFields((err, values) => {
            if (!err) {
            	const data={
                  realname:values.realname,
                  account:values.account,
                  emailaddress:values.emailaddress,
                  memo:values.memo,
                  usergender:values.usergender,
                  userpower:values.userpower,
                  user:'admin'
              }
              console.log('data',data)
              
              if(this.state.type){
                  //编辑接口');
                  data.code=this.state.codetype;
                  post({url:"/api/userworker/update",data:data}, (res)=>{
                      if(res.success){
                          let list=this.state.list;
                          list[this.state.index]=res.data[0];                        
                          this.setState({
                              list:list,
                          })
                      }   
                  })                   
              }else{
                  //新增接口');
                  data.account=values.account;
                  post({url:"/api/userworker/add",data:data}, (res)=>{
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
                  visible: false
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
    showModaldelete = (code,record,index) =>{ //删除弹层
        this.setState({
            deleteshow: true,
            index:index,
            code:code,
            account:record.account,
        });
    }
    deleteOk = (code,index) =>{//确认删除
        const data={
            code:this.state.code,
            account:this.state.account,
            ifdel:1,
            user:'admin'
        }
        const list=this.state.list;
        list.splice(this.state.index,1);
        post({url:"/api/userworker/update",data:data}, (res)=>{
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
        this.setState({
            page:1,
        })
        this.props.form.validateFields((err, values) => {
            if(!err){
                const data={
                    realname:values.realname,
                    account:values.account,
                    pagesize:10,
                    pageindex:this.state.page,
                }
                post({url:"/api/userworker/getlist",data:data}, (res)=>{
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
    changePage=(page,pageSize)=>{ //分页  页码改变的回调，参数是改变后的页码及每页条数
        this.setState({
            page: page,
        },()=>{
            this.requestdata()
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
            },{
                title: '性别',
                dataIndex: 'usergender',
                key: 'usergender',
                render:(text, record,index) => {
                    if(record.usergender===0){
                        return ("女")
                    }else{
                        return ("男")
                    }
                }
            }
            ,{
                title: '权限',
                dataIndex: 'userpower',
                key: 'userpower',
                render:(text, record,index) => {
                    if(record.userpower==="admin_helper"){
                        return ("管理员")
                    }else if(record.userpower==="chargehand_helper"){
                        return ("值班组长")
                    }else if(record.userpower==="onduty_helper"){
                        return ("值守人员")
                    }
                }
            }
            ,{
                title: '邮箱',
                dataIndex: 'emailaddress',
                key: 'emailaddress',
                render: text => <span>{text}</span>,
            },{
                title: '备注',
                dataIndex: 'memo',
                key: 'memo',
                render: text => <span>{text}</span>,
            },{
                title: '操作',
                dataIndex: 'code',
                key: 'operation',
                render: (text, record,index) => {
                	if(this.state.utype==="admin_helper"){
                        return (
                            <div>
                                <Button style={{marginRight:'20px'}} onClick={()=>_this.showModalEdit(text,record,index)}>编辑</Button>
                                <Button style={record.userpower !== "admin_helper"?{display:"inline-block"}:{display:"none"}} onClick={()=>_this.showModaldelete(text,record,index)}>删除</Button>
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
                        <Col span={22}>
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
                            <Button style={this.state.utype==="admin_helper"?{display:"inline-block"}:{display:"none"}} type="primary" onClick={this.showModal}>新增</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Table rowKey={record => record.code} style={{marginTop:'20px'}} columns={columns} dataSource={this.state.list} bordered
                         pagination={{defaultPageSize:10,current:this.state.page, total:this.state.total,onChange:this.changePage,hideOnSinglePage:true}}
                        />
                    </Row>
                </div>
                <Modal title={this.state.type?'查看用户管理':'新增用户管理'}
                       visible={this.state.visible}
                       onOk={this.handleCreate}
                       onCancel={this.handleCancel}
                       okText="确认"
                       cancelText="取消"
                       width={550}
                >
                    <ModalForm visible={this.state.visible}
                               code={this.state.codetype}
                               value={this.state.value}
                               account={this.state.account}
                               wrappedComponentRef={(form) => this.formRef = form}
                    />
                </Modal>
                <Modal title="提示信息" visible={this.state.deleteshow} onOk={this.deleteOk}
                       onCancel={this.deleteCancel}
                       okText="确认"
                       cancelText="取消"
                >
                    <p>确认删除吗？</p>
                </Modal>
            </div>
        )
    }
}
export default Comemploye=Form.create()(Comemploye);