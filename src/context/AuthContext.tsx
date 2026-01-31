import React, { createContext, useState } from 'react';
import { PlayFabClient } from "playfab-sdk";
import crypto from 'crypto';
import * as CryptoJS from 'crypto-js';
import { UserInfoProp, Stats, ItemInstance } from '../lib'; 

type AuthContextProviderProp = {
children: React.ReactNode;
};

interface LoginResponse {
  success: boolean;
  message?: string;
}

type AuthContextType = {
userInfo: any;
stats: any;
inventory: any;
updateUserData: (address: string) => void;
loginWithPlayFab: (userName: string, password: string) => Promise<LoginResponse>;
modelIsOpen: string;
setModelIsOpen: React.Dispatch<React.SetStateAction<string>>;
loading: boolean;
signOut: () => void;
spendCoins: (totalBadPrice: number) => boolean;
addCoins: (amount: number) => void;
fundsModal: boolean,
setFundsModal: React.Dispatch<React.SetStateAction<boolean>>
};


export const AuthContext = createContext<AuthContextType>({
    userInfo: null,
    updateUserData: (address: string) => {},
    loginWithPlayFab: (userName: string, password: string) => 
        new Promise<LoginResponse>((resolve, reject) => {
            resolve({ success: false, message: "Default context value, not implemented" });
        }),
    modelIsOpen: 'false',
    setModelIsOpen: () => {},
    loading: false,
    signOut: () => {},
    spendCoins: () => false,
    addCoins: () => {},
    fundsModal: false,
    setFundsModal: () => {},
    stats: void[],
    inventory: void[]
  });


PlayFabClient.settings.titleId = "F2C0A";
PlayFabClient.settings.developerSecretKey = "4XF3P1IFYFSDO4TD9WKB78UEZ7TY4FGXIUXZHOIWDGHM7F3KJ8";

export const AuthContextProvider = ({ children }: AuthContextProviderProp) => {
  const [userInfo, setUserInfo] = useState<UserInfoProp | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [modelIsOpen, setModelIsOpen] = useState<string>('false');
  const [fundsModal, setFundsModal] = useState<boolean>(false);
  const [stats, setStats] = useState<Stats[] | any>();
  const [inventory, setInventory] = useState<ItemInstance[] | any>();


  
function encryptedPassword(pass: string): string {
  const maskedPass = '*'.repeat(pass.length);
  const md5Hash = CryptoJS.MD5(CryptoJS.enc.Utf8.parse(maskedPass));
  return md5Hash.toString(CryptoJS.enc.Hex).toLowerCase();
}

const deleteCustomId = () => {
  return new Promise((resolve, reject) => {
    PlayFabClient.UnlinkCustomID({
      CustomId: "Custom"
    }, (error, result) => {
      if (error) {
        console.error('Error unlinking CustomId:', error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const loginWithPlayFab = async (userName: string, password: string): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
  PlayFabClient.LoginWithPlayFab ({
    TitleId: PlayFabClient.settings.titleId,
    Username: userName,
    Password: encryptedPassword(password),
    InfoRequestParameters: {
      GetPlayerProfile: true,
      GetPlayerStatistics: true,
      GetUserAccountInfo: true,
      GetUserInventory: true,
      GetUserVirtualCurrency: true,
      GetUserData: true,
      GetUserReadOnlyData: true,
      GetCharacterInventories: true,
      GetCharacterList: true,
      GetTitleData: true,
    },
    }, (error, result) => {
    if (error) {
      console.log(error.errorMessage);
      setModelIsOpen('false');
      resolve({ success: false, message: error.errorMessage });
      return;
    }
    if (result) {
      const userResult = result.data.InfoResultPayload;
      if (userResult) {
        if (userResult.UserInventory) {
          const inventoryArray: ItemInstance[] = [];
          userResult.UserInventory.forEach((item) => {
            const newInventory: ItemInstance = {
              ItemId: item.ItemId,
              ItemInstanceId: item.ItemInstanceId,
              DisplayName: item.DisplayName,
              CatalogVersion: item.CatalogVersion,
              ItemClass: item.ItemClass,
            };
            inventoryArray.push(newInventory);
          });
          setInventory(inventoryArray);
        }

        if (userResult && userResult.PlayerProfile?.PlayerId) {
          // try {
          //   deleteCustomId();
          // } catch (deleteError) {
          //   console.error('Error deleting customId:', deleteError);
          // }
        }

        const statsArray: Stats[] = [];
        if (userResult?.PlayerStatistics) {
          userResult.PlayerStatistics.forEach((stat) => {
            const newStat: Stats = {
              StatisticName: stat.StatisticName,
              value: stat.Value,
            };
            statsArray.push(newStat);
          });
          setStats(statsArray);
        }
        setUserInfo({
          playfabId: userResult.PlayerProfile?.PlayerId ?? null,
          pfp: userResult.AccountInfo?.TitleInfo?.AvatarUrl ?? null,
          coins: userResult?.UserVirtualCurrency?.BC ?? null,
          userName: userResult?.AccountInfo?.TitleInfo?.DisplayName ?? null,
          publicAddress: userResult?.UserData?.PublicAddress?.Value ?? null,
        });

        setModelIsOpen('false');
        setLoading(false);
        resolve({ success: true });
      }
    }
  });
});
};

const updateUserData = async (address: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    PlayFabClient.UpdateUserData({
      Data: { ['PublicAddress']: address },
      Permission: "Public"
    }, (error, result) => {
      if (error) {
        console.error('Error updating user data:', error);
        reject(false);
      } else {
        var newUserInfo = userInfo
        if (newUserInfo)
          newUserInfo.publicAddress = address
        setUserInfo(newUserInfo)
        resolve(true);
      }
    });
  });
};

const signOut = async () => {
  setUserInfo(undefined)
  }

  const spendCoins = (totalBadPrice: number): boolean => {
    if ( userInfo?.coins && totalBadPrice > userInfo?.coins) {
      setFundsModal(true)
      return false
    }
    PlayFabClient.SubtractUserVirtualCurrency(
      {
        VirtualCurrency: 'BC',
        Amount: totalBadPrice
      },
      (error, result) => {
        if (result) {
          console.log(result);
          if (userInfo && result.data)
            setUserInfo({...userInfo, coins: result.data.Balance });
        } else if (error) {
          console.error(error);
        }
      }
    );
    return true;
  };

  const addCoins = (amount: number): void => {
    PlayFabClient.AddUserVirtualCurrency(
      {
        VirtualCurrency: 'BC',
        Amount: amount
      },
      (error, result) => {
        if (result) {
          console.log(result);
          if (userInfo && result.data)
            setUserInfo({...userInfo, coins: result.data.Balance });
        } else if (error) {
          console.error(error);
        }
      }
    );
  };
  

const authContextValue: AuthContextType = {
  userInfo,
  loginWithPlayFab,
  updateUserData,
  modelIsOpen,
  setModelIsOpen,
  loading,
  signOut,
  spendCoins,
  addCoins,
  fundsModal,
  setFundsModal,
  stats,
  inventory
};

return (
<AuthContext.Provider value={authContextValue}>
{children}
</AuthContext.Provider>
);
};