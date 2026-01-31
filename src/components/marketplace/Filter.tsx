import { useState, useContext } from 'react';
import Image from "next/image"
import { TextImages } from "../../assets/text"
import { IoClose, IoMenu } from 'react-icons/io5';
import { AuthContext } from '../../context/AuthContext';
import { BadCoin } from '../../assets/img';
import { useAccount } from 'wagmi';

interface FilterProp {
  filter: {
    digitalItems: boolean;
    customItems: boolean;
    apparel: boolean;
    experiences: boolean;
    buyNow: boolean;
    raffle: boolean;
    search: string;
  };
  setFilter: React.Dispatch<React.SetStateAction<{
    digitalItems: boolean;
    customItems: boolean;
    apparel: boolean;
    experiences: boolean;
    buyNow: boolean;
    raffle: boolean;
    search: string;
  }>>;
}

export function Filter({ filter, setFilter }: FilterProp) {
  const{ address } = useAccount();
  const [ openFilter, setOpenFilter ] = useState(false)
  const { setModelIsOpen, userInfo, signOut, stats, updateUserData } = useContext(AuthContext);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFilter(prevFilter => ({ ...prevFilter, [name]: checked }));
  };

  const handleConnectWallet = () => {
    console.log(address)
    if (!address) {
      setModelIsOpen('true')
    } else {
      updateUserData(address)
    }
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setFilter(prevFilter => ({ ...prevFilter, search: value }));
  };

  const handleMenu = () => {
    setOpenFilter(!openFilter)
  };

  return (
      <div className='md:w-72 w-full filter mx-auto pt-4 bg-dark-grey text-3xl p-4 rounded-2xl'>
        <Image
          src={TextImages.BadABilliards}
          width={711}
          height={100}
          style={{ width: '250px', height: 'auto', margin: '10px auto 10px' }}
          alt={'Bad a Billiard banner'}
        />
        <Image
          src={TextImages.BadAssProfile}
          width={800}
          height={100}
          className='w-1/2 md:w-full mx-auto'
          alt={'Bad a Billiard banner'}
        />
        { userInfo && 
        <div className='flex w-full justify-between'>
          <Image
            src={userInfo.pfp}
            width={300}
            height={300}
            alt={'User profile'}
            className="block w-32 h-[128px] mt-2"
          />
          <div className='w-2/3'>
            {userInfo.userName}
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
            {!userInfo.publicAddress &&<button className='profile-button' onClick={ () => handleConnectWallet()}>
              <div style={{ fontSize: '1.1rem' }}>Connect Wallet</div>
            </button>}
          </div>
        </div>
        }
        { !userInfo &&
           <h3 className='w-full hidden md:block text-center' >Please Sign in</h3>}
        { !userInfo &&
          <button className='profile-button' onClick={ () => setModelIsOpen('playFab')}>
            Sign In
          </button>
        
        }
        <Image
          src={TextImages.Filter}
          width={261}
          height={100}
          className='hidden md:block md:mx-auto my-2 mx-0'
          style={{ width: '80px', height: 'auto' }}
          alt={'Bad a Billiard banner'}
        />
        <div className='hidden md:block'>
          <label><label>
          <input
            type="text"
            name="search"
            placeholder='Search'
            value={filter.search}
            className="mx-auto pl-4 mb-2 rounded-2xl w-full  text-white bg-grey"
            onChange={handleSearchChange}
          />
        </label><br />
            <input
              type="checkbox"
              name="digitalItems"
              checked={filter.digitalItems}
              onChange={handleFilterChange}
            /> Digital Items
          </label><br />
          <label>
            <input
              type="checkbox"
              name="customItems"
              checked={filter.customItems}
              onChange={handleFilterChange}
            /> Custom Items
          </label><br />
          <label>
            <input
              type="checkbox"
              name="apparel"
              checked={filter.apparel}
              onChange={handleFilterChange}
            /> Apparel
          </label><br />
          <label>
            <input
              type="checkbox"
              name="experiences"
              checked={filter.experiences}
              onChange={handleFilterChange}
            /> Experiences
          </label><br />
          {/* <Image
          src={TextImages.ItemType}
          width={800}
          height={100}
          className='md:mx-auto my-2 mx-0'
          style={{ width: '120px', height: 'auto' }}
          alt={'Bad a Billiard banner'}
        /> */}
          <label>
            <input
              type="checkbox"
              name="buyNow"
              checked={filter.buyNow}
              onChange={handleFilterChange}
            /> Buy Now
          </label><br />
          <label>
            <input
              type="checkbox"
              name="raffle"
              checked={filter.raffle}
              onChange={handleFilterChange}
            /> Raffle
          </label><br />
        </div>
        { openFilter ?
          <>
            <button className='md:hidden block text-4xl mt-1 ml-auto mr-6' onClick={ handleMenu }>
              <IoClose />
            </button> 
            <div >
          <label><label>
          <input
            type="text"
            name="search"
            placeholder='Search'
            value={filter.search}
            className="mx-auto pl-4 mb-2 rounded-2xl w-full  text-white bg-grey"
            onChange={handleSearchChange}
          />
        </label><br />
            <input
              type="checkbox"
              name="digitalItems"
              checked={filter.digitalItems}
              onChange={handleFilterChange}
            /> Digital Items
          </label><br />
          <label>
            <input
              type="checkbox"
              name="customItems"
              checked={filter.customItems}
              onChange={handleFilterChange}
            /> Custom Items
          </label><br />
          <label>
            <input
              type="checkbox"
              name="apparel"
              checked={filter.apparel}
              onChange={handleFilterChange}
            /> Apparel
          </label><br />
          <label>
            <input
              type="checkbox"
              name="experiences"
              checked={filter.experiences}
              onChange={handleFilterChange}
            /> Experiences
          </label><br />
          <Image
          src={TextImages.ItemType}
          width={800}
          height={100}
          className='md:mx-auto my-2 mx-0 w-44'
          alt={'Bad a Billiard banner'}
        />
          <label>
            <input
              type="checkbox"
              name="buyNow"
              checked={filter.buyNow}
              onChange={handleFilterChange}
            /> Buy Now
          </label><br />
          <label>
            <input
              type="checkbox"
              name="raffle"
              checked={filter.raffle}
              onChange={handleFilterChange}
            /> Raffle
          </label><br />
        </div>
          </>
          :
          <button className='md:hidden w-11/12 flex justify-between text-4xl mt-1 mx-auto' onClick={ handleMenu }>
              <Image
            src={TextImages.Filter}
            width={261}
            height={100}
            style={{ width: '80px', height: 'auto' }}
            alt={'Bad a Billiard banner'}
          />
            <IoMenu />
          </button> 
        }

    </div>






  )
}