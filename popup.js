// popup.js

// Function to load and display saved highlights from chrome.storage
function loadHighlights() {
    chrome.storage.local.get({ highlights: [] }, function (result) {
        const highlights = result.highlights;
        const list = document.getElementById('highlights-list');
        list.innerHTML = ''; // Clear existing content

        // If no highlights are saved, show a message
        if (highlights.length === 0) {
            list.innerHTML = '<p>No highlights saved.</p>';
            return;
        }

        // Loop through each highlight and create UI elements for it
        highlights.forEach((highlight, index) => {
            const item = document.createElement('div');
            item.className = 'highlight-item';

            // Display the highlighted text
            const text = document.createElement('div');
            text.className = 'highlight-text';
            text.textContent = highlight.text;

            // Display the domain/hostname where the highlight was made
            const url = document.createElement('div');
            url.className = 'highlight-url';
            url.textContent = new URL(highlight.url).hostname;

            // Create a delete button to remove the highlight
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.textContent = 'Delete';

            // Attach click event to the delete button
            deleteButton.addEventListener('click', function () {
                deleteHighlight(index);
            });

            // Append text, URL, and delete button to the highlight item
            item.appendChild(text);
            item.appendChild(url);
            item.appendChild(deleteButton);

            // Append the item to the list container
            list.appendChild(item);
        });
    });
}

// Function to delete a highlight by its index in the array
function deleteHighlight(index) {
    chrome.storage.local.get({ highlights: [] }, function (result) {
        const highlights = result.highlights;
        highlights.splice(index, 1); // Remove one element at the given index

        // Save the updated highlights array back to chrome.storage
        chrome.storage.local.set({ highlights: highlights }, function () {
            loadHighlights(); // Reload the list to reflect changes
        });
    });
}

// Load highlights when popup is first opened
// Wait for the DOM content to fully load before running loadHighlights
document.addEventListener('DOMContentLoaded', loadHighlights);
