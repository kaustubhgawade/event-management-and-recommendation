const searchInput = document.getElementById("searchInput");
const container = document.querySelector(".container");
let eventData = JSON.parse(container.getAttribute("data-eventdata"));

// Event listener for input change
searchInput.addEventListener("input", function () {
  const searchText = this.value.toLowerCase();
  // Clear previous results
  container.innerHTML = "";
  // Filter event names based on input
  eventData.forEach((event) => {
    if (event.name.toLowerCase().includes(searchText)) {
      // Create a new div element for the event
      const eventHTML = `
        <a href="${event.category}/${event._id.toString()}">
          <div class="slides">
            <div class="info-wrapper">
              <h2 class="name">${event.name}</h2>
              <div class="more-info">
                <p class="location">${event.location.city}</p>
                <div>
                  <p class="from">${new Date(
                    event.from
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}</p>
                </div>
                <p class="host">${event.hostedby}</p>
              </div>
            </div>
          </div>
        </a>
      `;
      container.innerHTML += eventHTML;
    }
  });
});

// Event listener for "Sort by Date" button
document
  .getElementById("sortByDate")
  .addEventListener("click", function () {
    eventData.sort((a, b) => new Date(a.from) - new Date(b.from));
    renderEvents(eventData);
  });

// Function to render events
function renderEvents(eventData) {
  container.innerHTML = "";
  eventData.forEach((event) => {
    const eventHTML = `
      <a href="${event.category}/${event._id.toString()}">
        <div class="slides">
          <div class="info-wrapper">
            <h2 class="name">${event.name}</h2>
            <div class="more-info">
              <p class="location">${event.location.city}</p>
              <div>
                <p class="from">${new Date(event.from).toLocaleDateString(
                  "en-GB",
                  { day: "2-digit", month: "2-digit", year: "numeric" }
                )}</p>
              </div>
              <p class="tickets">${event.tickets}</p>
            </div>
          </div>
        </div>
      </a>
    `;
    container.innerHTML += eventHTML;
  });
}
