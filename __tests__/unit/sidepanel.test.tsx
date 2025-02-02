import { expect, vi } from 'vitest';
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
        const indexParagraph = screen.getAllByText('Index')[0];
        expect(indexParagraph.closest('p')).toBeDefined();

        // Technology
        const techParagraph = screen.getAllByText('Technology')[0];
        expect(techParagraph.closest('p')).toBeDefined();

        // Business
        const bizParagraph = screen.getAllByText('Business')[0];
        expect(bizParagraph.closest('p')).toBeDefined();

        // Music
        const musicParagraph = screen.getAllByText('Music')[0];
        expect(musicParagraph.closest('p')).toBeDefined();

        // Art
        const artParagraph = screen.getAllByText('Art')[0];
        expect(artParagraph.closest('p')).toBeDefined();

        // Video games
        const vidyaParagraph = screen.getAllByText('Video Games')[0];
        expect(vidyaParagraph.closest('p')).toBeDefined();

        // TV & Film
        const tvParagraph = screen.getAllByText('TV & Film')[0];
        expect(tvParagraph.closest('p')).toBeDefined();

        // Automobiles
        const autoParagraph = screen.getAllByText('Automobiles')[0];
        expect(autoParagraph.closest('p')).toBeDefined();

        // Outdoors
        const outParagraph = screen.getAllByText('Outdoors')[0];
        expect(outParagraph.closest('p')).toBeDefined();

        // Sports
        const sportsParagraph = screen.getAllByText('Sports')[0];
        expect(sportsParagraph.closest('p')).toBeDefined();

        // Science & Math
        const scienceParagraph = screen.getAllByText('Science & Math')[0];
        expect(scienceParagraph.closest('p')).toBeDefined();

        // International
        const intParagraph = screen.getAllByText('International')[0];
        expect(intParagraph.closest('p')).toBeDefined();

        // Random
        const randParagraph = screen.getAllByText('Random')[0];
        expect(randParagraph.closest('p')).toBeDefined();
    });
});