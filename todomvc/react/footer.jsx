import React, { Component } from "react";

class Footer extends Component {
  constructor(props) {
    console.log("Construct Footer");
    super(props);
  }
  handleFilter = (type) => {
    this.props.setFilter(type);
  }
  render() {
    console.log("Render Footer");
    let props = this.props;

    let clearElement = props.doneCount > 0 ? (
      <div className="btn-clear" onClick={props.clearCompleted}>
        Clear Completed
      </div>
    ): null;

    return (
      <div className="footer">
        <div className="counter">{props.totalCount}/{props.doneCount}</div>
        <div className="actions">
          <div className={"all"===props.filter?"active":""} onClick={this.handleFilter.bind(this, "all")}>All</div>
          <div className={"unDone"===props.filter?"active":""} onClick={this.handleFilter.bind(this, "unDone")}>Active</div>
          <div className={"done"===props.filter?"active":""} onClick={this.handleFilter.bind(this, "done")}>Completed</div>
        </div>
        {clearElement}
      </div>
    )
  }
}

export default Footer;