import React, { Component } from "react";
import Post from "./Post.jsx";
import NewPost from "./NewPost.jsx";
import { connect } from "react-redux";
class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
  }
  reload = async () => {
    let response = await fetch("/all-posts");
    let body = await response.text();
    console.log("/all-posts response", body);
    body = JSON.parse(body);
    this.setState({ posts: body });
  };
    deleteAll = async () => {
        let formDate = new FormData();
        formData.append("username", this.state.username);
        let response = await fetch("/delete-all", { method: "POST", body: formData});
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      alert("all post has been deleted!");
    }
  };
  render = () => {
    return (
      <div>
        <button onClick={this.reload}> load </button>
        <button onClick={this.deleteAll}> delete all </button>
        <div>
          {this.state.posts.map(p => (
            <Post key={p._id} contents={p} />
          ))}
        </div>
        <NewPost />
      </div>
    );
  };
}
let mapStateToProps = state => {
    return {
        username: state.username
    };
};
export default connect(mapStateToProps)(Content);
