
import { useContext } from 'react'
import { AuthContext } from "../../context"


export function Inventory() {
  const { userInfo, inventory } = useContext(AuthContext)


  return (
    <div className='max-w-5xl w-full mx-auto pt-4 bg-dark-grey p-4 rounded-2xl'>

    </div>
  )
}