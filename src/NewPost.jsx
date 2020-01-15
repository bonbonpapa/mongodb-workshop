import React, { Component } from "react";
import { connect } from "react-redux";
class NewPost extends Component {
  constructor() {
    super();
    this.state = {
      files: [],
      description: ""
    };
  }
  descChangeHandler = e => {
    this.setState({ description: e.target.value });
  };

    fileChangeHandler = event => {
        console.log("files selected, ", event.target.files);
        
       // for (let i = 0; i < event.target.files.length; i++) {
       //     this.setState({
                //              files: this.state.files.slice().concat(event.target.files[i])
      //          files: event.target.files
     //       });
        //}
        this.setState({ files: event.target.files });
      
  };

  submitHandler = evt => {
    evt.preventDefault();
      let data = new FormData();
      for (let i = 0; i < this.state.files.length; i++) {
          data.append("mfiles", this.state.files[i]);
      }
      console.log("files array", this.state.files);
      
    data.append("description", this.state.description);
      data.append("createdby", this.props.username);
      console.log("the  to the server", data);
    fetch("/new-post", { method: "POST", body: data });

    this.setState({ file: [], description: "" });
  };

  render = () => {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
             <label>Add File</label>                    
            <input type="file" name="mfiles" onChange={this.fileChangeHandler} multiple="multiple" />          
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
