import React, { Component } from "react";
import { connect } from "react-redux";

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: this.props.contents.description,
      imgfile: this.props.contents.frontendPath
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
        let multimediacontent = "";
        if (frontendPaths) {
            multimediacontent = frontendPath.map(file => {

                let filetype = this.props.contents.filetype;
    
    if (filetype === "image/jpeg") {
      multimediacontent = (
        <div>
          <img
            src={this.props.contents.frontendPath}
            width="200px"
            height="200px"
          />
          <label>
            Select Image
            <input type="file" onChange={this.updateimgSelectHandler} />
          </label>
        </div>
      );
    }
    if (filetype === "audio/mp3") {
      multimediacontent = (
        <audio
          controls
          src={this.props.contents.frontendPath}
          type={filetype}
        ></audio>
      );
    }
                return
            })

        }
    

    return (
      <form onSubmit={this.submitHandler}>
        <label>
          {this.props.contents.createdby}
          <input
            type="text"
            value={this.state.description}
            onChange={this.changeHandler}
          />
        </label>
        <div>{multimediacontent}</div>
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
