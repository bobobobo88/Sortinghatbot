# Discord Role Adder Bot

A Discord bot that allows server members to self-assign vanity roles via interactive buttons in an embedded message.

## Features

- **Interactive Role Selection**: Users can click buttons to add/remove roles
- **Admin Commands**: Easy setup and management of role buttons
- **Ephemeral Responses**: Clean user feedback without cluttering channels
- **Persistent Configuration**: Role-button mappings are saved and restored

## Setup

### Quick Start
```bash
npm install
npm run quick-start
```

### Manual Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `env.example` to `.env`
   - Fill in your Discord bot token, client ID, and guild ID

3. **Discord Bot Setup**
   - Create a Discord application at https://discord.com/developers/applications
   - Create a bot and get your token
   - Enable the following bot permissions:
     - Manage Roles
     - Send Messages
     - Use Slash Commands
     - Read Message History
     - Add Reactions

4. **Deploy Commands**
   ```bash
   npm run deploy-commands
   ```

5. **Start the Bot**
   ```bash
   npm start
   ```

## Admin Commands

- `/setup` - Create or update the embedded role message
- `/addrole` - Add a new role button
- `/removerole` - Remove a role button
- `/viewroles` - List all configured roles

## Usage

1. Use `/setup` to create the initial role selection message
2. Users can click buttons to assign/remove roles
3. Use admin commands to manage available roles

## Permissions Required

The bot needs the following permissions:
- Manage Roles
- Send Messages
- Use Slash Commands
- Read Message History
- Add Reactions

## Development

```bash
npm run dev  # Start with nodemon for development
``` 