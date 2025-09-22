import React, { ReactElement } from "react";
import { Icon } from "./icon.js";

function PrefBar(): ReactElement {
  const [theme, toggleTheme] = usePrefToggle("theme", ["auto", "light", "dark"]);
  const [soundEnabled, toggleSoundEnabled] = usePrefToggle("sound-enabled", ["on", "off"]);
  const [vibrateEnabled, toggleVibrateEnabled] = usePrefToggle("vibrate-enabled", ["on", "off"]);

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

function usePrefToggle(key: string, values: string[]): [string, () => void] {
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
    window.dispatchEvent(new CustomEvent<{ key: string }>("prefChanged", { detail: { key } }));
  };

  return [reactState, toggle];
}

function usePrefValue(key: string): string {
  const [value, setValue] = React.useState("");

  const update = React.useCallback(() => {
    setValue(localStorage.getItem(key) ?? "");
  }, [key, setValue]);

  React.useEffect(() => {
    const listener = (evt: CustomEventInit<{ key: string }>) => {
      if (evt?.detail?.key == key) {
        update();
      }
    };

    window.addEventListener("prefChanged", listener);
    return function cleanup() {
      window.removeEventListener("prefChanged", listener);
    };
  }, [key, update]);

  React.useEffect(() => update(), [update]);

  return value;
}

function readPref(key: string): string {
  return localStorage.getItem(key) ?? "";
}

export { PrefBar, readPref, usePrefValue };
