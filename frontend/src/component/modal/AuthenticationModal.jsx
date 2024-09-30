import React, { Component } from "react";
import "./AuthenticationModal.css";
import {submitFetchAPIToken} from "../serviceSDK/ServiceCalls";

class AuthenticationModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            isErrorAuthenticating: false,
            errorMessage: "",
            isLoading: false,
        };
        this.handleAuthenticationResult = this.handleAuthenticationResult.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleChange(e){
        this.setState({ [e.target.name]: e.target.value,  isErrorAuthenticating: false });
    };


    handleLogin() {
        if (this.state.username.length===0 || this.state.password.length === 0 ) {
            this.setState({
                isErrorAuthenticating: true,
                errorMessage: "Username or password cannot be blank"})
        } else {
            const body = {
                username: this.state.username,
                password: this.state.password
            }
            this.setState({isLoading: true});
            submitFetchAPIToken(body, this.handleAuthenticationResult);
        }
    };

    handleAuthenticationResult(data, error) {
        if (error!=null) {
            console.log(error.status);
            if (error.status === 401) {
                this.setState({
                    isErrorAuthenticating: true,
                    isLoading: false,
                    errorMessage: "Invalid username or password",
                })
            } else {
                this.setState({
                    isErrorAuthenticating: true,
                    isLoading: false,
                    errorMessage: "An unknown error occurred. Please retry later."
                })
            }
        } else {
            this.props.onLoginSuccess(data.access_token)
            this.setState({
                username: "",
                password: "",
                isLoading: false
            })
        }
    }

    render() {


        return (
            <div className="modal" >
                <div className="modal-content">
                    <h2>{this.props.heading}</h2>
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
                            disabled={this.state.isLoading}
                        />
                    </div>
                    {<button onClick={this.handleLogin} disabled={this.state.isLoading}>Login</button>}
                    {this.state.isErrorAuthenticating && <h2 style={{color: 'red', fontSize: '10px'}}>{this.state.errorMessage}</h2>}
                    {this.state.isLoading && <h2 style={{color: 'blue', fontSize: '10px'}}>{"Validating your credentials"}</h2>}
                </div>
            </div>
        );
    }
}

export default AuthenticationModal;