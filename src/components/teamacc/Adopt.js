
import React, { Component } from 'react';
import '../../style/sjg/home.css';
import { Card, Form, Input, Row, Col, Button,Upload, message, Icon, } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import axios from 'axios';
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
    // state = {
    //     confirmDirty: false,
    //     list:[],
    // };
    constructor(props) {
        super(props);
        this.state = {
            list:[],
            confirmDirty: false,
            isDeal: false
        };
    }
    componentDidMount(e) {
        this.setState({
        })
        //取数据
       console.log(e);
        this.requestdata();
    }
    requestdata=(params) => {//取数据
        axios.get("table.json",params)
            .then((res)=>{
            if(res.data.success){
                console.log(res.data.data);
                this.setState({
                    list: res.data.data
                })
            }
        })
    }

    // requestdata = () => {
    //     if(this.state.code){
    //         axios.get("table.json").then((res)=>{
    //             if(res.data.success){
    //                 console.log(res.data.data);
    //                 this.setState({
    //                     name: res.data.data.name,
    //                     type: res.data.data.type,
    //                     binding: res.data.data.binding,
    //                     deveui: res.data.data.deveui,
    //                     teamname: res.data.data.teamname,
    //
    //
    //                 })
    //
    //             }
    //         })
    //     }
    // };


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
                                        label="摄像头IP"
                                        hasFeedback
                                    >
                                        {getFieldDecorator('IP', {
                                            rules: [{required: true, message: '请输入摄像头IP',whitespace: true}],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="用户名"
                                        hasFeedback
                                    >
                                        {getFieldDecorator('用户名', {
                                            rules: [{required: true, message: '请输入用户名',whitespace: true}],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="审核结果"
                                        hasFeedback
                                    >
                                        {getFieldDecorator('审核结果', {
                                            rules: [{required: true,whitespace: true}],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>

                                    <Row className="area_row">
                                        <Col span={3} offset={5} className="area_text">
                                            区域：
                                        </Col>
                                        <Col span={10}>
                                            <div className="area">
                                                <img alt="2" src="../../style/logo.png" />
                                            </div>
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
                                    <Row className="area_row">
                                        <Col span={4} offset={10} className="area_text">
                                            <Button type="primary" size="large">返回</Button>
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
