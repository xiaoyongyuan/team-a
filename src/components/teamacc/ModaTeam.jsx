import React, { Component } from 'react';
import {Form,Input,Radio,DatePicker} from 'antd';
import {post} from "../../axios/tools";
import moment from 'moment';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class ModaBianhao extends Component {
    constructor(props){
        super(props);
        this.state={
            visible:props.visible || false,
            form:false,
        };
    }

    componentDidMount() {
        //编辑  数据回填
        this.setState({
            code:this.props.code,
        },()=>{
            this.requestdata()
        });
        console.log("this.props.code",this.props.code)
    }
    componentDidUpdate = () => {
        if(this.props.code && this.props.code!=this.state.code){
            this.setState({
                code:this.props.code
            }, () => {this.requestdata()});
        }
    }
    requestdata=(params) => {//取数据
         console.log("this.state.code",this.state.code)
        if(this.state.code){
            post({url:"/api/company/getone",data:{comid:this.state.code} }, (res)=>{
                console.log("111333",typeof (res.data.ctype))
                this.props.form.setFieldsValue({
                    cname: res.data.cname,
                    adminname:res.data.adminname,
                    adminaccount:res.data.adminaccount,
                    ctype: res.data.ctype.toString(),//类型
                    clng: res.data.clng,
                    clat: res.data.clat,
                     cloudvaliddate:moment(res.data.cloudvaliddate),//日期
                    memo: res.data.memo,

                });
            })
        }
    }

    formref = () => { //将form传给父组件由父组件控制表单提交
        // const aa=this.props.form.getFieldsValue();
        return this.props.form;
    };

    render() {
        function onChange(date, dateString) {
            console.log(date, dateString);
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="vertical" onSubmit={this.handleSubmit}>
                <div>
                <FormItem label="名称">
                    {getFieldDecorator('cname', {
                        rules: [{ required: true, message: '请输入名称!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                    <FormItem label="联系人">
                        {getFieldDecorator('adminname', {
                            rules: [{ required: true, message: '请输入联系人!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="联系人手机号">
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
                    <FormItem label="用户类型">
                        {getFieldDecorator('ctype', {
                            initialValue: "4",
                            rules: [{ required: true, message: '请输入用户类型!' }],
                        })(
                            <RadioGroup onChange={this.onChange_radio}>
                                <Radio value="5">局域网个人用户</Radio>
                                <Radio value="4">树莓派企业用户</Radio>
                                <Radio value="3">树莓派个人用户</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem label="经度">
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
                    <FormItem label="纬度">
                        {getFieldDecorator('clat', {
                            rules: [{ required: true, message: '请输入经度/只能输入数字!',
                                pattern: new RegExp(/^\d*\.{0,6}\d{0,6}$/, "g"),
                            }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="云服务到期日期">
                        {getFieldDecorator('cloudvaliddate', {
                            rules: [{ required: false, message: '请输入云服务到期日期!' }],
                        })(
                            <DatePicker onChange={onChange} />
                        )}
                    </FormItem>
                    <FormItem label="备注">
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