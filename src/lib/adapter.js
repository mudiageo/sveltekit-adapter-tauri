// @ts-check
import { fileURLToPath } from 'url';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { pathToFileURL } from 'url';

/** @type {import('@sveltejs/kit').Adapter} */
const adapter = function (options = {}) {
	return {
		name: 'sveltekit-dapter-tauri',

		async adapt(builder) {
			// Ensure we have a clean build directory
			builder.rimraf(builder.getServerDirectory());
			builder.rimraf(builder.getClientDirectory());

			// Build the client and server
			const serverBuildDir = join(builder.getServerDirectory());
			const clientBuildDir = join(builder.getClientDirectory());

			// Ensure directories exist
			mkdirSync(serverBuildDir, { recursive: true });
			mkdirSync(clientBuildDir, { recursive: true });

			// Copy client files
			builder.writeClient(clientBuildDir);

			// Copy server files
			builder.writeServer(serverBuildDir);

			// Generate the server entry point
			const relativePath = (path) => builder.getServerDirectory(path);

			const serverFile = join(serverBuildDir, 'index.js');
			writeFileSync(
				serverFile,
				`
import { handler } from '${builder.getServerDirectory('handler.js')}';
import { env } from '${builder.getServerDirectory('env.js')}';
import { Server } from '${builder.getServerDirectory('index.js')}';
import { manifest } from '${builder.getServerDirectory('manifest.js')}';

const server = new Server(manifest);
await server.init({ env });

export { handler };
                `.trim()
			);

			// Generate the client entry point for Tauri
			const clientEntry = `
import { invoke } from '@tauri-apps/api';
import { start } from '${pathToFileURL(join(clientBuildDir, 'app.js'))}';

// Initialize the SvelteKit app
start({
    target: document.body,
    hydrate: true
});

// Handle SSR requests through Tauri
window.__ssr = async (url, options = {}) => {
    try {
        const response = await invoke('handle_ssr', {
            url,
            options: JSON.stringify(options)
        });
        return JSON.parse(response);
    } catch (error) {
        console.error('SSR Error:', error);
        return {
            status: 500,
            headers: {},
            body: 'Internal Server Error'
        };
    }
};
            `.trim();

			writeFileSync(join(clientBuildDir, 'entry.js'), clientEntry);

			// Generate Tauri command handler
			const tauriCommand = `
#[tauri::command]
async fn handle_ssr(url: String, options: String) -> Result<String, String> {
    let handler = get_handler().await;
    let options: Value = serde_json::from_str(&options)
        .map_err(|e| e.to_string())?;
    
    let response = handler(Request::new(&url, options))
        .await
        .map_err(|e| e.to_string())?;
    
    serde_json::to_string(&response)
        .map_err(|e| e.to_string())
}
            `.trim();

			writeFileSync(join(builder.getBuildDirectory(), 'tauri-command.rs'), tauriCommand);

			// Generate configuration instructions
			const readmeContent = `
# SvelteKit Tauri Adapter

## Setup Instructions

1. Install the adapter:
   \`\`\`bash
   npm install sveltekit-adapter-tauri
   \`\`\`

2. Update your svelte.config.js:
   \`\`\`javascript
   import adapter from 'sveltekit-adapter-tauri';

   export default {
       kit: {
           adapter: adapter()
       }
   };
   \`\`\`

3. Add the Rust command handler to your Tauri main.rs:
   - Copy the content from \`build/tauri-command.rs\`
   - Register the command in your main.rs:
     \`\`\`rust
     #[tauri::command]
     fn handle_ssr(/* ... */)
     
     fn main() {
         tauri::Builder::default()
             .invoke_handler(tauri::generate_handler![handle_ssr])
             // ...
     }
     \`\`\`

4. Update your index.html to use the SSR entry point:
   \`\`\`html
   <script type="module" src="/build/entry.js"></script>
   \`\`\`
            `.trim();

			writeFileSync(join(builder.getBuildDirectory(), 'README.md'), readmeContent);
		}
	};
};

export default adapter;
