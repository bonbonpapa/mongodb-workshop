import React, { Component } from "react";
import { connect } from "react-redux";
class NewPost extends Component {
  constructor() {
    super();
    this.state = {
      file: "",
      description: ""
    };
  }
  descChangeHandler = e => {
    this.setState({ description: e.target.value });
  };

  fileChangeHandler = e => {
    this.setState({ file: e.target.files[0] });
  };

  submitHandler = evt => {
    evt.preventDefault();
    let data = new FormData();
    data.append("mfile", this.state.file);
    data.append("description", this.state.description);
    data.append("createdby", this.props.username);
    fetch("/new-post", { method: "POST", body: data });

    this.setState({ file: "", description: "" });
  };

  render = () => {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <label>
            Add File
            <input type="file" onChange={this.fileChangeHandler} />
          </label>
          <input
            type="text"
            value={this.state.description}
            onChange={this.descChangeHandler}
          />
          <input type="submit" value="New post" />
        </form>
      </div>
    );
  };
}
let mapStateToProps = state => {
  return {
    username: state.username
  };
};
export default connect(mapStateToProps)(NewPost);
