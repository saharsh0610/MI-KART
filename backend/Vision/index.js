"use strict";
const dotenv = require("dotenv");
dotenv.config({ path: "./env" });
const async = require("async");
const fs = require("fs");
const https = require("https");
const path = require("path");
const createReadStream = require("fs").createReadStream;
const { chromium } = require('playwright');
const sleep = require("util").promisify(setTimeout);
const ComputerVisionClient =require("@azure/cognitiveservices-computervision").ComputerVisionClient;
const ApiKeyCredentials = require("@azure/ms-rest-js").ApiKeyCredentials;
/**
 * AUTHENTICATE
 * This single client is used for all examples.
 */
const key = "Enter Key";
const endpoint = "Enter endpoint";

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
  endpoint
);
/**
 * END - Authenticate
 */

function computerVision() {
  async.series(
    [
      async function () {
        /**
         * DETECT TAGS
         * Detects tags for an image, which returns:
         *     all objects in image and confidence score.
         */
        console.log("-------------------------------------------------");
        console.log("DETECT TAGS");
        console.log();

        // Image of different kind of dog.
        const tagsURL =
          "https://rukminim1.flixcart.com/image/416/416/krjjde80/computer/w/j/x/na-thin-and-light-laptop-hp-original-imag5bg7ngmzfkqu.jpeg?q=70";

        // Analyze URL image
        console.log("Analyzing tags in image...", tagsURL.split("/").pop());
        const tags = (
          await computerVisionClient.analyzeImage(tagsURL, {
            visualFeatures: ["Tags"],
          })
        ).tags;
        console.log(`Tags: ${formatTags(tags)}`);

        // Format tags for display
        function formatTags(tags) {
          return tags
            .map((tag) => `${tag.name} (${tag.confidence.toFixed(2)})`)
            .join(", ");
        }


        var help = ['phone', 'laptop', 'coffee', 'television'];
        tags.forEach(async(tag)=>{
            if(help.includes(tag.name.split(" ")[0])){
              console.log("present")
                const browser = await chromium.launch({headless:false,});
                const context = await browser.newContext();
const page = await context.newPage();
await page.goto(`https://store.mi.com/in/search_${tag.name}`);
            }
        })
        /**
         * END - Detect Tags
         */
        console.log();
        console.log(typeof(tags));
        console.log("-------------------------------------------------");
        console.log("End of quickstart.");
      },
      function () {
        return new Promise((resolve) => {
          resolve();
        });
      },
    ],
    (err) => {
      throw err;
    }
  );
}

computerVision();
