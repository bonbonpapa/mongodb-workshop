import React, { Component } from "react";
import { connect } from "react-redux";
import MediaItem from "./MediaItem.jsx";

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: this.props.contents.description
    };
  }
  changeHandler = e => {
    this.setState({ description: e.target.value });
  };
  submitHandler = evt => {
    evt.preventDefault();
    let data = new FormData();
    data.append("description", this.state.description);
    data.append("id", this.props.contents._id);
    data.append("updatedby", this.props.username);
    fetch("/update", { method: "POST", body: data });
  };
  deletePostHandler = event => {
    let data = new FormData();
    data.append("id", this.props.contents._id);
    fetch("/delete-post", { method: "POST", body: data });
  };

  render = () => {
    let frontendPaths = this.props.contents.frontendPaths;

    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <div>
            <h3>
              {this.props.contents.createdby} -{" "}
              {this.props.contents.description}
            </h3>
          </div>
          <input
            type="text"
            value={this.state.description}
            onChange={this.changeHandler}
          />
          <input type="submit" value="update" />
          <button type="button" onClick={this.deletePostHandler}>
            delete
          </button>
        </form>
        {Object.keys(frontendPaths).map((obj, i) => {
          return (
            <div>
              {obj} - {frontendPaths[obj]}
              <MediaItem mid={frontendPaths[obj]} />
            </div>
          );
        })}
      </div>
    );
  };
}
let mapStateToProps = state => {
  return {
    username: state.username
  };
};
export default connect(mapStateToProps)(Post);
