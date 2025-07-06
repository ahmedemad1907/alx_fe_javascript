// Simulate fetching quotes from server
async function fetchServerQuotes() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    const data = await response.json();

    // Convert server posts to our quote format
    const serverQuotes = data.map(post => ({
      text: post.title,
      category: "Server"
    }));

    resolveConflicts(serverQuotes);
  } catch (error) {
    console.error("Failed to fetch from server:", error);
  }
}

// Resolve local vs server conflicts (server wins)
function resolveConflicts(serverQuotes) {
  const localQuoteTexts = quotes.map(q => q.text);
  let newAdded = 0;

  serverQuotes.forEach(serverQuote => {
    if (!localQuoteTexts.includes(serverQuote.text)) {
      quotes.push(serverQuote);
      newAdded++;
    }
  });

  if (newAdded > 0) {
    saveQuotes();
    populateCategories();
    displayRandomQuote();
    notifyUser(`${newAdded} new quote(s) synced from server.`);
  }
}

// Notify user of sync event
function notifyUser(message) {
  const notice = document.getElementById("syncNotice");
  notice.textContent = message;
  setTimeout(() => {
    notice.textContent = "";
  }, 5000);
}

// Sync with server every 15 seconds
setInterval(fetchServerQuotes, 15000);
