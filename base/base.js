// ========================================
// IMPORTS
// ========================================

// ========================================
// MAIN
// ========================================

export async function initializeBase() {
  // ========================================
  // STYLES
  // ========================================

  const stylesheetFoundation = document.createElement("link");

  stylesheetFoundation.rel = "stylesheet";

  stylesheetFoundation.href = globalThis.path.foundation.css;

  document.head.appendChild(stylesheetFoundation);

  const stylesheetFoundation_Elements = document.createElement("link");

  stylesheetFoundation_Elements.rel = "stylesheet";

  stylesheetFoundation_Elements.href = globalThis.path.foundation.elements;

  document.head.appendChild(stylesheetFoundation_Elements);

  const stylesheetBase = document.createElement("link");

  stylesheetBase.rel = "stylesheet";

  stylesheetBase.href = globalThis.path.base.css;

  document.head.appendChild(stylesheetBase);

  // ========================================
  // STRUCTURE
  // ========================================

  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="base-page">

      <main
        class="base-content"
        id="base-content">
      </main>

    </div>
  `;
}
