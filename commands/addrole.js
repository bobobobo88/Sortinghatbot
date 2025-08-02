const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedBuilderUtil = require('../utils/embedBuilder');
const config = require('../config/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addrole')
        .setDescription('Add a new role button to the role selection message')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to add')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('label')
                .setDescription('The label for the button')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('Emoji for the button (optional)')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        try {
            const role = interaction.options.getRole('role');
            const label = interaction.options.getString('label');
            const emoji = interaction.options.getString('emoji');

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

            // Check if role is already configured
            if (config.hasRole(role.id)) {
                return interaction.reply({
                    content: `The role ${role.name} is already configured.`,
                    ephemeral: true
                });
            }

            // Add the role to configuration
            config.addRole(role.id, label, emoji || '');

            // Update the existing message if it exists
            const configData = config.getConfig();
            if (configData.messageId && configData.channelId) {
                try {
                    const channel = await interaction.guild.channels.fetch(configData.channelId);
                    const message = await channel.messages.fetch(configData.messageId);

                    const embed = EmbedBuilderUtil.createRoleSelectionEmbed();
                    const actionRows = EmbedBuilderUtil.createActionRows();

                    await message.edit({
                        embeds: [embed],
                        components: actionRows
                    });

                    await interaction.reply({
                        content: `Role ${role.name} has been added to the role selection message!`,
                        ephemeral: true
                    });
                } catch (error) {
                    console.error('Error updating message:', error);
                    await interaction.reply({
                        content: `Role ${role.name} has been added, but I couldn't update the existing message. Please run /setup to recreate it.`,
                        ephemeral: true
                    });
                }
            } else {
                await interaction.reply({
                    content: `Role ${role.name} has been added! Run /setup to create the role selection message.`,
                    ephemeral: true
                });
            }

        } catch (error) {
            console.error('Error in addrole command:', error);
            await interaction.reply({
                content: 'An error occurred while adding the role.',
                ephemeral: true
            });
        }
    },
}; 