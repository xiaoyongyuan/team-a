
import React, { Component } from 'react';
import '../../style/sjg/home.css';
import { Card, Form, Input, Row, Col, Button,Upload, message, Icon, } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import {post} from "../../axios/tools";
import nopic from "../../style/imgs/nopic.png";
const FormItem = Form.Item;
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

class Adopt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            imgsrc:nopic,
            present:[]
        };
    }
    componentWillMount(){
        this.setState({
            code:this.props.query.code
        })
    }
    componentDidMount(){
        const _this=this;
        post({url:"/api/rollcall/getone_maintain",data:{code:this.state.code}}, (res)=>{
            if(res.success){
                _this.props.form.setFieldsValue({
                    qpplyname: res.data.cameraname, //用户名
                    rname: res.data.rname, //对象名
                    applydate: res.data.applydate, 
                    cameraname: res.data.cameraname, 
                    rhandle: res.data.rhandle,   //处理结果                           
                });
                _this.setState({
                    imgsrc: res.data.basepic, //图片
                    present: JSON.parse(res.data.rzone), //区域   
                },()=>{
                   this.draw() 
                })
            }
        })
        this.setState({
        })
    }
    draw = () => { //绘制区域
        let item=this.state.present;
        console.log('itemitem',item)
        if(item.length){
            let ele = document.getElementById("time_graph_canvas");
            let area = ele.getContext("2d");
            area.strokeStyle='#ff0';
            area.lineWidth=3;
            area.beginPath();
            area.moveTo(item[0][0],item[0][1]);
            item.map((elx,i)=>{
                if(i>0){
                   area.lineTo(item[i][0],item[i][1]);
                   if(i===3){
                   area.lineTo(item[0][0],item[0][1]);
                   } 
                   area.stroke();
                }
            }) 
        }
        
    }
    cancelhandle=()=>{ //不通过
        const _this=this;
        post({url:"/api/rollcall/handle",data:{code:this.state.code,rhandle:2}}, (res)=>{
            if(res.success){
                message.success('设置成功',2,function(){
                    _this.props.history.go(-1);
               });
            }
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };


        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="维护团队管理" second="点名审核" />

                <Row className="white">
                    <Col className="gutter-row" span={10}>
                        <div className="gutter-box">
                            <Card title="" bordered={false}>
                                <Form onSubmit={this.handleSubmit}>
                                    
                                    <FormItem
                                        {...formItemLayout}
                                        label="用户名"
                                        hasFeedback
                                    >
                                        {getFieldDecorator('qpplyname', {
                                            rules: [{required: true, message: '请输入用户名',whitespace: true}],
                                        })(
                                            <Input disabled />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="摄像头"
                                        hasFeedback
                                    >
                                        {getFieldDecorator('cameraname', {
                                            rules: [{required: true, message: '请输入摄像头IP',whitespace: true}],
                                        })(
                                            <Input disabled />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="对象名"
                                        hasFeedback
                                    >
                                        {getFieldDecorator('rname', {
                                            rules: [{required: true, message: '请输入摄像头IP',whitespace: true}],
                                        })(
                                            <Input disabled />
                                        )}
                                    </FormItem>
                                    <Row className="area_row">
                                        <Col span={3} offset={5} className="area_text">
                                            区域：
                                        </Col>
                                        <Col span={10}>
                                            <canvas id="time_graph_canvas" width="704px" height="576px" style={{backgroundImage:'url('+this.state.imgsrc+')',backgroundSize:'100% 100%'}} onClick={this.clickgetcorrd} onMouseMove={this.drawmove} />
                                        </Col>
                                    </Row>           
                                    
                                    <Row className="area_row">
                                        <Col span={4} offset={4} className="area_text">
                                            对象图：
                                        </Col>
                                        <Col span={10}>
                                            <div className="area">
                                                <img alt="3" src="../../style/logo.png" />
                                            </div>
                                        </Col>
                                        <Col xl={6} offset={4}>
                                            <Upload {...props}>
                                                <Button>
                                                    <Icon type="upload" /> Click to Upload
                                                </Button>
                                            </Upload>
                                        </Col>
                                    </Row>
                                    <FormItem
                                        {...formItemLayout}
                                        label="审核结果"
                                        hasFeedback
                                    >
                                        {getFieldDecorator('rhandle', {
                                            rules: [{required: true,whitespace: true}],
                                        })(
                                            <Input disabled />
                                        )}
                                    </FormItem>
                                    <Row>
                                        <Col span={8} offset={16}>
                                            <Button type="primary" htmlType="submit" className="login-form-button" >上传对象图</Button>
                                            <Button style={{display:"inline-block"}} onClick={this.cancelhandle}>不通过</Button>
                                        </Col>
                                    </Row>

                                </Form>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

}
export default Adopt= Form.create()(Adopt);
