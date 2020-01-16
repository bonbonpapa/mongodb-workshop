import React, { Component } from "react";
import { connect } from "react-redux";

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: this.props.contents.description,
      filesPaths: this.props.contents.frontendPaths
    };
  }
  changeHandler = e => {
    this.setState({ description: e.target.value });
  };
  submitHandler = evt => {
    evt.preventDefault();
    let data = new FormData();
    data.append("mfile", this.state.imgfile);
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
  updateimgSelectHandler = event => {
    this.setState({ imgfile: event.target.files[0] });
  };

  render = () => {
    let frontendPaths = this.props.contents.frontendPaths;
    let multimediacontent = [];
    if (frontendPaths) {
      multimediacontent = frontendPaths.map(file => {
        let filetype = file.filetype;
        if (filetype === "image/jpeg") {
          return (
            <div>
              <img src={file.frontendPath} width="200px" height="200px" />
              <label>
                Select Image
                <input type="file" onChange={this.updateimgSelectHandler} />
              </label>
            </div>
          );
        }
        if (filetype === "audio/mp3") {
          return (
            <audio controls src={file.frontendPath} type={filetype}></audio>
          );
        }
        return <>unknown file format</>;
      });
    }

    return (
      <form onSubmit={this.submitHandler}>
        <div>
          <label>
            {this.props.contents.createdby} - {this.props.contents.description}
          </label>
        </div>
        <input
          type="text"
          value={this.state.description}
          onChange={this.changeHandler}
        />
        <div>
          {multimediacontent.map(content => {
            return content;
          })}
        </div>
        <input type="submit" value="update" />
        <button type="button" onClick={this.deletePostHandler}>
          delete
        </button>
      </form>
    );
  };
}
let mapStateToProps = state => {
  return {
    username: state.username
  };
};
export default connect(mapStateToProps)(Post);
