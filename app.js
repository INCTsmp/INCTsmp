const netlifyEndpoint = 'https://twitchtracker.netlify.app/.netlify/functions/get-status';

const trackedUsers = ['alwaysalmostnever', 'jawnskibop', 'radi0zombie'];

async function checkStreamStatus() {
  try {
    // Fetch the stream data directly from the Netlify endpoint
    const response = await fetch(netlifyEndpoint);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response as JSON
    const streams = await response.json();

    // Set up the status display area
    const statusDiv = document.getElementById('stream-status');

    // Map of user logins to their stream data
    const liveMap = {};
    streams.forEach(stream => {
      liveMap[stream.user_login.toLowerCase()] = stream;
    });

    // Prepare the HTML to display live and offline users
    let html = '<ul>';
    trackedUsers.forEach(user => {
      const stream = liveMap[user.toLowerCase()];
      if (stream) {
        html += `<li><span class="status-dot live"></span> <strong>${stream.user_name}</strong> is LIVE playing ${stream.game_name} — <a href="https://twitch.tv/${stream.user_login}" target="_blank">Watch</a></li>`;
      } else {
        html += `<li><span class="status-dot offline"></span> <strong>${user}</strong> is offline</li>`;
      }
    });
    html += '</ul>';

    // Display the HTML content
    statusDiv.innerHTML = html;

  } catch (err) {
    // Handle errors gracefully and show an error message in the UI
    console.error('Stream check failed:', err);
    document.getElementById('stream-status').textContent = 'Error loading stream info.';
  }
}

// Call the function to check stream status on page load
checkStreamStatus();


