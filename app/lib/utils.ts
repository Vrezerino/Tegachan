import { ErrorWithStatusCode } from './definitions';
import {
  HomeIcon,
  ComputerDesktopIcon,
  CurrencyDollarIcon,
  MusicalNoteIcon,
  PaintBrushIcon,
  TvIcon,
  TruckIcon,
  SunIcon,
  TrophyIcon,
  BeakerIcon,
  GlobeEuropeAfricaIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export const boards = 'random, music, technology, outdoors';

// Links to display in the side navigation
export const links = [
  {
    name: 'Index',
    href: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Technology',
    href: '/dashboard/technology',
    icon: ComputerDesktopIcon,
  },
  {
    name: 'Business',
    href: '/dashboard/business',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Music',
    href: '/dashboard/music',
    icon: MusicalNoteIcon,
  },
  {
    name: 'Art',
    href: '/dashboard/art',
    icon: PaintBrushIcon,
  },
  {
    name: 'Video Games',
    href: '/dashboard/videogames',
    icon: ComputerDesktopIcon,
  },
  {
    name: 'TV & Film',
    href: '/dashboard/tv',
    icon: TvIcon,
  },
  {
    name: 'Automobiles',
    href: '/dashboard/auto',
    icon: TruckIcon,
  },
  {
    name: 'Outdoors',
    href: '/dashboard/outdoors',
    icon: SunIcon,
  },
  {
    name: 'Sports',
    href: '/dashboard/sports',
    icon: TrophyIcon,
  },
  {
    name: 'Science & Math',
    href: '/dashboard/science',
    icon: BeakerIcon,
  },
  {
    name: 'International',
    href: '/dashboard/international',
    icon: GlobeEuropeAfricaIcon
  },
  {
    name: 'Random',
    href: '/dashboard/random',
    icon: ChatBubbleLeftRightIcon
  }
];

export const MAX_FILE_SIZE = 1000000;
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif'];

export const parseDate = (date: Date): string => {
  return new Date(date).toUTCString();
};

/**
 * Returns a number between 1 and max
 * @param max 
 * @returns 
 */
export const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * (max - 1)) + 1;
};

export const isErrorWithStatusCodeType = (x: any): x is ErrorWithStatusCode => {
  return x.status !== undefined && x.message !== undefined;
};

/**
 * Remove consecutive spaces, linebreaks and tabs.
 * @param str string
 * @returns 
 */
export const removeGapsFromString = (str: string) => {
  return str
    .replace(/ +/g, ' ')
    .replace(/\n\n+/g, "\n\n")
    .replace(/\t+/g, '')
}

/**
 * Remove consecutive spaces, linebreaks, tabs and special characters.
 * @param str string
 * @returns 
 */
export const sanitizeString = (str: string) => {
  return removeGapsFromString(str)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const toTitleCase = (str: string) => str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());

export const findExactInString = (searchWord: string | null, target: string | undefined) => {
  if (!searchWord || !target) return false;

  const regex = new RegExp('\\b' + searchWord + '\\b');
  return regex.test(target);
};

// 6 seconds for CI test
export const THROTTLE_WINDOW = process.env.CI ? 6 : 30;
