import uuid from "node-uuid";
import alt from "../libs/alt";
import LaneActions from "../actions/LaneActions";

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

  attachToLane({laneId, noteId}) {
    if (!noteId) {
      this.waitFor(NoteStore);

      noteId = NoteStore.getState().notes.slice(-1)[0].id;
    }

    const lanes = this.lanes;

    lanes
      .filter(lane => lane.id === laneId && lane.notes.every(note => note.id !== noteId))
      .forEach(lane => {
        lane.notes.push(noteId);
        this.setState({lanes});
      })
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
}

export default alt.createStore(LaneStore, "LaneStore");