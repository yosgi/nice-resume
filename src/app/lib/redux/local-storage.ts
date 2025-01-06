import type { RootState } from "lib/redux/store";

// Reference: https://dev.to/igorovic/simplest-way-to-persist-redux-state-to-localstorage-e67

const LOCAL_STORAGE_KEY = "open-resume-state";

export const loadStateFromLocalStorage = () => {
  try {
    const stringifiedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stringifiedState) return undefined;
    return JSON.parse(stringifiedState);
  } catch (e) {
    return undefined;
  }
};

export const saveStateToLocalStorage = (state: RootState) => {
  try {
    const stringifiedState = JSON.stringify(state);
    localStorage.setItem(LOCAL_STORAGE_KEY, stringifiedState);
  } catch (e) {
    // Ignore
  }
};

// export to json file
export const exportStateFromLocalStorage = () => {
  const state = loadStateFromLocalStorage();
  if (!state) return;
  const stringifiedState = JSON.stringify(state);
  const blob = new Blob([stringifiedState], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "open-resume-state.json";
  a.click();
  URL.revokeObjectURL(url);
};

export const getHasUsedAppBefore = () => Boolean(loadStateFromLocalStorage());
