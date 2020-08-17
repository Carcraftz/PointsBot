
let adminroles = ["733880771915284500"];
let token = "discordtoken";
//============================================================================
const discord = require("discord.js");
const Keyv = require("keyv");
//simple sqlite database
const database = new Keyv("sqlite://database.sqlite");

const client = new discord.Client();
client.on("ready", ready => {
  console.log("Client is ready!");
});
client.on("message", async message => {
  if (
    (message.content.startsWith("+") || message.content.startsWith("-")) &&
    isAuthorized(message.member)
  ) {
    try {
      let points = parseInt(message.content.split(" ")[0]);
      changepoints(message, points);
    } catch (e) {}
  } else if (message.content.startsWith("!getprofile")) {
    if (message.mentions.users.first()) {
      let mention = message.mentions.users.first();
      let points = await database.get(mention.id);
      let pointsval = 0;
      if (points) {
        pointsval = points;
      }
      const profile = new discord.MessageEmbed()
        .setTitle(mention.tag + " Profile")
        .addField("Points", pointsval)
        .setThumbnail(mention.avatarURL())
        .setTimestamp();
      message.channel.send(profile);
    } else {
      //no user provided, get ur own profile
      let points = await database.get(message.author.id);
      let pointsval = 0;
      if (points) {
        pointsval = points;
      }
      const profile = new discord.MessageEmbed()
        .setTitle(message.member.user.tag + " Profile")
        .addField("Points", pointsval)
        .setThumbnail(message.member.user.avatarURL())
        .setTimestamp();
      message.channel.send(profile);
    }
  }
});
function isAuthorized(member) {
  let found = false;
  adminroles.forEach(role => {
    if (member.roles.cache.has(role)) {
      found = true;
    }
  });
  return found;
}
async function changepoints(message, changevalue) {
  let mention = message.mentions.users.first();
  let currentpoints = await database.get(mention.id);
  if (currentpoints) {
    await database.set(mention.id, currentpoints + changevalue);
    const profile = new discord.MessageEmbed()
      .setTitle(mention.tag + " Profile")
      .addField("Points", currentpoints + changevalue)
      .setThumbnail(mention.avatarURL())
      .setTimestamp();
    message.channel.send(profile);
  } else {
    await database.set(mention.id, 0 + changevalue);
    const profile = new discord.MessageEmbed()
      .setTitle(mention.tag + " Profile")
      .addField("Points", 0 + changevalue)
      .setThumbnail(mention.avatarURL())
      .setTimestamp();
    message.channel.send(profile);
  }
}
client.login(token);
