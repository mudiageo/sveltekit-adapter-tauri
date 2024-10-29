import { describe, it, expect, vi } from 'vitest';
import adapter from '../index.js';

describe('adapter-tauri', () => {
	it('should create necessary build files', async () => {
		const mockBuilder = {
			rimraf: vi.fn(),
			getServerDirectory: vi.fn(() => 'server'),
			getClientDirectory: vi.fn(() => 'client'),
			getBuildDirectory: vi.fn(() => 'build'),
			writeClient: vi.fn(),
			writeServer: vi.fn()
		};

		const instance = adapter();
		await instance.adapt(mockBuilder);

		expect(mockBuilder.rimraf).toHaveBeenCalledTimes(2);
		expect(mockBuilder.writeClient).toHaveBeenCalled();
		expect(mockBuilder.writeServer).toHaveBeenCalled();
	});
});
