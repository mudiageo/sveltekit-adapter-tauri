import type { AdapterConfig, Builder } from '@sveltejs/kit';
import adapterStatic from '@sveltejs/adapter-static';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface AdapterTauriOptions {
	mode?: 'ssr' | 'spa' | 'static' | 'server';
	out?: string;
	precompress?: boolean;
	envPrefix?: string;
	serverPath?: string;
}

export default function adapterTauri(options: AdapterTauriOptions = {}): AdapterConfig {
	const {
		mode = 'ssr',
		out = 'build',
		precompress = false,
		envPrefix = '',
		serverPath = 'src-tauri/src/server.rs'
	} = options;

	return {
		name: 'sveltekit-adapter-tauri',

		async adapt(builder: Builder) {
			if (mode === 'static') {
				return adapterStatic({
					pages: out,
					assets: out,
					fallback: 'index.html',
					precompress
				}).adapt(builder);
			}

			const outputDir = resolve(out);
			mkdirSync(outputDir, { recursive: true });

			builder.log.minor('Building SvelteKit app...');

			// Write client files
			await builder.writeClient(outputDir);
			await builder.writePrerendered(outputDir);

			if (mode === 'server' || mode === 'ssr') {
				const serverDir = join(outputDir, 'server');
				mkdirSync(serverDir, { recursive: true });
				await builder.writeServer(serverDir);
				const serverShim = `
import { Server } from '@sveltejs/kit/node';
import { manifest } from './server/manifest.js';
import { building } from '$app/environment';

const server = new Server(manifest);

if (!building) {
  server.init({
    env: process.env
  });
}

export { server };
`;

				// Write server shim directly from the template
				writeFileSync(join(outputDir, 'server-shim.js'), serverShim);

				// Generate Rust server bindings
				const tauriBindings = generateTauriServerBindings();
				const rustServerPath = resolve(serverPath);
				mkdirSync(dirname(rustServerPath), { recursive: true });
				writeFileSync(rustServerPath, tauriBindings);
			}

			// Write client entry
			writeFileSync(join(outputDir, 'client.js'), generateClientEntry(mode));

			// Write shims directory
			const shimsDir = join(outputDir, 'shims');
			mkdirSync(shimsDir, { recursive: true });

			// Write platform-specific shims
			writeFileSync(join(shimsDir, 'platform.js'), generatePlatformShim());
		}
	};
}

function generatePlatformShim(): string {
	return `
export const platform = {
  env: new Proxy({}, {
    get: (target, prop) => window.__TAURI__.env.get(prop.toString())
  })
};
`;
}

function generateTauriServerBindings(): string {
	return `
use tauri::{command, Runtime};
use std::sync::Mutex;
use serde::{Serialize, Deserialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
pub struct ServerRequest {
    method: String,
    path: String,
    headers: HashMap<String, String>,
    body: Option<Vec<u8>>
}

#[derive(Debug, Serialize)]
pub struct ServerResponse {
    status: u16,
    headers: HashMap<String, String>,
    body: Vec<u8>
}

struct ServerState(Mutex<Option<String>>);

#[command]
pub async fn handle_server_request<R: Runtime>(
    app_handle: tauri::AppHandle<R>,
    state: tauri::State<'_, ServerState>,
    request: ServerRequest
) -> Result<ServerResponse, String> {
    let response = ServerResponse {
        status: 200,
        headers: HashMap::new(),
        body: Vec::new()
    };
    
    Ok(response)
}

#[command]
pub async fn initialize_server<R: Runtime>(
    app_handle: tauri::AppHandle<R>,
    state: tauri::State<'_, ServerState>
) -> Result<(), String> {
    Ok(())
}
`;
}

function generateClientEntry(mode: string): string {
	if (mode === 'spa') {
		return `
import { invoke } from '@tauri-apps/api';

async function start() {
  const { hydrate } = await import('./generated/client/app.js');
  
  hydrate({
    target: document.body,
    single: true
  });
}

start().catch(console.error);
`;
	}

	if (mode === 'server') {
		return `
import { invoke } from '@tauri-apps/api';

async function start() {
  const { hydrate } = await import('./generated/client/app.js');
  
  // Initialize Tauri server bridge
  await invoke('initialize_server');
  
  // Set up request interceptor
  window.__tauriServerRequest = async (request) => {
    return await invoke('handle_server_request', { request });
  };
  
  hydrate({
    target: document.body
  });
}

start().catch(console.error);
`;
	}

	// Default SSR mode
	return `
import { invoke } from '@tauri-apps/api';

async function start() {
  const { hydrate } = await import('./generated/client/app.js');
  
  hydrate({
    target: document.body
  });
}

start().catch(console.error);
`;
}
