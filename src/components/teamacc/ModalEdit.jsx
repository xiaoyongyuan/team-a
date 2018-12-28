import React, { Component } from 'react';
import {Form,Input, Select,Radio} from 'antd';
import axios from 'axios';
// import '../../style/sjg/home.css';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class ModalEdit extends Component {
    constructor(props){
        super(props);
        this.state={
            visible:props.visible || false,
            form:false,
            code:{},
        };
    }
    componentDidMount() {
        //编辑  数据回填
        this.setState({
            record:this.props.record
        });

        this.updatedata()
    }
    updatedata = () => {
        console.log('dddd',this.state.record)

        if(this.props.record){
            axios.get("table.json").then((res)=>{
                if(res.data.success){

                    console.log("ssssssssssss:",res.data.data[this.state.record.code]);

                    this.props.form.setFieldsValue({
                        state: `${res.data.data[this.state.record.code].type}`,
                    });

                }
            })
        }
    };


    componentDidUpdate = () => {
        if(this.props.code && this.props.code!=this.state.code){
            this.setState({
                    code:this.props.code
                }
                , () => {
                    // this.updatedata()
                });

        }
    }


    formref = () => { //将form传给父组件由父组件控制表单提交
        // const aa=this.props.form.getFieldsValue();
        return this.props.form;
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return (


                    <Form layout="vertical">

                        <FormItem label="状态" >
                            {getFieldDecorator('state', {
                                rules: [{ required: true, message: '状态' }],
                            })(
                                <Select
                                    placeholder="请选择状态"
                                    onChange={this.handleSelectChange}
                                >
                                    <Option value="0">0</Option>
                                    <Option value="1">1</Option>

                                </Select>
                            )}
                        </FormItem>

                    </Form>


        )
    }
}

export default ModalEdit = Form.create({})(ModalEdit);