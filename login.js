
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const userRole = document.getElementById("userRole").value;

    if (userRole === "admin") {
        if (username === "admin@dreamproperty.com" && password === "Admin123") {
            sessionStorage.setItem("userRole", "admin");
            sessionStorage.setItem("username", username);
            alert("Admin Login Successful!");
            window.location.href = "index.html";
        } else {
            alert("Invalid Admin Credentials!");
        }
    }

    else if (userRole === "agent") {

        const agents = JSON.parse(
            localStorage.getItem("dreamPropertyAgents") || "[]"
        );

        // Default Demo Agent
        const isDemoAgent =
            username.trim().toLowerCase() === "agent@dreamproperty.com" &&
            password === "Agent123";

        // Admin-created agents
        const registeredAgent = agents.find(agent =>
            agent.email.toLowerCase() === username.trim().toLowerCase() &&
            agent.password === password
        );

        if (isDemoAgent || registeredAgent) {

            sessionStorage.setItem("userRole", "agent");
            sessionStorage.setItem("username", username);

            alert("Agent Login Successful!");

            window.location.href = "index.html";

        } else {

            alert("Invalid Agent Credentials!");

        }
    }
});
