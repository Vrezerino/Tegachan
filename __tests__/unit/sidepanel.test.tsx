import { expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NavLinks from '@/app/ui/dashboard/navLinks';

describe('Navigation', () => {
    it('links exist and direct to correct pages', () => {
        render(<NavLinks />);

        // Index button
        const indexBtn = screen.getByText('Index'); // Paragraph element
        expect(indexBtn?.parentElement).toBeTruthy(); // Parent is an anchor (<a>)
        expect(indexBtn?.parentElement?.getAttribute('href')).toEqual('/dashboard');

        // Tech button
        const techBtn = screen.getByText('Tech');
        expect(techBtn?.parentElement).toBeTruthy();
        expect(techBtn?.parentElement?.getAttribute('href')).toEqual('/dashboard/technology');

        // Music button
        const musicBtn = screen.getByText('Music');
        expect(musicBtn?.parentElement).toBeTruthy();
        expect(musicBtn?.parentElement?.getAttribute('href')).toEqual('/dashboard/music');

        // Outdoors button
        const outdoorsBtn = screen.getByText('Outdoors');
        expect(outdoorsBtn?.parentElement).toBeTruthy();
        expect(outdoorsBtn?.parentElement?.getAttribute('href')).toEqual('/dashboard/outdoors');

        // Random button
        const randomBtn = screen.getByText('Random');
        expect(randomBtn?.parentElement).toBeTruthy();
        expect(randomBtn?.parentElement?.getAttribute('href')).toEqual('/dashboard/random');
    });
});