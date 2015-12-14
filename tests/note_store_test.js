import assert from "assert";
import NoteActions from "app/actions/NoteActions";
import NoteStore from "app/stores/NoteStore";
import alt from "app/libs/alt";

describe("NoteStore", () => {
  beforeEach(() => {
    alt.flush();
  });

  it("create notes", () => {
    NoteActions.create({task: "test"});

    const state = NoteStore.getState();

    assert.equal(state.notes.length, 1);
    assert.equal(state.notes[0].task, "test");
  });

  it("updates notes", () => {
    NoteActions.create({task: "test"});

    NoteActions.update({...NoteStore.getState().notes[0], task: "updated"});

    const state = NoteStore.getState();

    assert.equal(state.notes.length, 1);
    assert.equal(state.notes[0].task, "updated");
  });

});