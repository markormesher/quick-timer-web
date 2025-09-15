import React, { ReactElement } from "react";

function App(): ReactElement {
  const timers = [30_000, 60_000, 90_000, 120_000, 150_000, 180_000, 240_000];

  const [activeTimerStart, setActiveTimerStart] = React.useState(0);
  const [activeTimerDuration, setActiveTimerDuration] = React.useState(0);
  const [activeTimerRemaining, setActiveTimerRemaining] = React.useState(0);
  const [animationTick, setAnimationTick] = React.useState(0);

  const [updateAvailable, setUpdateAvailable] = React.useState(false);

  function startTimer(t: number) {
    setActiveTimerDuration(t);
    setActiveTimerStart(new Date().getTime());
  }

  React.useEffect(() => {
    if (activeTimerStart == 0 || activeTimerDuration == 0) {
      return;
    }

    const now = new Date().getTime();
    const remaining = activeTimerDuration - (now - activeTimerStart);
    if (remaining <= 0) {
      setActiveTimerStart(0);
      setActiveTimerDuration(0);
      return;
    }

    setActiveTimerRemaining(remaining);
    setTimeout(() => setAnimationTick(now), 100);
  }, [animationTick, activeTimerDuration, activeTimerStart]);

  React.useEffect(() => {
    navigator.serviceWorker?.addEventListener("message", (evt: MessageEvent) => {
      if (evt.data == "UPDATE_AVAILABLE") {
        setUpdateAvailable(true);
      }
    });
  }, []);

  if (activeTimerDuration == 0) {
    const updateNotice = updateAvailable ? (
      <div className={"footer-text footer-overlay"} onClick={() => window.location.reload()}>
        Reload to update.
      </div>
    ) : null;

    return (
      <>
        <div className={"timer-list"}>
          {timers.map((t) => {
            return (
              <div className={"timer"} key={"timer-" + t} onClick={() => startTimer(t)}>
                {formatTime(t)}
              </div>
            );
          })}
        </div>
        {updateNotice}
      </>
    );
  }

  return (
    <div className={"timer-display-wrapper"}>
      <div
        className={"timer-bg"}
        style={{ height: Math.max(0, activeTimerRemaining / activeTimerDuration) * 100 + "%" }}
      ></div>
      <div className={"timer-label"}>{formatTime(activeTimerRemaining)}</div>
      <div className={"footer-text"} onClick={() => setActiveTimerDuration(0)}>
        Cancel
      </div>
    </div>
  );
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / 1000 / 60);

  let out = seconds.toLocaleString("en-GB", { minimumIntegerDigits: 2 }) + "s";
  if (minutes > 0) {
    out = minutes.toLocaleString("en-GB", { minimumIntegerDigits: 2 }) + "m " + out;
  }

  return out;
}

export { App };
