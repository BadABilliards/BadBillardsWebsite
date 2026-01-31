/*
 * Author: BankkRoll
 * Date: 10/9/2023
 * Updated: 3/7/2024
 */

import React from "react";
import { payoutSettings } from "./checkwin";
import { useAnimation } from "framer-motion";

interface SpinProps {
  setIsSpinning: React.Dispatch<React.SetStateAction<boolean>>;
  reelControls: ReturnType<typeof useAnimation>[];
  setReels: React.Dispatch<React.SetStateAction<number[][]>>;
  settings: { sounds: string };
  spinningAudio: HTMLAudioElement | null;
  checkWin: (newReels: number[][]) => void;
  bet: number;
  spendCoins?: (amount: number) => void;
}

const betRateAdjustment: Record<number, number> = {
  5: 1.4,
  10: 1.6,
  25: 1.8,
  50: 2,
  100: 2.8,
};

function chooseSymbolBasedOnChance(chances: Record<number, number>) {
  const symbols = Object.keys(chances).map(Number);
  const weightedSymbols: number[] = [];

  // Create a weighted list of symbols based on their win rates
  for (const symbol of symbols) {
    const entries = Math.floor(chances[symbol] * 9);
    weightedSymbols.push(...Array(entries).fill(symbol));
  }

  // Select a symbol randomly from the weighted list
  const randomIndex = Math.floor(Math.random() * weightedSymbols.length);
  return weightedSymbols[randomIndex];
}

export const spin = async ({
  setIsSpinning,
  reelControls,
  setReels,
  settings,
  spinningAudio,
  checkWin,
  bet,
}: SpinProps) => {
  setIsSpinning(true);

  if (spinningAudio && settings.sounds === "on") {
    spinningAudio.currentTime = 0;
    spinningAudio.play();
  }

  let newReels: number[][] = [];

  for (let i = 0; i < 3; i++) {
    const reelControl = reelControls[i];
    const symbols = Object.keys(payoutSettings).map(Number);

    const symbolChances: Record<number, number> = symbols.reduce<
      Record<number, number>
    >((acc, symbol) => {
      const adjustedRate = betRateAdjustment[bet] || 1;
      const adjustedWinRate =
        (payoutSettings[symbol].winRate * adjustedRate) / 100;
      acc[symbol] = adjustedWinRate;
      return acc;
    }, {});

    const newRow = Array.from({ length: 9 }, () => {
      let symbol = chooseSymbolBasedOnChance(symbolChances);
      return symbol;
    });

    newReels.push(newRow);

    reelControl.start({
      y: [-2500, 0],
      transition: { duration: 3.2 + i * 0.5, ease: "easeOut" },
    });
  }

  await Promise.all(reelControls.map((control) => control.stop));

  setReels(newReels);

  setTimeout(() => {
    checkWin(newReels);
    setIsSpinning(false);
  }, 5000);
};
