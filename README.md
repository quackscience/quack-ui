# Quack-UI

> CH-UI fork for DuckDB / Quackpipe

![Quack-UI-Workspace-ezgif com-crop](https://github.com/user-attachments/assets/aec14c53-3bfb-4e1e-acb9-fcb9001c433e)


### Build from Source

#### Prerequisites
- Node.js >= 20.x
- npm >= 10.x

#### Installation Steps
Build and Test locally
```bash
npm install
npm run build
npm run dev
```
For production
```bash
npm run preview
```

#### Configuration
The application will defaults to the connection setup on first access.


To preset connection details use the following ENV variables:
```
VITE_CLICKHOUSE_URL
VITE_CLICKHOUSE_USER
VITE_CLICKHOUSE_PASS
```

For self-serving setups such as quackpipe
```
VITE_SELFSERVICE
```

## 📄 License

[ch-ui](https://github.com/caioricciuti/ch-ui) fork licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
