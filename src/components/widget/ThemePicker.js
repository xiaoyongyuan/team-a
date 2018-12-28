import React, { Component } from 'react';
import { Icon } from 'antd';
import { SketchPicker } from 'react-color';
import classNames from 'classnames';

class ThemePicker extends Component {
    state = {
        switcherOn: false,
        background: localStorage.getItem('team-color') || '#313653',
    }
    _switcherOn = () => {
        this.setState({
            switcherOn: !this.state.switcherOn
        })
    };
    _handleChangeComplete = color => {
        this.setState({ background: color.hex });
        localStorage.setItem('team-color', color.hex);
        window.less.modifyVars({
            '@primary-color': color.hex,
        })
    };
    render() {
        const { switcherOn, background } = this.state;
        return (
            <div className={classNames('switcher dark-white', { active: switcherOn })}>
                <span className="sw-btn dark-white" onClick={this._switcherOn}>
                    <Icon type="setting" className="text-dark" />
                </span>
                <div style={{ padding: 10 }} className="clear">
                    <SketchPicker
                        color={ background }
                        onChangeComplete={ this._handleChangeComplete }
                    />
                </div>
            </div> 
        )
    }
}

export default ThemePicker;