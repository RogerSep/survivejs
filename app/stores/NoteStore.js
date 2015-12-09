import uuid from "node-uuid";
import alt from "../libs/alt";
import NoteActions from "../actions/NoteActions";

class NoteStore {
  constructor() {
    this.bindActions(NoteActions);

    this.notes = [];

    this.exportPublicMethods({
      get: this.get.bind(this)
    });
  }

  create(note) {
    const notes = this.notes;

    note.id = uuid.v4();

    this.setState({
      notes: notes.concat(note)
    });
  }

  update({id, task}) {
    this.setState({
      notes: this.notes.map(note => {
        if (note.id === id) {
          note.task = task;
        }

        return note;
      })
    });
  }

  delete(id) {
    this.setState({
      notes: this.notes.filter(note => note.id !== id)
    });
  }

  get(ids = []) {
    ids = ids.map(id => this.notes.filter(note => note.id === id));
    return [].concat.apply([], ids);
  }

}

export default alt.createStore(NoteStore, "NoteStore");