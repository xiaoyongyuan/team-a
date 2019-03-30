import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
class WorkStatistics extends Component {
    render() {
        let option={
            legend:{},
            dataset: {
                source: [
                    ['product', '虚警', '报警', '误报处理'],
                    ['3.22', 0, 1, 0],
                    ['3.23', 0, 0, 0],
                    ['3.24', 0, 0, 0],
                    ['3.25', 0, 0, 0],
                    ['3.26', 0, 0, 0],
                    ['3.27', 0,16, 0],
                    ['3.28', 0, 35, 0],
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
                    data:[1,0,0,0,0,16,35]
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