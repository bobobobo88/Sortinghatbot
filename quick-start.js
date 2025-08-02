const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

// Check if .env file exists
if (!fs.existsSync('.env')) {
    console.log('❌ .env file not found!');
    console.log('Please create a .env file with the following content:');
    console.log('');
    console.log('DISCORD_TOKEN=your_discord_bot_token_here');
    console.log('CLIENT_ID=your_discord_client_id_here');
    console.log('GUILD_ID=your_discord_guild_id_here');
    console.log('');
    console.log('You can get these values from:');
    console.log('1. Go to https://discord.com/developers/applications');
    console.log('2. Create a new application');
    console.log('3. Create a bot and copy the token');
    console.log('4. Copy the Application ID (Client ID)');
    console.log('5. Copy your server ID (Guild ID)');
    process.exit(1);
}

// Check if required environment variables are set
const requiredEnvVars = ['DISCORD_TOKEN', 'CLIENT_ID', 'GUILD_ID'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.log('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    console.log('');
    console.log('Please update your .env file with the missing variables.');
    process.exit(1);
}

console.log('✅ Environment variables are properly configured!');
console.log('');
console.log('🚀 Quick Start Guide:');
console.log('');
console.log('1. Install dependencies:');
console.log('   npm install');
console.log('');
console.log('2. Deploy slash commands:');
console.log('   npm run deploy-commands');
console.log('');
console.log('3. Start the bot:');
console.log('   npm start');
console.log('');
console.log('4. In your Discord server, use these commands:');
console.log('');
console.log('   /setup channel:#role-selection');
console.log('   /addrole role:@Degen Uncle label:"Degen Uncle" emoji:🎲');
console.log('   /addrole role:@Uber Customer label:"Uber Customer" emoji:🚗');
console.log('');
console.log('📖 For more detailed instructions, see README.md and example-setup.md');
console.log('');
console.log('🎯 The bot will create an interactive message where users can click buttons to assign/remove roles!'); 