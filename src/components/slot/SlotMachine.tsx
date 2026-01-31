/* eslint-disable @next/next/no-img-element */
/*
 * Author: BankkRoll
 * Date: 10/9/2023
 * Updated: 3/7/2024
 */

import React, { useContext, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

import { AuthContext } from "../../context/AuthContext";
import { BadCoin } from "../../assets/img";
import Image from "next/image";
import InfoModal from "./InfoModal";
import OutcomeModal from "./OutcomeModal";
import SettingsModal from "./SettingsModal";
import { WalletModal } from "../../layout/components";
import { checkWin } from "./utils/checkwin";
import { spin } from "./utils/spin";

export const SlotMachine: React.FC = () => {
  const {
    userInfo,
    modelIsOpen,
    setModelIsOpen,
    signOut,
    spendCoins,
    addCoins,
  } = useContext(AuthContext);

  // UI
  const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  // Gameplay
  const [coins, setCoins] = useState(userInfo ? userInfo.coins : 0);
  const [bet, setBet] = useState(5);
  const setBetAmount = (amount: number) => {
    setBet(amount);
  };
  const [outcome, setOutcome] = useState<"win" | "loss" | "jackpot" | null>(
    null
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningAmount, setWinningAmount] = useState<number | null>(null);
  const [winningPositions, setWinningPositions] = useState<number[][] | null>(
    null
  );
  const [reels, setReels] = useState([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);

  const [settings, setSettings] = useState({
    sounds: "on",
    closeModalKey: "Escape",
    spinKey: "Enter",
  });

  // Animation and Audio
  const reel1Control = useAnimation();
  const reel2Control = useAnimation();
  const reel3Control = useAnimation();
  const reelControls = [reel1Control, reel2Control, reel3Control];
  const [winnerAudio, setWinnerAudio] = useState<HTMLAudioElement | null>(null);
  const [spinningAudio, setSpinningAudio] = useState<HTMLAudioElement | null>(
    null
  );

  const handleSpin = () => {
    setWinningPositions(null);
    spin({
      setIsSpinning,
      reelControls,
      setReels,
      settings,
      spinningAudio,
      bet,
      checkWin: (newReels) =>
        checkWin({
          newReels,
          setOutcome,
          bet,
          setWinningPositions,
          setWinningAmount,
          settings,
          winnerAudio,
          spinningAudio,
          setShowModal,
          spendCoins,
          addCoins,
        }),
    });
  };

  const CloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    // Update the local state whenever userInfo changes
    if (userInfo) {
      setCoins(userInfo.coins);
    }

    // Initialize audio
    setSpinningAudio(new Audio("/slots/spinning.mp3"));
    setWinnerAudio(new Audio("/slots/winner.mp3"));

    // Listen for the custom spin key
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        (event.code === "Enter" || event.code === settings.spinKey) &&
        !isSpinning &&
        coins >= bet
      ) {
        handleSpin();
      }
      if (event.code === "Escape" || event.code === settings.closeModalKey) {
        if (showModal) {
          CloseModal();
        }
        if (showSettingsModal) {
          setShowSettingsModal(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    userInfo,
    settings,
    isSpinning,
    coins,
    bet,
    showModal,
    showSettingsModal,
  ]);

  return (
    <>
      <WalletModal
        modelIsOpen={modelIsOpen}
        CloseModal={() => setModelIsOpen("false")}
      />
      {userInfo ? (
        <>
          <OutcomeModal
            show={showModal}
            outcome={outcome ?? "loss"}
            onClose={CloseModal}
            winningAmount={winningAmount ?? undefined}
            closeModalKey={settings.closeModalKey}
          />
          <SettingsModal
            show={showSettingsModal}
            onClose={() => setShowSettingsModal(false)}
            settings={settings as any}
            updateSettings={(newSettings) => setSettings(newSettings)}
          />
          <InfoModal
            show={showInfoModal}
            onClose={() => setShowInfoModal(false)}
          />
          <div className="h-full flex items-center justify-center relative">
            {/* Reels Layer */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="overflow-hidden mt-10 h-[140px] sm:mt-16 sm:h-[180px] md:mt-20 lg:mt-24 xl:mt-32 md:h-[250px] lg:h-[275px] xl:h-[300px]">
                <div className="grid grid-cols-3 mx-auto gap-x-2 sm:gap-x-3 xl:gap-x-5 mr-8 sm:mr-10 md:mr-12 lg:mr-16 xl:mr-16">
                  {reelControls.map((control, idx) => (
                    <motion.div key={idx} animate={control}>
                      {Array.from({ length: 10 }, (_, k) => k).map((k) =>
                        reels[idx].map((value, index) => (
                          <div
                            key={`${k}-${index}`}
                            className={`bg-white w-[4.2rem] h-[2.7rem] sm:w-[5rem] sm:h-[3.2rem] md:w-[7.5rem] md:h-[4.5rem] lg:w-36 lg:h-20 xl:w-36 xl:h-20 flex items-center justify-center`}
                          >
                            <img
                              src={`/slots/slot${value}.png`}
                              alt={`Image ${value}`}
                              className={`object-cover ${
                                winningPositions && winningPositions[idx][index]
                                  ? "goldenGlow"
                                  : ""
                              }`}
                            />
                          </div>
                        ))
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Background Image Layer */}
            <div
              className={`made-by-bankkroll relative z-1 bg-no-repeat bg-cover bg-center w-full h-[300px] sm:h-[300px] md:h-[500px] lg:bg-contain lg:bg-center lg:h-[600px] xl:h-[600px] max-w-[1200px] flex items-center justify-center ${
                windowWidth <= 1200 ? "bg-center" : "bg-80"
              }`}
            >
              <div className="lever-button">
                {coins >= bet && !isSpinning ? (
                  <button
                    type="button"
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className="text-black font-bold rounded-full flex items-center justify-center glow w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-20 xl:h-20"
                  >
                    Spin
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="text-gray-600 font-bold rounded-full flex items-center justify-center glow cursor-not-allowed w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-20 xl:h-20"
                  >
                    Spinning..
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="container mx-auto p-4">
            {/* Bet Buttons */}
            <div className="bet-buttons flex justify-center space-x-4 mb-8">
              <p className="align-middle mt-5">Bet:</p>
              <div>
                <img
                  src="/slots/bet5.png"
                  alt="Bet 5"
                  className={`w-12 md:w-20 h-12 md:h-20 cursor-pointer transition duration-200 hover:shadow-xl transform hover:scale-105 ${
                    bet === 5 ? "ring-2 ring-white scale-110" : ""
                  } ${coins < 5 ? "grayscale" : ""}`}
                  onClick={() => {
                    if (coins >= 5) setBetAmount(5);
                  }}
                />
                <p className="text-center">5</p>
              </div>
              <div>
                <img
                  src="/slots/bet10.png"
                  alt="Bet 10"
                  className={`w-12 md:w-20 h-12 md:h-20 cursor-pointer transition duration-200 hover:shadow-xl transform hover:scale-105 ${
                    bet === 10 ? "ring-2 ring-white scale-110" : ""
                  } ${coins < 10 ? "grayscale" : ""}`}
                  onClick={() => {
                    if (coins >= 10) setBetAmount(10);
                  }}
                />
                <p className="text-center">10</p>
              </div>
              <div>
                <img
                  src="/slots/bet25.png"
                  alt="Bet 25"
                  className={`w-12 md:w-20 h-12 md:h-20 cursor-pointer transition duration-200 hover:shadow-xl transform hover:scale-105 ${
                    bet === 25 ? "ring-2 ring-white scale-110" : ""
                  } ${coins < 25 ? "grayscale" : ""}`}
                  onClick={() => {
                    if (coins >= 25) setBetAmount(25);
                  }}
                />
                <p className="text-center">25</p>
              </div>
              <div>
                <img
                  src="/slots/bet50.png"
                  alt="Bet 50"
                  className={`w-12 md:w-20 h-12 md:h-20 cursor-pointer transition duration-200 hover:shadow-xl transform hover:scale-105 ${
                    bet === 50 ? "ring-2 ring-white scale-110" : ""
                  } ${coins < 50 ? "grayscale" : ""}`}
                  onClick={() => {
                    if (coins >= 50) setBetAmount(50);
                  }}
                />
                <p className="text-center">50</p>
              </div>
              <div>
                <img
                  src="/slots/bet100.png"
                  alt="Bet 100"
                  className={`w-12 md:w-20 h-12 md:h-20 cursor-pointer transition duration-200 hover:shadow-xl transform hover:scale-105 ${
                    bet === 100 ? "ring-2 ring-white scale-110" : ""
                  } ${coins < 100 ? "grayscale" : ""}`}
                  onClick={() => {
                    if (coins >= 100) setBetAmount(100);
                  }}
                />
                <p className="text-center">100</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center p-2 md:p-4">
              <div className="flex items-center mb-4 md:mb-0">
                <Image
                  src={userInfo.pfp}
                  width={100}
                  height={100}
                  alt={"User profile"}
                  className="block rounded-full shadow-inner"
                />
                <div className="ml-2 md:ml-4">
                  <h1 className="text-lg md:text-xl font-semibold">
                    {userInfo.userName}
                  </h1>
                  <div className="flex items-center mt-1 md:mt-2">
                    <Image
                      src={BadCoin}
                      width={24}
                      height={24}
                      alt={"Bad Coin"}
                      className="inline mr-1 md:mr-2"
                    />
                    <span className="text-sm md:text-lg font-bold">
                      {coins}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 md:space-x-4">
                <button
                  className="bg-gray-800 text-white py-1 md:py-2 px-2 md:px-4 rounded hover:bg-gray-900 transition duration-200"
                  onClick={() => setShowInfoModal(true)}
                >
                  Info
                </button>
                <button
                  className="bg-gray-800 text-white py-1 md:py-2 px-2 md:px-4 rounded hover:bg-gray-900 transition duration-200"
                  onClick={() => setShowSettingsModal(true)}
                >
                  ⚙️
                </button>
                <button
                  className="bg-red-600 text-white py-1 md:py-2 px-2 md:px-4 rounded hover:bg-red-700 transition duration-200"
                  onClick={() => signOut()}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="login-section flex flex-col items-center justify-center h-full">
          <Image
            src="/slots/slots.png"
            width={500}
            height={300}
            alt={"Bad Coin"}
            className="inline mr-1 md:mr-2"
          />
          <p className="text-lg m-6 text-center">
            Sign in to play and use BadCoins to spin your way to the top.
          </p>
          <button
            style={{ backgroundColor: "#2C791F" }}
            className="w-60 block rounded-xl py-3"
            onClick={() => setModelIsOpen("playFab")}
          >
            Sign In
          </button>
        </div>
      )}
    </>
  );
};
