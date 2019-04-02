import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import {post} from "../../axios/tools";
import "../../style/ztt/css/police.css";

class dataCharts extends Component {
    constructor(props){
        super(props);
        this.state={
            height:""
        };
    }
    componentWillMount(){
        var _this=this;
        window.onresize=function(){
            _this.setState({
                height:document.documentElement.clientHeight-200+"px"
            }); 
        }
    }
    componentDidMount(){
        this.setState({
            bdate:this.props.query.bdate,
            edate:this.props.query.edate,
            realname:this.props.query.realname,
            height:document.documentElement.clientHeight-200+"px"
        },()=>{
            this.requestdata()
        });
        
    }
    requestdata=() => {//取数据
        var dataUseres = {
            bdate: this.state.bdate?this.props.query.bdate:'',
            edate: this.state.edate?this.state.edate:'',
            realname: this.state.realname?this.state.realname:'',
            pagesize:10,
            pageindex:this.state.page,
        }
        
        post({url:"/api/alarmhandlehistory/get_analysis_user",data:dataUseres}, (res)=>{
            var rname=[];//姓名
            var alarm=[];//报警
            var emptyalarm=[];//虚警
            var falsealarm=[];//误警
            if(res.success){
                this.setState({
                    list:res.data,
                },()=>{
                    this.state.list.map((v,i)=>(
                        [rname.push(v.realname),
                        alarm.push(v.alarm),
                        emptyalarm.push(v.emptyalarm),
                        falsealarm.push(v.falsealarm)]
                    ))
                })
            }
            this.setState({
                rname:rname,
                alarm:alarm,
                emptyalarm:emptyalarm,
                falsealarm:falsealarm
            });
        })
        
        
    }

    render() {      
        let option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : { // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'// 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data:['误报','虚报','警报'],
                top:'30',
                itemHeight :30,
                itemWidth :50,
                itemGap:20,
                textStyle : {
                    fontSize : 16,
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '2%',
                top:'160',
                containLabel: true,
            },
            xAxis : [
                {
                    axisLabel: {        
                        textStyle: {
                            color: '#000',
                            fontSize:'16'
                        }
                    },
                    type : 'category',
                    data : this.state.rname,
                    
                    nameTextStyle:{
                        fontSize:50
                    },
                },
               
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel: {        
                        textStyle: {
                            color: '#000',
                            fontSize:'16'
                        }
                    },
                }
            ],
            series : [
                {
                    name:'误报',
                    type:'bar',
                    barWidth:"30%",
                    stack: '1',
                    data:this.state.falsealarm,
                    itemStyle: { //上方显示数值
                        normal: {
                            color:'#C87FFF',
                            label: {
                                show: true, //开启显示
                                position: 'insideTop', //在上方显示
                                formatter: function(p) {
                                   return p.value > 0 ? (p.value) : '';
                                },
                                textStyle: { //数值样式
                                    color: 'black',
                                    fontSize: 16
                                }
                            }
                        }
                    }
                },
                {
                    name:'虚报',
                    type:'bar', 
                    barWidth:"30%",
                    stack: '1',
                    data:this.state.emptyalarm,
                    itemStyle: {//上方显示数值
                        normal: {
                            color:'#6475F9',
                            label: {
                                show: true, //开启显示
                                position: 'insideTop', //在上方显示
                                formatter: function(p) {
                                    return p.value > 0 ? (p.value) : '';
                                 },
                                textStyle: { //数值样式
                                    color: 'black',
                                    fontSize: 16
                                }
                            }
                        }
                    }
                },
                {
                    name:'警报',
                    barWidth:"30%",
                    type:'bar',
                    stack: '1',
                    data:this.state.alarm,
                    itemStyle: { //上方显示数值
                        normal: {
                            color:'#FA8068',
                            label: {
                                show: true, //开启显示
                                position: 'insideTop', //在上方显示
                                formatter: function(p) {
                                    return p.value > 0 ? (p.value) : '';
                                 },
                                textStyle: { //数值样式
                                    color: 'black',
                                    fontSize: 16
                                }
                            }
                        }
                    }
                }
            ]
        };
        return (
            <div className="dataCharts" style={{height:this.state.height}}>
                <ReactEcharts
                option={option}
                style={{width:"100%",height:this.state.height}}
                />
            </div>
        )
    }

}
export default dataCharts;
