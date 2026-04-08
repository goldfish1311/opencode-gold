# OpenCode Gold - Разделение от оригинального OpenCode

## Цель

OpenCode Gold - это форк OpenCode с полностью изолированными путями конфигурации и данных.

## Изменённые пути

| Компонент | Оригинальный OpenCode | OpenCode Gold |
|-----------|----------------------|----------------|
| Config | `~/.config/opencode` | `~/.config/opencode-gold` |
| Data | `~/.local/share/opencode` | `~/.local/share/opencode-gold` |
| Cache | `~/.cache/opencode` | `~/.cache/opencode-gold` |
| State | `~/.local/state/opencode` | `~/.local/state/opencode-gold` |
| Bin | `~/.cache/opencode/bin` | `~/.cache/opencode-gold/bin` |
| Logs | `~/.local/share/opencode/log` | `~/.local/share/opencode-gold/log` |
| Skills | `~/.config/opencode/skills` | `~/.config/opencode-gold/skills` |

## Изменённые файлы

### 1. `packages/opencode/src/global/index.ts`
- Изменено: `const app = "opencode"` → `"opencode-gold"`
- Влияет на все XDG пути автоматически

### 2. `packages/desktop/src-tauri/src/cli.rs`
- `CLI_INSTALL_DIR`: `.opencode/bin` → `.opencode-gold/bin`
- `CLI_BINARY_NAME`: `opencode` → `opencode-gold`
- `get_sidecar_path()`: возвращает `opencode-gold-cli`
- Windows WSL script: обновлён путь установки

### 3. `packages/desktop/src-tauri/tauri.conf.json`
- `productName`: `"OpenCode Gold"`
- `identifier`: `"ai.opencode.desktop.gold"`
- `mainBinaryName`: `"opencode-gold"`
- `externalBin`: `["sidecars/opencode-gold-cli"]`

## Структура файлов

```
opencode-gold/
├── packages/
│   ├── opencode/           # CLI с изолированными путями
│   └── desktop/            # Tauri desktop app
│       └── src-tauri/
│           ├── sidecars/
│           │   └── opencode-gold-cli-x86_64-unknown-linux-gnu/
│           │       └── opencode-gold-cli
│           └── tauri.conf.json
```

## Установка

```bash
sudo dpkg -i OpenCode\ Gold_1.3.17_amd64.deb
```

## Запуск

- Меню приложений: "OpenCode Gold"
- Или терминал: `/usr/bin/opencode-gold`

## Преимущества изоляции

1. **Независимые конфигурации** - изменения в одном не влияют на другое
2. **Независимые базы данных** - отдельные сессии и история
3. **Независимые кэши** - отдельные LSP, MCP, npm пакеты
4. **Безопасность тестирования** - можно экспериментировать без риска сломать основную версию
