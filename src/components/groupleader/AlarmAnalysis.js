import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
class AlarmAnalysis extends Component {
    render() {
        let option={
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            color:["#5570FB","#FE6661","#43B4F8"],
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:310, name:'未处理报警数'},
                        {value:234, name:'今日处理报警数'},
                        {value:135, name:'用户总数'},
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
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
export default AlarmAnalysis;