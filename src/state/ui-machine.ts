export type UIMode =
  | "idle"
  | "command_suggesting"
  | "submitting"
  | "working"
  | "streaming"
  | "interrupted"
  | "failed"
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

type RequestStartedEvent = {
  type: "REQUEST_STARTED";
};

type StreamStartedEvent = {
  type: "STREAM_STARTED";
};

type RequestInterruptedEvent = {
  type: "REQUEST_INTERRUPTED";
};

type RequestFailedEvent = {
  type: "REQUEST_FAILED";
};

type CancelCommandEvent = {
  type: "CANCEL_COMMAND";
};

export type UIEvent =
  | InputChangedEvent
  | SubmitEvent
  | SubmitCompleteEvent
  | RequestStartedEvent
  | StreamStartedEvent
  | RequestInterruptedEvent
  | RequestFailedEvent
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
    case "REQUEST_STARTED":
      return {
        ...state,
        mode: "working"
      };
    case "STREAM_STARTED":
      return {
        ...state,
        mode: "streaming"
      };
    case "REQUEST_INTERRUPTED":
      return {
        ...state,
        mode: "interrupted"
      };
    case "REQUEST_FAILED":
      return {
        ...state,
        mode: "failed"
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
