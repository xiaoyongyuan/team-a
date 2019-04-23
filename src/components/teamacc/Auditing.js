/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { Component } from "react";
import { crossjsonP } from "../../axios/tools";
import reqwest from "reqwest";
import "whatwg-fetch";
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

import BreadcrumbCustom from "../BreadcrumbCustom";
const FormItem = Form.Item;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
const upprops = {
  onStart(file) {
    console.log("onStart", file, file.name);
  },
  onSuccess(ret) {
    console.log("onSuccess", ret);
  },
  onError(err) {
    console.log("onError", err);
  },
  beforeUpload(file) {
    const isJPG = file.type === "image/jpeg";
    if (!isJPG) {
      message.error("You can only upload JPG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJPG && isLt2M;
  }
};
const handsbu = ev => {
  ev.preventDefault();
};
class Auditing extends Component {
  state = {
    // confirmDirty: false
    loading: false
  };
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
  handleUpload = option => {
    // crossjsonP({ url: "/var/www/html/jtl_api/upload/cs" }, res => {
    //   // console.log("++++++++++++==================______________", res);
    // });
    // const formData = new FormData();
    // const fileUrl = "/var/www/html/jtl_api/upload/cs";
    // formData.append("files", option.file);
    // reqwest({
    //   url: fileUrl,
    //   method: "post",
    //   processData: false,
    //   data: formData,
    //   crossOrigin: true,
    //   success: res => {
    //     //res为文件上传成功之后返回的信息，res.responseText为接口返回的值
    //     let fileInfo = JSON.parse(res.responseText);
    //     if (res) {
    //       this.setState({
    //         fileInfo: fileInfo,
    //         loading: false
    //       });
    //     }
    //   },
    //   error: () => {
    //     this.setState({
    //       loading: false
    //     });
    //     message.error("图片上传失败！");
    //   }
    // });
    // fetch("http://api.aokecloud.cn/var/www/html/jtl_api/upload/cs", {
    //   method: "POST",
    //   mode: "cors",
    //   credentials: "include",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   body: option.file
    // }).then(function(response) {
    //   console.log(response);
    // });
  };
  // handleSubmit = e => {
  //   e.preventDefault();
  //   this.props.form.validateFieldsAndScroll((err, values) => {
  //     if (!err) {
  //       console.log("Received values of form: ", values);
  //     }
  //   });
  // };
  render() {
    // const { getFieldDecorator } = this.props.form;
    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //     sm: { span: 8 }
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 14 }
    //   }
    // };
    // const tailFormItemLayout = {
    //   wrapperCol: {
    //     xs: {
    //       span: 24,
    //       offset: 0
    //     },
    //     sm: {
    //       span: 14,
    //       offset: 8
    //     }
    //   }
    // };
    // return (
    //   <div className="gutter-example">
    //     <BreadcrumbCustom first="维护团队管理" second="点名审核" />
    //     <Row className="white">
    //       <Col className="gutter-row" span={10}>
    //         <div className="gutter-box">
    //           <Card title="" bordered={false}>
    //             <Form onSubmit={this.handleSubmit}>
    //               <FormItem {...formItemLayout} label="摄像头IP" hasFeedback>
    //                 {getFieldDecorator("IP", {
    //                   rules: [
    //                     {
    //                       required: true,
    //                       message: "请输入摄像头IP",
    //                       whitespace: true
    //                     }
    //                   ]
    //                 })(<Input />)}
    //               </FormItem>
    //               <FormItem {...formItemLayout} label="用户名" hasFeedback>
    //                 {getFieldDecorator("IP", {
    //                   rules: [
    //                     {
    //                       required: true,
    //                       message: "请输入用户名",
    //                       whitespace: true
    //                     }
    //                   ]
    //                 })(<Input />)}
    //               </FormItem>
    //               <Row className="area_row">
    //                 <Col span={3} offset={5} className="area_text">
    //                   区域：
    //                 </Col>
    //                 <Col span={10}>
    //                   <div className="area">
    //                     <img alt="1" src="../../style/logo.png" />
    //                   </div>
    //                 </Col>
    //                 <Col span={1} className="area_col">
    //                   <Button type="primary">下载</Button>
    //                 </Col>
    //               </Row>
    //               <FormItem {...tailFormItemLayout}>
    //                 <Button type="primary" htmlType="submit" size="large">
    //                   上传svg文件
    //                 </Button>
    //                 <Button type="primary" htmlType="submit" size="large">
    //                   不通过
    //                 </Button>
    //               </FormItem>
    //             </Form>
    //           </Card>
    //         </div>
    //       </Col>
    //     </Row>
    //   </div>
    // );
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "plus"} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
      // <Upload
      //   listType="picture-card"
      //   className="avatar-uploader"
      //   showUploadList={false}
      //   multiple={false}
      //   action="/myload/var/www/html/jtl_api/upload/cs"
      //   // customRequest={this.handleUpload}
      //   {...upprops}
      //   onChange={this.handleChange}
      // >
      //   {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
      // </Upload>
      <form
        action="http://api.aokecloud.cn/var/www/html/jtl_api/upload/cs"
        method="post"
        encType="multipart/form-data"
      >
        <input type="file" name="file" />
        <input type="submit" value="上传" />
      </form>
    );
  }
}

// const BasicForm = Form.create()(Auditing);

// export default (Auditing = Form.create()(Auditing));
export default Auditing;
