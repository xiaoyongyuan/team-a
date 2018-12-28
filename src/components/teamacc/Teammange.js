
import React, { Component } from 'react';
import '../../style/sjg/home.css';
import {Form,Table, DatePicker,Input, Row, Col, Button,Modal,} from 'antd';
import BreadcrumbCustom from "../BreadcrumbCustom";
import moment from 'moment';
import ModaTeam from './ModaTeam';
import {post} from "../../axios/tools";
const {RangePicker } = DatePicker;
const FormItem = Form.Item;
class Teammange extends Component {
    constructor(props){
        super(props);
        this.state={
            list:[],
            value: 1,
        };
    }
    componentDidMount() {
        let utypes= localStorage.getItem("teamuser");
        let utypeObj=JSON.parse(utypes);
        this.setState({
            utype: utypeObj.utype
        })   
        //取数据
        this.requestdata()
    }

    requestdata=(params) => {//取数据
        post({url:"/api/company/getlist"}, (res)=>{
            if(res.success){
                console.log("列表数据：",res.data);
                this.setState({
                    list: res.data
                })
            }
        })
    }
    // showModsearch = (code,index,record) =>{//删除弹层
    //     this.setState({
    //         deleteshow: true,
    //         type:code,
    //         index:index
    //     });

    // }


    onChange_radio=(e)=>{//单选
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    }
    showModal = (e)=> {//新增弹窗
        e.preventDefault();
        this.setState({
            visible: true,
            type:0,
        });
    };
    showModalEdit=(code,index)=>{ //编辑用户
        this.setState({
            visible: true,
            type:code,
            index:index,
        });
    }

    handleCreate = (e) => {//modal提交
        e.preventDefault();
        const forms=this.formRef.formref();
        forms.validateFields((err, values) => {
            if (!err) {
                if(this.state.type){
                    // console.log("編輯接口",)
                    const data={
                        comid:this.state.type,
                        cname:values.cname,
                        adminname:values.adminname,
                        adminaccount:values.adminaccount,
                        cloudvaliddate: moment(values.cloudvaliddate).format("YYYY-MM-DD"),
                        ctype:values.ctype,
                        clng:values.clng,
                        clat:values.clat,
                        memo:values.memo,
                    }
                    post({url:"/api/company/update",data:data}, (res)=>{
                        if(res.success){
                            data.code=res.code;
                            let list=this.state.list;
                            list[this.state.index]=res.data[0];                        
                            this.setState({
                                list:list,
                            })
                        }
                    })

                }else{
                    // console.log("新增接口",values.cname, values.adminname,values.adminaccount,values.cloudvaliddate,values.ctype,values.clng,values.clat,values.memo)
                    const data={
                        cname:values.cname,
                        adminname:values.adminname,
                        adminaccount:values.adminaccount,
                        cloudvaliddate: moment(values.cloudvaliddate).format("YYYY-MM-DD"),
                        ctype:values.ctype,
                        clng:values.clng,
                        clat:values.clat,
                        memo:values.memo,
                    }
                    post({url:"/api/company/add",data:data}, (res)=>{
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
                });
                forms.resetFields()//清空
            }
        });
    };
    handleCancel = (e) => {
        const forms=this.formRef.formref();
        this.setState({
            visible: false,
        });
        forms.resetFields();
    };

    selectopt = (e) => { //检索search
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!",values.clouddata,values.name)
            console.log(typeof(values.clouddata))
            if(values.clouddata==undefined &&values.name==undefined){
                this.setState({
                    deleteshow: true,
                })
                return false ;
            }

            if(!err){
                const data={
                    bdate:values.clouddata[0].format('YYYY-MM-DD'),
                    edate:values.clouddata[1].format('YYYY-MM-DD'),
                    cname:values.name,
                }
 
                post({url:"/api/company/getlist",data:data}, (res)=>{
                    if(res.success){
                        this.setState({
                            list: res.data
                        })
                    }
                })
            }
        })
    }

searchOk= () =>{//删除取消
    this.setState({
        deleteshow: false,
    });
};
searchCancel = () =>{//删除取消
    this.setState({
        deleteshow: false,
    });
};

    render() {
        const _this=this;
        const { getFieldDecorator } = this.props.form;
        function onChange_time(date, dateString) {
            console.log(dateString[0]);
            console.log(dateString[1]);
            _this.setState({
                timeString1:dateString[0],
                timeString2:dateString[1]
            });
        }
        const dateFormat = 'YYYY/MM/DD';

        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render: (text, record,index) => (index+1)
            },
            {
                title: '名称',
                dataIndex: 'cname',
                key: 'cname'
            },
            {
                title: '联系人',
                dataIndex: 'adminname',
                key: 'adminname',
                render: text => <span>{text}</span>,
            },
            {
                title: '联系人电话',
                dataIndex: 'adminaccount',
                key: 'adminaccount',
                render: text => <span>{text}</span>,
            },
            {
                title: '云服务到期日期',
                dataIndex: 'cloudvaliddate',
                key: 'cloudvaliddate',
                render: text => <span>{text}</span>,
            },
            {
                title: '类型',
                dataIndex: 'ctype',
                key: 'ctype',
                render: (text, record) => {
                 if(text==4){
                    return ('树莓派企业用户');

                 }if (text==5) {
                    return ('局域网个人用户');
                 } else {
                    return ('树莓派个人用户');
                 }
               
                },
            },
            {
                title: '说明',
                dataIndex: 'explain',
                key: 'explain',
                render: text => <span>自行管理</span>,
            },
            {
                title: '共享',
                dataIndex: 'share',
                key: 'share',
                render: text => <span>{text}</span>,
            },
            {
                title: '操作',
                key: 'manage3',
                render: (text, record,index) => (
                    <span>
                        <Button 
                         style={this.state.utype? {display:"inline-block"}:{display:"none"}}                      
                         onClick={() => {_this.showModalEdit(text.code,index,record)}}
                        >编辑
                        </Button>
                        {/* <Button onClick={()=>_this.showModaldelete(text.code,index,record)}>删除</Button> */}

                    </span>
                ),
            }];
        return (
            <div>
                <BreadcrumbCustom first="账号管理" second="用户管理" />
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
                                    rules: [{ required: false, message: '请选择日期!' }],
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
                    <Col span={4} offset={2}>
                        <Button type="primary" onClick={this.showModal}>
                            新增
                        </Button>
                    </Col>
                </Row>

                <Table columns={columns} dataSource={this.state.list} />

                <Modal visible={this.state.visible}
                       onOk={this.handleCreate}
                       onCancel={this.handleCancel} 
                >
                    <ModaTeam visible={this.state.visible}
                              code={this.state.type}
                              wrappedComponentRef={(form) => this.formRef = form}
                    />
                </Modal>
                <Modal title="提示信息" visible={this.state.deleteshow} onOk={this.searchOk}
                       onCancel={this.searchCancel}
                >
                    <p>请选择查询的内容 </p>
                </Modal>
            </div>

        )
    }

}

export default Teammange=Form.create()(Teammange);