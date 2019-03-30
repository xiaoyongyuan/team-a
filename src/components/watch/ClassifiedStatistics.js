import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
class ClassifiedStatistics extends Component {
    render() {
        let option = {
            legend: {
                data: ['误报', '虚报','警情','查询用户'],
                orient:"vertical",
                right:"right"
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
                    data: [this.props.yesterdayFalseList]
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
                    data: [this.props.yesterdayEmptyList]
                },
                {
                    name: '警情',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideTop'
                        }
                    },
                    data: [this.props.yesterdayList]
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
                    data: [this.props.yesterdayList]
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