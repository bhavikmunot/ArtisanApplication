import React, {Component, createRef} from 'react';
import './Chatbot.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDeleteLeft, faHandsClapping, faPaperPlane, faPen} from '@fortawesome/free-solid-svg-icons';

import avatarImage from './ava_avatar.jpg.png'

import {submitMessageToBot} from "../serviceSDK/ServiceCalls";
/*I have majorly used class componenets, hence preferring that over functional components*/
class Chatbot extends Component {
    constructor(props) {
        super(props);
        this.scrollToRef = createRef();
        this.state = {
            messages: [
                { id: 0, sender: 'Ava', text: 'Hi Jane, Amazing how Mosey is simplifying state compliance for businesses across the board!' },
            ],
            userMessage: '',
            errorMessage: '',
            isLoading: false,
            isEditing: null,
            editMessageText: '',
        };
        this.handleNewMessageFromBot = this.handleNewMessageFromBot.bind(this);
        this.handleSendButtonClick = this.handleSendButtonClick.bind(this);
        this.createAndSubmitNewMessageRequest = this.createAndSubmitNewMessageRequest.bind(this);
        this.handleInputFieldChange = this.handleInputFieldChange.bind(this);
    }

    componentDidMount() {
    }

    handleSendButtonClick() {
        if (this.state.userMessage.trim()) {
            const newMessage = { id: Date.now() + "User", sender: 'User', text: this.state.userMessage };
            const newMessageFromAva = { id: Date.now() + "Ava", sender: 'Ava', text: 'Fetching an answer for your question...' };
            this.setState({
                messages: [...this.state.messages, newMessage, newMessageFromAva],
                userMessage: '',
                isLoading: true
            }, () => {
                this.createAndSubmitNewMessageRequest();
            });
        } else {
            this.setState({errorMessage: "Message can't be empty"});
        }
    };

    createAndSubmitNewMessageRequest() {
        const body = {
            "message": this.state.userMessage,
            "token": this.props.apiToken
        };
        const lastMessageIndex = this.state.messages.length - 1;
        submitMessageToBot(body, this.handleNewMessageFromBot, lastMessageIndex);
    }

    handleNewMessageFromBot(data, error, indexOfTheMessageToUpdate) {
        const updatedMessages = this.state.messages;

        if (error != null) {
            let errorMessage = '';
            //In-general, most of the "String literals" should be constants
            (error.status === 401) ? errorMessage = `${error.statusText}. Please re-authenticate to run the query` :
                (error.status === 429) ? errorMessage = `API limit exceeded, Please retry after a minute` :
                    errorMessage = 'An unknown error occurred. Please retry later.'

            updatedMessages[indexOfTheMessageToUpdate].text = errorMessage;
            this.setState({messages: updatedMessages, isLoading: false}, () => {
                this.scrollToTheBottom(indexOfTheMessageToUpdate);
            })

            if (error.status === 401) {
                //Re-authenticate should be a constant. In-general, most of the "String literals" should be constants
                this.props.signalExpiredToken("Re-authenticate");

            }

        } else {
            updatedMessages[indexOfTheMessageToUpdate].text = data.reply;
            this.setState({ messages: updatedMessages, isLoading:false}, () => {
                this.scrollToTheBottom(indexOfTheMessageToUpdate);
            });
        }
    };

    scrollToTheBottom(index) {
        if (index === this.state.messages.length-1) {
            if( this.scrollToRef.current ) {
                this.scrollToRef.current.scrollIntoView();
            }
        }
    }

    handleInputFieldChange(e) {
        this.setState({userMessage: e.target.value, errorMessage: ''})
    }

    handleDeleteMessage(index) {
        const updatedMessages = this.state.messages;
        updatedMessages.splice(index, 2);

        this.setState({ messages: updatedMessages });
    };

    handleEditMessage(id, currentText) {
        this.setState({
            isEditing: id,
            editMessageText: currentText,
            isLoading: true
        });
    };


    handleSaveEdit(index) {
        var updatedMessages = this.state.messages;
        updatedMessages[index].text = this.state.editMessageText;
        updatedMessages[index+1].text = 'Fetching an answer for your question...'
        this.setState({
            messages: updatedMessages,
            isEditing: null,
            userMessage: ''
        },() => {
            this.createAndSubmitEditMessageRequest(index+1);
        });
    };

    createAndSubmitEditMessageRequest(index) {
        const body = {
            "message": this.state.userMessage,
            "token": this.props.apiToken
        };
        submitMessageToBot(body, this.handleNewMessageFromBot, index);
    }

    /*If I had time, I would have made 3 class (chat-header, chat-body and chat-footer*/
    /*That would have made the code more manageable and testable*/
    /*And this class would be the main driver class*/
    render() {

        return (
            <div className="chatbot-container">
                <div className="chat-header">
                    <img className="avatar" src={avatarImage} alt="Ava"/>
                    <div>
                        <h2>Hey {<FontAwesomeIcon icon={faHandsClapping}/>}, I'm Ava</h2>
                        <p>Ask me anything or pick a place to start</p>
                    </div>
                </div>

                <div className="chat-body">
                    {this.state.messages.map((msg, index) => (
                        <div key={msg.id} className={`message ${msg.sender === 'Ava' ? 'from-ava' : 'from-user'}`}>
                            {msg.sender === 'User' && !this.state.isLoading && (
                                <div className="message-actions">
                                    <button className="hover-button" title="Edit"
                                            onClick={() => this.handleEditMessage(msg.id, msg.text)} >{<FontAwesomeIcon icon={faPen} />}
                                    </button>
                                    <button className="hover-button" title="Delete"
                                            onClick={() => this.handleDeleteMessage(index)} >{<FontAwesomeIcon icon={faDeleteLeft} />}
                                    </button>
                                </div>
                            )}

                            {msg.sender === 'Ava' && (
                                <img className="avatar" src={avatarImage} alt={msg.sender}/>
                            )}

                            {this.state.isEditing === msg.id ? (
                                <div className="edit-mode">
                                    <input
                                        type="text"
                                        value={this.state.editMessageText}
                                        onChange={(e) => this.setState({editMessageText: e.target.value})}
                                    />
                                    <button onClick={() => this.handleSaveEdit(index)}>Save</button>
                                </div>
                            ) : (
                                <p>{msg.text}</p>
                            )}
                        </div>
                    ))}
                    <div ref={this.scrollToRef}></div>
                </div>

                <div className="chat-footer">
                    <input
                        type="text"
                        placeholder="Your Question..."
                        value={this.state.userMessage}
                        onChange={this.handleInputFieldChange}
                        disabled={this.state.isLoading}
                    />
                    <button className={this.state.isLoading ? 'no-hover' : ''} onClick={this.handleSendButtonClick} disabled={this.state.isLoading}>{<FontAwesomeIcon icon={faPaperPlane} />}</button>
                </div>
                {/*The below error message should be a common method in class "commonUtils"*/}
                {/*It is getting used in the authenticationModal as well. Hence...*/}
                {this.state.errorMessage.length > 0 &&
                    <h2 style={{color: 'red', fontSize: '10px'}}>{this.state.errorMessage}</h2>}
            </div>
        );
    }
}

export default Chatbot;