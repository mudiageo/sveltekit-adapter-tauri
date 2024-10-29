sveltekit-adapter-tauri

An experimental SvelteKit adapter for Tauri applications with SSR support.

## Features

- Full Server-Side Rendering (SSR) support
- Seamless integration with Tauri's command system
- Proper hydration and client-side navigation
- TypeScript support
- Comprehensive error handling

## Installation

```bash
npm install --save-dev sveltekit-adapter-tauri
```

## Usage

1. Update your `svelte.config.js`:

```javascript
import adapter from 'sveltekit-adapter-tauri';

export default {
	kit: {
		adapter: adapter()
	}
};
```

2. Add the Rust command handler to your Tauri `main.rs`:

```rust
#[tauri::command]
async fn handle_ssr(url: String, options: String) -> Result<String, String> {
    // Implementation provided in build output
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![handle_ssr])
        // ...
}
```

3. That's it! Your SvelteKit app will now use SSR with Tauri.

## Configuration Options

The adapter accepts the following options:

```javascript
adapter({
	// Custom options here
});
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
