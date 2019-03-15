import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
class ClassifiedStatistics extends Component {
    render() {
        let option = {
            legend: {
                data: ['误报', '虚报','警报','查询用户'],
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
                    data: [320, 302, 301, 334, 390, 330, 320]
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
                    data: [120, 132, 101, 134, 90, 230, 210]
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
                    data: [220, 182, 191, 234, 290, 330, 310]
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
                    data: [150, 212, 201, 154, 190, 330, 410]
                }
            ]
        };
        return(
            <ReactEcharts
                option={option}
                style={{width:"100%"}}
            />
        )
    }
}
export default ClassifiedStatistics;