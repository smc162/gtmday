"use client";

import { useEffect, useState } from "react";

function toSeconds(m: number, s: number) {
  return m * 60 + s;
}

function fromSeconds(total: number) {
  const clamped = Math.max(0, Math.floor(total));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return { minutes, seconds };
}

export default function TimerPage() {
  const defaultMinutes = 40;
  const defaultSeconds = 0;
  const [remaining, setRemaining] = useState(
    toSeconds(defaultMinutes, defaultSeconds),
  );
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || remaining <= 0) return;

    const id = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [isRunning, remaining]);

  const display = fromSeconds(remaining);
  const pad = (n: number) => n.toString().padStart(2, "0");

  const handleM = () => {
    if (isRunning) return;
    setRemaining((prev) => Math.min(99 * 60 + 59, prev + 60));
  };

  const handleS = () => {
    if (isRunning) return;
    setRemaining((prev) => Math.min(99 * 60 + 59, prev + 10));
  };

  const handleStartStop = () => {
    if (remaining <= 0) return;
    setIsRunning((r) => !r);
  };

  const handleClear = () => {
    setIsRunning(false);
    setRemaining(toSeconds(defaultMinutes, defaultSeconds));
  };

  return (
    <div className="page-shell timer-page">
      <div className="timer-device">
        <div className="timer-screen">
          <div className="timer-digits">
            <span className="timer-part">
              <span className="timer-num">{pad(display.minutes)}</span>
              <span className="timer-label">M</span>
            </span>
            <span className="timer-colon">:</span>
            <span className="timer-part">
              <span className="timer-num">{pad(display.seconds)}</span>
              <span className="timer-label">S</span>
            </span>
          </div>
        </div>
        <div className="timer-clear-row">
          <span className="timer-clear" onClick={handleClear}>
            CLEAR
          </span>
        </div>
        <div className="timer-buttons">
          <button
            type="button"
            className="timer-btn timer-btn-m"
            onClick={handleM}
            disabled={isRunning}
            aria-label="Add minute"
          >
            M
          </button>
          <button
            type="button"
            className="timer-btn timer-btn-s"
            onClick={handleS}
            disabled={isRunning}
            aria-label="Add 10 seconds"
          >
            S
          </button>
          <button
            type="button"
            className="timer-btn timer-btn-start"
            onClick={handleStartStop}
            disabled={remaining <= 0}
            aria-label={isRunning ? "Stop" : "Start"}
          >
            {isRunning ? "STOP" : "START"}
          </button>
        </div>
      </div>
    </div>
  );
}
