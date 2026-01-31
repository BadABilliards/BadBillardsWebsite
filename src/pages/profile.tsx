import { useContext } from "react";
import { MerchNavbar, Footer } from "../layout";
import { Profile, Inventory, Assets, Orders } from "../components/profile";
import { AuthContext } from "../context/AuthContext";
import { Stats } from "../lib";


export default function ProfilePage() {
  const { userInfo, setModelIsOpen } = useContext(AuthContext)



  return (
    <>
      <MerchNavbar />
      <div className="mt-32">
        { userInfo ? <>
        <Profile />
        <Inventory />
        <Assets userInfo={userInfo} />
        <Orders userInfo={userInfo} />
        </>
        :
      <div className='max-w-7xl w-full mx-auto pt-4 bg-dark-grey p-4 rounded-2xl'>
      <button className='profile-button' onClick={ () => setModelIsOpen('playFab')}>
            Sign In
          </button>
      </div>}
      </div>

      <Footer />
  </>
  );
}