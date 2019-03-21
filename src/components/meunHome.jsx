import React, { Component } from 'react';
import Teamhome from './teamhome/Teamhome';
import WatchIndex from './watch/WatchIndex'
import Groupleader from './groupleader/Groupleader';
import Login from './pages/Login';

class meunHome extends Component {
    render() {
        const meuns=JSON.parse(localStorage.getItem('teammeun'));
        if(meuns[0]){
           if(meuns[0].menuaddress=='/app/teamhome/index')return (<Teamhome />)
            else if(meuns[0].menuaddress=='/app/watch/watchIndex')return (<WatchIndex />)
            else return (<Groupleader />) 
        }else{
            return (<Login />)  
        }
        
    }
        
}
export default meunHome