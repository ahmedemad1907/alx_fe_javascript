let quotes = [];

// Load quotes from local storage or default
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    quotes = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Don't let yesterday take up too much of today.", category: "Inspiration" }
    ];
    saveQuotes();
  }
}

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show random quote
function showRandomQuote() {
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById("quoteDisplay").textContent = `"${random.text}" — ${random.category}`;
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    showRandomQuote();
    postQuoteToServer(newQuote);
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Post new quote to mock API (simulate)
function postQuoteToServer(quote) {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quote)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Posted to server:", data);
    })
    .catch(error => console.error("Error posting quote:", error));
}

// Fetch from server (simulate new quotes)
function fetchQuotesFromServer() {
  return fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
    .then(res => res.json())
    .then(serverQuotes => {
      // Format to match our quote structure
      return serverQuotes.map(post => ({
        text: post.title,
        category: "Server"
      }));
    });
}

// Sync and resolve conflicts
function syncQuotes() {
  fetchQuotesFromServer()
    .then(serverQuotes => {
      let added = 0;
      const localTexts = quotes.map(q => q.text);

      serverQuotes.forEach(q => {
        if (!localTexts.includes(q.text)) {
          quotes.push(q); // Add if not found locally
          added++;
        }
      });

      if (added > 0) {
        saveQuotes();
        showRandomQuote();
        notifyUser(`${added} new quote(s) synced from server.`);
      } else {
        notifyUser("No new quotes to sync.");
      }
    })
    .catch(err => {
      console.error("Sync error:", err);
      notifyUser("Sync failed. Try again later.");
    });
}

// Show notification
function notifyUser(message) {
  const el = document.getElementById("syncNotice");
  el.textContent = message;
  setTimeout(() => {
    el.textContent = "";
  }, 5000);
}

// Init
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
loadQuotes();
showRandomQuote();
setInterval(syncQuotes, 20000); // Automatic sync every 20s
