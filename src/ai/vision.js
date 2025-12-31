import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";

let model = null;

/**
 * Load MobileNet Model (Singleton Pattern)
 */
async function loadModel() {
    if (!model) {
        console.log("⏳ Loading AI Model...");

        // 1. Force Backend (WebGL is faster, CPU is fallback)
        try {
            await tf.setBackend('webgl');
            console.log("Using WebGL backend");
        } catch (e) {
            console.warn("WebGL failed, falling back to CPU", e);
            await tf.setBackend('cpu');
        }

        // 50 seconds timeout (Slow internet fix)
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Model load timeout - Check Internet Connection")), 50000)
        );
        model = await Promise.race([mobilenet.load(), timeout]);

        // 2. WARM UP (Crucial for first prediction)
        // Ek dummy zero-tensor pass karke model ko "jagana" padta hai
        try {
            const zeros = tf.zeros([224, 224, 3]);
            await model.classify(zeros);
            zeros.dispose(); // Memory cleanup
            console.log("🔥 Model Warmed Up!");
        } catch (e) {
            console.warn("Warmup failed", e);
        }

        console.log("✅ AI Model Loaded & Ready!");
    }
    return model;
}

/**
 * Analyze an Image and return detected keywords
 * @param {HTMLImageElement} imageElement - The image DOM element
 * @returns {Promise<string[]>} - Array of keywords (e.g. ['backpack', 'bag'])
 */
export async function analyzeImage(imageElement) {
    try {
        const net = await loadModel();

        // Ensure image is ready
        if (imageElement.decode) {
            await imageElement.decode();
        }

        const predictions = await net.classify(imageElement);

        // Debugging: Log all predictions
        console.log("Raw Predictions:", predictions);

        // Filter: Pehle 5% threshold try karte hain
        let tags = predictions
            .filter(p => p.probability > 0.05)
            .map(p => p.className.toLowerCase().split(',')[0]);

        // Fallback: Agar kuch nahi mila, to Top 3 utha lo (bhale hi kam confidence ho)
        if (tags.length === 0 && predictions.length > 0) {
            console.log("⚠️ Low confidence. Taking top 3 anyway.");
            tags = predictions.slice(0, 3).map(p => p.className.toLowerCase().split(',')[0]);
        }

        console.log("🤖 AI Detected:", tags);
        return tags;
    } catch (error) {
        console.error("AI Analysis Failed:", error);
        alert("AI Model Error: " + error.message); // Fail loud
        return [];
    }
}
