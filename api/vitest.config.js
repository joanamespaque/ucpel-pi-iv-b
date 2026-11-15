import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // Os testes compartilham o mesmo banco; a execução sequencial evita interferência.
    fileParallelism: false,
    testTimeout: 15000,
  },
});
