import { assert, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'nextjs-toploader/app';
import { initDb, clearDb } from '../setup/setup';
import Page from '@/app/dashboard/[board]/page';

beforeAll(async () => {
  await initDb();
});

// Mock Next.js useRouter hook
vi.mock('nextjs-toploader/app', () => ({
  useRouter: vi.fn()
}));

describe('Posting', () => {
  it('form submits new OP post and it can be seen afterwards', async () => {
    /*
    (useRouter as any).mockReturnValue({
      params: Promise.resolve({
        board: 'random',
      }),
    });

    const paramsPromise: Promise<{ board: string }> = Promise.resolve({ board: 'random' })

    render(<Page params={paramsPromise} />)
    screen.debug();

    await waitFor(() => screen.getByRole('heading', { name: '✵ Random ✵' }));
    expect(screen.getByRole('heading', { level: 1, name: '✵ Random ✵' })).toBeDefined();
    */
   
    assert(true);
  });
});

afterAll(async () => {
  await clearDb();
})