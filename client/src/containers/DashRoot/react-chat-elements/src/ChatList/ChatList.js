import React, { Component } from 'react';
import './ChatList.css';

import ChatItem from '../ChatItem/ChatItem';

const classNames = require('classnames');

export class ChatList extends Component {

    state = {
        selectedChatItem: 0
    }

    onClick(item, i, e) {
        if (this.props.onClick instanceof Function)
            this.props.onClick(item, i, e);

        this.setState({selectedChatItem: i});
    }

    onContextMenu(item, i, e) {
        e.preventDefault();
        if (this.props.onContextMenu instanceof Function)
            this.props.onContextMenu(item, i, e);
    }

    render() {
        return (
            <div
                ref={this.props.cmpRef}
                className={classNames('rce-container-clist', this.props.className)}>
                {
                    this.props.dataSource.map((x, i) => (
                        <ChatItem
                            id={x.id || i}
                            key={i}
                            {...x}
                            onContextMenu={(e) => this.onContextMenu(x,i,e)}
                            onClick={() => this.onClick(x, i)}
                            selected={i === this.state.selectedChatItem}/>
                    ))
                }
            </div>
        );
    }
}

ChatList.defaultProps = {
    dataSource: [],
    onClick: null,
};

export default ChatList;
