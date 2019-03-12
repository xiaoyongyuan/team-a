/**
 * 路由组件出口文件
 * yezi 2018年6月24日
 */
import Loadable from 'react-loadable';
import Loading from './widget/Loading';


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
import watchIndex from './watch/watchIndex';
import workbench from './watch/workbench';
import history from './watch/history';
import AlarmDetail from './watch/AlarmDetail';



//组长
import groupleader from './groupleader/Groupleader';
import performance from './groupleader/performance';
import dataCharts from './groupleader/dataCharts';



const WysiwygBundle = Loadable({ // 按需加载富文本配置
    loader: () => import('./ui/Wysiwyg'),
    loading: Loading,
});

export default {
    WysiwygBundle
    
    , Teamhome, Teammange, Teamdeveice, Callalarm, Adopt, Auditing, Department, Comemploye

    , watchIndex, workbench, history, AlarmDetail
    , groupleader, performance, dataCharts

}