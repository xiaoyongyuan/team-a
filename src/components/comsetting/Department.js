import React, { Component} from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import {Form,Input, Row, Col, Button , Modal, Table, message } from 'antd';
import {post} from "../../axios/tools";
const FormItem = Form.Item;
class Department extends Component {
    constructor(props){
        super(props);
        this.state={
            visible:false,
            list:[],
            createinfo:[],
            comid:1000001
        };
    }
    componentDidMount() {
        this.requestdata()
    }

    requestdata=(params) => {//取数据
        post({url:"/api/companygroup/getlist"}, (res)=>{
            if(res.success){
                console.log("列表数据：",res.data);
                this.setState({
                    list: res.data
                })
            }
        })
    }
    showModal = () => {//新增弹窗
        this.setState({
            visible: true,
            type:0
        });
    };
    handleChange = (e) => { //新增提交
        this.setState({
            departname:e.target.value
        });
    }
    handleCreate = (e) => {//modal提交
        e.preventDefault();
        if(this.state.departname){
            if(this.state.type){
                const data={
                    cgname:this.state.departname,
                    code:this.state.type,
                }
                post({url:"/api/companygroup/update",data:data}, (res)=>{
                    if(res.success){
                        console.log(res.success)
                         // data.comid=res.comid;
                        let list=this.state.list;
                            list[this.state.index].cgname=res.data[0].cgname;
                        this.setState({
                            list:list,
                        })
                    }
                })
            }else{
                const data={
                    cgname:this.state.departname,
                }
                post({url:"/api/companygroup/add",data:data}, (res)=>{
                    if(res.success){
                        console.log(res.success)
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
                departname:''
            });
        }else{
           message.warn('请输入名称'); 
        }
    };
    handleCancel = (e) => { //新增取消
        e.preventDefault();
        this.setState({
            visible: false,
            departname:''
        });
    };
    showModalEdit= (code,index) => { //编辑弹窗
        this.setState({
            visible: true,
            type:code,
            index:index,
        },()=>{
                if(this.state.type){
                    let list=this.state.list[index].cgname;
                    this.setState({
                        departname: list,
                    })
                }
        });
    };
    showModaldelete = (code,index) =>{ //删除弹层
        this.setState({
            deleteshow: true,
            type:code,
            index:index,
        });
    }
    //删除确认
    deleteOk = () =>{
        console.log("code",this.state.type)
        const data={
            code:this.state.type,
        }
        const list=this.state.list;
        list.splice(this.state.index,1);
        post({url:"/api/companygroup/del",data:data}, (res)=>{
            if(res.success){
                this.setState({
                    list:list,
                    deleteshow: false,
                })
            }
        })
    };
    deleteCancel = () =>{//删除取消
        this.setState({
            deleteshow: false,
        });
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
                console.log('检索',values)
                const data={
                    cgname:values.cgname,
                }
                post({url:"/api/companygroup/getlist",data:data}, (res)=>{
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

        const columns = [{
                title: '序号',
                dataIndex: 'index',
                key: 'name',
                render: (text, record,index) => (index+1)
            },{
                title: '名称',
                dataIndex: 'cgname',
                key: 'bianbao',
                render: text => <span>{text}</span>,
            },{
                title: '是否默认',
                dataIndex: 'status',
                key: 'equ_type',
                render: text => <span>{text}</span>,
            },{
                title: '操作',
            dataIndex: 'code',
            key: 'operation',
                render: (text, record,index) => (
                    <div>
                    <Button onClick={()=>_this.showModalEdit(text,index)}>编辑</Button>
                    <span className="ant-divider" />
                    <Button onClick={()=>_this.showModaldelete(text,index)}>删除</Button>
                    </div>
                )
            }
        ];
        return (
            <div>
                <BreadcrumbCustom first="系统管理" second="部门管理" />
                <div className="shange">
                    <Row>
                        <Col span={12}>
                            <Form layout="inline" onSubmit={this.selectopt}>
                                <FormItem label="名称">
                                    {getFieldDecorator('cgname', {
                                        rules: [{ required: false, message: '请输入名称!' }],
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
                            <Button type="primary" onClick={this.showModal}>新增</Button>                           
                        </Col>
                    </Row>
                <Row>
                    <Table columns={columns} dataSource={this.state.list} />
                </Row>
                </div>
                       
                <Modal title={this.state.type?'编辑分组':'新增分组'} visible={this.state.visible} onOk={this.handleCreate}
          onCancel={this.handleCancel}
                >  
                    <Input className="departname" name="departname" value={this.state.departname} onChange={this.handleChange} />
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

export default Department=Form.create()(Department);