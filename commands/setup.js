const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedBuilderUtil = require('../utils/embedBuilder');
const config = require('../config/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Create or update the embedded role selection message')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to post the role selection message in')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Title for the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Description for the embed')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        try {
            const channel = interaction.options.getChannel('channel');
            const title = interaction.options.getString('title');
            const description = interaction.options.getString('description');

            // Check if user has permission to manage roles
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                return interaction.reply({
                    content: 'You need the "Manage Roles" permission to use this command.',
                    ephemeral: true
                });
            }

            // Check if bot has permission to manage roles
            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
                return interaction.reply({
                    content: 'I need the "Manage Roles" permission to manage role assignments.',
                    ephemeral: true
                });
            }

            // Update config with new values
            const newConfig = {
                channelId: channel.id
            };

            if (title) newConfig.embedTitle = title;
            if (description) newConfig.embedDescription = description;

            config.updateConfig(newConfig);

            // Create the embed and action rows
            const embed = EmbedBuilderUtil.createRoleSelectionEmbed();
            const actionRows = EmbedBuilderUtil.createActionRows();

            // Send the message
            const message = await channel.send({
                embeds: [embed],
                components: actionRows
            });

            // Update config with message ID
            config.updateConfig({ messageId: message.id });

            await interaction.reply({
                content: `Role selection message has been created in ${channel}!`,
                ephemeral: true
            });

        } catch (error) {
            console.error('Error in setup command:', error);
            await interaction.reply({
                content: 'An error occurred while setting up the role selection message.',
                ephemeral: true
            });
        }
    },
}; 