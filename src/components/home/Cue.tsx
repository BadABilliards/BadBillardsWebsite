import Image, { StaticImageData } from 'next/image';

interface IntroProps {
  image: StaticImageData;
  left: boolean;
  id: string
}

export function Cue({ id, left, image }: IntroProps) {

  return (
    <Image
      src={image}
      width={600}
      height={100}
      id={id}
      style={{
        width: '80%',
        height: 'auto',
        margin: '30px auto',
        display: 'block',
        transform: left ? 'none' : 'scaleX(-1)',
      }}
      alt={'Bad a Billiard Cue stick'}
    />
  );
}