import React, { Component } from 'react';
import {Form,Input,Radio,DatePicker,Checkbox ,Upload, message, Button, Icon, } from 'antd';
import {post} from "../../axios/tools";
import moment from 'moment';
import '../../style/sjg/home.css';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
let vis=false;
class ModaBianhao extends Component {
    constructor(props){
        super(props);
        this.state={
            visible:props.visible || false,
            form:false,
            istrue:true
        };
    }

    componentDidMount() {
        let plainOptions = [];
        post({url:"/api//servicetype/getsinfo"}, (res)=>{
            if(res.success){
                if(res.data.length){
                    res.data.map((el)=>{
                        let objs={
                           label: el.name,
                           value: el.name,
                        };
                        plainOptions.push(objs);
                        return "";
                    });
                    this.setState({
                        plainOptions
                    })
                }
            }
        })

        //编辑  数据回填
        this.setState({
            code:this.props.code,
        },()=>{
            this.requestdata()
        });
    }
    componentWillReceiveProps(nextProps){
        if( nextProps.visible !== vis){
            vis=nextProps.visible;
            if(nextProps.visible){
                vis=nextProps.visible;
                this.setState({
                    code:nextProps.code,
                },()=>{
                    this.requestdata()
                });
            }
        }

    }
    requestdata=(params) => {//取数据
        this.props.form.setFieldsValue({
            opening:['围界入侵']
        });
        if(this.state.code){
            post({url:"/api/company/getone",data:{comid:this.state.code} }, (res)=>{
                let istrue=true;
                res.data.ctype === 4? istrue=true:istrue=false
                this.setState({
                    istrue:istrue
                });
                this.props.form.setFieldsValue({
                    opening:res.data.servicetype.split(','),
                    cname: res.data.cname,
                    adminname:res.data.adminname,
                    adminaccount:res.data.adminaccount,
                    ctype: res.data.ctype.toString(),//类型
                    clng: res.data.clng,
                    clat: res.data.clat,
                    cloudvaliddate:res.data.cloudvaliddate?moment(res.data.cloudvaliddate):undefined,//日期
                    memo: res.data.memo,
                });
            })
        }
    }

    formref = () => { //将form传给父组件由父组件控制表单提交
        return this.props.form;
    };




    render() {
        const CheckboxGroup = Checkbox.Group;
        const _this=this;
        function onChangecheck(checkedValues) {
            console.log('checked = ', checkedValues);
        }
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 15 },
            },
        };
        function onChangeD(date, dateString) {
            console.log(date, dateString);
        }
        const { getFieldDecorator } = this.props.form;
        const props = {
            name: 'file',
            action: '//jsonplaceholder.typicode.com/posts/',
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };
        return (
            <Form layout="vertical" onSubmit={this.handleSubmit} className="modaTeam">
                <div>
                <FormItem label="名称" {...formItemLayout}>
                    {getFieldDecorator('cname', {
                        rules: [{ required: true, message: '请输入名称!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                    <FormItem label="联系人" {...formItemLayout}>
                        {getFieldDecorator('adminname', {
                            rules: [{ required: true, message: '请输入联系人!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="手机号" {...formItemLayout}>
                        {getFieldDecorator('adminaccount', {
                            rules: [{
                            required: true, message: '请输入有效手机号!' ,
                            pattern: new RegExp(/^1(3|4|5|7|8)\d{9}$/, "g"),
                        }],
                            initialValue:''
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="用户类型" {...formItemLayout}>
                        {getFieldDecorator('ctype', {
                            initialValue: "4",
                            rules: [{ required: true, message: '请输入用户类型!' }],
                        })(
                            <RadioGroup disabled onChange={this.onChange_radio}>
                                <Radio value="5">局域网企业用户</Radio>
                                <Radio value="4">树莓派企业用户</Radio>
                                <Radio value="3">树莓派个人用户</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem label="开通功能" {...formItemLayout}>
                        {getFieldDecorator('opening', {
                            rules: [{ required: true}],
                        })(
                            <CheckboxGroup disabled={!this.state.istrue} options={_this.state.plainOptions} onChange={onChangecheck} />
                        )}
                    </FormItem>
                    <div style={{display:this.state.istrue?"block":"none"}}>
                        <FormItem label="场景" {...formItemLayout} className="scene">
                            {getFieldDecorator('scene', {
                                initialValue: "",
                                rules: [{ required: false, message: '请上传图片!' }],
                            })(
                                <Upload {...props}>
                                    <Button>
                                        <Icon type="upload" /> 上传
                                    </Button>
                                </Upload>,
                            )}
                        </FormItem>
                    </div>
                    <FormItem label="经度" {...formItemLayout}>
                        {getFieldDecorator('clng', {
                            rules: [{
                                required: true, message: '请输入经度/只能输入数字',
                                pattern: new RegExp( /^\d*\.{0,6}\d{0,6}$/, "g"),
                            }],
                            initialValue:''
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="纬度" {...formItemLayout}>
                        {getFieldDecorator('clat', {
                            rules: [{ required: true, message: '请输入经度/只能输入数字!',
                                pattern: new RegExp(/^\d*\.{0,6}\d{0,6}$/, "g"),
                            }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="云服务到期日期" {...formItemLayout}>
                        {getFieldDecorator('cloudvaliddate', {
                            rules: [{ required: false, message: '请输入云服务到期日期!' }],
                        })(
                            <DatePicker onChange={onChangeD} />
                        )}
                    </FormItem>
                    <FormItem label="备注" {...formItemLayout} className="scene">
                        {getFieldDecorator('memo', {
                            rules: [{ required:false, message: '请输入备注!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                </div>

        </Form>
        )
    }
}

export default ModaBianhao = Form.create({})(ModaBianhao);