import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
require('../../style/ztt/map/shanxi1');

class Teamdispersion extends Component {
    render() {
        const option={
            backgroundColor: "#BFDDF6",
            background:"#404a59",
            geo: {
                map: 'shanxi1',
                roam: true,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                            [{ offset: 0, color: '#80D6EB' },{ offset: 1, color: '#3B80B4' }]
                        )}
                },
                itemStyle:{
                    normal:{
                        areaColor:"#3C82B5",
                        borderColor:"#78CDE5"
                    },
                    emphasis:{
                        areaColor:"#3A80B4"
                    }
                },
                label: {
                    emphasis: {
                        show: false
                    }
                },
            },
            series:[
                {
                    type:"effectScatter",// series图表类型
                    coordinateSystem:"geo",// series坐标系类型
                    data:this.props.datasMap, // series数据内容
                    effectType:"ripple",
                    itemStyle: {
                        normal: {
                            color: '#D5656E',
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke',
                        scale: 3, //设置缩放
                        period: 2, //设置时间
                    },
                    hoverAnimation: true,
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        },
                        emphasis: {
                            show: true,
                            color: '#D5656E',
                        }
                    },
                    symbolSize:20
                }
            ]
        }
        return (
            <ReactEcharts
                option={option}
                style={{height: '397px', width: '100%',padding:"10px 0"}}
                className={'react_for_echarts'}
            />
        )
    }
}
export default Teamdispersion;