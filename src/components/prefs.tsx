import React, { ReactElement } from "react";
import { Icon } from "./icon.js";

function PrefBar(): ReactElement {
  const [theme, toggleTheme] = usePersistedToggle("theme", ["auto", "light", "dark"]);
  const [soundEnabled, toggleSoundEnabled] = usePersistedToggle("sound-enabled", ["on", "off"]);
  const [vibrateEnabled, toggleVibrateEnabled] = usePersistedToggle("vibrate-enabled", ["on", "off"]);

  const themeIcons: Record<string, string> = {
    auto: "brightness_auto",
    light: "light_mode",
    dark: "dark_mode",
  };

  const soundEnabledIcons: Record<string, string> = {
    on: "volume_up",
    off: "volume_off",
  };

  const vibrateEnabledIcons: Record<string, string> = {
    on: "mobile_vibrate",
    off: "mobile",
  };

  return (
    <div className={"pref-bar"}>
      <span onClick={toggleTheme}>
        <Icon name={themeIcons[theme] ?? ""} />
      </span>
      <span onClick={toggleSoundEnabled}>
        <Icon name={soundEnabledIcons[soundEnabled] ?? ""} />
      </span>
      <span onClick={toggleVibrateEnabled}>
        <Icon name={vibrateEnabledIcons[vibrateEnabled] ?? ""} />
      </span>
    </div>
  );
}

function usePersistedToggle(key: string, values: string[]): [string, () => void] {
  const [reactState, setReactState] = React.useState("");

  React.useEffect(() => {
    const initial = localStorage.getItem(key);
    if (initial && values.includes(initial)) {
      setReactState(initial);
    } else {
      setReactState(values[0] ?? "");
    }
  }, [key, values, setReactState]);

  const toggle = () => {
    const currIdx = values.indexOf(reactState);
    let newIdx = 0;
    if (currIdx >= 0 && currIdx <= values.length - 2) {
      newIdx = currIdx + 1;
    }

    setReactState(values[newIdx] ?? "");
    localStorage.setItem(key, values[newIdx] ?? "");
  };

  return [reactState, toggle];
}

export { PrefBar };
