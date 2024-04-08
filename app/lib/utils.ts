export const boards = 'random, music, technology, outdoors';

export const parseDate = (date: Date): string => {
    return new Date(date).toUTCString();
}

/**
 * Returns a number between 1 and max
 * @param max 
 * @returns 
 */
export const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * (max - 1)) + 1;
}