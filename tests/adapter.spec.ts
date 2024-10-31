import { describe, it, expect, vi } from 'vitest';
import adapterTauri from '../src/lib/index';

describe('sveltekit-adapter-tauri', () => {
  it('should create adapter with default options', () => {
    const adapter = adapterTauri();
    expect(adapter.name).toBe('sveltekit-adapter-tauri');
  });

  it('should use static adapter in static mode', async () => {
    const adapter = adapterTauri({ mode: 'static' });
    const builder = {
      writeClient: vi.fn(),
      writePrerendered: vi.fn(),
      log: vi.fn(),
      rimraf: vi.fn(),
      generateEnvModule: vi.fn(),
      generateFallback: vi.fn(),
    };

    await adapter.adapt(builder);
    expect(builder.writeClient).toHaveBeenCalled();
  });

  it('should generate server bindings in server mode', async () => {
    const adapter = adapterTauri({ mode: 'server' });
    const builder = {
      writeClient: vi.fn(),
      writePrerendered: vi.fn(),
      writeServer: vi.fn(),
      log: {
        minor: vi.fn()
      }
    };

    await adapter.adapt(builder);
    expect(builder.writeServer).toHaveBeenCalled();
  });
});