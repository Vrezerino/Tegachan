import { expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NavLinks from '@/app/ui/dashboard/navLinks';
import SideNav from '@/app/ui/dashboard/sideNav';

describe('Navigation', () => {
    it('links exist', () => {
        render(<NavLinks />);

        expect(screen.getByText('Index')).toBeTruthy();
        expect(screen.getByText('Tech')).toBeTruthy();
        expect(screen.getByText('Music')).toBeTruthy();
        expect(screen.getByText('Outdoors')).toBeTruthy();
        expect(screen.getByText('Random')).toBeTruthy();
    });
});

describe('Side panel', () => {
    it('dark mode toggle exists and works', () => {
        render(<SideNav />);

        expect(screen.getByText('Dark mode')).toBeTruthy();
        //

    });
});