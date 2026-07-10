// const PDFDocument = require("pdfkit");
// const sharp = require("sharp");
// const { processSingleImage } = require("../Services/ImageServices");

// exports.processImages = async (req, res) => {
//   try {
//     const files = req.files;

//     if (!files || files.length === 0) {
//       return res.status(400).send("No images uploaded");
//     }

//     const passportWidth = 390;
//     const passportHeight = 480;

//     const doc = new PDFDocument({ size: "A4", margin: 10 });

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "attachment; filename=passport.pdf");

//     doc.pipe(res);

//     let x = 10;
//     let y = 10;

//     for (let file of files) {
//       const processed = await processSingleImage(file.buffer);

//       const resized = await sharp(processed)
//         .resize(passportWidth, passportHeight)
//         .png()
//         .toBuffer();

//       doc.image(resized, x, y, {
//         width: passportWidth,
//         height: passportHeight,
//       });

//       x += passportWidth + 10;

//       if (x > 500) {
//         x = 10;
//         y += passportHeight + 10;
//       }
//     }

//     doc.end();
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Error processing images");
//   }
// };


//new code after refactor
// const PDFDocument = require("pdfkit");
// const sharp = require("sharp");
// const { processSingleImage } = require("../Services/ImageServices");

// exports.processImages = async (req, res) => {
//   try {
//     const files = req.files;

//     if (!files || files.length === 0) {
//       return res.status(400).send("No images uploaded");
//     }

//     const passportWidth = 390;
//     const passportHeight = 480;

//     // STEP 1: Pehle saari images process kar lein (PDF bhejne se pehle)
//     const processedImages = [];
//     for (let file of files) {
//       const processedBuffer = await processSingleImage(file.buffer);
      
//       const resized = await sharp(processedBuffer)
//         .resize(passportWidth, passportHeight)
//         .png()
//         .toBuffer();
        
//       processedImages.push(resized);
//     }

//     // STEP 2: Agar processing kamyaab ho jaye, tab PDF generate karna shuru karein
//     const doc = new PDFDocument({ size: "A4", margin: 10 });

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "attachment; filename=passport.pdf");

//     doc.pipe(res);

//     let x = 10;
//     let y = 10;

//     for (let imgBuffer of processedImages) {
//       doc.image(imgBuffer, x, y, {
//         width: passportWidth,
//         height: passportHeight,
//       });

//       x += passportWidth + 10;

//       if (x > 500) {
//         x = 10;
//         y += passportHeight + 10;
//       }
//     }

//     doc.end();
//   } catch (err) {
//     console.error("Controller Error:", err.message);
//     // Ab yahan ERR_HTTP_HEADERS_SENT nahi aayega kyunke response pehle set nahi hua
//     res.status(500).json({ error: "Error processing images", details: err.message });
//   }
// };


// Refactored code with better error handling and separation of concerns
const PDFDocument = require("pdfkit");
const sharp = require("sharp");
const { processSingleImage } = require("../Services/ImageServices");

exports.processImages = async (req, res) => {
  try {
    const files = req.files;
    // Frontend se configuration lein
    const config = {
      width: parseInt(req.body.width) || 390,
      height: parseInt(req.body.height) || 480,
      spacing: parseInt(req.body.spacing) || 10,
    };

    if (!files || files.length === 0) {
      return res.status(400).send("No images uploaded");
    }

    const doc = new PDFDocument({ size: "A4", margin: 10 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=passport.pdf");
    doc.pipe(res);

    let x = 20;
    let y = 20;

    for (let i = 0; i < files.length; i++) {
      const processedBuffer = await processSingleImage(files[i].buffer);
      
      // Frontend se is specific image ki copies maangein
      // Agar frontend 'copies' ka array nahi bhej raha toh default 6 copies
      const copiesCount = req.body.copies ? (Array.isArray(req.body.copies) ? req.body.copies[i] : req.body.copies) : 6;

      const resizedImage = await sharp(processedBuffer)
        .resize(config.width, config.height)
        .png()
        .toBuffer();

      // Jitni copies chahiye utni baar loop chalayein
      for (let j = 0; j < parseInt(copiesCount); j++) {
        // Check karein page khatam toh nahi ho raha?
        if (y + config.height > 800) {
          doc.addPage();
          y = 20;
          x = 20;
        }

        doc.image(resizedImage, x, y, {
          width: config.width,
          height: config.height,
        });

        x += config.width + config.spacing;

        // Agar line bhar gayi hai toh agli line mein jayein
        if (x + config.width > 550) {
          x = 20;
          y += config.height + config.spacing;
        }
      }
    }

    doc.end();
  } catch (err) {
    console.error("Controller Error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Processing failed", details: err.message });
    }
  }
};