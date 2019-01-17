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




const WysiwygBundle = Loadable({ // 按需加载富文本配置
    loader: () => import('./ui/Wysiwyg'),
    loading: Loading,
});

export default {
    WysiwygBundle
    
    , Teamhome, Teammange, Teamdeveice, Callalarm, Adopt, Auditing, Department, Comemploye

}