/*
 * Author: BankkRoll
 * Date: 10/9/2023
 * Updated: 3/7/2024
 */

import React, { useEffect, useRef, useState } from "react";

import { supabase } from "../../utils/supabaseClient";

interface JackpotFormInfo {
  first_name: string;
  last_name: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  phone?: string;
  email?: string;
}

interface OutcomeModalProps {
  show: boolean;
  outcome: "win" | "loss" | "jackpot";
  onClose: () => void;
  winningAmount?: number;
  closeModalKey: string;
  jackpotInfo?: JackpotFormInfo;
}

const OutcomeModal: React.FC<OutcomeModalProps> = ({
  show,
  outcome,
  onClose,
  winningAmount,
  closeModalKey,
}) => {
  const [jackpotFormInfo, setJackpotFormInfo] = useState<JackpotFormInfo>({
    first_name: "",
    last_name: "",
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
    phone: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJackpotFormInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: any) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === closeModalKey) {
      onClose();
    }
  };

  useEffect(() => {
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [show, closeModalKey]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const { error } = await supabase.from("physicalwinners").insert([
      {
        first_name: jackpotFormInfo.first_name,
        last_name: jackpotFormInfo.last_name,
        street_address: jackpotFormInfo.street_address,
        city: jackpotFormInfo.city,
        state: jackpotFormInfo.state,
        zip_code: jackpotFormInfo.zip_code,
        phone: jackpotFormInfo.phone || null,
        email: jackpotFormInfo.email || null,
      },
    ]);

    if (error) {
      alert("There was an error submitting your information: " + error.message);
    } else {
      alert("Information submitted successfully!");
      setJackpotFormInfo({
        first_name: "",
        last_name: "",
        street_address: "",
        city: "",
        state: "",
        zip_code: "",
        phone: "",
        email: "",
      });
      onClose();
    }
  };

  if (!show) {
    return null;
  }

  if (outcome === "jackpot") {
    return (
      <div
        className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-60"
        onClick={onClose}
      >
        <div
          ref={modalRef}
          className="modal-block rounded-lg shadow-lg max-w-lg mx-auto p-6 text-white relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-0 right-0 mt-1 md:mt-2 mr-1 md:mr-2 text-red-500 hover:text-red-600 text-4xl md:text-6xl transition-colors duration-300 ease-in-out"
            aria-label="Close modal"
          >
            &times;
          </button>
          <div className="text-center">
            <h2 className="text-lg md:text-3xl mb-2 text-shadow">
              🎉 You won a physical prize! 🎉
            </h2>
            <div className="flex w-full justify-center mb-2">
              <img
                src="/slots/jackpot.gif"
                alt={"jackpot"}
                className="object-contain rounded-md"
              />
            </div>
            <p className="text-lg">Please provide your shipping information:</p>
            <div className="mt-4 text-left">
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* First Name */}
                <div className="flex justify-between gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="first_name"
                      className="block text-sm font-medium"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      value={jackpotFormInfo.first_name || ""}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black text-md"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="flex-1">
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-medium"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      value={jackpotFormInfo.last_name || ""}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black text-md"
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label
                    htmlFor="street_address"
                    className="block text-sm font-medium"
                  >
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street_address"
                    id="street_address"
                    value={jackpotFormInfo.street_address || ""}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black text-md"
                  />
                </div>

                {/* City, State, Zip Code */}
                <div className="flex justify-between gap-4">
                  <div className="flex-1">
                    <label htmlFor="city" className="block text-sm font-medium">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={jackpotFormInfo.city || ""}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black text-md"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium"
                    >
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      id="state"
                      value={jackpotFormInfo.state || ""}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black text-md"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="zip_code"
                      className="block text-sm font-medium"
                    >
                      Zip/Postal Code
                    </label>
                    <input
                      type="text"
                      name="zip_code"
                      id="zip_code"
                      value={jackpotFormInfo.zip_code || ""}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black text-md"
                    />
                  </div>
                </div>

                {/* Phone and Email */}
                <div className="flex justify-between gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium"
                    >
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={jackpotFormInfo.phone || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black text-md"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium"
                    >
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={jackpotFormInfo.email || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black text-md"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-green-500 py-2 mt-4"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="modal-block rounded-lg shadow-lg max-w-sm mx-auto p-2 md:p-4 text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-1 md:mt-2 mr-1 md:mr-2 text-red-500 hover:text-red-600 text-4xl md:text-6xl transition-colors duration-300 ease-in-out"
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="p-2 md:p-4 text-center">
          <div className="flex justify-center mb-2 md:mb-4">
            <img
              src={
                outcome === "win" ? "/slots/winner.gif" : "/slots/looser.gif"
              }
              alt={outcome === "win" ? "You won!" : "You lost!"}
              className="object-contain h-[100px] md:h-[200px] w-auto"
            />
          </div>
          <div className="text-center p-2 md:p-4 rounded-t-lg">
            <h2 className="text-2xl md:text-4xl mb-2 md:mb-4 text-shadow">
              {outcome === "win"
                ? `🎉 You won ${winningAmount} coins! 🎉`
                : "🍀 Better luck next time 🍀"}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutcomeModal;
