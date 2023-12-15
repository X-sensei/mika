const {
  tlang,
  ringtone,
  cmd,
  fetchJson,
  sleep,
  botpic,
  ffmpeg,
  getBuffer,
  pinterest,
  prefix,
  Config,
  isGroup,
} = require('../lib');
async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/prompthero/openjourney-v4",
        {
            headers: { Authorization: "Bearer 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" }, // Replace {API_TOKEN} with your actual API token
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.blob();
    return result;
}

cmd(
  {
    pattern: 'imagine',
    desc: 'Generate an image from text',
    category: 'ai',
    filename: __filename,
    use: 'genimg <text>',
  },
  async (Void, citel, text) => {
    if (!text) {
      return citel.reply(`Please provide text to generate an image from.`);
    } 

    try {
      // Use the query function to generate an image based on the text
      const imageBlob = await query({ "inputs": text });

      // Create a Data URI from the image blob
      const imageBuffer = await imageBlob.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString('base64');
      const imageURI = `data:image/jpeg;base64,${imageBase64}`;

      // Send the generated image
      await Void.sendMessage(
        citel.chat,
        {
          image: { url: imageURI },
          caption: `Generated Image\nText: ${text}`,
        },
        { quoted: citel }
      );
    } catch (err) {
      await citel.reply(`An error occurred while generating the image. Please try again later.`);
    }
  }
);
