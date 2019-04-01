/**
 * 头部登录人信息
 */
import React, { Component } from 'react';
import { Menu, Icon, Layout, Badge, Popover } from 'antd';
import screenfull from 'screenfull';
import icon_admin from '../style/imgs/icon_admin.png';
import icon_user from '../style/imgs/icon_user.png';
import SiderCustom from './SiderCustom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { post } from '../axios/tools';


const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class HeaderCustom extends Component {
    state = {
        user: '',
        visible: false,
    };
    componentDidMount() {
        const _user = JSON.parse(localStorage.getItem('teamuser'));
        if(!_user){
            this.props.history.push('/login');
        }else{
            this.setState({
                user: _user
            });
        }
        this.unAlarmNumber();
        setInterval(()=> this.unAlarmNumber(),2000);
       // const aa= post('login',);
    
    };
    unAlarmNumber=()=>{
        post({url:"/api/alarmhandle/get_unhandle"},(res)=>{
            if(res.success){
                this.setState({
                    unAlarm:res.data
                });
            }
        })
    }
    screenFull = () => { //全屏
        screenfull.toggle();
        this.props.toggle();
    };
    menuClick = e => {
        e.key === 'logout' && this.logout();
    };
    logout = () => { //退出
        localStorage.removeItem('teamuser');
        localStorage.removeItem('teammeun');
        this.props.history.push('/login')
    };
    popoverHide = () => {
        this.setState({
            visible: false,
        });
    };
    handleVisibleChange = (visible) => {
        this.setState({ visible });
    };
    render() {
        const { responsive, path } = this.props;
        let unAlarm={
            width:"210px",
            height:"45px",
            display:"inline-block",
            borderRadius:"25px",
            lineHeight:"45px",
            border:"2px solid #3F51B5",
            marginRight:"50px"
        };
        let unAlarmFont={
            background:"#0C1050",
            width:"60%",
            height:"100%",
            display:"inline-block",
            color:"#fff",
            textAlign:"center",
            borderTopLeftRadius:"25px",
            borderBottomLeftRadius:"25px",
        };
        let unAlarmNumber={
            borderTopRightRadius:"25px",
            borderBottomRightRadius:"25px",
            background:"#313653",
            color:"#F40000",
            width:"40%",
            height:"100%",
            display:"inline-block",
            textAlign:"center",
            fontWeight:"bolder",
            fontSize:"18px"
        };
        return (
            <Header className="custom-theme header" >
                {
                    responsive.data.isMobile ? (
                        <Popover content={<SiderCustom path={path} popoverHide={this.popoverHide} />} trigger="click" placement="bottomLeft" visible={this.state.visible} onVisibleChange={this.handleVisibleChange}>
                            <Icon type="bars" className="header__trigger custom-trigger" />
                        </Popover>
                    ) : (
                        <Icon
                            className="header__trigger custom-trigger"
                            type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.props.toggle}
                        />
                    )
                }
                <Menu
                    mode="horizontal"
                    style={{ lineHeight: '64px', float: 'right' }}
                    onClick={this.menuClick}
                >
                    <span style={unAlarm}><span style={unAlarmFont}>未处理报警数</span><span style={unAlarmNumber}>{this.state.unAlarm}</span></span>
                    <Menu.Item key="full" onClick={this.screenFull} >
                        <Icon type="arrows-alt" onClick={this.screenFull} />
                    </Menu.Item>
                    {/*<Menu.Item key="1">
                        <Badge count={25} overflowCount={10} style={{marginLeft: 10}}>
                            <Icon type="notification" />
                        </Badge>
                    </Menu.Item>*/}
                    <SubMenu title={<span className="avatar"><img src={this.props.user.utype?icon_user:icon_admin}  alt="头像" /><i className="on bottom b-white" /></span>}>
                        <MenuItemGroup title="用户中心">
                            <Menu.Item key="setting:1">你好 - {this.props.user.realname}</Menu.Item>
                            {/*<Menu.Item key="setting:2">个人信息</Menu.Item>*/}
                            <Menu.Item key="logout"><span onClick={this.logout}>退出登录</span></Menu.Item>
                        </MenuItemGroup>
                        {/*<MenuItemGroup title="设置中心">
                            <Menu.Item key="setting:3">个人设置</Menu.Item>
                            <Menu.Item key="setting:4">系统设置</Menu.Item>
                        </MenuItemGroup>*/}
                    </SubMenu>
                </Menu>
            </Header>
        )
    }
}

const mapStateToProps = state => {  
// const  {responsive}=state.httpData;
    const { responsive = {data: {}} } = state.httpData;

    return {responsive};
};

export default withRouter(connect(mapStateToProps)(HeaderCustom));
