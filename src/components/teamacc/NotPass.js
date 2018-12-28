/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { Component } from 'react';
import '../../style/sjg/home.css';
import { Card, Form, Input, Row, Col, Button } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
const FormItem = Form.Item;
class NotPass extends Component {
    state = {
        confirmDirty: false,
    };
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
                                            <Input value="不通过" />
                                        )}
                                    </FormItem>

                                    <Row className="area_row">
                                        <Col span={3} offset={5} className="area_text">
                                            区域：
                                        </Col>
                                        <Col span={10}>
                                            <div className="area">
                                                <img src="../../style/logo.png" />
                                            </div>
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

const BasicForm = Form.create()(NotPass);

export default BasicForm;