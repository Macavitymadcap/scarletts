import { createApp } from './app';

// Only /crew and /cal reach this script (see run_worker_first in
// wrangler.jsonc); every other path is served straight from static assets.
export default createApp();
