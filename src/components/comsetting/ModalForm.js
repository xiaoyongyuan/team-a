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
            value:1,
        };
    }
    componentDidMount() {
        //编辑  数据回填
        this.setState({
            code:this.props.code,
            zh:this.props.zh,
        },()=>{
            console.log('*record.accound',this.state.zh);
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
            post({url:"/api/userworker/getone",data:{code:this.state.code,zh:this.state.zh,user:'admin'} }, (res)=>{

                    this.props.form.setFieldsValue({
                    realname: `${res.data.realname}`,
                    account: `${res.data.account}`,
                    emailaddress: `${res.data.emailaddress}`,
                    });
            })
           
        }
    }
    onChangeradio = (e) => {
        console.log('radio checked', e.target.value);
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
              sm: { span: 6 },
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
                    <FormItem label="账号(手机号)"{...formItemLayout}>
                        {getFieldDecorator('account', {
                            rules: [{
                                required: true, message: '请输入合法的手机号!',
                                pattern: new RegExp(/^1(3|4|5|7|8)\d{9}$/, "g"),
                            }],
                        })(
                            <Input disabled={_this.state.code?true:false} />
                        )}
                    </FormItem>
                </Col>
                <Col>
                    <FormItem label="工号"{...formItemLayout}>
                        {getFieldDecorator('job_number', {
                            rules: [{
                                required: false, message: '请输入工号!',
                              
                            }],
                        })(
                            <Input type="number" />
                        )}
                    </FormItem>
                </Col>
                <Col>
                    <Row>
                        <Col xs={24} sm={6} style={{textAlign:'right',marginBottom:'20px'}}><label>权限：</label></Col>
                        <Col xs={24} sm={18}><RadioGroup onChange={this.onChangeradio} value={this.state.value}>
                            <Radio value={1}>管理员</Radio>
                            <Radio value={2}>组长</Radio>
                            <Radio value={3}>值守人员</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
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