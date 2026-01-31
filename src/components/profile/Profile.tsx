import { Stats } from "../../lib"
import Image from "next/image"
import { TextImages } from "../../assets/text"
import { BadCoin } from "../../assets/img"
import {useContext} from 'react'
import { AuthContext } from "../../context"



export function Profile( ) {
  const { userInfo, stats, inventory } = useContext(AuthContext)

  const totalGames = stats.find((stat: Stats | undefined) => stat?.StatisticName === 'totalGamesPlayed') ?? 0;
  const totalWins = stats.find((stat: Stats | undefined) => stat?.StatisticName === 'totalGamesWon') ?? 0;
  const inventoryTotal = inventory.length ?? 0

  console.log(totalGames)
  
  
  return (
    <div className='max-w-5xl w-full mx-auto pt-4 bg-dark-grey p-4 rounded-2xl'>
      { userInfo &&
      <div>
        <div className="grid profile-block">
          <Image
            src={TextImages.BadABilliards}
            width={711}
            height={100}
            className="block w-60"
            alt={'Bad a Billiard banner'}
          />
          <h1 className="text-6xl text-center">{userInfo.userName}</h1>
        </div>
        <div className="lg:flex justify-between" >
        { userInfo.pfp && 
          <Image
            src={userInfo.pfp}
            width={300}
            height={300}
            alt={'User profile'}
            className="block w-1/4 lg:ml-0 mx-auto mt-2"
          />
        }
        <div className="w-full flex mx-2">
        <div className="border-4 rounded-3xl lg:w-2/5 w-3/4 p-4 m-2">
          <div>
          <Image
                src={BadCoin}
                width={25}
                height={25}
                alt={'Bad Coin'}
                className="inline mb-1 mr-1"
              />
            {userInfo.coins}
          </div>
          <div>Items in inventory: {inventoryTotal}</div>
        </div>
        <div className="border-4 rounded-3xl lg:w-3/5 w-3/4 p-4 m-2">
          <div className="flex justify-between">
            <p>Total Wins: </p>
            <p>{totalWins.value}</p>
          </div>
          <div className="flex justify-between">
            <p>Total Loses: </p>
            <p>{totalWins.value && totalGames.value - totalWins.value }</p>
          </div>
          <div className="flex justify-between">
            <p>Win %: </p>
            <p>{ totalGames.value && totalWins.value/totalGames.value }</p>
          </div>
        </div>
        </div>
      </div>
      </div>
        }
    </div>
  )
}