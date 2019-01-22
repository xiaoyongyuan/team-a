import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import {Row, Col, Card} from 'antd';
import Teamdispersion from './Teamdispersion';
import Numberaccess from './Numberaccess';
import Monthlynumber from './Monthlynumber';
import '../../style/publicStyle/publicStyle.css';
import '../../style/ztt/css/Companyhome.css';
import {post} from "../../axios/tools";
import moment from "moment";

//图标
import juyuwangIcon from '../../style/ztt/img/juyuwangIcon .png';
import shumeipaiIcon from '../../style/ztt/img/shumeipaiIcon.png';
import qiyeyonghu from '../../style/ztt/img/qiyeyonghu.png';
import users from "../../style/ztt/img/gerenyonghu.png";
import sandiantu from '../../style/ztt/img/yonghusandiantu.png';
import fwnleiruwang from "../../style/ztt/img/fwnleiruwang.png";
import daoqifuwu from '../../style/ztt/img/daoqifuwu.png';
import yueruwangshu from '../../style/ztt/img/yueruwangshu.png';
class Teamhome extends React.Component {
    constructor(props){
        super(props);
        this.state={
            enterpriseUsers:[],
            personUsers:[],
            raspberry:[],
            LANequipment:[],
            mapJson:[],
            monthlyNumber:[],
            monthlyNumberY:[],
            cloudUsers:[],
            companyadd:[]
        };
    }
    componentWillMount(){
        post({url:"/api/company/getone_maintain"},(res)=>{
        	if(res){
                for(let y=res.data.companyadd.length-1;y>=0;y--){
                    var timeY1=res.data.companyadd[y];
                   this.state.monthlyNumber.push(moment(timeY1.name).format('MM.DD'));
                }
                var timeY=res.data.companyadd.map(list =>list.value).reverse();
                if(res.success){
                    this.setState({
                        enterpriseUsers:res.data.smpqy,
                        personUsers:res.data.smpgr,
                        raspberry:res.data.smpqy+res.data.smpgr,
                        LANequipment:res.data.jyw,
                        mapJson:res.data.company,
                        monthlyNumberY:timeY,
                        cloudUsers:res.data.overdue.slice(0,3)
                    },()=>{
                        console.log(this.state.mapJson,typeof (this.state.mapJson));
                    });
                }
        	}
        })
    }
    render() {
        return (
            <div className="gutter-example button-demo">
                <BreadcrumbCustom />
                <Row>
                    <Col xl={5} xxl={5} className="maintenanceTeam">
                        <div className="gutter-box admin qiYe">
                            <Card>
                                <div className="clear y-center">
                                    <Col xl={10} lg={8}>
                                        <div className="noBorder qiYeBackground">
                                            <img src={qiyeyonghu} alt="" />
                                        </div>
                                    </Col>
                                    <Col xl={10} lg={5} offset={1}>
                                        <Row>
                                            <Col xl={24} className="adminFont qiYeFont">{this.state.enterpriseUsers}</Col>
                                        </Row>
                                        <Row>
                                            <Col xl={24}>企业用户</Col>
                                        </Row>
                                    </Col>
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col xl={5} xxl={5} className="rightShift maintenanceTeam">
                        <div className="gutter-box admin personalUser">
                            <Card>
                                <div className="clear y-center">
                                    <Col xl={10} lg={8}>
                                        <div className="noBorder personalUserBackground">
                                            <img src={users} alt="" />
                                        </div>
                                    </Col>
                                    <Col xl={10} lg={5} offset={1}>
                                        <Row>
                                            <Col xl={24} className="adminFont personalUseFont">{this.state.personUsers}</Col>
                                        </Row>
                                        <Row>
                                            <Col xl={24}>个人用户</Col>
                                        </Row>
                                    </Col>
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col xl={5} xxl={5} className="rightShift maintenanceTeam">
                        <div className="gutter-box admin weiHuBorder">
                            <Card>
                                <div className="clear y-center">
                                    <Col xl={10} lg={8}>
                                        <div className="noBorder weiHuBackround">
                                            <img src={shumeipaiIcon} alt="" />
                                        </div>
                                    </Col>
                                    <Col xl={10} lg={5} offset={1}>
                                        <Row>
                                            <Col xl={24} className="adminFont wiHuFont">{this.state.raspberry}</Col>
                                        </Row>
                                        <Row>
                                            <Col xl={24}>树莓派设备</Col>
                                        </Row>
                                    </Col>
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col xl={5} xxl={5} className="rightShift maintenanceTeam">
                        <div className="gutter-box admin LAN">
                            <Card>
                                <div className="clear y-center">
                                    <Col xl={10} lg={8}>
                                        <div className="noBorder LANBackground">
                                            <img src={juyuwangIcon} alt="" />
                                        </div>
                                    </Col>
                                    <Col xl={10} lg={5} offset={1}>
                                        <Row>
                                            <Col xl={24} className="adminFont LANFont">{this.state.LANequipment}</Col>
                                        </Row>
                                        <Row>
                                            <Col xl={24}>局域网设备</Col>
                                        </Row>
                                    </Col>
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xl={11} xxl={11} className="topShift">
                        <div className="gutter-box cardBorder">
                            <Card>
                                <Row>
                                    <Col xl={2} xxl={1}><div className="sandian"><img src={sandiantu} alt="" /></div></Col>
                                    <Col xl={10} xxl={12}><span className="titleFont">用户散点图</span></Col>
                                </Row>
                                <Teamdispersion datasMap={this.state.mapJson}/>
                            </Card>
                        </div>
                    </Col>
                    <Col xl={12} xxl={12}>
                        <Row>
                            <Col xl={10} xxl={10} className="rightShift topShift">
                                <div className="gutter-box cardBorder">
                                    <Card >
                                        <Row>
                                            <Col xl={3} xxl={3}><div className="sandian"><img src={fwnleiruwang} alt="" /></div></Col>
                                            <Col xl={12} xxl={12}><span className="titleFont">分类入网数</span></Col>
                                        </Row>
                                        <Numberaccess raspberry={this.state.raspberry} LANequipment={this.state.LANequipment}/>
                                    </Card>
                                </div>
                            </Col>
                            <Col xl={10} xxl={10} className="rightShift topShift">
                                <div className="gutter-box cardBorder fiveHeight">
                                    <Card>
                                        <Row>
                                            <Col xl={3} xxl={2}><div className="sandian"><img src={daoqifuwu} alt="" /></div></Col>
                                            <Col xl={12} xxl={12} className="listContext"><span className="titleFont">五天内服务器到期用户</span></Col>
                                        </Row>
                                            {
                                                this.state.cloudUsers.map((item,index)=>{
                                                    return(

                                                            <Row className="cloudUsers" key={index}>
                                                                <Col xl={8} xxl={8} className="listContext" title={item.cname}>{item.cname}</Col>
                                                                <Col xl={8} xxl={8} className="listContext" title={item.cloudvaliddate}>{item.cloudvaliddate}</Col>
                                                                <Col xl={8} xxl={8} className="listContext" title={item.adminname}>{item.adminname}</Col>
                                                            </Row>

                                                    )
                                                })
                                            }
                                    </Card>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={21} xxl={21} className="rightShift topShift">
                                <div className="gutter-box cardBorder">
                                    <Card>
                                        <Row>
                                            <Col xl={2} xxl={1}><div className="sandian"><img src={yueruwangshu} alt="" /></div></Col>
                                            <Col xl={10} xxl={12}><span className="titleFont">月入网数</span></Col>
                                        </Row>
                                        <Monthlynumber monthlyX={this.state.monthlyNumber} monthlyY={this.state.monthlyNumberY}/>
                                    </Card>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Teamhome;