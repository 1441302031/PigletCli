export type SessionState = {
  draft: string;
  timeline: string[];
};

export function createSessionState(): SessionState {
  return {
    draft: "",
    timeline: []
  };
}
