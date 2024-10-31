# SvelteKit Adapter Tauri

⚠️ **Experimental Status**: This adapter is currently in early experimental stage. API and functionality may change significantly between versions. Use in production at your own risk.

## Quick Start

```bash
npm install --save-dev sveltekit-adapter-tauri
```

```javascript
// svelte.config.js
import adapter from 'sveltekit-adapter-tauri';

/** @type {import('@sveltejs/kit').Config} */
export default {
  kit: {
    adapter: adapter({
      mode: 'ssr' // default mode
    })
  }
};
```

## Features

- 🔄 SSR Support: Server-side rendering with Tauri
- 🌐 SPA Mode: Single-page application mode
- 📄 Static Mode: Static site generation
- 🔌 Server Mode: Full server capabilities through Tauri IPC
- ⚡ Fast Development: Quick development cycle with HMR
- 🔒 Secure: No need to expose server ports

## Modes

### SSR Mode (Default)
Server-side rendering with client-side hydration. Best for applications requiring SEO and initial fast page loads.

```javascript
adapter({
  mode: 'ssr'
})
```

### SPA Mode
Single-page application mode. Best for applications with rich client-side interactions.

```javascript
adapter({
  mode: 'spa'
})
```

### Static Mode
Pre-renders all pages at build time. Best for content-focused sites.

```javascript
adapter({
  mode: 'static'
})
```

### Server Mode
Enables server-side functionality through Tauri IPC. Best for applications requiring backend functionality.

```javascript
adapter({
  mode: 'server'
})
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| mode | 'ssr' \| 'spa' \| 'static' \| 'server' | 'ssr' | Application mode |
| out | string | 'build' | Output directory |
| precompress | boolean | false | Enable Brotli/Gzip precompression |
| envPrefix | string | '' | Environment variable prefix |
| serverPath | string | 'src-tauri/src/server.rs' | Server bindings path |

## Project Structure

```
my-tauri-app/
├── src/
│   └── routes/
├── src-tauri/
│   ├── src/
│   │   └── main.rs
│   └── tauri.conf.json
├── static/
├── svelte.config.js
├── package.json
└── vite.config.js
```

## Development Workflow

1. Initialize your project:
```bash
npx sv create my-tauri-app
cd my-tauri-app
```

2. Add Tauri:
```bash
npm install --save-dev @tauri-apps/cli
npm run tauri init
```

3. Install the adapter:
```bash
npm install --save-dev sveltekit-adapter-tauri
```

4. Configure svelte.config.js as shown above

5. Development:
```bash
npm run tauri dev
```

6. Build:
```bash
npm run tauri build
```

## Server Mode Setup

When using server mode, you'll need to set up Tauri IPC handlers:

```rust
// src-tauri/src/main.rs
use tauri::command;

#[command]
async fn handle_server_request(request: ServerRequest) -> Result<ServerResponse, String> {
  // Handle server requests
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![handle_server_request])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
```

## TypeScript Support

The adapter includes TypeScript definitions. No additional setup required.

## Known Limitations

- Hot module replacement (HMR) may be unreliable in server mode
- Some SvelteKit features may not work as expected in server mode
- Static mode does not support dynamic routes
- Server-side environment variables require special handling

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

## License

MIT



## what it does

We're excited to announce sveltekit-adapter-tauri, an experimental adapter that brings the power of SvelteKit to Tauri applications. This adapter enables developers to build desktop applications using SvelteKit's powerful features while leveraging Tauri's secure, lightweight runtime.

## Why This Adapter?

The desktop application landscape is evolving. While Electron has been the go-to solution, Tauri offers a more lightweight, secure alternative. However, integrating modern web frameworks like SvelteKit with Tauri hasn't been straightforward(espefially when using server side rendering) —until now.

## Key Features

1. **Multiple Modes**: Choose between SSR, SPA, static, or server modes based on your needs.
2. **Seamless Integration**: Works with existing SvelteKit projects.
3. **Security First**: No exposed ports in production.
4. **Developer Experience**: Maintains SvelteKit's excellent DX.

## Looking Forward

This is just the beginning. We're working on:
- Enhanced server capabilities
- Better development tools
- Performance optimizations
- Expanded documentation

Try it out and let me know what you think!

# Our Roadmap

## Current Status: Experimental (v0.1.x)

This roadmap outlines the development path from experimental to production-ready status.

## Phase 1: Foundation (v0.1.x - v0.3.x)
Current focus: Core functionality and stability

### v0.1.x (Current)
- ✅ Basic adapter implementation
- ✅ SSR support (basic)
- ✅ Static file serving
- ✅ Basic documentation
- ✅ Initial test suite

### v0.2.x (Q4 2024)
- 🔄 Enhanced error handling
- 🔄 Improved TypeScript support
- 🔄 Basic hot module replacement (HMR)
- 🔄 Development mode improvements
- 🔄 Core stabilization
- 🔄 Environment variables handling
- 🔄 Basic CI/CD pipeline

### v0.3.x (Q1 2025)
- 📋 Full server mode implementation
- 📋 Tauri IPC optimization
- 📋 Enhanced build process
- 📋 Development tools
- 📋 Example applications
- 📋 Enhanced testing framework

## Phase 2: Enhancement (v0.4.x - v0.6.x)
Focus: Feature completeness and developer experience

### v0.4.x (Q2 2025)
- 📋 Advanced SSR features
- 📋 Improved routing handling
- 📋 Asset optimization
- 📋 Development server enhancements
- 📋 Plugin system foundation
- 📋 Performance monitoring tools

### v0.5.x (Q2 2025)
- 📋 Advanced server features
  - WebSocket support
  - Server-sent events
  - File upload handling
- 📋 Custom middleware support
- 📋 Enhanced security features
- 📋 Development mode debugging tools
- 📋 Configuration presets

### v0.6.x (Q2 2025)
- 📋 Advanced build optimizations
- 📋 Custom server adapters
- 📋 Enhanced error boundaries
- 📋 Development mode UI
- 📋 Auto-configuration features
- 📋 Migration tools

## Phase 3: Stabilization (v0.7.x - v0.9.x)
Focus: Production readiness and ecosystem

### v0.7.x (Q3 2025)
- 📋 Production optimizations
  - Build size optimization
  - Load time improvements
  - Memory usage optimization
- 📋 Advanced caching strategies
- 📋 Deployment guides
- 📋 Production monitoring tools

### v0.8.x (Q4 2025)
- 📋 Enterprise features
  - Advanced security options
  - Custom protocols
  - Multi-window support
- 📋 Performance profiling tools
- 📋 Advanced debugging features
- 📋 Production testing tools

### v0.9.x (Q4 2025)
- 📋 Final stabilization
- 📋 Complete documentation
- 📋 Migration guides
- 📋 Production case studies
- 📋 Performance benchmarks
- 📋 Security audits

## Phase 4: Production Release (v1.0.0)
Target: Q1 2026

### v1.0.0
- 📋 Production-ready release
- 📋 Complete feature set
- 📋 Comprehensive documentation
- 📋 Full test coverage
- 📋 Production examples
- 📋 Enterprise support readiness

## Future Considerations (Post v1.0.0)

### Performance
- Advanced build optimizations
- Custom compilation targets
- Enhanced caching strategies

### Developer Experience
- Visual configuration tools
- Enhanced debugging capabilities
- Advanced development tools

### Enterprise Features
- Custom protocol handling
- Advanced security options
- Enterprise deployment tools

### Ecosystem
- Plugin system
- Third-party integrations
- Community templates

## Contributing

We welcome contributions at all stages of development. Priority areas:

1. Core Functionality
   - Bug fixes
   - Performance improvements
   - Test coverage

2. Documentation
   - Usage examples
   - Best practices
   - Troubleshooting guides

3. Tools and Utilities
   - Development tools
   - Testing utilities
   - Configuration helpers

## Feature Requests

Feature requests should align with our roadmap phases and focus on:
1. Stability and reliability
2. Developer experience
3. Performance optimization
4. Production readiness

Submit feature requests through GitHub issues with the `enhancement` label.

## Version Support

- Development versions (0.x.x): 3 months
- Production versions (1.x.x): 12 months
- LTS versions: TBD post-1.0.0

## Timeline Notes

- Dates are tentative and subject to change
- Features may be moved between versions based on community feedback
- Security updates take priority over feature development
- Breaking changes will be clearly documented
- Beta testing periods will precede major releases

## Success Metrics

We'll measure success through:
1. Adoption metrics
2. Performance benchmarks
3. Community feedback
4. Production deployments
5. Testing coverage
6. Documentation completeness

## Get Involved

- GitHub Discussions: Technical discussions and feature requests
- Issue Tracker: Bug reports and specific issues
- Pull Requests: Code contributions

## Tracking Progress

Track our progress:
- GitHub Project Board
- Milestone tracking
- Regular releases
- Development blog (coming soon)

Legend:
- ✅ Completed
- 🔄 In Progress
- 📋 Planned


