import React, { Component } from 'react';
import '../../style/sjg/home.css';
import {Table, Form, Input, Row, Col, Button,Select,Modal,message} from 'antd';
import BreadcrumbCustom from "../BreadcrumbCustom";
import {post} from "../../axios/tools";
const FormItem = Form.Item;
const Option = Select.Option;
class Teamdeveice extends Component {
    constructor(props){
        super(props);
        this.state={
            list:[],
            type:"",
            editstate:1,
            userlist:[], //用户列表
            page:1,
            longitude:false
        };
    }
    componentDidMount() {
        post({url:'/api/company/getlist'},(res)=>{
            if(res){
                this.setState({
                    userlist:res.data,
                });
            }
        });

        //取数据
        this.requestdata()
    }
    requestdata=(params) => {//取数据
        this.setState({ loading: true });
        const quparams={
            pagesize:10,
            ecode:this.state.ecode,
            estatus:this.state.estatus,
            companycode:this.state.companycode,
            pageindex:this.state.page,

        }
        post({url:'/api/equipment/getlist',data:quparams},(res)=>{
            if(res){
                this.setState({
                    list:res.data,
                    total:res.totalcount,
                    loading: false 
                }); 
            }   
        })
    }
    selectopt = (e) => { //检索
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.setState({
                    ecode:values.ecode,
                    estatus: values.estatus,
                    companycode:values.companycode,
                    page:1
                },()=>{
                    this.requestdata();
                })
                

            }
        })
    }


    showModaldelete = (code,index) =>{ //删除弹层
        this.setState({
            deleteshow: true,
            type:code,
            index:index,
        });
    }

    deleteOk = () =>{//删除确认
        post({url:'/api/equipment/del',data:{code:this.state.type}},(res)=>{
            if(res){
                const list=this.state.list;
                list.splice(this.state.index,1);
                this.setState({
                    list:list,
                    deleteshow: false,
                }); 
            }   
        })
    };
    deleteCancel = () =>{//删除取消
        this.setState({
            deleteshow: false,
        });
    };


    showModalEdit= (record) => { //编辑弹窗
        this.setState({
            visible: true,
            record:record,
            // lis:record.code,
        });
    };
    handleCreate = (e) => {//modal提交
        e.preventDefault();
        this.setState({
            visible: false
        });

    };
    handleCancel = (e) => { //modal取消
        e.preventDefault();
        this.setState({
            visible: false,
        });
    };
    handleChange = (value) => { //状态操作
        this.setState({
            editstate: value
        });
    }
    changePage=(page,pageSize)=>{ //分页  页码改变的回调，参数是改变后的页码及每页条数
        this.setState({
            page: page,
        },()=>{
            this.requestdata()
        })
    };
    //经纬度model
    upLatitude=(redcord,index)=>{
        this.setState({
            longitude:true,
            changelng:redcord.lng,
            changelat:redcord.lat,
            cid:redcord.cid,
            LatitudeIndex:index
        })
    };
    longitudeCancel=()=>{
        document.getElementById("changelat").value="";
        this.setState({
            longitude:false,
        })
        console.log(document.getElementById("changelat").value,"aaaa")
    };
    HanleChangelng=(Changelng,e)=>{
        console.log(e.target.value,Changelng);
        this.setState({
            [Changelng]:e.target.value
        })
    };
    longitudeOk=()=>{
        if(this.state.cid){
            const reg =/^\d+(\.\d+)?$/;
            if(this.state.changelng || this.state.changelat){
                if(reg.test(this.state.changelat)&&reg.test(this.state.changelng)){
                    post({url:"/api/camera/update",data:{code:this.state.cid,lat:this.state.changelat,lng:this.state.changelng}},(res)=>{
                        if(res.success){
                            let list=this.state.list;
                            list[this.state.LatitudeIndex].lat=this.state.changelat;
                            list[this.state.LatitudeIndex].lng=this.state.changelng;
                            this.setState({
                                longitude:false,
                                list
                            },()=>{
                                message.success('修改成功！');
                            })
                        }
                    })
                }else{
                    message.error('只能输入整数或者小数');
                }
            }
        }
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                width:100,
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render: (text,record,index) => <span>{index+1}</span>,

            },{
                title: '设备编号',
                dataIndex: 'ecode',
                key: 'ecode',
                render: text => <span>{text}</span>,
            },{
                title: '设备类型',
                dataIndex: 'etype',
                key: 'etype',
                render: text => <span>树莓派</span>,
            },{
                title: '所属用户',
                dataIndex: 'pname',
                key: 'pname',
                render: text => <span>{text}</span>,
            },{
                title: '设备状态',
                dataIndex: 'estatus',
                key: 'estatus1',
                render: (text, record,index) => {
                    switch(text){
                        case 0:
                            return `未使用`;
                        case 1:
                            return `使用中`;
                        case 2:
                            return `报修中`;
                        case 9001:
                            return `服务已过期`;
                        default:
                            return"";
                    }
                },
            },{
                title: '经纬度',
                dataIndex: 'lng',
                key: 'lng',
                render: (text, record,index) => {
                    return(
                        <p><span>{record.lng}</span><span style={{display:text?"inline-block":"none"}}>,</span><span>{record.lat}</span></p>
                    )
                }
            },{
                title: '绑定日期',
                dataIndex: 'createon',
                key: 'manage'
            },{
                title: '操作',
                dataIndex: 'estatus',
                key: 'opt',
                render: (text, record,index) => {
                    if(text){
                        return(
                            <span>
                                {/*<Button onClick={() => {this.showModalEdit(record.code,index)}}>编辑</Button>*/}
                                <Button onClick={()=>this.showModaldelete(record.code,index)}>删除</Button>
                                <Button onClick={()=>this.upLatitude(record,index)}>修改经纬度</Button>
                            </span>
                        )
                    }else{
                        return(
                            <span>
                                <Button onClick={()=>this.showModaldelete(record.code,index)}>删除</Button>
                            </span>

                        )
                    }
                }
            }];


        return (
            <div>
                <BreadcrumbCustom first="账号管理" second="设备管理" />
                <Row className="margin_top20 margin_bottom20">
                        <Col span={22}>
                            <Form layout="inline"onSubmit={this.selectopt}>
                                <FormItem label="设备编号">
                                    {getFieldDecorator('ecode', {
                                        rules: [{ required: false, message: '设备编号!' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem label="状态">
                                    {getFieldDecorator('estatus', {
                                        initialValue:""
                                    })(
                                        <Select style={{ width: 120 }}>
                                            <Option value="">所有</Option>
                                            <Option value="0">未绑定</Option>
                                            <Option value="2">维修中</Option>
                                            <Option value="1">已绑定</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label="所属用户">
                                    {getFieldDecorator('companycode', {
                                        initialValue:"",
                                    })(
                                        <Select style={{ width: 120 }}>
                                            <Option value="">所有</Option>
                                        {
                                                this.state.userlist.map((item, index) => (
                                                    <Option value={item.code} key={index}>{item.cname}</Option>
                                                ))

                                        }
                                        </Select>
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
                <Table columns={columns} dataSource={this.state.list} bordered={true}
                 pagination={{defaultPageSize:10,current:this.state.page, total:this.state.total,onChange:this.changePage ,hideOnSinglePage:true}}
                 rowKey={record => record.code}
                />
                <Modal title='编辑' visible={this.state.visible} onOk={this.handleCreate}
                       onCancel={this.handleCancel}
                >
                    <label>状态 </label>
                    <Select defaultValue={this.state.editstate} style={{ width: 300}} onChange={this.handleChange}>
                        <Option value="1">解绑</Option>
                        <Option value="2">维修中</Option>
                        <Option value="3">未绑定</Option>
                    </Select>
                </Modal>
                <Modal title="提示信息" visible={this.state.deleteshow} onOk={this.deleteOk}
                       onCancel={this.deleteCancel}
                       okText="确认"
                       cancelText="取消"
                >
                    <p>确认删除吗？</p>
                </Modal>
                <Modal title="修改经纬度" visible={this.state.longitude} onOk={this.longitudeOk}
                       onCancel={this.longitudeCancel}
                       width={450}
                       okText="确认"
                       cancelText="取消"
                >
                    <div className="zttLatitude"><label>经度：</label><Input placeholder="请输入经度" id="changelat" defaultValue={this.state.changelng} onChange={(e)=>this.HanleChangelng("changelng",e)} /></div>
                    <div className="zttLatitude"> <label>纬度：</label><Input placeholder="请输入纬度" defaultValue={this.state.changelat} onChange={(e)=>this.HanleChangelng("changelat",e)} /></div>
                </Modal>
            </div>
        )
    }
}
export default Teamdeveice=Form.create()(Teamdeveice);
