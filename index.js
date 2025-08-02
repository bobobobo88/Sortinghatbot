const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const CommandHandler = require('./utils/commandHandler');
const EmbedBuilderUtil = require('./utils/embedBuilder');
const PermissionChecker = require('./utils/permissionChecker');
const RoleManager = require('./utils/roleManager');
const config = require('./config/config');

class DiscordRoleBot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages
            ]
        });

        this.commandHandler = new CommandHandler();
        this.commands = this.commandHandler.loadCommands();

        this.setupEventHandlers();
    }

    /**
     * Sets up all event handlers
     */
    setupEventHandlers() {
        this.client.once('ready', this.handleReady.bind(this));
        this.client.on('interactionCreate', this.handleInteraction.bind(this));
        this.client.on('error', this.handleError.bind(this));
        process.on('unhandledRejection', this.handleUnhandledRejection.bind(this));
    }

    /**
     * Handles the ready event
     */
    handleReady() {
        console.log(`Logged in as ${this.client.user.tag}!`);
        console.log(`Bot is ready to serve ${this.client.guilds.cache.size} guilds`);
    }

    /**
     * Handles all interactions (commands and buttons)
     * @param {Interaction} interaction - The interaction to handle
     */
    async handleInteraction(interaction) {
        try {
            if (interaction.isChatInputCommand()) {
                await this.handleCommand(interaction);
            } else if (interaction.isButton()) {
                await this.handleButton(interaction);
            }
        } catch (error) {
            console.error('Error handling interaction:', error);
            await this.handleInteractionError(interaction, error);
        }
    }

    /**
     * Handles slash command interactions
     * @param {CommandInteraction} interaction - The command interaction
     */
    async handleCommand(interaction) {
        const command = this.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing command ${interaction.commandName}:`, error);
            await this.handleInteractionError(interaction, error);
        }
    }

    /**
     * Handles button interactions
     * @param {ButtonInteraction} interaction - The button interaction
     */
    async handleButton(interaction) {
        const customId = interaction.customId;
        
        if (customId.startsWith('role_')) {
            await this.handleRoleButton(interaction);
        }
    }

    /**
     * Handles role button interactions
     * @param {ButtonInteraction} interaction - The button interaction
     */
    async handleRoleButton(interaction) {
        const roleId = interaction.customId.replace('role_', '');
        const member = interaction.member;
        const botMember = interaction.guild.members.me;

        // Check permissions
        const permissionCheck = PermissionChecker.validateRoleOperation(
            member, 
            botMember, 
            interaction.guild.roles.cache.get(roleId)
        );

        if (!permissionCheck.success) {
            await interaction.reply({
                embeds: [EmbedBuilderUtil.createErrorEmbed(permissionCheck.message)],
                ephemeral: true
            });
            return;
        }

        // Toggle the role
        const result = await RoleManager.toggleRole(member, roleId);
        
        if (result.success) {
            await interaction.reply({
                embeds: [result.embed],
                ephemeral: true
            });
        } else {
            await interaction.reply({
                embeds: [EmbedBuilderUtil.createErrorEmbed(result.message)],
                ephemeral: true
            });
        }
    }

    /**
     * Handles interaction errors
     * @param {Interaction} interaction - The interaction that caused the error
     * @param {Error} error - The error that occurred
     */
    async handleInteractionError(interaction, error) {
        const errorMessage = {
            content: 'There was an error while executing this command!',
            ephemeral: true
        };

        try {
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        } catch (replyError) {
            console.error('Error sending error message:', replyError);
        }
    }

    /**
     * Handles Discord client errors
     * @param {Error} error - The error that occurred
     */
    handleError(error) {
        console.error('Discord client error:', error);
    }

    /**
     * Handles unhandled promise rejections
     * @param {Error} error - The error that occurred
     */
    handleUnhandledRejection(error) {
        console.error('Unhandled promise rejection:', error);
    }

    /**
     * Starts the bot
     */
    start() {
        this.client.login(process.env.DISCORD_TOKEN);
    }
}

// Create and start the bot
const bot = new DiscordRoleBot();
bot.start(); 