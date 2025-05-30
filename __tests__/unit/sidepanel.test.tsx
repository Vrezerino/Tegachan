import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NavLinks from '@/app/ui/dashboard/navLinks';

// Mock Next.js useRouter hook
vi.mock('nextjs-toploader/app', () => ({
  useRouter: vi.fn().mockReturnValue({
    push: vi.fn(),
  }),
  usePathname: vi.fn().mockReturnValue(''),
}));

describe('Navigation', () => {
  it('links exist and direct to correct pages', () => {
    render(<NavLinks />);

    // Index
    const indexParagraph = screen.getAllByText('Index')[0].closest('p');
    const indexLink = indexParagraph?.closest('a');
    expect(indexLink?.getAttribute('href')).toBe('/');

    // Technology
    const techParagraph = screen.getAllByText('Technology')[0].closest('p');
    const techLink = techParagraph?.closest('a');
    expect(techLink?.getAttribute('href')).toBe('/technology');

    // Business
    const bizParagraph = screen.getAllByText('Business')[0].closest('p');
    const bizLink = bizParagraph?.closest('a');
    expect(bizLink?.getAttribute('href')).toBe('/business');

    // Music
    const musicParagraph = screen.getAllByText('Music')[0].closest('p');
    const musicLink = musicParagraph?.closest('a');
    expect(musicLink?.getAttribute('href')).toBe('/music');

    // Art
    const artParagraph = screen.getAllByText('Art')[0].closest('p');
    const artLink = artParagraph?.closest('a');
    expect(artLink?.getAttribute('href')).toBe('/art');

    // Video games
    const vidyaParagraph = screen.getAllByText('Video Games')[0].closest('p');
    const vidyaLink = vidyaParagraph?.closest('a');
    expect(vidyaLink?.getAttribute('href')).toBe('/videogames');

    // TV & Film
    const tvParagraph = screen.getAllByText('TV & Film')[0].closest('p');
    const tvLink = tvParagraph?.closest('a');
    expect(tvLink?.getAttribute('href')).toBe('/tv');

    // Automobiles
    const autoParagraph = screen.getAllByText('Automobiles')[0].closest('p');
    const autoLink = autoParagraph?.closest('a');
    expect(autoLink?.getAttribute('href')).toBe('/auto');

    // Outdoors
    const outParagraph = screen.getAllByText('Outdoors')[0].closest('p');
    const outLink = outParagraph?.closest('a');
    expect(outLink?.getAttribute('href')).toBe('/outdoors');

    // Sports
    const sportsParagraph = screen.getAllByText('Sports')[0].closest('p');
    const sportsLink = sportsParagraph?.closest('a');
    expect(sportsLink?.getAttribute('href')).toBe('/sports');

    // Science & Math
    const scienceParagraph = screen.getAllByText('Science & Math')[0].closest('p');
    const scienceLink = scienceParagraph?.closest('a');
    expect(scienceLink?.getAttribute('href')).toBe('/science');

    // News
    const newsParagraph = screen.getAllByText('News')[0].closest('p');
    const newsLink = newsParagraph?.closest('a');
    expect(newsLink?.getAttribute('href')).toBe('/news');

    // Random
    const randParagraph = screen.getAllByText('Random')[0].closest('p');
    const randLink = randParagraph?.closest('a');
    expect(randLink?.getAttribute('href')).toBe('/random');
  });
});