# Simulation core

Pure TypeScript. No React, no DOM, no timers.

The payments resilience simulator is implemented here as a deterministic
discrete-event simulation so that it can be unit-tested in isolation and so the
render layer stays replaceable. Anything in this directory must run under
`vitest` in a plain Node environment.
