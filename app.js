// Check User Authentication
const currentUser = sessionStorage.getItem("username");
const currentRole = sessionStorage.getItem("userRole");

if (!currentUser || !currentRole) {
    window.location.href = "login.html";
}

// Dream Property - Demo Plot Management System

const totalPlots = 50;

// Demo plot data
const plots = [];

let selectedPlotId = null;

const statuses = [
    "available",
    "booked",
    "sold"
];

// Generate 50 plots
const rows = ["A", "B", "C", "D", "E"];

rows.forEach((row) => {

    for (let i = 1; i <= 10; i++) {

        const plotNumber = `${row}-${String(i).padStart(2, "0")}`;

        plots.push({
            id: plotNumber,
            size: 250 + (i * 10),
            price: 450000 + (i * 10000),
            status: "available"
        });

    }

});

// Demo status assignment

// Demo status assignment
plots[1].status = "booked";
plots[2].status = "sold";
plots[5].status = "booked";
plots[8].status = "sold";
plots[12].status = "booked";
plots[17].status = "sold";
plots[24].status = "booked";
plots[30].status = "sold";
plots[39].status = "booked";
plots[44].status = "sold";

// Load previously saved plot statuses
const savedStatuses = JSON.parse(
    localStorage.getItem("dreamPropertyStatuses")
);

if (savedStatuses) {
    plots.forEach(plot => {
        if (savedStatuses[plot.id]) {
            plot.status = savedStatuses[plot.id];
        }
    });
}


// Display plots on site layout

function displayPlots() {
    const siteLayout = document.getElementById("siteLayout");

    // Clear existing layout
    siteLayout.innerHTML = "";

    plots.forEach((plot, index) => {

        // Create plot
        const plotBox = document.createElement("div");

        plotBox.className = `plot ${plot.status}`;

        if (plot.id === selectedPlotId) {
            plotBox.classList.add("selected");
        }

        plotBox.innerHTML = `
            <span>${plot.id}</span>
            <small>${plot.status.toUpperCase()}</small>
        `;

        // Open plot details on click
        plotBox.addEventListener("click", () => {
            selectedPlotId = plot.id;

            displayPlots();

            showPlotDetails(plot);
        });;

        siteLayout.appendChild(plotBox);

        // Add internal road after every row
        if ((index + 1) % 10 === 0 && index !== plots.length - 1) {

            const road = document.createElement("div");

            road.className = "road";
            road.textContent = "INTERNAL ROAD";

            siteLayout.appendChild(road);
        }
    });

    // Add main entrance
    const entrance = document.createElement("div");

    entrance.className = "entrance";
    entrance.textContent = "MAIN ENTRANCE";

    siteLayout.appendChild(entrance);
}

// Update dashboard summary
function updateSummary() {

    const available = plots.filter(
        plot => plot.status === "available"
    ).length;

    const booked = plots.filter(
        plot => plot.status === "booked"
    ).length;

    const sold = plots.filter(
        plot => plot.status === "sold"
    ).length;

    document.getElementById("totalPlots").textContent = totalPlots;

    document.getElementById("availablePlots").textContent = available;

    document.getElementById("bookedPlots").textContent = booked;

    document.getElementById("soldPlots").textContent = sold;

}


function renderActivityLog() {
    const activityLog = document.getElementById("activityLog");

    const activities = JSON.parse(
        localStorage.getItem("dreamPropertyActivity") || "[]"
    );

    if (activities.length === 0) {
        activityLog.innerHTML = `
            <tr>
                <td colspan="3">No activity recorded yet.</td>
            </tr>
        `;
        return;
    }

    activityLog.innerHTML = activities.map(activity => `
        <tr>
            <td>${activity.time}</td>
            <td>${activity.plotId}</td>
            <td>${activity.activity}</td>
        </tr>
    `).join("");
}

// Update Admin Dashboard Statistics
function updateAdminDashboard() {

    const adminDashboard = document.getElementById("adminDashboard");

    if (!adminDashboard) return;

    const userRole = sessionStorage.getItem("userRole");

    // Only Admin can see this dashboard
    if (userRole !== "admin") {
        adminDashboard.style.display = "none";
        return;
    }

    adminDashboard.style.display = "block";

    const requests = JSON.parse(
        localStorage.getItem("dreamPropertyRequests") || "[]"
    );

    const pending = requests.filter(
        request => request.status === "pending"
    ).length;

    const approved = requests.filter(
        request => request.status === "approved"
    ).length;

    const rejected = requests.filter(
        request => request.status === "rejected"
    ).length;

    const agents = JSON.parse(
        localStorage.getItem("dreamPropertyAgents") || "[]"
    );

    document.getElementById("totalAgents").textContent = agents.length;
    document.getElementById("pendingApprovals").textContent = pending;
    document.getElementById("approvedRequests").textContent = approved;
    document.getElementById("rejectedRequests").textContent = rejected;
}

function renderAgentList() {

    const agentList = document.getElementById("agentList");

    if (!agentList) return;

    const currentRole = sessionStorage.getItem("userRole");

    if (currentRole !== "admin") {
        document.getElementById("agentManagement").style.display = "none";
        return;
    }

    const agents = JSON.parse(
        localStorage.getItem("dreamPropertyAgents") || "[]"
    );

    agentList.innerHTML = "";

    agents.forEach(agent => {

        agentList.innerHTML += `
            <tr>
                <td>${agent.name}</td>
                <td>${agent.email}</td>
                <td>Agent</td>
                <td>Active</td>
            </tr>
        `;

    });
}
// Add Agent Form Controls

document.getElementById("addAgentBtn").addEventListener("click", () => {

    document.getElementById("addAgentForm").style.display = "block";

});

document.getElementById("cancelAgentBtn").addEventListener("click", () => {

    document.getElementById("addAgentForm").style.display = "none";

});

// Save New Agent

document.getElementById("saveAgentBtn").addEventListener("click", () => {

    const name = document.getElementById("agentName").value.trim();
    const email = document.getElementById("agentEmail").value.trim();
    const password = document.getElementById("agentPassword").value;

    if (!name || !email || !password) {
        alert("Please fill all agent details.");
        return;
    }

    const agents = JSON.parse(
        localStorage.getItem("dreamPropertyAgents") || "[]"
    );

    const emailExists = agents.some(
        agent => agent.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
        alert("This agent email already exists.");
        return;
    }

    const newAgent = {
        id: Date.now(),
        name: name,
        email: email,
        password: password
    };

    agents.push(newAgent);

    localStorage.setItem(
        "dreamPropertyAgents",
        JSON.stringify(agents)
    );

    renderAgentList();

    document.getElementById("agentName").value = "";
    document.getElementById("agentEmail").value = "";
    document.getElementById("agentPassword").value = "";

    document.getElementById("addAgentForm").style.display = "none";

    alert("New Agent added successfully!");

});
// Display Pending Approval Requests
function renderApprovalRequests() {

    const pendingRequests = document.getElementById("pendingRequests");

    if (!pendingRequests) return;

    const userRole = sessionStorage.getItem("userRole");

    if (userRole !== "admin") {
        document.getElementById("approvalSection").style.display = "none";
        return;
    }

    const requests = JSON.parse(
        localStorage.getItem("dreamPropertyRequests") || "[]"
    );

    const pending = requests.filter(
        request => request.status === "pending"
    );

    if (pending.length === 0) {
        pendingRequests.innerHTML = "<p>No pending requests.</p>";
        return;
    }

    pendingRequests.innerHTML = pending.map(request => `
        <div class="approval-card">
            <h3>Plot: ${request.plotId}</h3>
            <p>Requested By: ${request.requestedBy}</p>
            <p>Current Status: ${request.oldStatus}</p>
            <p>Requested Status: ${request.newStatus}</p>
            <p>Request Time: ${request.time}</p>

            <button class="approve-btn"
                onclick="approvePlotRequest(${request.id})">
                Approve
            </button>

            <button class="reject-btn"
                onclick="rejectPlotRequest(${request.id})">
                Reject
            </button>
        </div>
    `).join("");
}

// Approve Plot Request
function approvePlotRequest(requestId) {

    const requests = JSON.parse(
        localStorage.getItem("dreamPropertyRequests") || "[]"
    );

    const request = requests.find(
        item => item.id === requestId
    );

    if (!request || request.status !== "pending") return;

    const plot = plots.find(
        item => item.id === request.plotId
    );

    if (!plot) {
        alert("Plot not found!");
        return;
    }

    const oldStatus = plot.status;

    plot.status = request.newStatus;
    request.status = "approved";

    localStorage.setItem(
        "dreamPropertyRequests",
        JSON.stringify(requests)
    );

    const statusData = {};

    plots.forEach(item => {
        statusData[item.id] = item.status;
    });

    localStorage.setItem(
        "dreamPropertyStatuses",
        JSON.stringify(statusData)
    );

    recordPlotActivity(plot.id, oldStatus, plot.status);

    displayPlots();
    updateSummary();
    renderApprovalRequests();
    updateAdminDashboard();

    alert("Plot status approved successfully!");
}


// Reject Plot Request
function rejectPlotRequest(requestId) {

    const requests = JSON.parse(
        localStorage.getItem("dreamPropertyRequests") || "[]"
    );

    const request = requests.find(
        item => item.id === requestId
    );

    if (!request || request.status !== "pending") return;

    request.status = "rejected";

    localStorage.setItem(
        "dreamPropertyRequests",
        JSON.stringify(requests)
    );

    renderApprovalRequests();
    updateAdminDashboard();

    alert("Plot status request rejected!");
}

function recordPlotActivity(plotId, oldStatus, newStatus) {
    const activities = JSON.parse(
        localStorage.getItem("dreamPropertyActivity") || "[]"
    );

    activities.unshift({
        time: new Date().toLocaleString("en-ZA"),
        plotId: plotId,
        activity: `${oldStatus.toUpperCase()} → ${newStatus.toUpperCase()}`
    });

    localStorage.setItem(
        "dreamPropertyActivity",
        JSON.stringify(activities.slice(0, 10))
    );

    renderActivityLog();
}


// Show selected plot details

function showPlotDetails(plot) {

    const details = document.getElementById("plotDetails");

    details.innerHTML = `
        <h2>Plot Details: ${plot.id}</h2>

        <p><strong>Project:</strong> Dream Valley Estate</p>

        <p><strong>Plot Number:</strong> ${plot.id}</p>

        <p><strong>Plot Size:</strong> ${plot.size} sq. yards</p>

        <p><strong>Price:</strong> R ${plot.price.toLocaleString("en-ZA")}</p>

        <p class="detail-status">
            <strong>Current Status:</strong> ${plot.status.toUpperCase()}
        </p>

        <div id="statusUpdateSection">

            <label for="plotStatus">Update Plot Status:</label>

            <select id="plotStatus">
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="sold">Sold</option>
            </select>

            <button id="updateStatusBtn">Update Status</button>

        </div>
    `;

    // Show current plot status in dropdown
    document.getElementById("plotStatus").value = plot.status;

    // Update selected plot status
    
document.getElementById("updateStatusBtn").addEventListener("click", () => {

    const newStatus = document.getElementById("plotStatus").value;
    const oldStatus = plot.status;

    if (oldStatus === newStatus) {
        alert("Please select a different status.");
        return;
    }

    const userRole = sessionStorage.getItem("userRole");
    const username = sessionStorage.getItem("username");

    // Agent: Send approval request
    if (userRole === "agent") {

        const requests = JSON.parse(
            localStorage.getItem("dreamPropertyRequests") || "[]"
        );

        requests.push({
            id: Date.now(),
            plotId: plot.id,
            oldStatus: oldStatus,
            newStatus: newStatus,
            requestedBy: username,
            time: new Date().toLocaleString("en-ZA"),
            status: "pending"
        });

        localStorage.setItem(
            "dreamPropertyRequests",
            JSON.stringify(requests)
        );

        alert("Your status change request has been sent to Admin!");

        showPlotDetails(plot);
        return;
    }

    // Admin: Update status directly
    if (userRole === "admin") {

        plot.status = newStatus;

        recordPlotActivity(plot.id, oldStatus, newStatus);

        const statusData = {};

        plots.forEach(plot => {
            statusData[plot.id] = plot.status;
        });

        localStorage.setItem(
            "dreamPropertyStatuses",
            JSON.stringify(statusData)
        );

        displayPlots();
        updateSummary();
        showPlotDetails(plot);
    }

});
    localStorage.setItem(
        "dreamPropertyStatuses",
        JSON.stringify(statusData)
    );

    displayPlots();
    updateSummary();
    showPlotDetails(plot);

}


// Start application
displayPlots();
updateSummary();
renderActivityLog();
renderApprovalRequests();
updateAdminDashboard();
renderAgentList();


    // Plot Search Functionality

    // Plot Search and Status Filter
    const plotSearch = document.getElementById("plotSearch");

    let activeStatusFilter = "all";

    function applyPlotFilters() {
        const searchValue = plotSearch.value.trim().toUpperCase();

        const allPlots = document.querySelectorAll(".plot");

        allPlots.forEach(plotBox => {
            const plotNumber = plotBox.querySelector("span").textContent;

            const matchesSearch = plotNumber.includes(searchValue);

            const matchesStatus =
                activeStatusFilter === "all" ||
                plotBox.classList.contains(activeStatusFilter);

            if (matchesSearch && matchesStatus) {
                plotBox.style.display = "flex";
            } else {
                plotBox.style.display = "none";
            }
        });
    }

    // Search by plot number
    plotSearch.addEventListener("input", applyPlotFilters);

    // Filter by plot status
    function filterPlots(status) {
        activeStatusFilter = status;
        applyPlotFilters();
    }


// Display Logged-in User
const loggedInUser = document.getElementById("loggedInUser");

if (loggedInUser) {
    const username = sessionStorage.getItem("username");
    const userRole = sessionStorage.getItem("userRole");

    if (username && userRole) {
        loggedInUser.textContent =
            `${username} (${userRole.toUpperCase()})`;
    } else {
        loggedInUser.textContent = "Guest User";
    }
}

// Logout Functionality
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {

        sessionStorage.removeItem("username");
        sessionStorage.removeItem("userRole");

        alert("Logout Successful!");

        window.location.href = "login.html";
    });
}

