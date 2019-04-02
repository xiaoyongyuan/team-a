import React, { Component } from 'react';
import {Select,Form,Input,Radio,Row,Col } from 'antd';
import {post} from "../../axios/tools";
const FormItem = Form.Item;
let vis=false;
const RadioGroup = Radio.Group;
const Option = Select.Option;
class ModalForm extends Component {
    constructor(props){
        super(props);
        this.state={
            visible:props.visible || false,
            form:false,
            roles:[{rolename:'admin'}]
          };
    }
    componentDidMount() {
        //编辑  数据回填
        this.setState({
            code:this.props.code,
            account:this.props.account,
        },()=>{
            this.requestdata()
            this.userroles()
        });
    }

    componentWillReceiveProps(nextProps){
        if( nextProps.visible !== vis){
            vis=nextProps.visible;
            if(nextProps.visible){
                this.setState({
                    code:nextProps.code,
                    account:nextProps.account,
                }, () => {
                    this.requestdata()});
            }
        }
    }
    userroles =()=>{
        post({url:"/api/userroles/getlist"}, (res)=>{
            if(res.success){
                this.setState({
                    roles:res.data
                })  
            } 
        })
    }
    requestdata=() => {//取数据
        if(this.state.code){
            const data={
                code:this.state.code,
                account:this.state.account,
                user:'admin'
            }
            post({url:"/api/userworker/getone",data:data }, (res)=>{
                    this.props.form.setFieldsValue({
                        usergender:res.data.usergender,//性别
                        realname: res.data.realname,//姓名
                        account: res.data.account,//账号
                        emailaddress: res.data.emailaddress,//邮箱
                        job_number: res.data.job_number,//工号
                        memo: res.data.memo,//备注
                        userpower:res.data.userpower,//类型
                    });
            })
        }
    }
    onChangeradio = (e) => {
        this.setState({
          value: e.target.value,
        });
      }
    formquanxian = () => { //将form传给父组件由父组件控制表单提交
        return this.state.value;
    };

    formref = () => { //将form传给父组件由父组件控制表单提交
        return this.props.form;
    };
    render() {
        const _this=this;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 18 },
            },
          };
          
        return (
            <Form onSubmit={this.handleSubmit}>
              <Row>
                  <Col>
                    <FormItem label="姓名" {...formItemLayout}>
                        {getFieldDecorator('realname', {
                            rules: [{ required: true, message: '请输入姓名!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                 </Col>
                <Col>
                    <Form.Item label="性别"{...formItemLayout} >
                        {getFieldDecorator('usergender',{
                            initialValue:"",
                        } )(
                            <Select style={{ width: 120 }}>
                                <Option value="0" >女</Option>
                                <Option value="1" >男</Option>
                            </Select>
                        )}
                    </Form.Item>
                </Col>
                <Col>
                    <FormItem label="账号" {...formItemLayout}>
                        {getFieldDecorator('account')(
                            <Input disabled={_this.state.code?true:false} />
                        )}
                    </FormItem>
                </Col>
                <Col>
                    <FormItem label="权限"{...formItemLayout}>
                        {getFieldDecorator('userpower', {
                            initialValue: _this.state.roles[0].rolename,
                            rules: [{ required: true }],
                        })(
                            <RadioGroup onChange={this.onChangeradio}>
                            {this.state.roles.map(function(item,index){
                                return(
                                    <Radio value={item.rolename}>{item.roledescribe}</Radio>
                                )
                            })}
                            </RadioGroup>
                        )}
                    </FormItem>
                </Col>
                <Col>
                    <FormItem label="邮箱"{...formItemLayout}>
                        {getFieldDecorator('emailaddress', {
                            rules: [{
                                required: false, message: '请输入正确的邮箱!',
                                pattern: new RegExp(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/, "g")
                            }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>
                <Col>
                    <FormItem label="备注"{...formItemLayout}>
                        {getFieldDecorator('memo', {
                            rules: [{ required: false, message: '请输入姓名!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>
              </Row>
                
            </Form>
        )
    }
}
export default ModalForm = Form.create({})(ModalForm);