import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    specPattern: '__tests__/e2e/**/*.cy.ts',  // Adjust the path to match your test files
  },
});
