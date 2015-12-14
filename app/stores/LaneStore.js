import uuid from "node-uuid";
import alt from "../libs/alt";
import LaneActions from "../actions/LaneActions";
import NoteStore from "./NoteStore";
import update from "react/lib/update";

class LaneStore {
  constructor() {
    this.bindActions(LaneActions);

    this.lanes = [];
  }

  create(lane) {
    const lanes = this.lanes;

    lane.id = uuid.v4();
    lane.notes = lane.notes || [];

    this.setState({
      lanes: lanes.concat(lane)
    });
  }

  update({id, name}) {
    const lanes = this.lanes;

    lanes
      .filter(lane => lane.id === id)
      .forEach(lane => {
        lane.name = name;

        this.setState({lanes});
      });
  }

  delete(id) {
    this.setState({
      lanes: this.lanes.filter(lane => lane.id !== id)
    });
  }
  
  move({sourceId, targetId}) {
    const lanes = this.lanes;
    const sourceLane = lanes.filter(lane => lane.notes.indexOf(sourceId) >= 0)[0];
    const targetLane = lanes.filter(lane => lane.notes.indexOf(targetId) >= 0)[0];
    const sourceNoteIndex = sourceLane.notes.indexOf(sourceId);
    const targetNoteIndex = targetLane.notes.indexOf(targetId);

    if (sourceLane === targetLane) {
      sourceLane.notes = update(sourceLane.notes, {
        $splice: [
          [sourceNoteIndex, 1],
          [targetNoteIndex, 0, sourceId]
        ]
      });
    } else {
      sourceLane.notes.splice(sourceNoteIndex, 1);
      targetLane.notes.splice(targetNoteIndex, 0, sourceId);
    }

    this.setState({lanes});
  }

  attachToLane({laneId, noteId}) {
    if (!noteId) {
      this.waitFor(NoteStore);

      noteId = NoteStore.getState().notes.slice(-1)[0].id;
    }

    this.removeNote(noteId);

    const lanes = this.lanes;

    lanes
      .filter(lane => lane.id === laneId && lane.notes.every(note => note.id !== noteId))
      .forEach(lane => {
        lane.notes.push(noteId);
        this.setState({lanes});
      });
  }

  detachFromLane({laneId, noteId}) {
    const lanes = this.lanes;

    lanes
      .filter(lane => lane.id === laneId && lane.notes.some(note => note.id === noteId))
      .forEach(lane => {
        lane.notes = lane.notes.filter(note => note.id !== noteId)

        this.setState({lanes});
      });
  }

  removeNote(noteId) {
    this.lanes
      .filter(lane => lane.notes.some(note => note === noteId))
      .forEach(lane => {
        lane.notes = lane.notes.filter(note => note !== noteId)
      });
  }
}

export default alt.createStore(LaneStore, "LaneStore");