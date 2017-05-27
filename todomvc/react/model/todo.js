class Todo {
  constructor(content) {
    this.content = content || "";
    this.isDone = false;
  }
  getContent() {
    return this.content;
  }
  setContent(content) {
    this.content = content || this.content;
  }
  done() {
    this.isDone = true;
  }
  unDone() {
    this.isDone = false;
  }
  toggle() {
    this.isDone = !this.isDone;
  }
}

export default Todo