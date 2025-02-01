// Array to store book data
const books = [];
const applications = {};

// Function to send application data to the server
function addApp() {
    const name = document.getElementById('name').value;
    const zipcode = document.getElementById('zipcode').value;
    const messageDiv = document.getElementById('message');

    if (!name || !zipcode) {
        messageDiv.innerHTML = "<p style='color: red;'>Please enter both name and zipcode.</p>";
        return;
    }

    fetch('/api/add_app', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, zipcode })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            messageDiv.innerHTML = `<p style='color: red;'>Error: ${data.error}</p>`;
        } else {
            messageDiv.innerHTML = `<p style='color: green;'>Application received ID: ${data.app_id}</p>`;
        }
    })
    .catch(error => {
        console.error('Error adding application:', error);
        messageDiv.innerHTML = "<p style='color: red;'>Failed to add application.</p>";
    });
}


document.addEventListener("DOMContentLoaded", function () {
    // Select the form and listen for submission
    document.querySelector("form").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from refreshing the page

        const appID = document.getElementById("APPID").value.trim();
        const statusOptions = document.getElementsByName("selection");
        let selectedStatus = null;

        // Find the selected radio button
        for (const option of statusOptions) {
            if (option.checked) {
                selectedStatus = option.id; // Get the ID (processing, accepted, rejected)
                break;
            }
        }

        // Validate input
        if (!appID) {
            showMessage("❌ Please enter an application ID.", "red");
            return;
        }
        if (!selectedStatus) {
            showMessage("❌ Please select a new status.", "red");
            return;
        }

        // Send the update request to the server
        fetch(`/api/update_status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ app_id: appID, new_status: selectedStatus })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showMessage(`❌ Error: ${data.error}`, "red");
            } else {
                showMessage(`✅ Status updated successfully to '${selectedStatus}'`, "green");
            }
        })
        .catch(error => {
            console.error("Error updating status:", error);
            showMessage("❌ Failed to update status. Please try again.", "red");
        });
    });

    // Function to display messages on the webpage
    function showMessage(message, color) {
        let messageDiv = document.getElementById("message");
        if (!messageDiv) {
            messageDiv = document.createElement("div");
            messageDiv.id = "message";
            document.body.appendChild(messageDiv);
        }
        messageDiv.innerHTML = `<p style="color: ${color};">${message}</p>`;
    }
});

function check_Status() {
    const appID = document.getElementById('appID').value.trim();
    const messageDiv = document.getElementById('message');

    // Clear previous messages
    messageDiv.innerHTML = "";

    if (!appID) {
        messageDiv.innerHTML = "<p style='color: red;'>❌ Please enter an application ID.</p>";
        return;
    }

    // Send request to the server to check application status
    fetch(`/api/check_status?app_id=${encodeURIComponent(appID)}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                messageDiv.innerHTML = `<p style='color: red;'>❌ Error: ${data.error}</p>`;
            } else {
                messageDiv.innerHTML = `<p style='color: green;'>✅ Application Status: ${data.status}</p>`;
            }
        })
        .catch(error => {
            console.error("Error checking status:", error);
            messageDiv.innerHTML = "<p style='color: red;'>❌ Failed to check status. Please try again.</p>";
        });
}
