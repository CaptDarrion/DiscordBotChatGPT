module.exports = (client) => {
    client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}!`);
      const channel = client.channels.cache.get(process.env.CHAT_BOT_CHANNEL);
    if (channel) {
    channel.send('Hi, I`m a chatbot. You can write messages in this chat and I will respond to them. I ignore messages that start with "!, /".').catch(console.error);
  }});
  };