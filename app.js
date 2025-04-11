const netlifyEndpoint = 'https://twitchtracker.netlify.app/.netlify/functions/get-status.js';
const proxiedURL = `https://api.allorigins.win/get?url=${encodeURIComponent(netlifyEndpoint)}`;

const trackedUsers = ['alwaysalmostnever', 'jawnskibop', 'radi0zombie'];

async function checkStreamStatus() {
  try {
    const response = await fetch(proxiedURL);
    const wrapped = await response.json();
    const streams = JSON.parse(wrapped.contents);

    const statusDiv = document.getElementById('stream-status');

    const liveMap = {};
    streams.forEach(stream => {
      liveMap[stream.user_login.toLowerCase()] = stream;
    });

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
    statusDiv.innerHTML = html;
  } catch (err) {
    console.error('Stream check failed:', err);
    document.getElementById('stream-status').textContent = 'Error loading stream info.';
  }
}

checkStreamStatus();
