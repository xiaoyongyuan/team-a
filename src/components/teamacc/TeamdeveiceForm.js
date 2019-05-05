import React, { Component } from 'react';
import {Form,Input,Row,Col } from 'antd';
import {post} from "../../axios/tools";
const FormItem = Form.Item;
let vis=false;
class TeamdeveiceForm extends Component {
    constructor(props){
        super(props);
        this.state={

        };
    }
    componentDidMount() {
        this.setState({
            changeCode:this.props.changeCode
        },()=>{
            this.getOne();
        })
    }
    componentWillReceiveProps(nextProps){
        if( nextProps.longitude !== vis){
            vis=nextProps.longitude;
            if(nextProps.longitude){
                this.setState({
                    changeCode:nextProps.changeCode,
                }, () => {
                    this.getOne()
                });
            }
        }
    }
    getOne=()=>{
        if(this.state.changeCode){
            const datas={
                code:this.state.changeCode,
            };
            post({url:"/api/equipment/getone",data:datas},(res)=>{
                if(res.success){
                    this.props.form.setFieldsValue({
                        lng:res.data.lng,
                        lat:res.data.lat,
                        location:res.data.location
                    });
                }
            })
        }
    }
    formref = () => { //将form传给父组件由父组件控制表单提交
        return this.props.form;
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
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
                        <FormItem label="经度" {...formItemLayout}>
                            {getFieldDecorator('lng',{
                                rules:[{
                                    required:false,
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
                                    required:false,
                                    pattern: new RegExp(/^\d+(\.\d+)?$/),
                                    message: '请输入整数或者小数'
                                }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                    </Col>
                    <Col>
                        <FormItem label="所在区域" {...formItemLayout}>
                            {getFieldDecorator('filed')(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="详细地址"{...formItemLayout}>
                            {getFieldDecorator('location')(
                                <textarea  style={{width:"100%",height:"80px",border:"1px solid #D9D9D9",borderRadius:"4px"}} />
                            )}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="安装人"{...formItemLayout}>
                            {getFieldDecorator('memo', {
                                rules: [{ required: false, message: '请输入姓名!' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="安装人电话" {...formItemLayout}>
                            {getFieldDecorator('iphone', {
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
                            {getFieldDecorator('iphone', {
                                rules: [{ required: false, message: '请输入姓名!' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="销售电话"{...formItemLayout}>
                            {getFieldDecorator('iphone', {
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
        )
    }
}
export default TeamdeveiceForm=Form.create()(TeamdeveiceForm)