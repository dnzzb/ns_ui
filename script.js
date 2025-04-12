// URL of the backend API
const API_URL = "https://network-security-project-production.up.railway.app";

// Handle new interaction form submission (Dashboard page).
document.getElementById("interaction-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const submissionResult = document.getElementById("submission-result");
  submissionResult.innerText = "Submitting...";
  
  const source = Number(document.getElementById("source").value);
  const target = Number(document.getElementById("target").value);
  const rating = parseFloat(document.getElementById("rating").value);
  
  const payload = { source, target, rating };
  
  try {
    const response = await fetch(`${API_URL}/add_interaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    
    const data = await response.json();
    submissionResult.innerHTML = `<strong>Status:</strong> ${data.status} <br>
                                   <strong>Interaction is:</strong> ${data.is_anomaly ? "Anomalous" : "Normal"}`;
  } catch (error) {
    submissionResult.innerText = `Error: ${error.message}`;
  }
});

// Fetch and display network stats.
document.getElementById("refresh-stats")?.addEventListener("click", async () => {
  const statsDisplay = document.getElementById("stats-display");
  statsDisplay.innerText = "Loading stats...";
  
  try {
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
    const data = await response.json();
    statsDisplay.innerHTML = `
      <strong>Total interactions:</strong> ${data.total_interactions} <br>
      <strong>Normal interactions:</strong> ${data.normal_interactions} <br>
      <strong>Anomalous interactions:</strong> ${data.anomalous_interactions} <br>
      <strong>Anomaly ratio:</strong> ${(data.anomaly_ratio * 100).toFixed(2)}%
    `;
  } catch (error) {
    statsDisplay.innerText = `Error: ${error.message}`;
  }
});

// Fetch and display all interactions (Complete Table page).
document.getElementById("refresh-table")?.addEventListener("click", async () => {
  const tableBody = document.querySelector("#interactions-table tbody");
  tableBody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";
  
  try {
    const response = await fetch(`${API_URL}/all_interactions`);
    if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
    const interactions = await response.json();
    
    if (interactions.length === 0) {
      tableBody.innerHTML = "<tr><td colspan='5'>No interactions found.</td></tr>";
      return;
    }
    
    // Build table rows.
    let rowsHtml = "";
    interactions.forEach(interaction => {
      // Convert timestamp to human-readable format.
      const ts = new Date(interaction.timestamp * 1000).toLocaleString();
      rowsHtml += `<tr>
        <td>${interaction.source}</td>
        <td>${interaction.target}</td>
        <td>${interaction.rating}</td>
        <td>${ts}</td>
        <td>${interaction.anomaly}</td>
      </tr>`;
    });
    tableBody.innerHTML = rowsHtml;
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan='5'>Error: ${error.message}</td></tr>`;
  }
});
