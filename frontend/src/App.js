import React, { Component } from 'react';
import './App.css';
import AuthenticationModal from "../src/component/modal/AuthenticationModal";
import Chatbot from "./component/chatbot/ChatBot";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      apiToken: null,
    };

    this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
  }

  handleLoginSuccess(token) {
    console.log(token)
    this.setState({isAuthenticated: true, apiToken: token});
  }

  render() {

    return (
        <div className="App">
          {!this.state.isAuthenticated && <AuthenticationModal
              onLoginSuccess={this.handleLoginSuccess}
          />}
          <Chatbot apiToken={this.state.apiToken}/>
        </div>
    );
  }
}

export default App;