import type { SceneId } from './catalog';
import { EndCardScene, LogoScene, TaglineScene } from './BrandScenes';
import { DashboardScene } from './DashboardScene';
import { DeviceScene } from './DeviceScene';
import { FeaturesScene } from './FeaturesScene';
import { ProblemScene } from './ProblemScene';
import { QuoteScene } from './QuoteScene';
import { RevealScene } from './RevealScene';
import { RolesScene } from './RolesScene';
import { ScreenScene } from './ScreenScene';
import { StatsScene } from './StatsScene';
import { StepsScene } from './StepsScene';
import { TitleScene } from './TitleScene';

/** Register product-specific scenes from ./custom here (and in catalog.ts). */
export const SCENES: Record<SceneId, React.FC> = {
  title: TitleScene,
  problem: ProblemScene,
  reveal: RevealScene,
  steps: StepsScene,
  features: FeaturesScene,
  stats: StatsScene,
  screen: ScreenScene,
  roles: RolesScene,
  device: DeviceScene,
  dashboard: DashboardScene,
  quote: QuoteScene,
  tagline: TaglineScene,
  logo: LogoScene,
  endcard: EndCardScene,
};
