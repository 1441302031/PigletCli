import React, {useEffect, useState} from "react";
import {Text} from "ink";
import {tokens} from "../theme/tokens.js";

type WorkingIndicatorProps = {
  startedAt: number;
};

function getElapsedSeconds(startedAt: number) {
  return Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
}

export function WorkingIndicator({startedAt}: WorkingIndicatorProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(() =>
    getElapsedSeconds(startedAt)
  );
  const [highlighted, setHighlighted] = useState(false);

  useEffect(() => {
    setElapsedSeconds(getElapsedSeconds(startedAt));

    const timer = setInterval(() => {
      setElapsedSeconds(getElapsedSeconds(startedAt));
    }, 1000);

    return () => clearInterval(timer);
  }, [startedAt]);

  useEffect(() => {
    const pulse = setInterval(() => {
      setHighlighted(current => !current);
    }, 700);

    return () => clearInterval(pulse);
  }, []);

  return (
    <Text color={highlighted ? "white" : tokens.muted}>
      {`Working (${elapsedSeconds}s • Esc to interrupt)`}
    </Text>
  );
}
