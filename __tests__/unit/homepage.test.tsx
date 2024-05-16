import { describe, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '@/app/dashboard/page';
import { initDb, clearDb } from '../setup/setup';

beforeAll(async () => {
    await initDb();
});

describe('Home page', () => {
    it('heading exists', async () => {
        render(await Page());
        expect(screen.getByRole('heading', { level: 1, name: '✵ Welcome to Tegachan! ✵' })).toBeDefined();
    });

    it('latest posts list exists', async () => {
        render(await Page());
        expect(screen.getByRole('heading', { level: 5, name: 'Latest Posts' })).toBeDefined();
    })

    it('latest post list has posts in it', async () => {
        render(await Page());

        expect(screen.getByText('Legato')).toBeTruthy();
        expect(screen.getByText('In music performance and notation', { exact: false })).toBeTruthy();
        expect(screen.getByText('Test title 2')).toBeTruthy();
        expect(screen.getByText('Test content 2')).toBeTruthy();
    })
});

afterAll(async () => {
    await clearDb();
})