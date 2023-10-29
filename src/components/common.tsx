import '../style/common.css';
import {
  Class,
  Element,
  Elements,
  EyeColor,
  HairColor,
  Pose,
  Poses,
  Stats,
  Trait,
  TraitEnum,
  Zodiac
} from '../data/data';
import { PlacesType, Tooltip as ReactTooltip } from 'react-tooltip';
import { ReactElement, ReactNode, useContext, useMemo, useState } from 'react';

import 'react-tooltip/dist/react-tooltip.css';
import { roundValue } from '../data/common';
import ReactDOMServer from 'react-dom/server';
import { GameAPIContext } from '../data/game-api-context';

export type GemType = Element | 'rainbow';

export interface GemProps {
  element: GemType;
  className?: string;
  noTitle?: boolean;
}

export const GemIcon: React.FC<GemProps> = ({
  element,
  className,
  noTitle
}) => {
  const gameName = useContext(GameAPIContext).gameAPI!.getGameName();
  const icon = getGemIcon(element, gameName);
  const elementName =
    element === 'rainbow' ? 'rainbow' : Elements.toString(element);
  const cssClass = `elementIcon ${className ?? ''}`;
  const title = noTitle === true ? undefined : elementName;
  return (
    <img src={icon} title={title} alt={elementName} className={cssClass} />
  );
};

export function getGemIcon(element: GemType, gameName: string): string {
  const contentHostName2 = contentHost2(gameName);

  switch (element) {
    case 'rainbow':
      return `https://${contentHostName2}/pictures/design/gems/all.png`;
    case Element.blue:
      return `https://${contentHostName2}/pictures/design/gems/water.png`;
    case Element.red:
      return `https://${contentHostName2}/pictures/design/gems/fire.png`;
    case Element.dark:
      return `https://${contentHostName2}/pictures/design/gems/darkness.png`;
    case Element.green:
      return `https://${contentHostName2}/pictures/design/gems/nature.png`;
    case Element.orange:
      return `https://${contentHostName2}/pictures/design/gems/stone.png`;
    case Element.purple:
      return `https://${contentHostName2}/pictures/design/gems/psychic.png`;
    case Element.white:
      return `https://${contentHostName2}/pictures/design/gems/light.png`;
    case Element.yellow:
      return `https://${contentHostName2}/pictures/design/gems/sun.png`;
  }
}

interface ElementProps {
  element: Element | 'rainbow';
}
export const ElementIcon: React.FC<ElementProps> = ({ element }) => {
  const elementName =
    element === 'rainbow' ? 'rainbow' : Elements.toString(element);
  const elementClasses = `element ${elementName}`;
  return <div className={elementClasses} />;
};

export const SalaryIcon: React.FC = () => {
  return <div className="soft_currency" />;
};

export const UpgradeIcon: React.FC = () => {
  return <div className="upgrade-girl" />;
};

export interface ZodiacProps {
  zodiac: Zodiac;
}

export const ZodiacElement: React.FC<ZodiacProps> = ({ zodiac }) => {
  return <span className={`zodiac ${Zodiac[zodiac]}`}>{Zodiac[zodiac]}</span>;
};

export interface PoseProps {
  pose: Pose;
}

export const PoseElement: React.FC<PoseProps> = ({ pose }) => {
  return <span className={`pose ${Pose[pose]}`}>{Pose[pose]}</span>;
};

export function format(value: number): string {
  return new Intl.NumberFormat().format(value);
}

export function formatCost(cost: number): string {
  if (cost > 1000000000) {
    return (cost / 1000000000).toFixed(1) + 'B';
  }
  if (cost > 1000000) {
    return (cost / 1000000).toFixed(1) + 'M';
  }
  if (cost > 10000) {
    return (cost / 1000).toFixed(1) + 'k';
  }
  return String(cost);
}

export function firstToUpper(value: string): string {
  if (value.length === 0) {
    return value;
  }
  return value.substring(0, 1).toUpperCase() + value.substring(1);
}

export function formatTime(value: number): string {
  const seconds = value;
  const minutes = Math.round((value / 60) * 100) / 100;
  const hours = Math.round((value / 3600) * 100) / 100;
  if (hours > 1) {
    const min = (value / 60) % 60;
    const h = Math.floor(hours);
    return min > 0 ? `${h}h ${min}min` : `${h}h`;
  } else if (Number(minutes) > 1) {
    return `${minutes} minutes`;
  } else {
    return `${seconds} seconds`;
  }
}

export function contentHost(gameName: string): string {
  switch (gameName) {
    case 'hh_hentai': {
      return 'hh.hh-content.com';
    }
    case 'hh_comix': {
      return 'ch.hh-content.com';
    }
    default: {
      return 'hh.hh-content.com';
    }
  }
}

export function contentHost2(gameName: string): string {
  switch (gameName) {
    case 'hh_hentai': {
      return 'hh2.hh-content.com';
    }
    case 'hh_comix': {
      return 'ch.hh-content.com';
    }
    default: {
      return 'hh2.hh-content.com';
    }
  }
}

export interface GradeProps {
  stars: number;
  maxStars: number;
  currentStar: number;
}
export const Grade: React.FC<GradeProps> = ({
  stars,
  maxStars,
  currentStar
}) => {
  return (
    <div className="grade">
      {[...Array(stars)].map((_v, i) => (
        <Star key={`full_${i}`} kind="solid" current={i === currentStar - 1} />
      ))}
      {[...Array(maxStars - stars)].map((_v, i) => (
        <Star key={`empty_${i}`} kind="empty" />
      ))}
    </div>
  );
};

export interface StarProps {
  kind: 'solid' | 'empty';
  current?: boolean;
}
export const Star: React.FC<StarProps> = ({ kind, current }) => {
  const currentStyle = current ? ' current' : '';
  const className = `star ${kind}${currentStyle}`;
  return <div className={className} />;
};

export interface GemsCountProps {
  gemsCount: Map<Element, number | undefined>;
}

export const GemsCount: React.FC<GemsCountProps> = ({ gemsCount }) => {
  const tooltipContent = useMemo(() => {
    const totalCount = [...gemsCount.values()].reduce(
      (a, b) => (a ?? 0) + (b ?? 0),
      0
    );
    return (
      <div className="gems-count-details">
        {Elements.values().map((element) => (
          <GemsCountEntry
            key={element}
            element={element}
            count={gemsCount.get(element) ?? 0}
          />
        ))}
        <hr />
        <GemsCountEntry
          key="rainbow"
          element="rainbow"
          count={totalCount ?? 0}
        />
      </div>
    );
  }, [gemsCount]);

  return (
    <Tooltip cssClasses="gems-count" place="bottom" tooltip={tooltipContent}>
      <GemIcon element="rainbow" noTitle={true} />
    </Tooltip>
  );
};

export interface TooltipProps {
  children: ReactNode;
  tooltip: ReactNode;
  place?: PlacesType;
  cssClasses?: string | string[];
  delay?: number;
}

export interface SharedTooltipProps extends TooltipProps {
  tooltipId: string;
  tooltip: ReactElement;
}

export const SharedTooltip: React.FC<SharedTooltipProps> = ({
  tooltip,
  children,
  place,
  cssClasses,
  delay,
  tooltipId
}) => {
  const classes =
    cssClasses === undefined
      ? []
      : Array.isArray(cssClasses)
      ? cssClasses
      : [cssClasses];
  classes.push('qh-tooltip-wrapper');

  const tooltipContent = ReactDOMServer.renderToStaticMarkup(tooltip);

  return (
    <>
      <span
        className={classes.join(' ')}
        data-tooltip-place={place}
        data-tooltip-delay-show={delay}
        data-tooltip-id={tooltipId}
        data-tooltip-html={tooltipContent}
      >
        {children}
      </span>
    </>
  );
};

export const Tooltip: React.FC<TooltipProps> = ({
  tooltip,
  children,
  place,
  cssClasses,
  delay
}) => {
  const classes =
    cssClasses === undefined
      ? []
      : Array.isArray(cssClasses)
      ? cssClasses
      : [cssClasses];
  classes.push('qh-tooltip-wrapper');

  const [anchorId] = useState(randomAnchor);

  return (
    <>
      <span
        className={classes.join(' ')}
        data-tooltip-place={place}
        data-tooltip-delay-show={delay}
        data-tooltip-id={anchorId}
      >
        {children}
      </span>
      <ReactTooltip
        className="qh-tooltip"
        classNameArrow="qh-tooltip-arrow"
        id={anchorId}
      >
        {tooltip}
      </ReactTooltip>
    </>
  );
};

function randomAnchor(): string {
  const id = Math.round(Math.random() * 0x10000);
  return `tt-anchor_${id}`;
}

interface GemsCountEntryProps {
  element: Element | 'rainbow';
  count: number;
}

const GemsCountEntry: React.FC<GemsCountEntryProps> = ({ element, count }) => {
  return (
    <span>
      <GemIcon element={element} /> {format(count)}
    </span>
  );
};

export interface StatsDescriptionProps {
  baseStats: Stats;
  currentStats: Stats;
  upcomingStats: Stats;
  potentialMultiplier: number;
  blessed: boolean;
  statIcon?: Class;
  currentBlessingMultiplier: number;
  upcomingBlessingMultiplier: number;
}

export const StatsDescriptionTooltip: React.FC<StatsDescriptionProps> = ({
  baseStats,
  currentStats,
  upcomingStats,
  potentialMultiplier,
  blessed,
  statIcon,
  currentBlessingMultiplier,
  upcomingBlessingMultiplier
}) => {
  return (
    <span className="stats-description">
      <Tooltip
        place="bottom"
        tooltip={
          <StatsDescription
            baseStats={baseStats}
            blessed={blessed}
            currentStats={currentStats}
            upcomingStats={upcomingStats}
            potentialMultiplier={potentialMultiplier}
            currentBlessingMultiplier={currentBlessingMultiplier}
            upcomingBlessingMultiplier={upcomingBlessingMultiplier}
          />
        }
      >
        <StatIcon statClass={statIcon ?? Class.Knowhow} blessed={blessed} />
      </Tooltip>
    </span>
  );
};

export const StatsDescription: React.FC<StatsDescriptionProps> = ({
  baseStats,
  currentStats,
  upcomingStats,
  potentialMultiplier,
  currentBlessingMultiplier,
  upcomingBlessingMultiplier
}) => {
  return (
    <div className="detailed-stats">
      <div className="base-stats">
        Base{' '}
        <StatsList
          stats={baseStats}
          potentialMultiplier={potentialMultiplier}
          blessed={false}
        />
      </div>
      <div
        className={`current-stats${
          currentStats.charm > baseStats.charm ? ' blessed' : ''
        }`}
      >
        Current
        {currentBlessingMultiplier > 1
          ? ` +${roundValue((currentBlessingMultiplier - 1) * 100)}%`
          : null}
        <StatsList
          stats={currentStats}
          potentialMultiplier={potentialMultiplier}
          blessed={currentStats.charm > baseStats.charm}
        />
      </div>
      <div
        className={`upcoming-stats${
          upcomingStats.charm > baseStats.charm ? ' blessed' : ''
        }`}
      >
        Upcoming
        {upcomingBlessingMultiplier > 1
          ? ` +${roundValue((upcomingBlessingMultiplier - 1) * 100)}%`
          : null}
        <StatsList
          stats={upcomingStats}
          potentialMultiplier={potentialMultiplier}
          blessed={false}
        />
      </div>
    </div>
  );
};

export interface StatsProps {
  stats: Stats;
  potentialMultiplier: number;
  blessed: boolean;
}

export const StatsList: React.FC<StatsProps> = ({
  stats,
  potentialMultiplier,
  blessed
}) => {
  const potential = (
    (stats.hardcore + stats.charm + stats.knowhow) *
    potentialMultiplier
  ).toFixed(2);
  return (
    <div className={`stats-list${blessed ? ' blessed' : ''}`}>
      <span className="potential">{potential}</span>{' '}
      <span className="stat hc-stat">{format(stats.hardcore)}</span>{' '}
      <span className="stat ch-stat">{format(stats.charm)}</span>{' '}
      <span className="stat kh-stat">{format(stats.knowhow)}</span>{' '}
    </div>
  );
};

export interface StatIconProps {
  statClass: Class | 'rainbow';
  blessed?: boolean;
}

export const StatIcon: React.FC<StatIconProps> = ({ statClass, blessed }) => {
  return (
    <span
      className={`stat-icon class_${statClass}${
        blessed === true ? ' blessed' : ''
      }`}
    />
  );
};

export interface PoseIconProps {
  pose: Pose;
}

export const PoseIcon: React.FC<PoseIconProps> = ({ pose }) => {
  const poseName = Poses.toString(pose);
  return <span className={`pose-icon ${poseName}`} />;
};

export interface CloseButtonProps {
  close: () => void;
  title?: string;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ close, title }) => {
  return <div className="close-popup" onClick={close} title={title}></div>;
};

export interface ReturnButtonProps {
  close: () => void;
  title?: string;
}

export const ReturnButton: React.FC<ReturnButtonProps> = ({ close, title }) => {
  return (
    <div className="return-button" onClick={close} title={title}>
      <div className="return-button-content"></div>
    </div>
  );
};

export function getDomain(): string {
  const host = window.location.host;
  const domain = host.includes('localhost')
    ? 'https://www.hentaiheroes.com'
    : '.';
  return domain;
}

export interface ProgressBarProps {
  min: number;
  max: number;
  curr: number;
  extra?: number;
  label?: string;
  overlay?: ReactNode;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  min,
  max,
  curr,
  extra,
  label,
  overlay
}) => {
  const ratio = Math.min(1, Math.max(0, (curr - min) / (max - min)));
  const extraValue = curr + (extra ?? 0);
  const extraRatio = Math.min(1, Math.max(0, (extraValue - min) / (max - min)));

  const classNames = ['qh-progress-bar'];
  if (ratio === 1) {
    classNames.push('full');
  } else if (extraRatio === 1) {
    classNames.push('extra-full');
  }

  const mainWidth = Math.floor(ratio * 100);
  const extraWidth =
    extraRatio === 1 ? 100 - mainWidth : Math.floor((extraRatio - ratio) * 100);

  return (
    <div className={classNames.join(' ')}>
      <div className="raw-track" style={{ width: `${mainWidth}%` }}></div>
      <div className="main-track" style={{ width: `${mainWidth}%` }}></div>
      <div className="extra-track" style={{ width: `${extraWidth}%` }}></div>
      {label !== undefined ? (
        <span className="track-label">{label}</span>
      ) : null}
      {overlay !== undefined ? overlay : null}
    </div>
  );
};

export const BookIcon: React.FC<{ item?: number }> = ({ item }) => {
  const icon = item === undefined ? 'XP2' : `XP${item}`;
  const gameName = useContext(GameAPIContext).gameAPI!.getGameName();
  const contentHostName2 = contentHost2(gameName);
  return <img src={`https://${contentHostName2}/pictures/items/${icon}.png`} />;
};

export const GiftIcon: React.FC<{ item?: number }> = ({ item }) => {
  const icon = item === undefined ? 'K2' : `K${item}`;
  const gameName = useContext(GameAPIContext).gameAPI!.getGameName();
  const contentHostName2 = contentHost2(gameName);
  return <img src={`https://${contentHostName2}/pictures/items/${icon}.png`} />;
};

export const EnduranceIcon = () => {
  const gameName = useContext(GameAPIContext).gameAPI!.getGameName();
  const contentHostName2 = contentHost2(gameName);
  return (
    <img
      src={`https://${contentHostName2}/pictures/misc/items_icons/4.png`}
      className="endurance-icon"
    />
  );
};

export const EgoIcon = () => {
  const gameName = useContext(GameAPIContext).gameAPI!.getGameName();
  const contentHostName2 = contentHost2(gameName);
  return (
    <img
      src={`https://${contentHostName2}/caracs/ego.png`}
      className="ego-icon"
    />
  );
};

export const AttackIcon = () => {
  const gameName = useContext(GameAPIContext).gameAPI!.getGameName();
  const contentHostName2 = contentHost2(gameName);
  return (
    <img
      src={`https://${contentHostName2}/caracs/damage.png`}
      className="attack-icon"
    />
  );
};

export const DefenseIcon = () => {
  const gameName = useContext(GameAPIContext).gameAPI!.getGameName();
  const contentHostName2 = contentHost2(gameName);
  return (
    <img
      src={`https://${contentHostName2}/caracs/deff_undefined.png`}
      className="defense-icon"
    />
  );
};

export interface TraitIconProps {
  trait: Trait;
}

export const TraitIcon: React.FC<TraitIconProps> = ({ trait }) => {
  const hairColorMap = {
    [HairColor.blue]: '00F',
    [HairColor.grey]: '888',
    [HairColor.blond]: 'FF0',
    [HairColor.white]: 'FFF',
    [HairColor.pink]: 'F99',
    [HairColor.silver]: 'CCC',
    [HairColor.red]: 'F00',
    [HairColor.darkBlond]: 'B62',
    [HairColor.dark]: '321',
    [HairColor.green]: '0F0',
    [HairColor.purple]: 'F0F',
    [HairColor.orange]: 'F90',
    [HairColor.black]: '000',
    [HairColor.brown]: 'A55',
    [HairColor.golden]: 'FD0',
    [HairColor.darkPink]: 'B06',
    [HairColor.strawberryBlond]: 'EB8',
    [HairColor.unknown]: 'XXX',
    [HairColor.bronze]: 'D83'
  };

  const eyeColorMap = {
    [EyeColor.blue]: '00F',
    [EyeColor.golden]: 'FD0',
    [EyeColor.green]: '0F0',
    [EyeColor.brown]: 'A55',
    [EyeColor.pink]: 'F99',
    [EyeColor.red]: 'F00',
    [EyeColor.purple]: 'F0F',
    [EyeColor.orange]: 'F90',
    [EyeColor.silver]: 'CCC',
    [EyeColor.darkPink]: 'B06',
    [EyeColor.black]: '000',
    [EyeColor.grey]: '888',
    [EyeColor.unknown]: 'XXX',
    [EyeColor.dark]: '321'
  };

  const gameName = useContext(GameAPIContext).gameAPI!.getGameName();
  const contentHostName2 = contentHost2(gameName);
  let url = `https://${contentHostName2}/pictures/design/blessings_icons/`;
  switch (trait.traitEnum) {
    case TraitEnum.HairColor:
      url += `hair_colors/hair_color_${hairColorMap[trait.traitValue]}.png`;
      break;
    case TraitEnum.EyeColor:
      url += `eye_colors/eye_color_${eyeColorMap[trait.traitValue]}.png`;
      break;
    case TraitEnum.Zodiac:
      url += `zodiac_signs/zodiac_sign_${Zodiac[trait.traitValue]}.png`;
      break;
    case TraitEnum.Pose:
      url += `positions/fav_pose_${trait.traitValue}.png`;
      break;
  }
  return (
    <span className="trait-icon" style={{ backgroundImage: `url(${url})` }} />
  );
};
