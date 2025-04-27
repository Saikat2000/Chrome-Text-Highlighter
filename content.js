// content.js

// Reference to the floating "Save Highlight?" button
let saveButton = null;

// Listen for mouseup events (when user finishes selecting text)
document.addEventListener("mouseup", function (event) {
  // If the click was on the save button itself, do nothing
  if (event.target === saveButton) {
    return;
  }
  const selectedText = window.getSelection().toString().trim();

  if (selectedText.length > 0) {
    // If there's selected text, show the save button near the selection
    showSaveButton(event.pageX, event.pageY, selectedText);
  } else {
    // If no text is selected, remove any existing save button
    removeSaveButton();
  }
});

// Function to create and display the "Save Highlight?" button
function showSaveButton(x, y, selectedText) {
  removeSaveButton(); // Remove any existing button first to avoid duplicates

  saveButton = document.createElement("button");
  saveButton.textContent = "Save Highlight?";

  // Style the button
  saveButton.style.position = "absolute";
  saveButton.style.top = `${y + 10}px`; // Slightly offset from the mouse
  saveButton.style.left = `${x + 10}px`;
  saveButton.style.zIndex = 9999;
  saveButton.style.padding = "8px 12px";
  saveButton.style.fontSize = "14px";
  saveButton.style.backgroundColor = "#4CAF50";
  saveButton.style.color = "white";
  saveButton.style.border = "none";
  saveButton.style.borderRadius = "5px";
  saveButton.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  saveButton.style.cursor = "pointer";

  // When the button is clicked, save the highlight and remove the button
  saveButton.addEventListener("click", function (event) {
    event.stopPropagation();
    saveHighlight(selectedText);
    removeSaveButton();
  });

  document.body.appendChild(saveButton);
}

// Function to remove the save button if it exists
function removeSaveButton() {
  if (saveButton) {
    saveButton.remove();
    saveButton = null;
  }
}

// Function to save the highlighted text into chrome.storage
function saveHighlight(text) {
  const pageUrl = window.location.href; // Get the current page URL

  // Retrieve existing highlights from storage (or initialize an empty array)
  chrome.storage.local.get({ highlights: [] }, function (result) {
    const highlights = result.highlights;

    // Add the new highlight (text, URL, and timestamp)
    highlights.push({
      text: text,
      url: pageUrl,
      time: new Date().toISOString(),
    });

    // Save updated highlights back to chrome.storage.local
    chrome.storage.local.set({ highlights: highlights }, function () {
      console.log("Highlight saved!");
    });
  });
}
