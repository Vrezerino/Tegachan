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
import { NextRequest } from 'next/server';

// Links to display in the side navigation
export const links = [
  {
    name: 'Index',
    href: '/',
    icon: HomeIcon,
    desc: ''
  },
  {
    name: 'Art',
    href: '/art',
    icon: PaintBrushIcon,
    desc: 'Discuss artists, techniques, methods, post your own art'
  },
  {
    name: 'Automobiles',
    href: '/auto',
    icon: TruckIcon,
    desc: 'Discuss automobiles'
  },
  {
    name: 'Business',
    href: '/business',
    icon: CurrencyDollarIcon,
    desc: 'Discuss business'
  },
  {
    name: 'Music',
    href: '/music',
    icon: MusicalNoteIcon,
    desc: 'Discuss releases, music theory, post your own material'
  },
  {
    name: 'News',
    href: '/news',
    icon: GlobeEuropeAfricaIcon,
    desc: 'Discuss recent events'
  },
  {
    name: 'Outdoors',
    href: '/outdoors',
    icon: SunIcon,
    desc: 'Discuss outdoors'
  },
  {
    name: 'Random',
    href: '/random',
    icon: ChatBubbleLeftRightIcon,
    desc: 'Anything legal and decent goes'
  },
  {
    name: 'Science & Math',
    href: '/science',
    icon: BeakerIcon,
    desc: 'Discuss science and math(s)'
  },
  {
    name: 'Sports',
    href: '/sports',
    icon: TrophyIcon,
    desc: 'Discuss sports'
  },
  {
    name: 'Technology',
    href: '/technology',
    icon: ComputerDesktopIcon,
    desc: 'Discuss technology'
  },
  {
    name: 'TV & Film',
    href: '/tv',
    icon: TvIcon,
    desc: 'Discuss cinema, TV series, production'
  },
  {
    name: 'Video Games',
    href: '/videogames',
    icon: ComputerDesktopIcon,
    desc: 'Discuss games and industry, maybe even share your own game'
  },
];

export const MAX_FILE_SIZE = 2000000;
export const ACCEPTED_IMAGE_TYPES = [
  'image/gif',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif'];

export const parseDate = (date: Date | string): string => {
  return new Date(date).toUTCString().replace(' GMT', '');
};

/**
 * Returns a number between 1 and max.
 * @param {number} max Maximum integer that can be returned
 * @returns {number} Number between 1 and max
 */
export const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * (max - 1)) + 1;
};

export const isErrorWithStatusCodeType = (x: any): x is ErrorWithStatusCode => {
  return x.status !== undefined && x.message !== undefined;
};

/**
 * Remove consecutive spaces, linebreaks and tabs.
 * @param {unknown} str Object to be processed if string
 * @returns {string}
 */
export const removeGapsFromString = (str: unknown) => {
  if (typeof str !== 'string') throw { message: 'removeGapsFromString: argument must be a string.', status: 400 };

  return str
    .replace(/ +/g, ' ')
    .replace(/\n\n+/g, "\n\n")
    .replace(/\t+/g, '')
};

/**
 * Remove consecutive spaces, linebreaks, tabs and special characters.
 * @param {unknown} str Object to be sanitized if string
 * @returns {string} Sanitized string
 */
export const sanitizeString = (str: unknown) => {
  if (typeof str !== 'string') throw { message: 'sanitizeString: argument must be a string.', status: 400 };

  return removeGapsFromString(str)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Attempt to parse and check a post recipients array.
 * @param {unknown} recipientsRaw Potential recipients array
 * @returns {number[]} Processed recipients array
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
};

export const toTitleCase = (str: string) => str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());

export const findExactInString = (searchWord: string | null, target: string | undefined) => {
  if (!searchWord || !target) return false;

  const regex = new RegExp('\\b' + searchWord + '\\b');
  return regex.test(target);
};

/**
 * Returns true if any word from e.g. 'yeet 5e68yu' is found in '5yj5yeetdsk'.
 * @param {string} content
 * @param {string} list
 * @returns {boolean} A word appeared in the list
 */
export const findInStringList = (content: string, ignoreCase: boolean, list?: string) => {
  if (!list) throw new Error('List not found!');

  if (!ignoreCase) {
    const bannedWords = list.toLowerCase().split(/\s+/);
    return bannedWords.some(word => content.toLowerCase().includes(word));
  }

  const bannedWords = list.split(/\s+/);
  return bannedWords.some(word => content.includes(word));
};

/**
 * Get IP address from client request.
 * @param {NextRequest} req Web request object
 * @returns {string | null} ip address
 */
export function getClientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get('x-forwarded-for');
  return (
    (forwarded && forwarded.split(',')[0].trim()) ??
    req.headers.get('x-real-ip') ??
    null
  );
};

/**
 * Evaluate poster's name and check if they're admin.
 * Only admins can hold name Expert.
 * @param {FormDataEntryValue} rawName Name value from form data
 * @returns {{ name: string, verified: boolean }} Name and whether poster is admin
 */
export const evaluateName = (rawName?: FormDataEntryValue | null, adminPass?: string) => {
  const name = removeGapsFromString(rawName);

  if (name === adminPass) return { name: 'Expert', admin: true };
  if (name === 'Expert') return { name: 'Wannabe-Expert', admin: false };
  if (!name) return { name: 'Noob', admin: false };
  
  return { name, admin: false };
};

/**
 * Convert letters in a country code to their Unicode code points
 * by shifting the letters into Unicode ranges of regional indicator
 * symbols, which represent flag letters.
 * @param {string} countryCode ISO 3166-1 alpha-2 country code
 * @returns Emoji flag corresponding to country code
 */
export const getFlagEmoji = (countryCode: string) => {
  return String.fromCodePoint(
    ...[...countryCode?.toUpperCase()].map(c => 127397 + c.charCodeAt(0))
  );
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