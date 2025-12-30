const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.matchItems = functions.https.onRequest(async (req, res) => {
  try {
    const { lostText, foundText } = req.body;

    if (!lostText || !foundText) {
      return res.json({
        result: "Please submit both Lost and Found items first",
      });
    }

    const apiKey = functions.config().gemini.key;

    const prompt = `
Lost item:
${lostText}

Found item:
${foundText}

Are these two items likely the same? Reply Yes or No with short reason.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

    res.json({ result: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: "AI matching failed" });
  }
});
