let quotes = [];

// Load from localStorage or defaults
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    quotes = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "If life were predictable it would cease to be life, and be without flavor.", category: "Philosophy" }
    ];
    saveQuotes();
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show random quote from current category
function displayRandomQuote() {
  const selected = document.getElementById("categoryFilter").value;
  filterQuotes(selected);
}

// Filter by category
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);

  let filteredQuotes = quotes;
  if (selected !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selected);
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").textContent = "No quotes in this category.";
    return;
  }

  const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  document.getElementById("quoteDisplay").textContent = `"${quote.text}" — ${quote.category}`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Populate category dropdown
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const selected = localStorage.getItem("selectedCategory") || "all";
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  select.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  if (select.querySelector(`[value="${selected}"]`)) {
    select.value = selected;
  }
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    displayRandomQuote();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both text and category.");
  }
}

// JSON Export
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// JSON Import
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        displayRandomQuote();
        alert("Quotes imported successfully!");
      }
    } catch {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
}

// Sync Notification
function notifyUser(message) {
  const notice = document.getElementById("syncNotice");
  notice.textContent = message;
  setTimeout(() => {
    notice.textContent = "";
  }, 4000);
}

// Simulate fetching quotes from server
async function fetchServerQuotes() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const serverQuotes = await res.json();

    const formattedQuotes = serverQuotes.map(post => ({
      text: post.title,
      category: "Server"
    }));

    resolveConflicts(formattedQuotes);
  } catch (error) {
    console.error("Server fetch failed:", error);
  }
}

// Conflict resolution (server wins)
function resolveConflicts(serverQuotes) {
  const localTexts = quotes.map(q => q.text);
  let newCount = 0;

  serverQuotes.forEach(q => {
    if (!localTexts.includes(q.text)) {
      quotes.push(q);
      newCount++;
    }
  });

  if (newCount > 0) {
    saveQuotes();
    populateCategories();
    displayRandomQuote();
    notifyUser(`${newCount} new quote(s) synced from server.`);
  }
}

// Manual sync button
function manualConflictResolve() {
  fetchServerQuotes();
}

// Periodic automatic sync
setInterval(fetchServerQuotes, 15000);

// Initialize app
loadQuotes();
populateCategories();
const last = sessionStorage.getItem("lastQuote");
if (last) {
  const q = JSON.parse(last);
  document.getElementById("quoteDisplay").textContent = `"${q.text}" — ${q.category}`;
}

// Event Listeners
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);
