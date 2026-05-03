// Shared mutable state for the error generation toggle.
// Lives in the Node.js module cache so both instrumentation.ts and
// the API routes share the same reference within one process.
export const errorState = {
  forceErrors: false,
};
