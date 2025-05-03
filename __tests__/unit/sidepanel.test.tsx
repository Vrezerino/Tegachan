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
    expect(indexLink?.getAttribute('href')).toBe('/dashboard');

    // Technology
    const techParagraph = screen.getAllByText('Technology')[0].closest('p');
    const techLink = techParagraph?.closest('a');
    expect(techLink?.getAttribute('href')).toBe('/dashboard/technology');

    // Business
    const bizParagraph = screen.getAllByText('Business')[0].closest('p');
    const bizLink = bizParagraph?.closest('a');
    expect(bizLink?.getAttribute('href')).toBe('/dashboard/business');

    // Music
    const musicParagraph = screen.getAllByText('Music')[0].closest('p');
    const musicLink = musicParagraph?.closest('a');
    expect(musicLink?.getAttribute('href')).toBe('/dashboard/music');

    // Art
    const artParagraph = screen.getAllByText('Art')[0].closest('p');
    const artLink = artParagraph?.closest('a');
    expect(artLink?.getAttribute('href')).toBe('/dashboard/art');

    // Video games
    const vidyaParagraph = screen.getAllByText('Video Games')[0].closest('p');
    const vidyaLink = vidyaParagraph?.closest('a');
    expect(vidyaLink?.getAttribute('href')).toBe('/dashboard/videogames');

    // TV & Film
    const tvParagraph = screen.getAllByText('TV & Film')[0].closest('p');
    const tvLink = tvParagraph?.closest('a');
    expect(tvLink?.getAttribute('href')).toBe('/dashboard/tv');

    // Automobiles
    const autoParagraph = screen.getAllByText('Automobiles')[0].closest('p');
    const autoLink = autoParagraph?.closest('a');
    expect(autoLink?.getAttribute('href')).toBe('/dashboard/auto');

    // Outdoors
    const outParagraph = screen.getAllByText('Outdoors')[0].closest('p');
    const outLink = outParagraph?.closest('a');
    expect(outLink?.getAttribute('href')).toBe('/dashboard/outdoors');

    // Sports
    const sportsParagraph = screen.getAllByText('Sports')[0].closest('p');
    const sportsLink = sportsParagraph?.closest('a');
    expect(sportsLink?.getAttribute('href')).toBe('/dashboard/sports');

    // Science & Math
    const scienceParagraph = screen.getAllByText('Science & Math')[0].closest('p');
    const scienceLink = scienceParagraph?.closest('a');
    expect(scienceLink?.getAttribute('href')).toBe('/dashboard/science');

    // International
    const intParagraph = screen.getAllByText('International')[0].closest('p');
    const intLink = intParagraph?.closest('a');
    expect(intLink?.getAttribute('href')).toBe('/dashboard/international');

    // Random
    const randParagraph = screen.getAllByText('Random')[0].closest('p');
    const randLink = randParagraph?.closest('a');
    expect(randLink?.getAttribute('href')).toBe('/dashboard/random');
  });
});