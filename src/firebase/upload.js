import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

/**
 * Uploads a file to Firebase Storage and returns the Download URL.
 * @param {File} file - The file object from input
 * @param {string} folder - 'lost-images' or 'found-images'
 * @returns {Promise<string|null>} - URL of uploaded image or null
 */
export async function uploadImage(file, folder) {
    if (!file) return null;

    try {
        // Unique Filename: e.g., 17098877_myphoto.jpg
        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `${folder}/${fileName}`);

        console.log(`Uploading ${fileName} to ${folder}...`);

        // Upload
        await uploadBytes(storageRef, file);

        // Get URL
        const url = await getDownloadURL(storageRef);
        console.log("Upload success:", url);
        return url;
    } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload Error: " + error.message); // Fail loud so user sees it
        throw error;
    }
}
