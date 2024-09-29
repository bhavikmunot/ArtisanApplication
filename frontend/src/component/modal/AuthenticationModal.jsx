import React, { Component } from "react";
import "./AuthenticationModal.css";
import {submitFetchAPIToken} from "../serviceSDK/ServiceCalls";

class AuthenticationModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
        this.handleAuthenticationResult = this.handleAuthenticationResult.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    // Handle input changes for username and password
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value});
    };

    // Handle the login attempt
    handleLogin = () => {
        const body = {
            username: this.state.username,
            password: this.state.password,
        }

        submitFetchAPIToken(body, this.handleAuthenticationResult)
    };

    handleAuthenticationResult(data, error) {
        if (error!=null) {
            console.log(error.status);
            if (error.status === 401) {
                this.setState({
                    isErrorAuthenticating: true,
                    errorMessage: "Invalid username or password"
                })
            } else {
                this.setState({
                    isErrorAuthenticating: true,
                    errorMessage: "An unknown error occurred. Please retry later."
                })
            }
        } else {
            this.props.onLoginSuccess(data.access_token)
            this.setState({
                username: "",
                password: ""
            })
        }
    }

    render() {


        return (
            <div className="modal" >
                <div className="modal-content">
                    <h2>Input</h2>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={this.state.username}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                    </div>
                    <button onClick={this.handleLogin}>Login</button>
                </div>
            </div>
        );
    }
}

export default AuthenticationModal;