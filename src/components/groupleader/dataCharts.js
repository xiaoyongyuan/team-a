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
            height:document.documentElement.clientHeight-200+"px"
        });
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
                data:['昨日','人流增加','人流减少'],
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
                    data : ['张三','李四','王五','赵柳','周七','王八','啊就'],
                    
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
                    name:'昨日',
                    type:'bar',
                    barWidth:"30%",
                    stack: '1',
                    data:[1800, 1320, 1010, 1340, 900, 2300, 2100],
                    itemStyle: { //上方显示数值
                        normal: {
                            color:'#68D4D5',
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
                    name:'人流增加',
                    type:'bar', 
                    barWidth:"30%",
                    stack: '1',
                    data:[2200,0, 1910,0, 2900, 0, 3100],
                    itemStyle: {//上方显示数值
                        normal: {
                            color:'#FFB980',
                            label: {
                                show: true, //开启显示
                                position: 'top', //在上方显示
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
                    name:'人流减少',
                    barWidth:"30%",
                    type:'bar',
                    stack: '1',
                    data:[0, 2320, 0, 1540, 0, 3300, 0],
                    itemStyle: { //上方显示数值
                        normal: {
                            color:'#C4B6E0',
                            label: {
                                show: true, //开启显示
                                position: 'top', //在上方显示
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
