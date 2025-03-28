// Fetch fuel types and populate the fuel grid
async function loadFuelTypes() {
  try {
    const response = await fetch("http://localhost:3000/fuelTypes");
    const fuelTypes = await response.json();

    const fuelGrid = document.getElementById("fuel-grid");
    fuelGrid.innerHTML = ""; // Clear any existing content

    fuelTypes.forEach((fuel) => {
      const fuelCard = document.createElement("div");
      fuelCard.classList.add("fuel-card");
      fuelCard.innerHTML = `
              <h3>${fuel.name}</h3>
              <p>$${fuel.pricePerUnit.toFixed(2)}/${fuel.unit}</p>
              <button data-fuel="${fuel.name}" data-fuel-id="${
        fuel.id
      }">Order Now</button>
          `;
      fuelGrid.appendChild(fuelCard);
    });

    // Add event listeners to the newly created buttons
    document.querySelectorAll(".fuel-card button").forEach((button) => {
      button.addEventListener("click", function () {
        const fuelType = this.getAttribute("data-fuel");
        document.getElementById("fuel-options").style.display = "none";
        document.getElementById("order-form").style.display = "block";
        document.getElementById("fuel-type").value = fuelType;
      });
    });
  } catch (error) {
    console.error("Error fetching fuel types:", error);
    alert("Failed to load fuel types. Please try again later.");
  }
}

// Load fuel types when the page loads
document.addEventListener("DOMContentLoaded", loadFuelTypes);

// Handle location icon click (placeholder for Google Maps integration)
document.getElementById("location-icon").addEventListener("click", function () {
  alert(
    "Location picker would open here (e.g., Google Maps). For now, please type your address."
  );
  // In a real app, this would open a map interface to select a location
  // Example: Integrate Google Maps API to set the location field value
});

// Handle form submission
document
  .getElementById("fuel-order-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const fuelType = document.getElementById("fuel-type").value;
    const quantity = document.getElementById("quantity").value;
    const email = document.getElementById("email").value;
    const location = document.getElementById("location").value;
    const accountHolder = document.getElementById("account-holder").value;
    const accountNumber = document.getElementById("account-number").value;
    const routingNumber = document.getElementById("routing-number").value;

    if (
      quantity &&
      email &&
      location &&
      accountHolder &&
      accountNumber &&
      routingNumber
    ) {
      try {
        // Map fuel type to fuelTypeId
        const fuelTypes = await fetch("http://localhost:3000/fuelTypes").then(
          (res) => res.json()
        );
        const fuelTypeMap = {};
        fuelTypes.forEach((fuel) => {
          fuelTypeMap[fuel.name] = fuel.id;
        });
        const fuelTypeId = fuelTypeMap[fuelType];

        // Create or find user
        const userResponse = await fetch(
          `http://localhost:3000/users?email=${email}`
        ).then((res) => res.json());
        let userId;
        if (userResponse.length === 0) {
          const newUser = {
            name: accountHolder,
            email: email,
            accountHolder: accountHolder,
            accountNumber: accountNumber,
            routingNumber: routingNumber,
          };
          const userPostResponse = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
          }).then((res) => res.json());
          userId = userPostResponse.id;
        } else {
          userId = userResponse[0].id;
        }

        // Create a new order
        const newOrder = {
          userId: userId,
          fuelTypeId: fuelTypeId,
          quantity: parseInt(quantity),
          location: location,
          email: email,
          accountHolder: accountHolder,
          accountNumber: accountNumber,
          routingNumber: routingNumber,
          status: "Pending",
          driverId: null,
          createdAt: new Date().toISOString(),
        };

        await fetch("http://localhost:3000/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newOrder),
        });

        alert("Order placed successfully! Check the API for details.");
        console.log("New Order:", newOrder);

        // Reset form and return to fuel options
        this.reset();
        document.getElementById("order-form").style.display = "none";
        document.getElementById("fuel-options").style.display = "block";
      } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again later.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  });
