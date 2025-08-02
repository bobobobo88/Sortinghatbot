const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedBuilderUtil = require('../utils/embedBuilder');
const PermissionChecker = require('../utils/permissionChecker');
const RoleManager = require('../utils/roleManager');
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

            // Validate permissions
            const permissionCheck = PermissionChecker.validateRoleOperation(
                interaction.member,
                interaction.guild.members.me
            );

            if (!permissionCheck.success) {
                return interaction.reply({
                    content: permissionCheck.message,
                    ephemeral: true
                });
            }

            // Update configuration
            const newConfig = { channelId: channel.id };
            if (title) newConfig.embedTitle = title;
            if (description) newConfig.embedDescription = description;
            config.updateConfig(newConfig);

            // Create and send the message
            const message = await this.createRoleSelectionMessage(channel);

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

    /**
     * Creates the role selection message
     * @param {TextChannel} channel - The channel to send the message in
     * @returns {Promise<Message>} The created message
     */
    async createRoleSelectionMessage(channel) {
        const embed = EmbedBuilderUtil.createRoleSelectionEmbed();
        const actionRows = EmbedBuilderUtil.createActionRows();

        return await channel.send({
            embeds: [embed],
            components: actionRows
        });
    }
}; 