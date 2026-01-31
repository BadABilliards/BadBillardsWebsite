/*
 * Author: BankkRoll
 * Date: 10/9/2023
 * Updated: 3/9/2024
 */

import React from "react";

// Payout settings for each symbol. Each symbol's payout multiplier and win rate are set here.
// A higher win rate means a higher chance of winning, this is NOT a percentage of 100
// this is a weightin system.. high numbers = more likely to win as it will appear more often
// like any casino machine we can no predict the exact outcome but we can use weighting here to
// try and predict higher win rates for each symbol.
export const payoutSettings: Record<
  number,
  { multiplier: number; winRate: number }
> = {
  1: { multiplier: 2, winRate: 80 }, // BadA
  2: { multiplier: 3, winRate: 70 }, // Ace
  3: { multiplier: 4, winRate: 60 }, // Bunny
  4: { multiplier: 5, winRate: 50 }, // Cherry
  5: { multiplier: 6, winRate: 50 }, // Cluck
  6: { multiplier: 10, winRate: 40 }, // Golden Cluck
  7: { multiplier: 3, winRate: 70 }, // Cap
  8: { multiplier: 4, winRate: 60 }, // Mask
  9: { multiplier: 5, winRate: 50 }, // Wizard Hat
};

type Settings = {
  sounds: string;
  closeModalKey: string;
  spinKey: string;
};

interface CheckWinProps {
  newReels: number[][];
  setOutcome: React.Dispatch<
    React.SetStateAction<"win" | "loss" | "jackpot" | null>
  >;
  bet: number;
  setWinningPositions: React.Dispatch<React.SetStateAction<number[][] | null>>;
  setWinningAmount: React.Dispatch<React.SetStateAction<number | null>>;
  settings: Settings;
  winnerAudio: HTMLAudioElement | null;
  spinningAudio: HTMLAudioElement | null;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  spendCoins?: (amount: number) => void;
  addCoins?: (amount: number) => void;
}

export const checkWin = ({
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
}: CheckWinProps) => {
  let totalPayout = 0;
  let newWinningPositions = Array.from({ length: 3 }, () =>
    Array(3).fill(false)
  );
  let jackpotTriggered = false;

  // Check all horizontal and vertical lines for three "Cluck" symbols (#5)
  for (let i = 0; i < 3; i++) {
    // Horizontal check
    if (newReels[i][0] === 5 && newReels[i][1] === 5 && newReels[i][2] === 5) {
      jackpotTriggered = true;
      newWinningPositions[i].fill(true);
    }
    // Vertical check
    if (newReels[0][i] === 5 && newReels[1][i] === 5 && newReels[2][i] === 5) {
      jackpotTriggered = true;
      newWinningPositions[0][i] = true;
      newWinningPositions[1][i] = true;
      newWinningPositions[2][i] = true;
    }
  }

  // Diagonal checks for jackpot condition
  if (
    (newReels[0][0] === 5 && newReels[1][1] === 5 && newReels[2][2] === 5) ||
    (newReels[0][2] === 5 && newReels[1][1] === 5 && newReels[2][0] === 5)
  ) {
    jackpotTriggered = true;
    if (newReels[0][0] === 5 && newReels[1][1] === 5 && newReels[2][2] === 5) {
      newWinningPositions[0][0] = true;
      newWinningPositions[1][1] = true;
      newWinningPositions[2][2] = true;
    }
    if (newReels[0][2] === 5 && newReels[1][1] === 5 && newReels[2][0] === 5) {
      newWinningPositions[0][2] = true;
      newWinningPositions[1][1] = true;
      newWinningPositions[2][0] = true;
    }
  }

    // Continue with other win checks if jackpot wasn't triggered
    if (!jackpotTriggered) {
    for (let i = 0; i < 3; i++) {
      const symbol = newReels[i][0];
      if (symbol === newReels[i][1] && symbol === newReels[i][2]) {
        newWinningPositions[i] = [true, true, true];
        totalPayout += bet * (payoutSettings[symbol]?.multiplier || 1);
      }
    }

    for (let i = 0; i < 3; i++) {
      const symbol = newReels[0][i];
      if (symbol === newReels[1][i] && symbol === newReels[2][i]) {
        newWinningPositions[0][i] = true;
        newWinningPositions[1][i] = true;
        newWinningPositions[2][i] = true;
        totalPayout += bet * (payoutSettings[symbol]?.multiplier || 1);
      }
    }

    if (
      newReels[0][0] === newReels[1][1] &&
      newReels[1][1] === newReels[2][2]
    ) {
      const symbol = newReels[0][0];
      newWinningPositions[0][0] = true;
      newWinningPositions[1][1] = true;
      newWinningPositions[2][2] = true;
      totalPayout += bet * (payoutSettings[symbol]?.multiplier || 1);
    }

    if (
      newReels[0][2] === newReels[1][1] &&
      newReels[1][1] === newReels[2][0]
    ) {
      const symbol = newReels[0][2];
      newWinningPositions[0][2] = true;
      newWinningPositions[1][1] = true;
      newWinningPositions[2][0] = true;
      totalPayout += bet * (payoutSettings[symbol]?.multiplier || 1);
    }
  }

  if (jackpotTriggered) {
    setOutcome("jackpot");
    setShowModal(true);
    spendCoins?.(bet);
    addCoins?.(totalPayout);
    setWinningAmount(totalPayout);
    setWinningPositions(newWinningPositions);
    if (settings.sounds === "on" || settings.sounds === "win only") {
      winnerAudio?.play();
    }
  } else if (totalPayout > 0) {
    setOutcome("win");
    setShowModal(true);
    spendCoins?.(bet);
    addCoins?.(totalPayout);
    setWinningPositions(newWinningPositions);
    setWinningAmount(totalPayout);
    if (settings.sounds === "on" || settings.sounds === "win only") {
      winnerAudio?.play();
    }
  } else {
    setOutcome("loss");
    setShowModal(true);
    spendCoins?.(bet);
    setWinningPositions(null);
    if (settings.sounds === "on") {
      spinningAudio?.pause();
    }
  }
};
