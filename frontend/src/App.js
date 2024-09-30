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
      heading: "Login",
    };

    this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
    this.signalExpiredToken = this.signalExpiredToken.bind(this);

  }

  handleLoginSuccess(token) {
    console.log(token)
    this.setState({isAuthenticated: true, apiToken: token});
  }

  signalExpiredToken(heading) {
    this.setState({ isAuthenticated: false, apiToken: null, heading: heading});
  }

  render() {

    return (
        <div className="App">
          {!this.state.isAuthenticated && <AuthenticationModal
              onLoginSuccess={this.handleLoginSuccess}
              heading = {this.state.heading}
          />}
          <Chatbot signalExpiredToken={this.signalExpiredToken} apiToken={this.state.apiToken}/>
        </div>
    );
  }
}

export default App;