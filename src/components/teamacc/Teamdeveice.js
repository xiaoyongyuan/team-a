import React, {Component} from 'react';
import '../../style/sjg/home.css';
import {Table, Form, Input, Row, Col, Button, Select, Modal, message} from 'antd';
import BreadcrumbCustom from "../BreadcrumbCustom";
import {post} from "../../axios/tools";
import CascaderModule from "../common/CascaderModule";
import moment from "moment";
const FormItem = Form.Item;
const Option = Select.Option;
class Teamdeveice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            type: "",
            editstate: 1,
            userlist: [], //用户列表
            page: 1,
            longitude: false,
            caseInfo:"",
            filedInput:true,//控制子组件的修改
            filed:false//控制子组件的修改
        };
    }
    componentDidMount() {
        //所属用户
        /*post({url: '/api/company/getlist'}, (res) => {
            if (res) {
                this.setState({
                    userlist: res.data,
                });
            }
        });*/
        //取数据
        this.requestdata();
    }

    requestdata = (params) => {//取数据
        this.setState({loading: true});
        const quparams = {
            pagesize: 10,
            ecode: this.state.ecode,
            estatus: this.state.estatus,
            cname: this.state.cname,
            pageindex: this.state.page,

        };
        post({url: '/api/equipment/getlist', data: quparams}, (res) => {
            if (res) {
                this.setState({
                    list: res.data,
                    total: res.totalcount,
                    loading: false
                });
            }
        })
    };
    //设备编号
    hanleCode=(e)=>{
        this.setState({
            ecode: e.target.value,
        })
    };
    //所属用户
    hanleUser=(e)=>{
        this.setState({
            cname: e.target.value,
        })
    };
    //状态
    handleSelect=(value)=>{
        if(value==="5"){
            this.setState({
                estatus: "",
            })
        }else{
            this.setState({
                estatus: value,
            })
        }
    };
    selectopt = (e) => { //检索
        e.preventDefault();
        this.requestdata();
    };
    showModaldelete = (code, index) => { //删除弹层
        this.setState({
            deleteshow: true,
            type: code,
            index: index,
        });
    };

    deleteOk = () => {//删除确认
        post({url: '/api/equipment/del', data: {code: this.state.type}}, (res) => {
            if (res) {
                const list = this.state.list;
                list.splice(this.state.index, 1);
                this.setState({
                    list: list,
                    deleteshow: false,
                });
            }
        })
    };
    deleteCancel = () => {//删除取消
        this.setState({
            deleteshow: false,
        });
    };


    showModalEdit = (record) => { //编辑弹窗
        this.setState({
            visible: true,
            record: record,
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
    };
    changePage = (page) => { //分页  页码改变的回调，参数是改变后的页码及每页条数
        this.setState({
            page: page,
            ecode:"",
            cname:"",
            estatus:""
        }, () => {
            this.requestdata();
        })
    };
    //经纬度model
    upLatitude = (redcord, index) => {
        this.props.form.resetFields(); //清空
        this.setState({
            longitude: true,
            LatitudeIndex: index,
            changeCode:redcord.code
        });
        post({url:"/api/equipment/getone",data:{code:redcord.code}},(res)=>{
            if(res.success){
                if(res.data.location.toString().indexOf(",")===-1){
                    this.props.form.setFieldsValue({
                        lng:res.data.lng,
                        lat:res.data.lat,
                        location:res.data.location,
                        installmen:res.data.installmen,
                        installtel:res.data.installtel,
                        salemen:res.data.salemen,
                        saletel:res.data.saletel,
                        /* filedlocation:res.data.location*/
                    });
                }else{
                    this.props.form.setFieldsValue({
                        lng:res.data.lng,
                        lat:res.data.lat,
                        location:res.data.location.toString()?res.data.location.toString().split(',')[1]:"",
                        filedlocation:res.data.location.toString()?res.data.location.toString().split(',')[0]:"",
                        installmen:res.data.installmen,
                        installtel:res.data.installtel,
                        salemen:res.data.salemen,
                        saletel:res.data.saletel,
                    });
                }
            }
        })
    };
    longitudeCancel = () => {
        this.props.form.resetFields(); //清空
        this.setState({
            longitude: false,
            filedInput:true,//控制子组件的修改
            filed:false,//控制子组件的修改
        });
    };
    //修改所在区域切换
    hanleFiled=()=>{
        this.setState({
            filedInput:false,
            filed:true,
        })
    };
    hanleonRef = (ref) => {
        this.setState({caseInfo:ref});
    };
    longitudeOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let equipment={
                    code:this.state.changeCode,
                    installmen:values.installmen,
                    installtel:values.installtel,
                    salemen:values.salemen,
                    saletel:values.saletel,
                };
                if (this.state.changeCode) {
                    if(this.state.filedInput){
                        if(values.lng && values.lat && values.filedlocation && values.location){
                            let datasfiledlocation = {
                                code:this.state.changeCode,
                                lng: values.lng,
                                lat: values.lat,
                                location:values.filedlocation+","+values.location
                            };
                          this.hanleUpdate(datasfiledlocation,equipment);
                        }else{
                            message.warning("请选择所在区域或详细地址!");
                        }
                    }else{
                        if(values.lng && values.lat && this.state.caseInfo.formref().zonename && values.location){
                            let dataszonename = {
                                code:this.state.changeCode,
                                lng: values.lng,
                                lat: values.lat,
                                location:this.state.caseInfo.formref().zonename+","+values.location
                            };
                          this.hanleUpdate(dataszonename,equipment);
                        }else{
                            message.warning("请选择所在区域或详细地址!");
                        }
                    }

                }
            }
        });
    };
    hanleUpdate=(datas,equipment)=>{
        post({url: "/api/camera/update", data: datas}, (ress) => {
            post({url:"/api/equipment/update",data: equipment},(res)=>{
                if (ress.success && res.success) {
                    let list = this.state.list;
                    list[this.state.LatitudeIndex].lng=ress.data[0].lng;
                    list[this.state.LatitudeIndex].lat=ress.data[0].lat;
                    list[this.state.LatitudeIndex].location=ress.data[0].location;
                    list[this.state.LatitudeIndex].installmen=res.data[0].installmen;
                    list[this.state.LatitudeIndex].installtel=res.data[0].installtel;
                    list[this.state.LatitudeIndex].salemen=res.data[0].salemen;
                    list[this.state.LatitudeIndex].saletel=res.data[0].saletel;
                    this.setState({
                        longitude: false,
                        list,
                    }, () => {
                        this.setState({
                            filedInput:true,
                            filed:false,
                        });
                        message.success('修改成功！');
                    })
                }
            })
        });
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 20 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render: (text, record, index) => <span>{index + 1}</span>,

            }, {
                title: '编号',
                dataIndex: 'ecode',
                key: 'ecode',
                defaultSortOrder: 'descend',
                onFilter: (value, record) => record.ecode.indexOf(value) === 0,
                sorter: (a, b) => a.ecode.length - b.ecode.length,
                sortDirections: ['descend', 'ascend'],
                render: text => <span>{text}</span>,
            }, {
                title: '类型',
                dataIndex: 'etype',
                key: 'etype',
                render: text => <span>椒图精灵</span>,
            }, {
                title: '所属用户',
                dataIndex: 'cname',
                key: 'cname',
                render: text => <span>{text}</span>,
            }, {
                title: '状态',
                dataIndex: 'estatus',
                key: 'estatus1',
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.estatus - b.estatus,
                render: (text,record) => {
                    var newDate=new Date().getTime();
                    var lasttime=new Date(record.lasttime).getTime();
                    var heartime=new Date(record.heartime).getTime();
                    var lastfont="";
                    if(newDate-lasttime>60000 || newDate-heartime>60000){
                        lastfont="离线";
                    }else{
                        lastfont="在线";
                    }
                    switch (text) {
                        case 0:
                            return `未使用`;
                        case 1:
                            return (
                                <div>使用中-<span style={{color:lastfont=="离线"?"red":"green"}}>{lastfont}</span></div>
                            );
                        case 2:
                            return `报修中`;
                        case 9001:
                            return `服务已过期`;
                        default:
                            return "";
                    }
                },
            },{
                title: '是否试用',
                dataIndex: 'iftrail',
                key: 'iftrail',
                render: text =>{return text?'是':'否'},
            }, {
                title: '所在位置',
                dataIndex: 'lng',
                key: 'lng',
                render: (text, record) => {
                    return (
                        <div>
                            <p><span>{record.lng}</span><span style={{display: text ? "inline-block" : "none"}}>,</span><span>{record.lat}</span>
                            </p>
                            <p>{record.location}</p>
                        </div>
                    )
                }
            }, {
                title: '绑定日期',
                dataIndex: 'biddingdate',
                key: 'biddingdate',
                sorter: (a, b) => Date.parse(a.biddingdate) - Date.parse(b.biddingdate),
                sortDirections: ['descend', 'ascend'],
            }, {
                title: '最后一次报警',
                dataIndex: 'lasttime',
                key: 'lasttime',
                sorter: (a, b) => Date.parse(a.lasttime) - Date.parse(b.lasttime),
                sortDirections: ['descend', 'ascend'],
            }, {
                title: '安装人员',
                dataIndex: 'installmen',
                key: 'installmen',
            }, {
                title: '责任销售',
                dataIndex: 'salemen',
                key: 'salemen',
            }, {
                title: '操作',
                dataIndex: 'estatus',
                key: 'opt',
                render: (text, record, index) => {
                    if (text) {
                        return (
                            <span>
                              {/*  <Button onClick={() => {this.showModalEdit(record.code,index)}}>编辑</Button>*/}
                                <Button onClick={() => this.upLatitude(record, index)}>编辑</Button>
                                 <Button><a href={"#/app/teamacc/lookAlarm?cid=" + record.cid}>查看报警</a></Button>
                                <Button onClick={() => this.showModaldelete(record.code, index)} style={{display:record.estatus==1?"none":"block"}}>删除</Button>

                            </span>
                        )
                    } else {
                        return (
                            <span>
                                <Button onClick={() => this.showModaldelete(record.code, index)} style={{display:record.estatus==1?"none":"block"}}>删除</Button>
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
                        <Form layout="inline" onSubmit={this.selectopt}>
                            <FormItem label="设备编号">
                                <Input onBlur={this.hanleCode} />
                            </FormItem>
                            <FormItem label="状态">
                                <Select style={{width: 120}} defaultValue="5" onChange={this.handleSelect}>
                                    <Option value="5">所有</Option>
                                    <Option value="0">未使用</Option>
                                    <Option value="1">使用中</Option>
                                    <Option value="2">报修中</Option>
                                    <Option value="9001">服务已过期</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="所属用户">
                                 <Input onBlur={this.hanleUser} />
                            </FormItem>
                            <FormItem>
                                <Button onClick={this.selectopt} type="primary">
                                    查询
                                </Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
                <Table columns={columns} dataSource={this.state.list} bordered={true}
                       pagination={{
                           defaultPageSize: 10,
                           current: this.state.page,
                           total: this.state.total,
                           onChange: this.changePage,
                           hideOnSinglePage: true
                       }}
                       rowKey={record => record.code}
                />
                <Modal title="编辑" visible={this.state.visible} onOk={this.handleCreate}
                       onCancel={this.handleCancel}
                >
                    <label>状态 </label>
                    <Select defaultValue={this.state.editstate} style={{width: 300}} onChange={this.handleChange}>
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
                <Modal title="修改" visible={this.state.longitude} onOk={this.longitudeOk}
                       onCancel={this.longitudeCancel}
                       width={450}
                       okText="确认"
                       cancelText="取消"
                >
                    <Form >
                    <Row>
                        <Col>
                            <FormItem label="经度" {...formItemLayout}>
                                {getFieldDecorator('lng',{
                                    rules:[{
                                        required:true,
                                        message: '经度不能为空!'
                                    },{
                                        pattern: new RegExp(/^\d+(\.\d+)?$/),
                                        message: '请输入整数或者小数'
                                    }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col>
                            <Form.Item label="纬度"{...formItemLayout} >
                                {getFieldDecorator('lat',{
                                    rules:[{
                                        required:true,
                                        message: '纬度不能为空!'
                                    },{
                                        pattern: new RegExp(/^\d+(\.\d+)?$/),
                                        message: '请输入整数或者小数!'
                                    }],
                                })(
                                    <Input />
                                )}
                            </Form.Item>
                        </Col>
                        <Col>
                            <FormItem label="所在区域" {...formItemLayout} style={{display:this.state.filedInput===false?"none":"block"}}>
                                {getFieldDecorator('filedlocation')(
                                    <Input disabled />
                                )}
                            </FormItem>
                            <div onClick={this.hanleFiled} style={{position: "absolute",right: "0%",top: "27%",color:"#0099FF",cursor:"pointer",display:this.state.filedInput===false?"none":"block"}}>修改</div>
                            <FormItem label="所在区域" {...formItemLayout} style={{display:this.state.filed===true?"block":"none"}}>
                                <CascaderModule onRef={this.hanleonRef} />
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="详细地址"{...formItemLayout}>
                                {getFieldDecorator('location',{
                                    rules: [{ required: false, message: '详细地址不能为空!' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="安装人"{...formItemLayout}>
                                {getFieldDecorator('installmen', {
                                    rules: [{ required: false, message: '请输入姓名!' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="安装电话" {...formItemLayout}>
                                {getFieldDecorator('installtel', {
                                    rules:[{
                                        required:false,
                                        pattern: new RegExp("^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$|^0\\d{2,3}-?\\d{7,8}$"),
                                        message: '请输入正确的手机号'
                                    }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="责任销售"{...formItemLayout}>
                                {getFieldDecorator('salemen', {
                                    rules: [{ required: false, message: '请输入姓名!' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="销售电话"{...formItemLayout}>
                                {getFieldDecorator('saletel', {
                                    rules:[{
                                        required:false,
                                        pattern: new RegExp("^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$|^0\\d{2,3}-?\\d{7,8}$"),
                                        message: '请输入正确的手机号'
                                    }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                    </Row>

                </Form>
                </Modal>
            </div>
        )
    }
}
export default Teamdeveice = Form.create()(Teamdeveice);
