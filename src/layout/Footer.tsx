import Link from 'next/link';


export function Footer() {

  
  return (
    <div className='footer'>
      <h3>™Trademarked 2022. All Rights Reserved.</h3>
      <Link className='market-button' href={'/delete-account'}>
        Delete Account
      </Link>
    </div>
  )
}
