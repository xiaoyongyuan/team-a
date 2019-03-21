import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';

const renderMenuItem = item => ( // item.route 菜单单独跳转的路由
    <Menu.Item
        key={item.menuaddress}
    >
        <Link to={(item.route || item.menuaddress) + (item.query || '')}>   
            {item.menuicon && <Icon type={item.menuicon} />}
            <span className="nav-text">{item.menuname}</span>
        </Link>
    </Menu.Item>
);

const renderSubMenu = item => ( 
    <Menu.SubMenu
        key={item.menuaddress}
        title={
            <span>
                {item.menuicon && <Icon type={item.menuicon} />}
                <span className="nav-text">{item.menuname}</span>
            </span>
        }
    >
        {item.subs.map(item => renderMenuItem(item))}
    </Menu.SubMenu>
);

export default ({ menus, ...props }) => (
    <Menu {...props} theme="dark">
        {     
            menus && menus.map(function(item){
                return(item.subs ? renderSubMenu(item) : renderMenuItem(item))
            } 
        )}
    </Menu>
);

// 权限验证
                // if({...props}.identify==item.identi){
                //   return( item.subs ? renderSubMenu(item) : renderMenuItem(item) )
                // }