import React, { Component } from 'react';
import '../../style/sjg/home.css';
import {Form,Table, DatePicker,Input, Row, Col, Button,Modal,LocaleProvider} from 'antd';
import BreadcrumbCustom from "../BreadcrumbCustom";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import 'moment/locale/zh-cn';
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
            page:1,
        };
    }
    componentDidMount() {
        let utypes= localStorage.getItem("teamuser");
        let utypeObj=JSON.parse(utypes);
        this.setState({
            utype: utypeObj.utype
        },()=>{
            this.requestdata()
        })
        
    }

    requestdata=() => {//取数据
        const params={
            pagesize:10,
            bdate:this.state.bdate,
            edate: this.state.edate,
            cname: this.state.cname,
            pageindex:this.state.page,

        }
        post({url:"/api/company/getlist",data:params}, (res)=>{
            if(res.success){
                this.setState({
                    list: res.data,
                    total:res.totalcount,
                })
            }
        })
    }
    onChange_radio=(e)=>{//单选
        this.setState({
            value: e.target.value,
        });
    }
    showModal = (e)=> {//新增弹窗
        e.preventDefault();
        this.setState({
            visible: true,
            type:0,
            istrue:false
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
                const data={
                    cname:values.cname,
                    adminname:values.adminname,
                    adminaccount:values.adminaccount,
                    cloudvaliddate:values.cloudvaliddate?moment(values.cloudvaliddate).format("YYYY-MM-DD"):'',
                    clng:values.clng,
                    clat:values.clat,
                    servicetype:values.opening.join(','),
                    memo:values.memo,
                }
                if(this.state.type){
                    data.comid=this.state.type;
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
                    data.ctype=4;
                    post({url:"/api/company/add",data:data}, (res)=>{
                        if(res.success){
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
    handleCancel = () => {
        const forms=this.formRef.formref();
        this.setState({
            visible: false,
        });
        forms.resetFields();
    };

    selectopt = (e) => { //检索search
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(values.clouddata===undefined && values.name===undefined){
                this.requestdata();
                this.setState({
                    deleteshow: true,
                });
                return false ;
            }
            if(!err){
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
        function onChange_time(date, dateString) {
            _this.setState({
                timeString1:dateString[0],
                timeString2:dateString[1]
            });
        }
        const dateFormat = 'YYYY/MM/DD';
        const columns = [
            {
                width:100,
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
            },
            {
                title: '联系人电话',
                dataIndex: 'adminaccount',
                key: 'adminaccount',
            },
            {
                title: '云服务到期日期',
                dataIndex: 'cloudvaliddate',
                key: 'cloudvaliddate',
            },
            {
                title: '类型',
                dataIndex: 'ctype',
                key: 'ctype',
                render: (text) => {
                 if(text===4){
                    return ('树莓派企业用户');
                 }else if (text===5) {
                    return ('椒图精灵个人用户');
                 }else if(text===3){
                    return ('局域网用户');
                 }else{
                    return '未知类型：'+text
                 }
                },
            },
            // {
            //     title: '说明',
            //     dataIndex: 'explain',
            //     key: 'explain',
            //     render: text => <span>自行管理</span>,
            // },
            // {
            //     title: '共享',
            //     dataIndex: 'share',
            //     key: 'share',
            //     render: text => <span>{text}</span>,
            // },
            {
                title: '操作',
                dataIndex: 'code',
                key: 'code',
                render: (text, record,index) => (
                    <span>
                        <Button 
                         style={this.state.utype? {display:"inline-block"}:{display:"none"}}                      
                         onClick={() => {_this.showModalEdit(text,index)}}
                        >编辑
                        </Button>
                        {/* <Button onClick={()=>_this.showModaldelete(text,index)}>删除</Button> */}
                    </span>
                ),
            }];
        return (
            <div>
                <BreadcrumbCustom first="账号管理" second="客户管理" />
                    <Row className="margin_top20 margin_bottom20">
                    <Col span={18}>
                        <Form layout="inline" onSubmit={this.selectopt}>
                            <FormItem label="查询用户：">
                                {getFieldDecorator('name', {
                                    rules: [{ required: false, message: '请输入用户名称!' }],
                                })(
                                     <Input />
                                )}
                            </FormItem>
                            <LocaleProvider locale={zh_CN}>
                                <FormItem label="云服务到期日期：">
                                {getFieldDecorator('clouddata', {
                                    rules: [{ required: false, message: '请选择日期!' }],
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
                    <Col span={4} offset={2}>
                        <Button type="primary" onClick={this.showModal}>
                            新增
                        </Button>
                    </Col>
                </Row>

                <Table columns={columns} dataSource={this.state.list} bordered
                 rowKey={record => record.code}
                 pagination={{defaultPageSize:10,current:this.state.page, total:this.state.total,onChange:this.changePage ,hideOnSinglePage:true}}
                />

                <Modal visible={this.state.visible}
                       onOk={this.handleCreate}
                       onCancel={this.handleCancel}
                       okText="确认"
                       cancelText="取消"
                >
                    <ModaTeam visible={this.state.visible}
                              code={this.state.type}
                              istrue={this.state.istrue}
                              wrappedComponentRef={(form) => this.formRef = form}
                    />
                </Modal>
                <Modal title="提示信息" visible={this.state.deleteshow} onOk={this.searchOk}
                       onCancel={this.searchCancel}
                        footer={null}
                >
                    <p>请选择查询的内容 </p>
                </Modal>
            </div>

        )
    }

}

export default Teammange=Form.create()(Teammange);