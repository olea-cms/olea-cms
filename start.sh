#!/bin/bash

# Start the frontend watcher
(cd frontend && bun run watch) &

# Start the backend dev server
(cd backend && bun run dev)

# If this doesn't work I'll try pm2
