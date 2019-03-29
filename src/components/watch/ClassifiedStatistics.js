import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
let vis=false;
class ClassifiedStatistics extends Component {
    constructor(props){
        super(props);
    }
    componentWillReceiveProps(){
        this.setState({
            yesterdayHandled:this.props.yesterdayHandled
        });
    }
    render() {
        let option = {
            legend: {
                data: ['误报', '虚报','警报','查询用户'],
                orient:"vertical",
                right:"right",
            },
            xAxis:  {
                type: 'category',
                data: ['周一'],
                splitLine:{
                    show:false
                },
                show:false,
            },
            color:["#B674FC","#6475F9","#FA8068","#76BBFC"],
            yAxis: {
                type: 'value',
                splitLine:{
                    show:false
                },
                show:false,
            },
            series: [
                {
                    name: '误报',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideTop'
                        }
                    },
                    data: [320]
                },
                {
                    name: '虚报',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideTop'
                        }
                    },
                    data: [120]
                },
                {
                    name: '警报',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideTop'
                        }
                    },
                    data: [220]
                },
                {
                    name: '查询用户',
                    type: 'bar',
                    barWidth:"40",
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideTop'
                        }
                    },
                    data: [150]
                }
            ]
        };
        return(
            <ReactEcharts
                option={option}
                style={{width:"100%",marginLeft:"-20%"}}
            />
        )
    }
}
export default ClassifiedStatistics;