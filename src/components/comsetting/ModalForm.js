import React, { Component } from 'react';
import {Form,Input,} from 'antd';
import {post} from "../../axios/tools";
const FormItem = Form.Item;
let vis=false;
class ModalForm extends Component {
    constructor(props){
        super(props);
        this.state={
            visible:props.visible || false,
            form:false
        };
    }
    componentDidMount() {
        //编辑  数据回填
        this.setState({
            code:this.props.code
        },()=>{
            this.requestdata()
        });
    }
    componentWillReceiveProps(nextProps){
        if( nextProps.visible != vis){
            vis=nextProps.visible;
            if(nextProps.visible){
                vis=nextProps.visible;
                this.setState({
                    code:nextProps.code
                }, () => {
                    this.requestdata()});
            }
        }
             
    }

    requestdata=() => {//取数据
        if(this.state.code){
            post({url:"/api/companyuser/getone",data:{code:this.state.code} }, (res)=>{
                    this.props.form.setFieldsValue({
                    realname: `${res.data.realname}`,
                    account: `${res.data.account}`,
                    emailaddress: `${res.data.emailaddress}`,
                    });
            })
           
        }
    }
    formref = () => { //将form传给父组件由父组件控制表单提交
        return this.props.form;
    };
    render() {
        const _this=this;
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="vertical" onSubmit={this.handleSubmit}>
                <FormItem label="账号(手机号)">
                    {getFieldDecorator('account', {
                        rules: [{
                            required: true, message: '请输入合法的手机号!',
                            pattern: new RegExp(/^1(3|4|5|7|8)\d{9}$/, "g"),
                        }],
                    })(
                        <Input disabled={_this.state.code?true:false} />
                    )}
                </FormItem>
                <FormItem label="姓名">
                    {getFieldDecorator('realname', {
                        rules: [{ required: true, message: '请输入姓名!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem label="邮箱">
                    {getFieldDecorator('emailaddress', {
                        rules: [{
                            required: false, message: '请输入正确的邮箱!',
                            pattern: new RegExp(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/, "g")
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
            </Form>
        )
    }
}
export default ModalForm = Form.create({})(ModalForm);