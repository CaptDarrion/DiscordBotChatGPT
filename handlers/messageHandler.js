const { client, openai } = require('../client/client');
const context = require('../context/context');
const { AttachmentBuilder } = require('discord.js');

async function handleIncomingMessage(message) {
  try {
    if (message.author.bot) return;
    if (message.channel.id !== process.env.CHAT_BOT_CHANNEL) return;
    if (message.content.startsWith('!') || message.content.startsWith('/')) return;

    await message.channel.sendTyping();

    let prevMessages = await message.channel.messages.fetch({ limit: 15 });
    prevMessages = prevMessages.sort((a, b) => a - b);

    let conversationLog = [{ role: 'system', content: context }];

    prevMessages.forEach((msg) => {
      if (msg.content.startsWith('!') || msg.content.startsWith('/')) return;
      if (msg.author.id !== client.user.id && message.author.bot) return;

      if (msg.author.id === client.user.id) {
        conversationLog.push({
          role: 'assistant',
          content: `${msg.content}`,
        });
      } else {
        if (msg.author.id !== message.author.id) return;

        conversationLog.push({
          role: 'user',
          content: `${msg.content}`,
        });
      }
    });

    const res = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: conversationLog,
    });

    let reply = res.data.choices[0].message?.content;

    if (reply?.length > 2000) {
      const buffer = Buffer.from(reply, 'utf8');
      const txtFile = new AttachmentBuilder(buffer, { name: `${message.author.tag}_response.txt` });

      message.reply({ files: [txtFile] }).catch(() => {
        message.channel.send({ content: `${message.author}`, files: [txtFile] });
      });
    } else {
      message.reply(reply).catch(() => {
        message.channel.send(`${message.author} ${reply}`);
      });
    }
  } catch (error) {
    message.reply(`Something went wrong.`).then((msg) => {
      setTimeout(async () => {
        await msg.delete().catch(() => null);
      }, 5000);
    });

    console.log(`Error: ${error}`);
  }
}

module.exports = { handleIncomingMessage };