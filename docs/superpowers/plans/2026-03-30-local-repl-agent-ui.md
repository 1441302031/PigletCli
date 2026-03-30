# Local REPL Agent UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a terminal-native local REPL that has a branded startup layout, slash-command suggestions, a visible working state with elapsed time and pulse animation, and streaming assistant output.

**Architecture:** Use a component-based Ink app with a small UI state machine and a session store. Keep command discovery, working-state timing, streaming response assembly, and timeline event rendering as separate units so the product feels responsive and debuggable from the first milestone.

**Tech Stack:** Node.js, TypeScript, Ink, Vitest, ANSI-safe text styling

---

## Proposed File Structure

### Create

- `package.json`
- `tsconfig.json`
- `vitest.config.ts`
- `src/index.tsx`
- `src/app.tsx`
- `src/theme/tokens.ts`
- `src/state/ui-machine.ts`
- `src/state/session-store.ts`
- `src/commands/types.ts`
- `src/commands/registry.ts`
- `src/commands/filter.ts`
- `src/components/WelcomeCard.tsx`
- `src/components/Timeline.tsx`
- `src/components/TimelineEvent.tsx`
- `src/components/StreamingMessage.tsx`
- `src/components/Composer.tsx`
- `src/components/CommandPalette.tsx`
- `src/components/WorkingStatus.tsx`
- `src/runtime/agent-client.ts`
- `src/runtime/stream-parser.ts`
- `src/runtime/task-events.ts`
- `tests/commands/filter.test.ts`
- `tests/state/ui-machine.test.ts`
- `tests/runtime/stream-parser.test.ts`
- `tests/components/command-palette.test.tsx`
- `tests/components/working-status.test.tsx`

### Responsibility Map

- `ui-machine.ts` owns primary UI mode transitions.
- `session-store.ts` owns timeline records and active turn state.
- `registry.ts` defines command metadata.
- `filter.ts` owns command matching and ordering.
- `agent-client.ts` owns request lifecycle, cancellation, and event callbacks.
- `stream-parser.ts` owns incremental assembly of response chunks.
- `Composer` owns input text and mode switching.
- `CommandPalette` owns suggestion rendering and highlighted choice.
- `WorkingStatus` owns timer display and pulse phase.
- `Timeline` and child components own stable rendering of history.

## Milestone Breakdown

- Milestone 1: Bootstrapped TUI shell and welcome layout
- Milestone 2: Composer plus slash-command discovery
- Milestone 3: Working state, timer, and interrupt handling
- Milestone 4: Streaming output and process timeline events
- Milestone 5: Error handling, polish, and terminal behavior hardening

## Task 1: Bootstrap the project and render a static shell

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `src/index.tsx`
- Create: `src/app.tsx`
- Create: `src/theme/tokens.ts`
- Test: `tests/components/command-palette.test.tsx`

- [ ] **Step 1: Write the failing shell smoke test**

```tsx
import {render} from 'ink-testing-library';
import {App} from '../../src/app';

it('renders the welcome shell with model and directory', () => {
  const {lastFrame} = render(
    <App
      boot={{productName: 'PigLet CLI', version: '0.1.0', model: 'gpt-5.4-mini', cwd: 'J:/Codex_Project/PigLetCli'}}
    />
  );

  expect(lastFrame()).toContain('PigLet CLI');
  expect(lastFrame()).toContain('gpt-5.4-mini');
  expect(lastFrame()).toContain('J:/Codex_Project/PigLetCli');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand`
Expected: FAIL because `src/app.tsx` and test tooling do not exist yet.

- [ ] **Step 3: Create package and TypeScript configuration**

Add dependencies and scripts:

```json
{
  "name": "piglet-cli",
  "version": "0.1.0",
  "type": "module",
  "bin": {
    "piglet": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "dev": "tsx src/index.tsx",
    "test": "vitest run"
  }
}
```

- [ ] **Step 4: Implement the static app shell**

Include:

```tsx
export function App({boot}: {boot: BootInfo}) {
  return (
    <>
      <WelcomeCard boot={boot} />
      <Timeline items={[]} />
      <Composer value="" />
    </>
  );
}
```

- [ ] **Step 5: Run tests to verify the shell renders**

Run: `npm test -- --runInBand`
Expected: PASS for the smoke test and visible references to product name, model, and cwd.

- [ ] **Step 6: Commit**

```bash
git add package.json tsconfig.json vitest.config.ts src tests
git commit -m "feat: bootstrap terminal shell layout"
```

## Task 2: Add a UI state machine and session store

**Files:**
- Create: `src/state/ui-machine.ts`
- Create: `src/state/session-store.ts`
- Modify: `src/app.tsx`
- Test: `tests/state/ui-machine.test.ts`

- [ ] **Step 1: Write failing state transition tests**

```ts
import {transition} from '../../src/state/ui-machine';

it('enters command mode when input starts with slash', () => {
  expect(transition('idle', {type: 'INPUT_CHANGED', value: '/'}).mode).toBe('command_suggesting');
});

it('enters working after submit', () => {
  expect(transition('idle', {type: 'SUBMIT'}).mode).toBe('working');
});

it('returns to completed after stream completes', () => {
  expect(transition('streaming', {type: 'STREAM_DONE'}).mode).toBe('completed');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/state/ui-machine.test.ts`
Expected: FAIL because the state machine does not exist.

- [ ] **Step 3: Implement the state machine**

Required modes:

```ts
export type UIMode =
  | 'idle'
  | 'command_suggesting'
  | 'submitting'
  | 'working'
  | 'streaming'
  | 'completed'
  | 'interrupted'
  | 'failed';
```

- [ ] **Step 4: Implement session store primitives**

Include timeline item types:

```ts
type TimelineItem =
  | {kind: 'user'; text: string}
  | {kind: 'event'; label: string; detail?: string[]}
  | {kind: 'assistant'; text: string; streaming?: boolean}
  | {kind: 'status'; text: string; tone: 'info' | 'error' | 'warning'};
```

- [ ] **Step 5: Wire app state through `App`**

`App` must derive:

- current mode
- current draft
- active timeline
- whether a request is in flight

- [ ] **Step 6: Run tests to verify transitions pass**

Run: `npm test -- tests/state/ui-machine.test.ts`
Expected: PASS with correct mode transitions.

- [ ] **Step 7: Commit**

```bash
git add src/state src/app.tsx tests/state/ui-machine.test.ts
git commit -m "feat: add repl ui state machine"
```

## Task 3: Implement slash-command registry, filtering, and selection

**Files:**
- Create: `src/commands/types.ts`
- Create: `src/commands/registry.ts`
- Create: `src/commands/filter.ts`
- Create: `src/components/CommandPalette.tsx`
- Modify: `src/components/Composer.tsx`
- Modify: `src/app.tsx`
- Test: `tests/commands/filter.test.ts`
- Test: `tests/components/command-palette.test.tsx`

- [ ] **Step 1: Write failing command filter tests**

```ts
import {filterCommands} from '../../src/commands/filter';

it('prefers exact prefix matches', () => {
  const results = filterCommands('/mo', [
    {name: '/model', description: 'change model'},
    {name: '/permissions', description: 'permissions settings'}
  ]);

  expect(results[0].name).toBe('/model');
});

it('matches descriptions and aliases', () => {
  const results = filterCommands('/speed', [
    {name: '/fast', aliases: ['speed'], description: 'toggle fast mode'}
  ]);

  expect(results).toHaveLength(1);
});
```

- [ ] **Step 2: Write failing palette interaction test**

```tsx
it('highlights the next command with arrow down', () => {
  const {stdin, lastFrame} = render(<CommandPalette query="/" commands={commands} selectedIndex={0} />);
  stdin.write('\u001B[B');
  expect(lastFrame()).toContain('/fast');
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test -- tests/commands/filter.test.ts tests/components/command-palette.test.tsx`
Expected: FAIL because command modules do not exist.

- [ ] **Step 4: Create the command registry**

Seed at least:

```ts
[
  {name: '/model', description: 'choose what model and reasoning effort to use'},
  {name: '/fast', description: 'toggle fast mode to enable fastest inference'},
  {name: '/permissions', description: 'choose what the tool is allowed to do'},
  {name: '/review', description: 'review current changes and find issues'},
  {name: '/new', description: 'start a new chat'}
]
```

- [ ] **Step 5: Implement filtering and stable ranking**

Rules:

- exact command prefix first
- alias match second
- description keyword match third
- alphabetical tie-breaker

- [ ] **Step 6: Render the command palette**

Palette must show:

- command name
- description
- highlighted row styling
- empty state when nothing matches

- [ ] **Step 7: Wire slash-mode keyboard behavior into composer**

Support:

- `Up`
- `Down`
- `Enter`
- `Tab`
- `Esc`

- [ ] **Step 8: Run tests to verify slash mode behavior**

Run: `npm test -- tests/commands/filter.test.ts tests/components/command-palette.test.tsx`
Expected: PASS with correct filtering and selection behavior.

- [ ] **Step 9: Commit**

```bash
git add src/commands src/components src/app.tsx tests/commands tests/components
git commit -m "feat: add slash command palette"
```

## Task 4: Implement working status with elapsed timer and pulse animation

**Files:**
- Create: `src/components/WorkingStatus.tsx`
- Modify: `src/app.tsx`
- Modify: `src/state/session-store.ts`
- Test: `tests/components/working-status.test.tsx`

- [ ] **Step 1: Write the failing working status test**

```tsx
import {render} from 'ink-testing-library';
import {WorkingStatus} from '../../src/components/WorkingStatus';

it('renders elapsed seconds and interrupt hint', () => {
  const {lastFrame} = render(<WorkingStatus elapsedSeconds={7} pulsePhase={1} />);
  expect(lastFrame()).toContain('Working');
  expect(lastFrame()).toContain('7s');
  expect(lastFrame()).toContain('Esc to interrupt');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/components/working-status.test.tsx`
Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the working component**

Required API:

```ts
type WorkingStatusProps = {
  elapsedSeconds: number;
  pulsePhase: 0 | 1 | 2;
};
```

Display text:

```ts
`Working (${elapsedSeconds}s • Esc to interrupt)`
```

- [ ] **Step 4: Add timer and pulse state**

Session store must track:

- `requestStartedAt`
- `elapsedSeconds`
- `pulsePhase`

Pulse should cycle every 400-600ms across three visual intensities.

- [ ] **Step 5: Show working state immediately after submit**

Requirement:

- within 100ms of submit, timeline/status area reflects `working`

- [ ] **Step 6: Run tests to verify timer text and mode hookup**

Run: `npm test -- tests/components/working-status.test.tsx tests/state/ui-machine.test.ts`
Expected: PASS and visible elapsed-time rendering.

- [ ] **Step 7: Commit**

```bash
git add src/components/WorkingStatus.tsx src/app.tsx src/state/session-store.ts tests/components/working-status.test.tsx
git commit -m "feat: add working timer and pulse state"
```

## Task 5: Add streaming response assembly and in-progress assistant rendering

**Files:**
- Create: `src/runtime/stream-parser.ts`
- Create: `src/components/StreamingMessage.tsx`
- Modify: `src/state/session-store.ts`
- Modify: `src/app.tsx`
- Test: `tests/runtime/stream-parser.test.ts`

- [ ] **Step 1: Write the failing stream parser test**

```ts
import {appendChunk} from '../../src/runtime/stream-parser';

it('appends chunks into a single assistant message', () => {
  const first = appendChunk('', 'Hello');
  const second = appendChunk(first, ' world');
  expect(second).toBe('Hello world');
});
```

- [ ] **Step 2: Write a failing completion test**

```ts
it('marks the message as complete when the stream closes', () => {
  const result = finalizeMessage({text: 'Hello world', streaming: true});
  expect(result.streaming).toBe(false);
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test -- tests/runtime/stream-parser.test.ts`
Expected: FAIL because stream parser helpers do not exist.

- [ ] **Step 4: Implement streaming parser helpers**

Required helpers:

```ts
export function appendChunk(current: string, chunk: string): string {
  return current + chunk;
}

export function finalizeMessage(message: AssistantItem): AssistantItem {
  return {...message, streaming: false};
}
```

- [ ] **Step 5: Render streaming assistant output in place**

Behavior:

- create one assistant timeline item at stream start
- mutate text as chunks arrive
- mark complete when stream ends

- [ ] **Step 6: Run tests to verify stream assembly passes**

Run: `npm test -- tests/runtime/stream-parser.test.ts`
Expected: PASS and no duplicated message entries.

- [ ] **Step 7: Commit**

```bash
git add src/runtime/stream-parser.ts src/components/StreamingMessage.tsx src/state/session-store.ts src/app.tsx tests/runtime/stream-parser.test.ts
git commit -m "feat: add streaming assistant rendering"
```

## Task 6: Add runtime agent client, timeline events, and interrupt support

**Files:**
- Create: `src/runtime/agent-client.ts`
- Create: `src/runtime/task-events.ts`
- Create: `src/components/Timeline.tsx`
- Create: `src/components/TimelineEvent.tsx`
- Modify: `src/app.tsx`
- Modify: `src/state/session-store.ts`
- Test: `tests/state/ui-machine.test.ts`

- [ ] **Step 1: Write failing lifecycle tests for event insertion**

```ts
it('adds an event before assistant completion', () => {
  const state = addTimelineEvent(initialState, {label: 'Explored', detail: ['List rg --files']});
  expect(state.items[0]).toMatchObject({kind: 'event', label: 'Explored'});
});

it('records interruption as a status item', () => {
  const state = interruptRequest(initialState, 12);
  expect(state.items.at(-1)).toMatchObject({kind: 'status', text: 'Generation interrupted after 12s'});
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/state/ui-machine.test.ts`
Expected: FAIL because event and interrupt handlers do not exist.

- [ ] **Step 3: Implement runtime event contract**

Agent client callbacks:

```ts
type AgentCallbacks = {
  onEvent: (event: {label: string; detail?: string[]}) => void;
  onChunk: (chunk: string) => void;
  onComplete: () => void;
  onError: (message: string) => void;
};
```

- [ ] **Step 4: Implement interrupt behavior**

Requirements:

- `Esc` cancels active request
- timer stops
- status item appended:

```ts
'Generation interrupted after 12s'
```

- [ ] **Step 5: Render timeline events separately from assistant prose**

Event rows must visibly distinguish:

- label
- optional detail list
- tone or bullet marker

- [ ] **Step 6: Run tests to verify lifecycle behavior**

Run: `npm test -- tests/state/ui-machine.test.ts tests/runtime/stream-parser.test.ts`
Expected: PASS with event, interrupt, and stream lifecycle integrated.

- [ ] **Step 7: Commit**

```bash
git add src/runtime src/components/Timeline.tsx src/components/TimelineEvent.tsx src/app.tsx src/state/session-store.ts tests/state/ui-machine.test.ts
git commit -m "feat: add runtime events and interrupt flow"
```

## Task 7: Polish error states, empty states, and terminal ergonomics

**Files:**
- Modify: `src/components/Composer.tsx`
- Modify: `src/components/CommandPalette.tsx`
- Modify: `src/components/Timeline.tsx`
- Modify: `src/runtime/agent-client.ts`
- Test: `tests/components/command-palette.test.tsx`
- Test: `tests/components/working-status.test.tsx`

- [ ] **Step 1: Write failing error-state assertions**

```tsx
it('shows no-match text when no command matches', () => {
  const {lastFrame} = render(<CommandPalette query="/zzz" commands={commands} selectedIndex={0} />);
  expect(lastFrame()).toContain('No matching command');
});

it('shows a structured error message after request failure', () => {
  const frame = renderErrorFrame('Network request failed. Retry with /new or check connection.');
  expect(frame).toContain('Network request failed');
  expect(frame).toContain('Retry');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/components/command-palette.test.tsx`
Expected: FAIL because empty/error states are incomplete.

- [ ] **Step 3: Implement empty, error, and recovery states**

Required strings:

- `No matching command`
- `Network request failed. Retry with /new or check connection.`

- [ ] **Step 4: Verify terminal rendering remains stable under long output**

Run manual check:

```bash
npm run dev
```

Expected:

- composer remains pinned at bottom
- command palette does not overlap final lines incorrectly
- timeline can hold long assistant output without flicker

- [ ] **Step 5: Run full test suite**

Run: `npm test -- --runInBand`
Expected: PASS for all command, state, runtime, and component tests.

- [ ] **Step 6: Commit**

```bash
git add src/components src/runtime tests
git commit -m "feat: polish repl terminal states"
```

## Verification Checklist

- [ ] Startup shell shows product, model, and cwd
- [ ] Slash command suggestions open and can be navigated with keyboard
- [ ] Submit enters working state immediately
- [ ] Working state shows elapsed seconds
- [ ] Working label visibly pulses
- [ ] Streaming output updates incrementally
- [ ] Timeline events can appear before response completion
- [ ] `Esc` interrupts the active request
- [ ] Error blocks provide recovery guidance

## Manual Demo Script

1. Run `npm install`
2. Run `npm run dev`
3. Confirm welcome card is visible
4. Type `/` and confirm command palette appears
5. Use arrow keys to highlight `/model`
6. Submit a sample prompt
7. Confirm `Working (0s • Esc to interrupt)` appears quickly
8. Wait for a streamed response and verify the text grows incrementally
9. Submit another prompt and press `Esc`
10. Confirm interruption status appears in the timeline

## Risks to Watch

- Ink redraw behavior may flicker if state updates are too granular.
- Timer and pulse animation can cause excessive rerenders if not isolated.
- Streaming plus keyboard input requires careful coordination to avoid focus loss.
- Windows terminal behavior should be validated early because key handling can differ.

## Recommended Execution Order

1. Implement Tasks 1-3 to establish the shell and input model.
2. Implement Task 4 before real LLM integration so waiting feedback exists from day one.
3. Implement Tasks 5-6 together to connect streaming and runtime events.
4. Finish with Task 7 for resilience and terminal polish.
