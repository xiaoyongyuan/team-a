import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
class WorkStatistics extends Component {
    render() {
        let option={
            legend:{},
            dataset: {
                source: [
                    ['product', '虚警', '报警', '误报处理'],
                    ['3.4', 43.3, 85.8, 93.7],
                    ['3.5', 83.1, 73.4, 55.1],
                    ['3.6', 86.4, 65.2, 82.5],
                    ['3.7', 72.4, 53.9, 39.1],
                    ['3.8', 72.4, 53.9, 39.1],
                    ['3.9', 72.4, 53.9, 39.1],
                    ['3.10', 72.4, 53.9, 39.1],
                ]
            },
            xAxis: {
                name:"天",
                type: 'category'
            },
            yAxis: {
                name:"数量",
            },
            series: [
                {type: 'bar',color:"#43B4F8",barWidth:"10%"},
                {type: 'bar',color:"#FE6661",barWidth:"10%"},
                {type: 'bar',color:"#5570FB",barWidth:"10%"},
                {
                    type: "line",
                    smooth: true,
                    color:["#FDC228"],
                    data:[43.3,73,39,78,34,23,45]
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
export default WorkStatistics;