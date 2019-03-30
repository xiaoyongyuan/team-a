import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import mometn from "moment";
class BeCuty extends Component {
    constructor(props){
        super(props);
    }
    sevenDay(sevenData){
        var sevenDatay=[];
        var sevenCount=[];
        if(sevenData){
            sevenData.map((v)=>{
                sevenDatay.push([mometn(v.dayly).format("MM.DD"),v.emptyalarm,v.falsealarm,v.alarm]);
            });
            for(var i=0;i<sevenData.length;i++){
                sevenCount.push(sevenData[i].alarm+sevenData[i].emptyalarm+sevenData[i].falsealarm);
            }
        }
        let option={
            legend: {},
            tooltip: {},
            dataset: {
                dimensions: ['product', '虚警', '警情', '误报'],
                source:sevenDatay
            },
            xAxis: {
                name:"天",
                type: 'category',
            },
            yAxis: {
                name:"数量",
            },
            series: [
                {type: 'bar',color:"#43B4F8",barWidth:"15%"},
                {type: 'bar',color:"#FE6661",barWidth:"15%"},
                {type: 'bar',color:"#5570FB",barWidth:"15%"},
                {
                    type: "line",
                    smooth: true,
                    color:["#FDC228"],
                    data:sevenCount
                }
            ]
        };
        return option;
    }
    render() {
        return(
            <ReactEcharts
                option={this.sevenDay(this.props.nearlySeven?this.props.nearlySeven:0)}
                style={{width:"100%"}}
            />
        )
    }
}
export default BeCuty;