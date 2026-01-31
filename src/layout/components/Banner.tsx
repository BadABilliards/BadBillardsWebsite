import Marquee from "react-fast-marquee";

export function Banner() {
  
  return (
    <div className="banner">
      <Marquee autoFill={true}>
        <p className="banner-text">BAD A BILLIARDS IS MINTING NOW!</p>
      </Marquee>
    </div>
  )
}
