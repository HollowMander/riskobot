 const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
  if (message.author.bot || !message.guild) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'help') {
    const embed = new Discord.MessageEmbed()
      .setColor('#2ecc71')
      .setTitle('Bot Help Menu')
      .setDescription('List of available bot commands and features.')
      .setThumbnail(client.user.avatarURL())
      .addFields(
        { name: '👋 Welcome', value: '`welcome <channel>` - Activate welcome messages for new members.', inline: true },
        { name: '👋 AutoRole', value: '`autorole <role>` - Assign a role to users upon joining.', inline: true },
        { name: '🔒 Lock Channel', value: '`lock` - Lock a channel for moderation.', inline: true },
        { name: '🔓 Unlock Channel', value: '`unlock` - Unlock a channel.', inline: true },
        { name: '🚫 Ban', value: '`ban <user> [reason]` - Ban a user with an optional reason.', inline: true },
        { name: '🚫 Kick', value: '`kick <user> [reason]` - Kick a user with an optional reason.', inline: true },
        { name: '⏰ Timeout', value: '`timeout <user> <duration> [reason]` - Timeout a user.', inline: true },
        { name: '🎲 Coinflip', value: '`coinflip` - Flip a coin.', inline: true },
        { name: '📊 Leaderboard', value: '`leaderboard` - Display a message leaderboard.', inline: true },
        { name: '🤼 Rock Paper Scissors', value: '`rps <rock/paper/scissors>` - Play rock paper scissors.', inline: true },
        { name: '👀 List Roles', value: '`roles` - Display a list of server roles.', inline: true },
        { name: '👑 Add Role', value: '`addrole <user> <role>` - Add a role to a user.', inline: true },
        { name: '👑 Remove Role', value: '`removerole <user> <role>` - Remove a role from a user.', inline: true },
        { name: '⏰ Reminder', value: '`remind <time in minutes> <message>` - Set a reminder.', inline: true }
      )
      .setFooter(`Requested by ${message.author.username}`)
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  } else if (command === 'ban') {
    if (!message.member.permissions.has('BAN_MEMBERS')) {
      return message.channel.send('You do not have permission to use this command.');
    }

    const memberToBan = message.mentions.members.first();
    if (!memberToBan) {
      return message.channel.send('Please mention a user to ban.');
    }

    const reason = args.slice(1).join(' ');
    const embed = new Discord.MessageEmbed()
      .setColor('#e74c3c')
      .setTitle('User Banned')
      .setDescription(`**${memberToBan.user.username}** was banned from the server.`)
      .addFields({ name: 'Moderator', value: message.author.username, inline: true }, { name: 'Reason', value: reason || 'No reason provided', inline: true });

    message.channel.send({ embeds: [embed] });
    memberToBan.ban(reason);
  } else if (command === 'kick') {
    if (!message.member.permissions.has('KICK_MEMBERS')) {
      return message.channel.send('You do not have permission to use this command.');
    }

    const memberToKick = message.mentions.members.first();
    if (!memberToKick) {
      return message.channel.send('Please mention a user to kick.');
    }

    const reason = args.slice(1).join(' ');
    const embed = new Discord.MessageEmbed()
      .setColor('#e74c3c')
      .setTitle('User Kicked')
      .setDescription(`**${memberToKick.user.username}** was kicked from the server.`)
      .addFields({ name: 'Moderator', value: message.author.username, inline: true }, { name: 'Reason', value: reason || 'No reason provided', inline: true });

    message.channel.send({ embeds: [embed] });
    memberToKick.kick(reason);
  } else if (command === 'coinflip') {
    const flipResult = ['heads', 'tails'][Math.floor(Math.random() * 2)];
    const embed = new Discord.MessageEmbed()
      .setColor('#2ecc71')
      .setTitle('Coin Flip Result')
      .setDescription(`The coin flip result is: **${flipResult}**`);

    message.channel.send({ embeds: [embed] });
  } else if (command === 'rps') {
    const [opponentChoice, ...userChoices] = args;
    const userChoice = userChoices[0]?.toLowerCase();

    if (!opponentChoice || !userChoice) {
      return message.channel.send('Please provide your choice in the format: `rps <rock/paper/scissors>`');
    }

    const possibleChoices = ['rock', 'paper', 'scissors'];
    if (!possibleChoices.includes(opponentChoice) || !possibleChoices.includes(userChoice)) {
      return message.channel.send('Invalid choice. Please use one of the following: `rock`, `paper`, `scissors`.');
    }

    let result;
    if (opponentChoice === userChoice) {
      result = 'It\'s a tie!';
    } else if ((opponentChoice === 'rock' && userChoice === 'paper') ||
      (opponentChoice === 'paper' && userChoice === 'scissors') ||
      (opponentChoice === 'scissors' && userChoice === 'rock')) {
      result = 'You win!';
    } else {
      result = 'You lose!';
    }

    const embed = new Discord.MessageEmbed()
      .setColor('#2ecc71')
      .setTitle('Rock Paper Scissors')
      .setDescription(`**Opponent Choice**: ${opponentChoice.charAt(0).toUpperCase() + opponentChoice.slice(1)} | **Your Choice**: ${userChoice.charAt(0).toUpperCase() + userChoice.slice(1)}`)
      .addFields({ name: 'Result', value: result });

    message.channel.send({ embeds: [embed] });
  } else if (command === 'roles') {
    const roles = message.guild.roles.cache.sort((a, b) => a.position - b.position);
    const roleList = roles.map(role => role.toString()).join(', ');
    const embed = new Discord.MessageEmbed()
      .setColor('#2ecc71')
      .setTitle('Server Roles')
      .setDescription(`${roleList}`);

    message.channel.send({ embeds: [embed] });
  } else if (command === 'leaderboard') {
    // Implement the leaderboard command here
  } else if (command === 'addrole') {
    if (!message.member.permissions.has('MANAGE_ROLES')) {
      return message.channel.send('You do not have permission to use this command.');
    }

    const [userMention, roleMention] = args;
    if (!userMention || !roleMention) {
      return message.channel.send('Please mention a user and a role for the assignment.');
    }

    const user = message.guild.members.cache.find(m => m.id === userMention.replace(/[<@!>]/g, ''));
    const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleMention.toLowerCase());

    if (!user || !role) {
      return message.channel.send('Invalid user or role.');
    }

    user.roles.add(role);
    const embed = new Discord.MessageEmbed()
      .setColor('#2ecc71')
      .setTitle('Role Added')
      .setDescription(`**${user.user.username}#${user.user.discriminator}** was assigned the **${role.name}** role.`);

    message.channel.send({ embeds: [embed] });
  } else if (command === 'removerole') {
    if (!message.member.permissions.has('MANAGE_ROLES')) {
      return message.channel.send('You do not have permission to use this command.');
    }

    const [userMention, roleMention] = args;
    if (!userMention || !roleMention) {
      return message.channel.send('Please mention a user and a role for the removal.');
    }

    const user = message.guild.members.cache.find(m => m.id === userMention.replace(/[<@!>]/g, ''));
    const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleMention.toLowerCase());

    if (!user || !role) {
      return message.channel.send('Invalid user or role.');
    }

    user.roles.remove(role);
    const embed = new Discord.MessageEmbed()
      .setColor('#e74c3c')
      .setTitle('Role Removed')
      .setDescription(`**${user.user.username}#${user.user.discriminator}** was removed from the **${role.name}** role.`);

    message.channel.send({ embeds: [embed] });
  } else if (command === 'remind') {
    const timeInMinutes = parseInt(args[0]);

    if (isNaN(timeInMinutes)) {
      return message.channel.send('Please provide a valid time in minutes.');
    }

    const reminderMessage = args.slice(1).join(' ');

    setTimeout(() => {
      message.channel.send(`Reminder: ${reminderMessage}`);
    }, timeInMinutes * 60000);

    const embed = new Discord.MessageEmbed()
      .setColor('#2ecc71')
      .setTitle('Reminder Set')
      .setDescription(`A reminder has been set for **${timeInMinutes}** minutes from now with the message: **${reminderMessage}**`);

    message.channel.send({ embeds: [embed] });
  }
});

client.login(config.token);
