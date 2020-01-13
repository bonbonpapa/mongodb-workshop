import React, { Component } from "react";
import { connect } from "react-redux";
import Content from "./Content.jsx";

class App extends Component {
  constructor() {
    super();
    this.state = {
      usernameInput: "",
      passwordInput: "",
      usernameSignup: "",
      passwordSignup: ""
    };
  }
  usernameSignupChange = evt => {
    this.setState({ usernameSignup: evt.target.value });
  };
  passwordSignupChange = evt => {
    this.setState({ passwordSignup: evt.target.value });
  };
  submitSignupHandler = async evt => {
    evt.preventDefault();

    let name = this.state.usernameSignup;
    let pwd = this.state.passwordSignup;
    let data = new FormData();
    data.append("username", name);
    data.append("password", pwd);
    let response = await fetch("/signup", { method: "POST", body: data });
    let body = await response.text();
    console.log("/login response", body);
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({ type: "login-success", content: name });
    }
  };

  usernameChange = evt => {
    this.setState({ usernameInput: evt.target.value });
  };
  passwordChange = evt => {
    this.setState({ passwordInput: evt.target.value });
  };
  submitHandler = async evt => {
    evt.preventDefault();
    console.log("username", this.state.username);
    console.log("password", this.state.passwordInput);
    let name = this.state.usernameInput;
    let data = new FormData();
    data.append("username", name);
    data.append("password", this.state.passwordInput);
    let response = await fetch("/login", { method: "POST", body: data });
    let body = await response.text();
    console.log("/login response", body);
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({ type: "login-success", content: name });
    }
  };
  render = () => {
    if (this.props.username === undefined) {
      return (
        <div>
          <h3>Sign up</h3>
          <form onSubmit={this.submitSignupHandler}>
            Username <input type="text" onChange={this.usernameSignupChange} />{" "}
            Password <input type="text" onChange={this.passwordSignupChange} />{" "}
            <input type="submit" value="signup" />
          </form>
          <h3>login</h3>
          <form onSubmit={this.submitHandler}>
            Username <input type="text" onChange={this.usernameChange} />{" "}
            Password <input type="text" onChange={this.passwordChange} />{" "}
            <input type="submit" value="login" />
          </form>
        </div>
      );
    }
    return <Content />;
  };
}
let mapStateToProps = state => {
  return {
    username: state.username
  };
};

export default connect(mapStateToProps)(App);
/* meta
  ({
    text:
    {
      1: `The App component is the top level component of this application.
      We are importing the Content component, which will actually display the content.
      The App component is mainly concerned with login.`,
      2: `The state will store the usernameInput and passwordInput, which represent what
      the user will enter in the login form, as well as the actual username when login
      is successful`,
      3: `In the render, we check if the user has signed in. If they haven't, we present them
      with a sign in form. If they have signed in, we show them the content.`,
      4: `This is the method used to update the usernameInput property of the state.`,
      5: `This is the method used to update the passwordInput property of the state.`,

    }

  })
  */
