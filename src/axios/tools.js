/**
 * http通用工具函数
 */
import axios from 'axios';
import { message } from 'antd';
/**
 * 公用get请求
 * @param url       接口地址
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
const Httpurl='http://api.aokecloud.cn';


/**
 * 公用post请求
 * @param url       接口地址
 * @param data      接口参数
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export const post = async({url, msg = '接口异常',data={},type},callback) =>{
  const token=localStorage.getItem('teamtoken');
  const comid=localStorage.getItem('teamcomid');
  const account=localStorage.getItem('teamaccount');

  if(!account||account=='undefined'||!token||!comid || token=='undefined' || comid=='undefined'){
    window.location.href="#/login"
    return callback(false);
  }
  const head={
    headers:{
      'AUTHORIZATION':token
    }
  }

    axios.post(Httpurl+url,Object.assign({comid:comid,user:account},data),head).then(res =>{
      if(res.data.success==1){
        return callback(res.data)
      }else if(res.data.success==2){
        window.location.href="#/login"
        return callback(false)
      }else{
        if(type){
          return callback(false);
        }
        message.warn(res.data.errorinfo);
        return callback(false);
      }

    }).catch(err => {
      console.log('err',err);
      message.warn(msg);
    });
}