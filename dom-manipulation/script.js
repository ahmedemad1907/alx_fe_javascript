let quotes = [];

// Load from localStorage or default
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    quotes = [
      { text: "Stay hungry, stay foolish.", category: "Inspiration" },
      { text: "Good artists copy, great artists steal.", category: "Creativity" }
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
  const random = Math.floor(Math.random() * quotes.length);
  const quote = quotes[random];
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    const newQuote = { text: text, category: category };
    quotes.push(newQuote);
    saveQuotes();
    postQuoteToServer(newQuote);
    showRandomQuote();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both quote and category.");
  }
}

// ✅ Required: fetchQuotesFromServer
function fetchQuotesFromServer() {
  return fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      return data.map(function(item) {
        return {
          text: item.title,
          category: "Server"
        };
      });
    });
}

// ✅ Required: syncQuotes
function syncQuotes() {
  fetchQuotesFromServer()
    .then(function(serverQuotes) {
      let addedCount = 0;
      const texts = quotes.map(function(q) {
        return q.text;
      });

      serverQuotes.forEach(function(quote) {
        if (!texts.includes(quote.text)) {
          quotes.push(quote);
          addedCount++;
        }
      });

      if (addedCount > 0) {
        saveQuotes();
        showNotification("Synced " + addedCount + " new quote(s) from server.");
      } else {
        showNotification("No new quotes from server.");
      }
    })
    .catch(function(error) {
      showNotification("Error syncing with server.");
      console.error(error);
    });
}

// ✅ Required: post to server
function postQuoteToServer(quote) {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quote)
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log("Posted:", data);
    })
    .catch(function(error) {
      console.error("Error posting:", error);
    });
}

// ✅ Required: UI Notification
function showNotification(message) {
  const el = document.getElementById("updateNotification");
  el.textContent = message;
  setTimeout(function () {
    el.textContent = "";
  }, 4000);
}

// Setup
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

loadQuotes();
showRandomQuote();

// ✅ Periodic sync
setInterval(syncQuotes, 20000);
