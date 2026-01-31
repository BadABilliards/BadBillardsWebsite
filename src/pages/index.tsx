import React from 'react';
import { Navbar, Footer, Banner } from '../layout';
import { Hero, Team, Intro, GameInfo, SaleInfo } from '../components/home';
import { MintIntro } from '../components/home/MintIntro';
import { Cue } from '../components/home/Cue';
import { CueImages } from '../assets/cues';

function Page() {
  return (
    <main>
      <Navbar />
      <div className='home-block' >
        <Hero />
        <Cue id='intro' left={false} image={CueImages.BumbleBee} />
        <MintIntro />
        <Cue id='intro' left={true} image={CueImages.BaseballBat} />
        <Intro />
        <Cue id='game' left={false} image={CueImages.WizardWand} />
        <GameInfo />
        <Cue id='marketplace' left={true} image={CueImages.Mic} />
        <SaleInfo />
        <Cue id='team' left={false} image={CueImages.OldMan} />
        <Team />
      </div>
      <Footer />
    </main>
  );
}

export default Page;