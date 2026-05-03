#!/bin/sh
set -e

# Start Fluent Bit in the background to tail logs and ship to the monitor
fluent-bit -c /etc/fluent-bit/fluent-bit.conf &

# Start the Next.js standalone server
# In a pnpm monorepo the standalone output nests server.js under apps/web/
exec node apps/web/server.js
