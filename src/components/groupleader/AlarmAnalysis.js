import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
class AlarmAnalysis extends Component {
    render() {
        let option={
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            color:["#FE6661","#5570FB","#43B4F8","#9D73F2"],
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius: ['40%', '60%'],
                    center: ['50%', '60%'],
                    data:[
                        {value:this.props.alarm, name:'警情'},
                        {value:this.props.falsealarm, name:'误报'},
                        {value:this.props.emptyalarm, name:'虚警'},
                        {value:this.props.hangup, name:'挂起'},
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
                style={{width:"100%",marginTop:"-30px"}}
            />
        )
    }
}
export default AlarmAnalysis;