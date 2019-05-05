/**
 * 路由组件出口文件
 * yezi 2018年6月24日
 */
import Loadable from 'react-loadable';
import Loading from './widget/Loading';

import meunHome from './meunHome';


//维护团队
import Teamhome from './teamhome/Teamhome';
import Teammange from './teamacc/Teammange';
import Teamdeveice from './teamacc/Teamdeveice';
import Callalarm from './teamacc/Callalarm';
import Adopt from './teamacc/Adopt';
import Auditing from './teamacc/Auditing';
import Department from './comsetting/Department';
import Comemploye from './comsetting/Comemploye';


//值班人员
import WatchIndex from './watch/WatchIndex';
import Workbench from './watch/Workbench';
import history from './watch/history';
import AlarmDetail from './watch/Alarmdetails';



//组长
import groupleader from './groupleader/Groupleader';
import Performance from './groupleader/Performance';
import dataCharts from './groupleader/dataCharts';

import LookAlarm from "./teamacc/LookAlarm";
const WysiwygBundle = Loadable({ // 按需加载富文本配置
    loader: () => import('./ui/Wysiwyg'),
    loading: Loading,
});

export default {
    WysiwygBundle, meunHome
    
    , Teamhome, Teammange, Teamdeveice, Callalarm, Adopt, Auditing, Department, Comemploye

    , WatchIndex, Workbench, history, AlarmDetail
    , groupleader, Performance, dataCharts,LookAlarm

}