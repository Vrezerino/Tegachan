import { expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NavLinks from '@/app/ui/dashboard/navLinks';

describe('Navigation', () => {
    it('links exist and direct to correct pages', () => {
        render(<NavLinks />);

        // Index
        const indexBtn = screen.getByText('Index'); // Paragraph element
        expect(indexBtn?.parentElement).toBeTruthy(); // Parent is an anchor (<a>)
        expect(indexBtn?.parentElement?.getAttribute('href')).toEqual('/dashboard');

        // Technology
        const techBtn = screen.getByText('Technology');
        expect(techBtn?.parentElement).toBeTruthy();
        expect(techBtn?.parentElement?.getAttribute('href')).toEqual('/dashboard/technology');

        // Business
        const bizBtn = screen.getByText('Business');
        expect(bizBtn?.parentElement).toBeTruthy();
        expect(bizBtn?.parentElement?.getAttribute('href')).toEqual('/dashboard/business');

        // Music
        const musicBtn = screen.getByText('Music');
        expect(musicBtn?.parentElement).toBeTruthy();
        expect(musicBtn?.parentElement?.getAttribute('href')).toEqual('/dashboard/music');

        // Art
        const artBtn = screen.getByText('Art');
        expect(artBtn?.parentElement).toBeTruthy();
        expect(artBtn?.parentElement?.getAttribute('href')).toEqual('/dashboard/art');

        // Video games
        const vidyaBtn = screen.getByText('Video Games');
        expect(vidyaBtn?.parentElement).toBeTruthy();
        expect(vidyaBtn?.parentElement?.getAttribute('href')).toEqual('/dashboard/videogames');

        // TV & Film
        const tvBtn = screen.getByText('TV & Film');
        expect(tvBtn?.parentElement).toBeTruthy();
        expect(tvBtn?.parentElement?.getAttribute('href')).toEqual('/dashboard/tv');

        // Automobiles
        const autoBtn = screen.getByText('Auto');
        expect(autoBtn?.parentElement).toBeTruthy();
        expect(autoBtn?.parentElement?.getAttribute('href')).toEqual('/dashboard/auto');

        // Outdoors
        const outdoorsBtn = screen.getByText('Outdoors');
        expect(outdoorsBtn?.parentElement).toBeTruthy();
        expect(outdoorsBtn?.parentElement?.getAttribute('href')).toEqual('/dashboard/outdoors');

        // Sports
        const sportsBtn = screen.getByText('Sports');
        expect(sportsBtn?.parentElement).toBeTruthy();
        expect(sportsBtn?.parentElement?.getAttribute('href')).toEqual('/dashboard/sports');

        // Science & Math
        const scienceBtn = screen.getByText('Science & Math');
        expect(scienceBtn?.parentElement).toBeTruthy();
        expect(scienceBtn?.parentElement?.getAttribute('href')).toEqual('/dashboard/science');

        // International
        const intBtn = screen.getByText('International');
        expect(intBtn?.parentElement).toBeTruthy();
        expect(intBtn?.parentElement?.getAttribute('href')).toEqual('/dashboard/international');

        // Random
        const randomBtn = screen.getByText('Random');
        expect(randomBtn?.parentElement).toBeTruthy();
        expect(randomBtn?.parentElement?.getAttribute('href')).toEqual('/dashboard/random');
    });
});