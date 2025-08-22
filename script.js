document.addEventListener("DOMContentLoaded", () => {
  fetch("playbook.json")
    .then(response => response.json())
    .then(playbook => {
      buildSidebar(playbook);
      buildContent(playbook);
    })
    .catch(err => console.error("Error loading playbook.json:", err));
});

function buildSidebar(playbook) {
  const sidebar = document.querySelector(".sidebar");
  sidebar.innerHTML = `<h5 class="mb-3">Industries</h5>
    <div class="accordion" id="verticalAccordion"></div>`;
  const accordion = document.getElementById("verticalAccordion");

  playbook.forEach((vertical, vIndex) => {
    let verticalId = `vertical-${vIndex}`;
    let accordionItem = document.createElement("div");
    accordionItem.className = "accordion-item";

    accordionItem.innerHTML = `
      <h2 class="accordion-header" id="heading-${verticalId}">
        <button class="accordion-button collapsed" type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapse-${verticalId}"
                aria-expanded="false"
                aria-controls="collapse-${verticalId}">
          <a href="#${verticalId}" >
            ${vertical.vertical}
          </a>
        </button>
      </h2>
      <div id="collapse-${verticalId}" class="accordion-collapse collapse"
           aria-labelledby="heading-${verticalId}"
           data-bs-parent="#verticalAccordion">
        <div class="accordion-body">
          <ul class="list-unstyled">
            ${vertical.horizontals.map((h, hIndex) =>
              `<div class = "list-item-div"><li><a href="#${verticalId}-${hIndex}" class="text-decoration-none d-block py-1">${h.name}</a> </li></div>`
            ).join("")}
          </ul>
        </div>
      </div>`;
    accordion.appendChild(accordionItem);
  });
}

function buildContent(playbook) {
  const content = document.querySelector(".content");
  content.innerHTML = `
    <h1 id="top" >Happilee Sales Playbook</h1>
    <p>This playbook is your guide to handling sales conversations across different industries and use cases. </p>
    <p>Use the sidebar to select a vertical, then choose the customer’s possbile need or intent.</p>
    <p>The main panel will show you the recommended use cases and plays you can pitch.</p>
  `;

  playbook.forEach((vertical, vIndex) => {
    let verticalId = `vertical-${vIndex}`;
    content.innerHTML += `<h3 id="${verticalId}" class="mt-4">${vertical.vertical}</h3>`;
    vertical.horizontals.forEach((h, hIndex) => {
      let horizontalId = `${verticalId}-${hIndex}`;
      content.innerHTML += `<h5 id="${horizontalId}" class="mt-3">${h.name}</h5>`;
      // Create intent grid container
      let gridHTML = '<div class="intent-grid">';
      h.intents.forEach(intent => {
        // Clean intent string: remove quotes and square brackets
        let cleanIntent = intent
          .replace(/^\[+|\]+$/g, '') // Remove leading/trailing brackets
          .replace(/['"\[\]]/g, '') // Remove quotes and brackets
          .trim();
        cleanIntent = cleanIntent.charAt(0).toUpperCase() + cleanIntent.slice(1); // Capitalize first letter
        gridHTML += `
          <div>
            <div class="card intent-card h-100" style="min-height:120px;">
              <div class="card-body">
                ${cleanIntent}
              </div>
            </div>
          </div>`;
      });
      gridHTML += '</div>';
      content.innerHTML += gridHTML;
    });
  });
}
