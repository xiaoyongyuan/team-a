/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { Component } from "react";
import "../../style/sjg/home.css";
import nopic from "../../style/imgs/nopic.png";
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
  const isJPG = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJPG) {
    message.error("只允许上传jpg或png!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("上传图片不能大于2M!");
  }
  return isJPG && isLt2M;
}

class Auditing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      loading: false,
      imgsrc: nopic,
      present: [],
      notpic: false
    };
    this.jumpPage = this.jumpPage.bind(this);
  }

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
          res => {
            if (res.success === 1) {
              message.success("审核通过");
              setTimeout(() => {
                window.location.href = "#/app/teamacc/callalram";
              }, 1000);
            }
          }
        );
      }
    });
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
          this.setState(
            {
              // areapic: res.data.basepic,
              imgsrc: res.data.basepic, //图片
              present: JSON.parse(res.data.rzone), //区域

              downpic
            },
            () => {
              this.draw();
            }
          );
        }
      }
    );
  }
  draw = () => {
    //绘制区域
    let item = this.state.present;
    if (item.length) {
      let ele = document.getElementById("time_graph_canvas");
      let area = ele.getContext("2d");
      area.strokeStyle = "#ff0";
      area.lineWidth = 3;
      area.beginPath();
      area.moveTo(item[0][0], item[0][1]);
      item.map((elx, i) => {
        if (i > 0) {
          area.lineTo(item[i][0], item[i][1]);
          if (i === 3) {
            area.lineTo(item[0][0], item[0][1]);
          }
          area.stroke();
        }
        return "";
      });
    }
  };
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
    if (info.file.type !== "image/jpeg" || info.file.type !== "image/png") {
      this.setState({
        notpic: true
      });
    }
  };
  jumpPage = () => {
    post(
      {
        url: "/api/rollcall/handle",
        data: {
          code: this.state.code,
          rhandle: 2
        }
      },
      res => {
        if (res.success === 1) {
          message.error("审核不通过");
          setTimeout(() => {
            window.location.href = "#/app/teamacc/callalram";
          }, 1000);
        }
      }
    );
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
        {this.state.notpic ? (
          <Icon type="exclamation-circle" />
        ) : (
          <Icon type={this.state.loading ? "loading" : "plus"} />
        )}
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
                    <canvas
                      id="time_graph_canvas"
                      width="704px"
                      height="576px"
                      style={{
                        backgroundImage: "url(" + this.state.imgsrc + ")",
                        backgroundSize: "100% 100%",
                        position: "relative"
                      }}
                    />
                    <Button
                      type="primary"
                      href={this.state.imgsrc}
                      target="_blank"
                      download
                    >
                      查看原图
                    </Button>
                  </FormItem>
                  <FormItem {...formItemLayout} label="上传图片">
                    <div
                      className="upload"
                      style={{
                        width: "200px",
                        height: "200px"
                        // maxHeight: "260px"
                        // overflow: "hidden"
                      }}
                    >
                      <Upload
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        multiple={false}
                        action="/api/rollcall/handle"
                        data={updata}
                        onChange={this.handleChange}
                        beforeUpload={beforeUpload}
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt=""
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "inline-block"
                            }}
                          />
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
