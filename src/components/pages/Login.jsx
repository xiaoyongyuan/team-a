import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchData, receiveData } from '@/action';  //action->index按需取
import bg from '../../style/imgs/bg.jpg';
import axios from 'axios';

const FormItem = Form.Item;
const logincomcode=localStorage.getItem('logincomcode');
const loginaccount=localStorage.getItem('loginaccount');

class Login extends React.Component {
    componentWillMount() {
        const { receiveData } = this.props;
        receiveData(null, 'auth');
    }
    componentDidMount(){
        this.props.form.setFieldsValue({
            comid:logincomcode&&logincomcode != 'undefined'?logincomcode:null,
            account: loginaccount&&loginaccount != 'undefined'?loginaccount:null
        });

    }
    componentDidUpdate(prevProps) { 
        const { auth: nextAuth = {}, history } = this.props;
        if (nextAuth.data && nextAuth.data.success) {
            localStorage.setItem('logincomcode', nextAuth.data.data.companycode);
            localStorage.setItem('loginaccount', nextAuth.data.data.account);
            localStorage.setItem('teamtoken', nextAuth.data.token);
            localStorage.setItem('teamuser', JSON.stringify(nextAuth.data.data));
            localStorage.setItem('teamcomid', nextAuth.data.data.companycode);
            localStorage.setItem('teamaccount', nextAuth.data.data.account);
            localStorage.setItem('teammeun', JSON.stringify(nextAuth.data.data.menulist));
            history.push('/');
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        //在从此处登录，并记录下来
        this.props.form.validateFields((err, values) => {
            if (!err) {

                //获取到的表单的值values
                const { fetchData } = this.props;
                fetchData({funcName: 'webapp', url:'/login/verifyforhelper', params:values, stateName:'auth'});
            }
        });
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login" style={{backgroundImage: 'url(' + bg + ')'}}>
                <div className="login-form" >
                    <div className="login-logo">
                        <span>Login</span>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '280px',margin:'0 auto'}}>
                        <FormItem>
                            {getFieldDecorator('comid', {
                                rules: [{ required: true, message: '请输入公司编码!' }],
                            })(
                                <Input placeholder='请输入公司编码' prefix={<Icon type="bank" style={{ fontSize: 13 }} />}/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('account', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input placeholder='请输入用户名' prefix={<Icon type="user" style={{ fontSize: 13 }} />} />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input placeholder='请输入密码' prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>记住我</Checkbox>
                            )}
                            {/*<span className="login-form-forgot" href="" style={{float: 'right'}}>忘记密码</span>*/}
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

const mapStateToPorps = state => {
    const { auth } = state.httpData;
    return { auth };
};
const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToPorps, mapDispatchToProps)(Form.create()(Login));  

//第一个参数输入值，第二个输出。
//使用context取值