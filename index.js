// Add event listeners to fuel order buttons
document.querySelectorAll(".fuel-card button").forEach((button) => {
  button.addEventListener("click", function () {
    const fuelType = this.getAttribute("data-fuel");
    document.getElementById("fuel-options").style.display = "none";
    document.getElementById("order-form").style.display = "block";
    document.getElementById("fuel-type").value = fuelType;
  });
});

// Handle form submission
document
  .getElementById("fuel-order-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const fuelType = document.getElementById("fuel-type").value;
    const quantity = document.getElementById("quantity").value;
    const location = document.getElementById("location").value;

    if (quantity && location) {
      alert(
        `Order placed!\nFuel: ${fuelType}\nQuantity: ${quantity}\nLocation: ${location}`
      );
      // Reset form and return to fuel options
      this.reset();
      document.getElementById("order-form").style.display = "none";
      document.getElementById("fuel-options").style.display = "block";
    } else {
      alert("Please fill in all fields.");
    }
  });
