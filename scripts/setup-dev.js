// scripts/setup-dev.js
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Create development environment
function setupDevEnvironment() {
	console.log('Setting up development environment...');

	// Create necessary directories
	mkdirSync('test-app', { recursive: true });

	// Install dependencies
	execSync('npm install', { stdio: 'inherit' });

	// Set up test app
	process.chdir('test-app');
	execSync('npx sv create  .', { stdio: 'inherit' });
	execSync('npm install', { stdio: 'inherit' });

	// Link local adapter
	execSync('npm link ../', { stdio: 'inherit' });

	// Update svelte.config.js
	const svelteConfig = `
import adapter from 'sveltekit-adapter-tauri';

export default {
    kit: {
        adapter: adapter()
    }
};
`.trim();

	writeFileSync('svelte.config.js', svelteConfig);

	console.log('Development environment setup complete!');
}

// Create test environment
function setupTestEnvironment() {
	console.log('Setting up test environment...');

	// Install test dependencies
	execSync('npm install --save-dev vitest @testing-library/svelte', { stdio: 'inherit' });

	// Create test utils
	mkdirSync('test/utils', { recursive: true });

	const testUtils = `
import { vi } from 'vitest';

export function createMockBuilder() {
    return {
        rimraf: vi.fn(),
        getServerDirectory: vi.fn(() => 'server'),
        getClientDirectory: vi.fn(() => 'client'),
        getBuildDirectory: vi.fn(() => 'build'),
        writeClient: vi.fn(),
        writeServer: vi.fn(),
    };
}
`.trim();

	writeFileSync('test/utils/test-utils.js', testUtils);

	console.log('Test environment setup complete!');
}

// Run setup
try {
	setupDevEnvironment();
	setupTestEnvironment();
	console.log('Setup completed successfully!');
} catch (error) {
	console.error('Setup failed:', error);
	process.exit(1);
}
