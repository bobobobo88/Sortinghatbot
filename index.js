const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const CommandHandler = require('./utils/commandHandler');
const EmbedBuilderUtil = require('./utils/embedBuilder');
const config = require('./config/config');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
    ]
});

// Initialize command handler
const commandHandler = new CommandHandler();
const commands = commandHandler.loadCommands();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`Bot is ready to serve ${client.guilds.cache.size} guilds`);
});

client.on('interactionCreate', async interaction => {
    try {
        if (interaction.isChatInputCommand()) {
            const command = commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing command ${interaction.commandName}:`, error);
                
                const errorMessage = {
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                };

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
        } else if (interaction.isButton()) {
            await handleButtonInteraction(interaction);
        }
    } catch (error) {
        console.error('Error handling interaction:', error);
    }
});

async function handleButtonInteraction(interaction) {
    try {
        const customId = interaction.customId;
        
        if (customId.startsWith('role_')) {
            const roleId = customId.replace('role_', '');
            const role = interaction.guild.roles.cache.get(roleId);
            const member = interaction.member;
            
            if (!role) {
                await interaction.reply({
                    embeds: [EmbedBuilderUtil.createErrorEmbed('Role not found. It may have been deleted.')],
                    ephemeral: true
                });
                return;
            }

            // Check if bot has permission to manage this role
            if (!interaction.guild.members.me.permissions.has('ManageRoles')) {
                await interaction.reply({
                    embeds: [EmbedBuilderUtil.createErrorEmbed('I don\'t have permission to manage roles.')],
                    ephemeral: true
                });
                return;
            }

            // Check if the role is higher than the bot's highest role
            if (role.position >= interaction.guild.members.me.roles.highest.position) {
                await interaction.reply({
                    embeds: [EmbedBuilderUtil.createErrorEmbed('I cannot manage this role because it is higher than my highest role.')],
                    ephemeral: true
                });
                return;
            }

            const hasRole = member.roles.cache.has(roleId);
            const roleData = config.getRole(roleId);

            if (!roleData) {
                await interaction.reply({
                    embeds: [EmbedBuilderUtil.createErrorEmbed('This role is not configured in the role selection system.')],
                    ephemeral: true
                });
                return;
            }

            try {
                if (hasRole) {
                    await member.roles.remove(roleId);
                    await interaction.reply({
                        embeds: [EmbedBuilderUtil.createSuccessEmbed(roleData.label, 'removed from')],
                        ephemeral: true
                    });
                } else {
                    await member.roles.add(roleId);
                    await interaction.reply({
                        embeds: [EmbedBuilderUtil.createSuccessEmbed(roleData.label, 'assigned')],
                        ephemeral: true
                    });
                }
            } catch (error) {
                console.error('Error managing role:', error);
                await interaction.reply({
                    embeds: [EmbedBuilderUtil.createErrorEmbed('Failed to manage role. Please contact an administrator.')],
                    ephemeral: true
                });
            }
        }
    } catch (error) {
        console.error('Error handling button interaction:', error);
        await interaction.reply({
            embeds: [EmbedBuilderUtil.createErrorEmbed('An error occurred while processing your request.')],
            ephemeral: true
        });
    }
}

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Login
client.login(process.env.DISCORD_TOKEN); 