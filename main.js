const dl = require("social_media_downloader");
const https = require("https");
const fs = require("fs");
const { Client } = require("discord.js"); // discord.js@12

const client = new Client({});

client.once("ready", () => {
  console.log("Ready!");
  client.user
    .setActivity("! Majuś#1337", { type: "PLAYING" }) //PLAYING, STREAMING, LISTENING, WATCHING, CUSTOM_STATUS
    .then((presence) =>
      console.log(`Activity set to: PLAYING ${presence.activities[0].name}`)
    )
    .catch(console.error);
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (
    message.content.startsWith("https://vm.tiktok.com") ||
    message.content.startsWith("https://www.tiktok.com")
  ) {
    await message.channel.send("downloading...");
    let result = await dl.tiktok(message.content);
    const file = fs.createWriteStream("tiktoks/" + message.author.id + ".mp4");
    const request = https.get(result.link, function (response) {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        if (
          fs.statSync("tiktoks/" + message.author.id + ".mp4").size /
            (1024 * 1024) <
          8
        ) {
          message.channel.send("download completed, uploading...");
          message.channel
            .send({
              files: ["tiktoks/" + message.author.id + ".mp4"],
            })
            .then((message) => {
              fs.rm("tiktoks/" + message.author.id + ".mp4", () => {});
            });
        } else {
          message.channel.send("file to large :C");
        }
      });
    });
  }
});

client.login(
  "TOKEN HERE"
);
