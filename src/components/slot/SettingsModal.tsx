/*
 * Author: BankkRoll
 * Date: 10/9/2023
 */

import React, { useEffect, useState } from "react";

interface SettingsModalProps {
  show: boolean;
  onClose: () => void;
  settings: {
    sounds: "off" | "on" | "win only";
    closeModalKey: string;
    spinKey: string;
    extraCloseModalKey: string;
    extraSpinKey: string;
  };
  updateSettings: (newSettings: any) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  show,
  onClose,
  settings,
  updateSettings,
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  const listenForKeyPress = (
    keyName: string,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    // Prevent the "Space" key from being set to prevent page scroll
    if (event.code !== "Space") {
      setLocalSettings({ ...localSettings, [keyName]: event.code });
      setFocusedKey(null);
    }
  };

  const handleFocus = (keyName: string) => {
    setFocusedKey(keyName);
  };

  return show ? (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="modal-block rounded-lg shadow-lg max-w-md mx-auto p-2 md:p-4 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-1 md:mt-2 mr-1 md:mr-2 text-red-500 hover:text-red-600 text-4xl md:text-6xl transition-colors duration-300 ease-in-out"
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="p-2 md:p-4">
          <h2 className="text-3xl md:text-4xl mb-2 md:mb-4 text-center text-shadow">
            Settings
          </h2>
          <div className="mb-2 md:mb-4 flex flex-col md:flex-row justify-between items-center">
            <label className="text-base md:text-lg mb-1 md:mb-0 w-full">
              Sounds:
            </label>
            <select
              className="text-black rounded p-1 md:p-2 w-full md:w-auto"
              value={localSettings.sounds}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  sounds: e.target.value as "on" | "off" | "win only",
                })
              }
            >
              <option value="on">On</option>
              <option value="off">Off</option>
              <option value="win only">Win Only</option>
            </select>
          </div>
          <div className="hidden mb-2 md:mb-4 md:flex flex-col md:flex-row justify-between items-center">
            <label className="text-base md:text-lg mb-1 md:mb-0 w-full">
              Close Modal Key:
            </label>
            <div className="flex items-center justify-end w-full">
              <input
                type="text"
                value="Escape"
                readOnly
                className="text-black rounded p-1 md:p-2 w-full md:w-1/4 text-center mr-0 md:mr-2 mb-1 md:mb-0"
              />
              <input
                type="text"
                value={
                  focusedKey === "closeModalKey"
                    ? "Press any key..."
                    : localSettings.closeModalKey
                }
                onFocus={() => handleFocus("closeModalKey")}
                onKeyDown={(e) => listenForKeyPress("closeModalKey", e)}
                readOnly
                className="text-black rounded p-1 md:p-2 w-full md:w-1/2 text-center"
              />
            </div>
          </div>
          <div className="hidden mb-6 md:mb-6 md:flex flex-col md:flex-row justify-between items-center">
            <label className="text-base md:text-lg mb-1 md:mb-0 w-full">
              Spin Key:
            </label>
            <div className="flex items-center justify-end w-full">
              <input
                type="text"
                value="Enter"
                readOnly
                className="text-black rounded p-1 md:p-2 w-full md:w-1/4 text-center mr-0 md:mr-2 mb-1 md:mb-0"
              />
              <input
                type="text"
                value={
                  focusedKey === "spinKey"
                    ? "Press any key..."
                    : localSettings.spinKey
                }
                onFocus={() => handleFocus("spinKey")}
                onKeyDown={(e) => listenForKeyPress("spinKey", e)}
                readOnly
                className="text-black rounded p-1 md:p-2 w-full md:w-1/2 text-center"
              />
            </div>
          </div>
          <button className="profile-button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default SettingsModal;
