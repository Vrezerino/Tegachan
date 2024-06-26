import { ErrorWithStatusCode } from './definitions';

export const boards = 'random, music, technology, outdoors';
export const MAX_FILE_SIZE = 1000000;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

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

export const sanitizeString = (str: string) => {
    // Remove consecutive spaces and linebreaks and escape special chars
    if (str) return str
        .replace(/ +/g, ' ')
        .replace(/\n\n+/g, "\n\n")
        .replace(/\t+/g, '')
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    return '';
};

export const toTitleCase = (str: string) => str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());

export const findExactInString = (searchWord: string, target: string) => {
    const regex = new RegExp('\\b' + searchWord + '\\b');
    return regex.test(target);
};