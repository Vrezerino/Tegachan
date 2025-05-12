import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '@/app/dashboard/page';

describe('Home page', () => {
  it('heading exists', async () => {
    render(await Page());
    expect(screen.getByRole('heading', { level: 1, name: 'TEGACHAN' })).toBeDefined();
  });

  it('latest posts list exists', async () => {
    render(await Page());
    expect(screen.getByRole('heading', { level: 5, name: 'Latest Posts' })).toBeDefined();
  })

  it('latest post list has posts in it', async () => {
    render(await Page());

    expect(screen.getAllByText('Legato')[0]).toBeTruthy();
    expect(screen.getAllByText('In music performance and notation', { exact: false })[0]).toBeTruthy();
    expect(screen.getAllByText('Test title 2')[0]).toBeTruthy();
    expect(screen.getAllByText('Test content 2')[0]).toBeTruthy();
  })
});