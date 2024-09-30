import React, { Component } from 'react';
import './Chatbot.css';

import avatarImage from './ava_avatar.jpg.png'

import {submitMessageReply} from "../serviceSDK/ServiceCalls";

class Chatbot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [
                { id: 0, sender: 'Ava', text: 'Hi Jane, Amazing how Mosey is simplifying state compliance for businesses across the board!' },
            ],
            userMessage: '',
            errorMessage: '',
            isLoading: false,
        };
        this.handleNewMessageFromBot = this.handleNewMessageFromBot.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.submitMessageToBot = this.submitMessageToBot.bind(this);
        this.handleInputFieldChange = this.handleInputFieldChange.bind(this);
    }

    componentDidMount() {
    };

    handleSend() {
        if (this.state.userMessage.trim()) {
            const newMessage = { id: Date.now() + "User", sender: 'User', text: this.state.userMessage };
            const newMessageFromAva = { id: Date.now() + "Ava", sender: 'Ava', text: 'Fetching an answer for your question...' };
            this.setState({
                messages: [...this.state.messages, newMessage, newMessageFromAva],
                userMessage: '',
                isLoading: true
            }, () => {
                this.submitMessageToBot();
            });
        } else {
            this.setState({errorMessage: "Message can't be empty"});
        }
    };

    submitMessageToBot() {
        const body = {
            "message": this.state.userMessage,
            "token": this.props.apiToken
        };
        submitMessageReply(body, this.handleNewMessageFromBot);
    }

    handleNewMessageFromBot(data, error) {
        const updatedMessages = this.state.messages;

        if (error != null) {
            console.log(error.status);
            var errorMessage = '';
            (error.status === 401) ? errorMessage = `${error.statusText}. Please re-authenticate to run the query` :
                (error.status === 429) ? errorMessage = `API limit exceeded, Please retry after a minute` :
                    errorMessage = 'An unknown error occurred. Please retry later.'

            updatedMessages[updatedMessages.length-1].text = errorMessage;
            this.setState({messages: updatedMessages, isLoading: false})

            if (error.status === 401) {
                this.props.signalExpiredToken("Re-authenticate");

            }

        } else {
            console.log(data);
            console.log(this.state.messages);
            updatedMessages[updatedMessages.length-1].text = data.reply;
            this.setState({ messages: updatedMessages, isLoading:false});
        }
    };

    handleInputFieldChange(e) {
        this.setState({userMessage: e.target.value, errorMessage: ''})
    }


    render() {

        return (
            <div className="chatbot-container">
                <div className="chat-header">
                    <img className="avatar" src={avatarImage} alt="Ava"/>
                    <div>
                        <h2>Hey👋, I'm Ava</h2>
                        <p>Ask me anything or pick a place to start</p>
                    </div>
                </div>

                <div className="chat-body">
                    {this.state.messages.map((msg) => (



                        <div key={msg.id} className={`message ${msg.sender === 'Ava' ? 'from-ava' : 'from-user'}`}>

                            {msg.sender === 'Ava' && (
                                <img className="avatar" src={avatarImage} alt={msg.sender}/>
                            )}
                                <p>{msg.text}</p>
                        </div>
                    ))}
                </div>

                <div className="chat-footer">
                    <input
                        type="text"
                        placeholder="Your Question..."
                        value={this.state.userMessage}
                        onChange={this.handleInputFieldChange}
                        disabled={this.state.isLoading}
                    />
                    <button onClick={this.handleSend} disabled={this.state.isLoading}>Send</button>
                </div>
                {this.state.errorMessage.length > 0 &&
                    <h2 style={{color: 'red', fontSize: '10px'}}>{this.state.errorMessage}</h2>}
            </div>
        );
    }
}

export default Chatbot;