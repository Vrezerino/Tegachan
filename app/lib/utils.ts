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
  'image/gif',
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
 * @param str any
 * @returns string
 */
export const removeGapsFromString = (str: any) => {
  if (typeof str !== 'string') throw { message: 'removeGapsFromString: argument must be a string.', status: 400 };

  return str
    .replace(/ +/g, ' ')
    .replace(/\n\n+/g, "\n\n")
    .replace(/\t+/g, '')
}

/**
 * Remove consecutive spaces, linebreaks, tabs and special characters.
 * @param str any
 * @returns string
 */
export const sanitizeString = (str: any) => {
  if (typeof str !== 'string') throw { message: 'sanitizeString: argument must be a string.', status: 400 };

  return removeGapsFromString(str)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Attempt to parse and check a post recipients array
 * @param recipientsRaw unknown
 * @returns number[]
 */
export const recipientsJSONparser = (recipientsRaw: unknown) => {
  if (typeof recipientsRaw !== 'string') throw { message: `'recipients' must be a string.`, status: 400 };

  const parsed = JSON.parse(recipientsRaw);
  if (!Array.isArray(parsed)) throw { message: `'recipients' must be a JSON array.`, status: 400 };

  const recipients = parsed.map((obj, i) => {
    if (typeof obj === 'string') {
      obj = removeGapsFromString(obj);
      const num = Number(obj);
      if (!Number.isInteger(num)) throw { message: `"${obj}" at ${i} not a valid number.`, status: 400 };

      return num;
    }

    if (typeof obj === 'number') {
      if (!Number.isInteger(obj)) throw { message: `"${obj}" at ${i} not an integer.`, status: 400 };

      return obj;
    }

    throw { message: `Type ${typeof obj} at ${i} is not allowed.`, status: 400 };
  });

  return recipients;
}

export const toTitleCase = (str: string) => str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());

export const findExactInString = (searchWord: string | null, target: string | undefined) => {
  if (!searchWord || !target) return false;

  const regex = new RegExp('\\b' + searchWord + '\\b');
  return regex.test(target);
};

// 'other' includes 'development'
let envType: 'ci' | 'production' | 'other';

if (process.env.CI) {
  envType = 'ci';
} else if (process.env.NODE_ENV === 'production') {
  envType = 'production';
} else {
  envType = 'other';
}

export const THROTTLE_WINDOW = (() => {
  switch (envType) {
    case 'production':
      return 30;
    case 'ci':
      return 2;
    default:
      return 6;
  }
})();