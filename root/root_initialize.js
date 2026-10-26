// ========================================
// MAIN
// ========================================

export async function initializeRoot() {
  // ========================================
  // IMPORTS
  // ========================================

  const { paths } = await import("../path/path.js");

  // ========================================
  // PATH
  // ========================================

  globalThis.path = paths;

  // ========================================
  // INITIALIZE
  // ========================================

  const { paths: pathsApplications } = await import(
    globalThis.path.applications.js
  );

  const { paths: pathsBlocks } = await import(globalThis.path.blocks.js);

  const { foundation } = await import(globalThis.path.foundation.js);

  // ========================================
  // REGISTER
  // ========================================

  globalThis.path.applications = pathsApplications;

  globalThis.path.blocks = pathsBlocks;

  globalThis.foundation = foundation;

  // ========================================
  // CONTROLLER
  // ========================================

  const { initializeController } = await import(globalThis.path.controller.js);

  await initializeController();
}
