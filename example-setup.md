# Example Setup Guide

This guide will help you set up the Discord Role Adder Bot with some example roles.

## Step 1: Bot Setup

1. Create a Discord application at https://discord.com/developers/applications
2. Create a bot and copy the token
3. Copy your client ID and guild ID
4. Create a `.env` file with your credentials:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
```

## Step 2: Install and Deploy

```bash
npm install
npm run deploy-commands
npm start
```

## Step 3: Create Roles

In your Discord server, create the vanity roles you want users to be able to assign themselves. For example:

- 🎲 Degen Uncle
- 🚗 Uber Customer
- 🎮 Gamer
- 📚 Student
- 💼 Professional

## Step 4: Add Roles to Bot

Use the `/addrole` command to add each role:

```
/addrole role:@Degen Uncle label:Degen Uncle emoji:🎲
/addrole role:@Uber Customer label:Uber Customer emoji:🚗
/addrole role:@Gamer label:Gamer emoji:🎮
/addrole role:@Student label:Student emoji:📚
/addrole role:@Professional label:Professional emoji:💼
```

## Step 5: Create Role Selection Message

Use the `/setup` command to create the embedded message:

```
/setup channel:#role-selection title:"Select Your Vanity Roles!" description:"Click the buttons below to assign yourself your desired roles. You can select or deselect roles at any time."
```

## Step 6: Test

Users can now click the buttons in the role selection channel to assign/remove roles!

## Example Role Configurations

Here are some popular role combinations you might want to use:

### Gaming Server
- 🎮 Gamer
- 🏆 Pro Player
- 🎯 Casual Player
- 🎪 Event Participant

### Study Group
- 📚 Student
- 👨‍🏫 Teacher
- 📖 Book Club
- 💡 Study Buddy

### Professional Network
- 💼 Professional
- 🚀 Entrepreneur
- 👨‍💻 Developer
- 🎨 Designer

### Community Server
- 🌟 VIP Member
- 🎉 Event Organizer
- 📢 Announcements
- 🤝 Helper 