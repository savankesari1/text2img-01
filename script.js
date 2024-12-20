const API_KEY = "SG_a7d65d4311acd225";
const inputTxt = document.getElementById("input");
const image = document.getElementById("image");
const button = document.getElementById("btn");
const downloadBtn = document.getElementById("download-btn");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

async function query(prompt) {
  try {
    // Show placeholder during loading
    showCanvasPlaceholder();
    downloadBtn.style.display = "none";

    // Prepare data for API call
    const data = {
      prompt: prompt.trim(),
      aspect_ratio: "1:1",
    };

    // Use fetch with reduced payload and headers
    const response = await fetch(
      "https://api.segmind.com/v1/luma-photon-flash-txt-2-img",
      {
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Fetch the response as blob (smallest possible data)
    return await response.blob();
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
}

function showCanvasPlaceholder() {
  canvas.style.display = "block";
  ctx.fillStyle = "#f3f3f3";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 16px Arial";
  ctx.fillStyle = "#888";
  ctx.fillText("Loading...", 50, 100);
}

button.addEventListener("click", async () => {
  const prompt = inputTxt.value;

  if (prompt.trim() === "") {
    alert("Please enter a prompt.");
    return;
  }

  try {
    // Optimize by directly using blob URL for display
    const blob = await query(prompt);
    const objectURL = URL.createObjectURL(blob);

    // Update image source and download link
    image.src = objectURL;
    canvas.style.display = "none"; // Hide canvas placeholder
    image.style.display = "block"; // Show generated image
    downloadBtn.style.display = "inline-block";
    downloadBtn.href = objectURL;
  } catch (error) {
    console.error("Error processing image:", error);
    alert("Error generating image. Please try again.");
  }
});
