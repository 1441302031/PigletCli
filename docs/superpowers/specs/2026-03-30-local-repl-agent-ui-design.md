# Local REPL Agent UI Design

## 1. Summary

This project is a local terminal REPL tool that should feel closer to Claude Code and Codex than a traditional CLI prompt. The experience needs to make the tool feel alive while it is working, keep the user oriented at all times, and make command discovery easy through an interactive slash-command mode.

This design is derived from the supplied screenshots, not an existing codebase. It therefore defines both the target behavior and the baseline product structure for a greenfield implementation.

## 2. Product Goal

Build a local terminal-first agent UI that supports:

- a branded startup layout
- a persistent bottom composer
- a slash-command mode with keyboard-selectable suggestions
- visible working feedback with elapsed time and pulsing emphasis
- streaming assistant output
- inline process/event logs that make the agent feel active and transparent

## 3. User Problem

Typical local REPL tools feel static and opaque:

- users cannot tell whether the app is waiting, frozen, or actively working
- command features are hidden behind memorized syntax
- outputs arrive in large blocks with no sense of progress
- the interface does not separate input, status, and output well enough to support long-running sessions

The target experience should make users feel that the tool is:

- responsive
- understandable
- controllable
- trustworthy during long model calls

## 4. Design Principles

### 4.1 Persistent Orientation

The screen should always answer three questions:

- Where am I working
- What mode am I in
- What is the agent doing right now

### 4.2 Terminal-Native, Not Fake GUI

The interface should stay faithful to terminal ergonomics:

- keyboard first
- ANSI-compatible styling
- stable layout
- minimal visual noise

### 4.3 Process Before Result

The tool should show action before conclusion:

- state transitions happen immediately after submit
- working status appears before model output
- process logs can appear before or during streaming output

### 4.4 Progressive Discoverability

Advanced commands should be easy to find without leaving the terminal:

- slash commands are searchable
- command descriptions are visible in context
- selection works with arrows, enter, tab, and esc

## 5. Screenshot-Derived Interaction Model

### 5.1 Startup Screen

Derived from the screenshots, the initial screen contains:

- terminal header from the host shell
- a warning or environment line when relevant
- a welcome card with:
  - product name
  - version
  - current model
  - current working directory
- a short tip line beneath the card
- an empty or lightly primed output timeline
- a persistent composer at the bottom

### 5.2 Slash Command Mode

When the user types `/`, the composer enters command mode.

Expected behavior:

- a command suggestion panel opens beneath the composer
- items show command name plus short description
- the list filters as the user types
- arrow keys move active selection
- enter inserts or executes the selected command
- tab completes the highlighted command
- esc closes command mode and returns to normal input

### 5.3 Agent Working State

After prompt submission and before the first response chunk:

- composer becomes temporarily non-editable or partially locked
- working status appears immediately
- elapsed time starts at `0s`
- the status line includes an interrupt hint
- the working label animates between dim gray and brighter gray/white

Suggested rendering:

- `Working (7s • Esc to interrupt)`
- or `Working... 00:07`

### 5.4 Process Timeline

The screenshots imply a timeline that interleaves:

- user prompt
- agent progress messages
- tool/event logs
- assistant response content

Event examples:

- `Explored`
- `Read`
- `Ran`
- `Updated plan`
- `Waiting`

### 5.5 Streaming Output

Assistant replies should render incrementally:

- line by line at minimum
- token or chunk streaming preferred
- history should not jump or fully repaint
- once streaming completes, the composer becomes active again

## 6. Information Architecture

The terminal UI is divided into five visual zones.

### 6.1 Shell/Environment Zone

Owned by the host terminal. No custom repaint logic required.

### 6.2 Welcome/Header Zone

Visible on initial load and optionally collapsible once the session becomes busy.

Contents:

- product name
- version
- selected model
- current directory
- optional warning line
- short onboarding tip

### 6.3 Timeline Zone

Primary scrollable output area. Holds:

- user messages
- structured event blocks
- assistant streaming messages
- errors
- interrupt notices

### 6.4 Status Zone

Dedicated transient state strip above the composer or embedded at the lower edge of the timeline.

Contents:

- current mode
- working state
- elapsed time
- interrupt hint

### 6.5 Composer Zone

Persistent input component with two modes:

- free text mode
- slash command mode

## 7. Functional Requirements

### 7.1 Session Layout

- The app must render a startup card on launch.
- The app must show current model and directory.
- The app must preserve a persistent bottom composer.
- The timeline must scroll independently from the composer.

### 7.2 Input and Composer

- The composer must accept multiline or single-line prompt input.
- The composer must submit via enter or configured submit key.
- The composer must clear or preserve draft according to command type.
- The composer must restore focus after each completed turn.

### 7.3 Slash Commands

- Typing `/` at the start of input enters command mode.
- Command suggestions must appear within 200ms.
- Suggestions must be keyboard selectable.
- Suggestions must display command name and short explanation.
- The command list must filter by command name, alias, and description keywords.
- Empty-state text must appear when no command matches.

### 7.4 Working State

- Working state must appear within 100ms of request submission.
- Elapsed timer must update once per second.
- The timer must stop immediately on completion, failure, or interrupt.
- The working label must animate while active.
- The working area must expose an interrupt affordance.

### 7.5 Event Timeline

- The app must support structured timeline events separate from assistant prose.
- Each event must include:
  - type
  - timestamp or relative timing
  - optional detail lines
- Event rendering must remain visually distinct from assistant content.

### 7.6 Streaming Responses

- Model responses must render incrementally.
- The current in-progress assistant message must be mutable until completion.
- Completed messages must become immutable history items.
- Streaming must not cause full-screen flicker or large-scale history reflow.

### 7.7 Interrupts and Failures

- `Esc` must interrupt the active request when possible.
- Interruptions must append a visible status message.
- Errors must be rendered as structured blocks, not raw stack traces by default.
- Error blocks must include a retry or recovery hint.

## 8. Interaction States

The UI has one primary state at a time.

### 8.1 `idle`

- composer focused
- no command menu
- no active request

### 8.2 `command_suggesting`

- composer contains slash prefix
- command panel visible
- selection can move with keyboard

### 8.3 `submitting`

- input accepted
- request being handed off
- working state about to appear

### 8.4 `working`

- request active
- no assistant content yet, or content has started but task still running
- timer and animation visible

### 8.5 `streaming`

- assistant chunks are arriving
- current response node is mutating in place

### 8.6 `completed`

- current turn finished successfully
- composer re-enabled

### 8.7 `interrupted`

- request stopped by user
- status entry added to timeline

### 8.8 `failed`

- request ended with error
- error block added to timeline

## 9. Visual Design Requirements

### 9.1 Color

- overall theme is dark terminal-first
- default text uses muted gray
- command names use bright blue or cyan
- warnings use yellow
- errors use pink/red
- working animation uses grayscale pulse, not colorful gradients

### 9.2 Motion

- motion should be subtle and terminal-safe
- the only always-on animation is the working pulse while a task is active
- no layout-bouncing animations
- no typewriter effect that blocks actual streaming cadence

### 9.3 Typography and Spacing

- rely on terminal monospace font
- prioritize spacing rhythm and alignment over decorative box drawing
- cards, separators, and event blocks should use a consistent border strategy

## 10. Technical Recommendation

### Recommended Stack

Use `Node.js + TypeScript + Ink`.

Rationale:

- strong fit for terminal UI composition
- good support for keyboard events and render-state updates
- straightforward integration with streaming LLM SDKs
- component model maps well to welcome card, composer, command palette, timeline, and working status

### Supporting Utilities

- `Ink` for terminal rendering
- `zod` for command schema validation
- `chalk` or Ink text styling primitives for ANSI-safe colors
- a thin internal event bus for runtime task updates
- `vitest` for unit tests
- `@testing-library/react` or Ink testing helpers for component behavior

## 11. Proposed File Boundaries

- `src/index.tsx`: app bootstrap and CLI entry
- `src/app.tsx`: root app composition
- `src/components/WelcomeCard.tsx`: startup card
- `src/components/Timeline.tsx`: scrollable session history
- `src/components/TimelineEvent.tsx`: structured event renderer
- `src/components/Composer.tsx`: bottom input area
- `src/components/CommandPalette.tsx`: slash-command suggestions
- `src/components/WorkingStatus.tsx`: timer plus pulse state
- `src/components/StreamingMessage.tsx`: in-progress assistant output
- `src/state/ui-machine.ts`: top-level mode/state transitions
- `src/state/session-store.ts`: current session timeline data
- `src/commands/registry.ts`: command definitions
- `src/commands/filter.ts`: command search/filter logic
- `src/runtime/agent-client.ts`: model request orchestration
- `src/runtime/stream-parser.ts`: stream chunk handling
- `src/runtime/task-events.ts`: process event adapters
- `src/theme/tokens.ts`: color and spacing constants

## 12. Non-Goals for V1

- mouse-driven interactions
- split-pane diff viewers
- markdown-rich rendering beyond terminal-safe formatting
- multi-session tabs
- plugin marketplace
- full shell emulation

## 13. Acceptance Criteria

- Typing `/` opens a selectable command menu.
- Arrow keys and enter can pick a command without typing the full name.
- Submitting a prompt shows a working indicator within 100ms.
- Working status shows elapsed seconds and an interrupt hint.
- Working text visibly pulses until output or completion.
- At least one structured process event can render before final response completion.
- Assistant output streams progressively instead of appearing all at once.
- `Esc` interrupts a long request and records an interruption message.
- The composer regains focus after each completed turn.

## 14. Open Assumptions

- This is a greenfield implementation.
- The initial implementation targets local desktop terminals on Windows first, while staying ANSI-friendly.
- Model integration will support streaming and cancellation.
- The command surface can start with a small built-in registry and expand later.

## 15. Delivery Strategy

Implement in this order:

1. app shell and layout
2. composer plus command palette
3. UI state machine
4. working status and timer animation
5. streaming runtime integration
6. structured event timeline
7. interrupts, errors, and polish

