/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import "../../style/sjg/home.css";
import {
  Card,
  Form,
  Input,
  Row,
  Col,
  Button,
  Upload,
  Icon,
  message
} from "antd";
import { post } from "../../axios/tools";
import BreadcrumbCustom from "../BreadcrumbCustom";
const FormItem = Form.Item;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === "image/jpeg" || "image/png";
  if (!isJPG) {
    message.error("You can only upload JPG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJPG && isLt2M;
}

class Auditing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      loading: false
    };
    this.jumpPage = this.jumpPage.bind(this);
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
      if (this.state.imageUrl) {
        post(
          {
            url: "/api/rollcall/handle",
            data: {
              code: this.state.code,
              rhandle: 1,
              picurl: this.state.imageUrl
            }
          },
          res => {}
        );
      }
    });
    this.context.router.history.push("/app/teamacc/callalram");
  };
  componentWillMount() {
    this.setState({
      code: this.props.query.code
    });
  }
  componentDidMount() {
    post(
      { url: "/api/rollcall/getone_maintain", data: { code: this.state.code } },
      res => {
        if (res.success) {
          this.props.form.setFieldsValue({
            qpplyname: res.data.cameraname, //用户名
            cameraname: res.data.cameraname
          });
          const furl = res.data.basepic;
          const regs = furl.substring(furl.indexOf("?"));
          const downpic = furl.replace(regs, "");
          this.setState({
            areapic: res.data.basepic,
            downpic
          });
        }
      }
    );
  }

  componentDidUpdate() {}
  handleChange = info => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false
        })
      );
    }
  };
  jumpPage = () => {
    this.context.router.history.push("/app/teamacc/callalram");
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 14,
          offset: 8
        }
      }
    };
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "plus"} />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    const updata = {
      code: this.state.code,
      rhandle: 1
    };
    return (
      <div className="gutter-example">
        <BreadcrumbCustom first="维护团队管理" second="点名审核" />
        <Row className="white">
          <Col className="gutter-row" span={10}>
            <div className="gutter-box">
              <Card title="" bordered={false}>
                <Form onSubmit={this.handleSubmit}>
                  <FormItem {...formItemLayout} label="摄像头IP">
                    {getFieldDecorator("cameraname", {
                      rules: [
                        {
                          required: true,
                          message: "请输入摄像头IP",
                          whitespace: true
                        }
                      ]
                    })(<Input disabled />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="用户名">
                    {getFieldDecorator("qpplyname", {
                      rules: [
                        {
                          required: true,
                          message: "请输入用户名",
                          whitespace: true
                        }
                      ]
                    })(<Input disabled />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="区域">
                    <div
                      className="area"
                      style={{
                        width: "300px",
                        background: `url(${
                          this.state.areapic
                        }) no-repeat center/cover `,
                        position: "relative"
                      }}
                    >
                      <Button
                        type="primary"
                        size="large"
                        href={this.state.downpic}
                        download
                        style={{
                          position: "absolute",
                          right: "-30%",
                          top: "40%"
                        }}
                      >
                        下载
                      </Button>
                    </div>
                  </FormItem>
                  <FormItem {...formItemLayout} label="上传图片">
                    <div className="upload">
                      <Upload
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        multiple={false}
                        action="/api/rollcall/handle"
                        data={updata}
                        // customRequest={this.handleUpload}
                        onChange={this.handleChange}
                        beforeUpload={beforeUpload}
                      >
                        {imageUrl ? (
                          <img src={imageUrl} alt="avatar" />
                        ) : (
                          uploadButton
                        )}
                      </Upload>
                    </div>
                  </FormItem>
                  <FormItem {...tailFormItemLayout}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      disabled={this.state.imageUrl ? false : true}
                    >
                      提交并通过
                    </Button>
                    <Button type="primary" size="large" onClick={this.jumpPage}>
                      不通过
                    </Button>
                  </FormItem>
                </Form>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default (Auditing = Form.create()(Auditing));
