import { Composition } from 'remotion';
import { DIMENSIONS, FPS, PromoCut, cutDurationInFrames } from './PromoCut';
import { CUTS, CUT_IDS } from './script';
import { TIMINGS } from './timings';

export const RemotionRoot: React.FC = () => (
  <>
    {CUT_IDS.filter((cut) => TIMINGS[cut]).map((cut) => (
      <Composition
        key={cut}
        id={CUTS[cut].composition}
        component={PromoCut}
        defaultProps={{ cut }}
        fps={FPS}
        {...DIMENSIONS[CUTS[cut].format]}
        durationInFrames={cutDurationInFrames(cut)}
      />
    ))}
  </>
);
