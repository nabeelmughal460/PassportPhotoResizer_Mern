// const axios = require("axios");
// const sharp = require("sharp");
// const cloudinary = require("../Utils/cloudinary");

// exports.processSingleImage = async (imageBuffer) => {
//   // Step 1: Remove BG
//   const response = await axios.post(
//     "https://api.remove.bg/v1.0/removebg",
//     {
//       image_file_b64: imageBuffer.toString("base64"),
//       size: "auto",
//     },
//     {
//       headers: {
//         "X-Api-Key": process.env.REMOVE_BG_API_KEY,
//       },
//     }
//   );

//   const bgRemovedBuffer = Buffer.from(response.data.data.result_b64, "base64");

//   // Step 2: Convert to white bg
//   const processed = await sharp(bgRemovedBuffer)
//     .flatten({ background: "#ffffff" })
//     .png()
//     .toBuffer();

//   // Step 3: Upload to Cloudinary
//   const upload = await cloudinary.uploader.upload_stream(
//     { resource_type: "image" },
//     async (error, result) => {}
//   );

//   const uploadResult = await new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {},
//       (err, res) => {
//         if (err) reject(err);
//         else resolve(res);
//       }
//     );
//     stream.end(processed);
//   });

//   // Step 4: Enhance
//   const enhancedUrl = cloudinary.url(uploadResult.public_id, {
//     effect: "gen_restore",
//     quality: "auto",
//     fetch_format: "auto",
//   });

//   const enhancedImage = await axios.get(enhancedUrl, {
//     responseType: "arraybuffer",
//   });

//   const finalImage = await sharp(enhancedImage.data)
//     .flatten({ background: "#ffffff" })
//     .toBuffer();

//   return finalImage;
// };

const axios = require("axios");
const sharp = require("sharp");
const cloudinary = require("../Utils/cloudinary");

exports.processSingleImage = async (imageBuffer) => {
  try {
    // Step 1: Remove BG
    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      {
        image_file_b64: imageBuffer.toString("base64"),
        size: "auto",

      },
      {
        headers: { "X-Api-Key": process.env.REMOVE_BG_API_KEY ,
          "Accept": "application/json"
        },
      }
    );

    if (!response.data || !response.data.data || !response.data.data.result_b64) {
      throw new Error("Remove.bg API failed to return base64 data");
    }

    const bgRemovedBuffer = Buffer.from(response.data.data.result_b64, "base64");

  
    const processed = await sharp(bgRemovedBuffer)
      .flatten({ background: "#ffffff" })
      .png()
      .toBuffer();


    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "passport_photos" },
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
      stream.end(processed);
    });


    const enhancedUrl = cloudinary.url(uploadResult.public_id, {
      effect: "gen_restore", 
      quality: "auto",
    });

    const enhancedImage = await axios.get(enhancedUrl, {
      responseType: "arraybuffer",
    });

    return await sharp(enhancedImage.data)
      .flatten({ background: "#ffffff" })
      .toBuffer();

  } catch (error) {
  
    if (error.response && error.response.data) {
      console.error("API Error Details:", error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    } else {
      console.error("Service Error:", error.message);
      throw error;
    }
  }
};