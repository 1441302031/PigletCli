export type UIMode =
  | "idle"
  | "command_suggesting"
  | "submitting"
  | "completed";

export type UIState = {
  mode: UIMode;
  draft: string;
};

type InputChangedEvent = {
  type: "INPUT_CHANGED";
  value: string;
};

type SubmitEvent = {
  type: "SUBMIT";
};

type SubmitCompleteEvent = {
  type: "SUBMIT_COMPLETE";
};

type CancelCommandEvent = {
  type: "CANCEL_COMMAND";
};

export type UIEvent =
  | InputChangedEvent
  | SubmitEvent
  | SubmitCompleteEvent
  | CancelCommandEvent;

export function transition(state: UIState, event: UIEvent): UIState {
  switch (event.type) {
    case "INPUT_CHANGED":
      return {
        mode: event.value.startsWith("/") ? "command_suggesting" : "idle",
        draft: event.value
      };
    case "SUBMIT":
      return {
        ...state,
        mode: "submitting"
      };
    case "SUBMIT_COMPLETE":
      return {
        ...state,
        mode: "completed"
      };
    case "CANCEL_COMMAND":
      return {
        mode: "idle",
        draft: ""
      };
    default:
      return state;
  }
}
