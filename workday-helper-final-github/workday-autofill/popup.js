document.getElementById('fillButton').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  const button = document.getElementById('fillButton');
  
  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Check if on Workday site
  if (!tab.url.includes('myworkdayjobs.com') && !tab.url.includes('workday.com')) {
    statusDiv.textContent = 'Please open a Workday application page first';
    statusDiv.className = 'status error';
    return;
  }
  
  // Send message to content script
  button.textContent = 'Filling...';
  button.disabled = true;
  
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'fillPage' });
    
    if (response && response.success) {
      statusDiv.textContent = 'Page filled successfully';
      statusDiv.className = 'status success';
    } else {
      statusDiv.textContent = 'No fields found to fill';
      statusDiv.className = 'status error';
    }
  } catch (error) {
    statusDiv.textContent = 'Error: ' + error.message;
    statusDiv.className = 'status error';
  }
  
  button.textContent = 'Fill This Page';
  button.disabled = false;
  
  // Hide status after 3 seconds
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 3000);
});

// Settings button
document.getElementById('settingsButton').addEventListener('click', () => {
  chrome.tabs.create({ url: 'settings.html' });
});
