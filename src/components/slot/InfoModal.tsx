/*
 * Author: BankkRoll
 * Date: 3/6/2024
 * Updated: 3/7/2024
 */

import React, { useEffect, useState } from "react";

interface InfoModalProps {
  show: boolean;
  onClose: () => void;
}

const symbols = [
  { id: 1, multiplier: 2, description: "BadA", image: "slot1.png" },
  { id: 2, multiplier: 3, description: "Ace", image: "slot2.png" },
  { id: 3, multiplier: 4, description: "Bunny", image: "slot3.png" },
  { id: 4, multiplier: 5, description: "Cherry", image: "slot4.png" },
  {
    id: 5,
    multiplier: 6,
    description: "Cluck",
    image: "slot5.png",
    physical: true,
  },
  { id: 6, multiplier: 10, description: "Golden Cluck", image: "slot6.png" },
  { id: 7, multiplier: 3, description: "Cap", image: "slot7.png" },
  { id: 8, multiplier: 4, description: "Mask", image: "slot8.png" },
  { id: 9, multiplier: 5, description: "Wizard Hat", image: "slot9.png" },
];

const InfoModal = ({ show, onClose }: InfoModalProps) => {
  return show ? (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="modal-block rounded-lg shadow-lg max-w-4xl mx-auto p-4 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-1 md:mt-2 mr-1 md:mr-2 text-red-500 hover:text-red-600 text-4xl md:text-6xl transition-colors duration-300 ease-in-out"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-3xl mb-4 text-center">Win Information</h2>
        <div className="grid grid-cols-3 gap-4">
          {symbols.map((symbol) => (
            <div
              key={symbol.id}
              className="text-center outline outline-white rounded-md"
            >
              <img
                src={`/slots/${symbol.image}`}
                alt={symbol.description}
                className="mx-auto"
              />
              <div>{symbol.description}</div>
              <div>Multiplier: x{symbol.multiplier}</div>
              <div>{symbol.physical ? "Jackpot Physical Item" : ""}</div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <p>Winning combinations are formed by matching symbols:</p>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {/* Horizontal Example */}
            <div className="flex flex-col items-center">
              <p className="mb-2">Horizontally</p>
              <div className="grid grid-cols-3 gap-1">
                <div className="w-8 h-8 bg-green-500"></div>
                <div className="w-8 h-8 bg-green-500"></div>
                <div className="w-8 h-8 bg-green-500"></div>
              </div>
            </div>
            {/* Vertically Example */}
            <div className="flex flex-col items-center">
              <p className="mb-2">Vertically</p>
              <div className="flex">
                <div className="flex flex-col gap-1">
                  <div className="w-8 h-8 bg-green-500"></div>
                  <div className="w-8 h-8 bg-green-500"></div>
                  <div className="w-8 h-8 bg-green-500"></div>
                </div>
              </div>
            </div>
            {/* Diagonally Example */}
            <div className="flex flex-col items-center">
              <p className="mb-2">Diagonally</p>
              <div className="grid grid-cols-3 gap-1">
                <div className="w-8 h-8 bg-green-500"></div>
                <div className="w-8 h-8"></div>
                <div className="w-8 h-8"></div>
                <div className="w-8 h-8"></div>
                <div className="w-8 h-8 bg-green-500"></div>
                <div className="w-8 h-8"></div>
                <div className="w-8 h-8"></div>
                <div className="w-8 h-8"></div>
                <div className="w-8 h-8 bg-green-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default InfoModal;
