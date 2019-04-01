import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
class AlarmAnalysis extends Component {
    constructor(props){
        super(props);
    }
    render() {
        let option={
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            color:["#5570FB","#FE6661","#43B4F8"],
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius: ['40%', '60%'],
                    center: ['50%', '60%'],
                    data:[
                        {value:this.props.unhandle, name:'未处理报警数'},
                        {value:this.props.todaysCount, name:'今日处理报警数'},
                        {value:this.props.userCount, name:'用户总数'},
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