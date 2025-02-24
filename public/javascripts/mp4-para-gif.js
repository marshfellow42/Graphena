const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const statusMessage = document.getElementById("statusMessage");
const previewContainer = document.getElementById("previewContainer");
const gifPreview = document.getElementById("gifPreview");
const downloadLink = document.getElementById("downloadLink");
const dragArea = document.getElementById("dragArea");

// Trigger file input when button is clicked
uploadBtn.addEventListener("click", () => fileInput.click());

// Handle file selection from input
fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  if (file) {
    await handleFileUpload(file);
  }
});

// Handle file drop in the drag area
dragArea.addEventListener("dragover", (event) => {
  event.preventDefault(); // Prevent default behavior (Prevent opening file)
  dragArea.classList.add("drag-over"); // Optional: Add a class for styling while dragging
});

dragArea.addEventListener("dragleave", () => {
  dragArea.classList.remove("drag-over");
});

dragArea.addEventListener("drop", async (event) => {
  event.preventDefault(); // Prevent default behavior
  dragArea.classList.remove("drag-over");

  const file = event.dataTransfer.files[0];
  if (file) {
    await handleFileUpload(file);
  }
});

// Function to handle file upload and conversion
async function handleFileUpload(file) {
  if (file.type !== "video/mp4") {
    statusMessage.innerHTML = "<p class='text-danger'>Por favor, carregue um arquivo MP4.</p>";
    return;
  }

  statusMessage.innerHTML = "<p class='text-info'>Enviando o arquivo...</p>";

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("convert/mp4-para-gif", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Erro durante a conversão.");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Display the converted GIF
    gifPreview.innerHTML = `<img src="${url}" alt="Preview do GIF" class="img-fluid" />`;

    // Set up download link
    downloadLink.href = url;
    downloadLink.download = "video-convertido.gif";
    previewContainer.classList.remove("d-none");
    statusMessage.innerHTML = "<p class='text-success'>Conversão concluída! Faça o download abaixo.</p>";
  } catch (error) {
    statusMessage.innerHTML = `<p class='text-danger'>${error.message}</p>`;
  }
}
