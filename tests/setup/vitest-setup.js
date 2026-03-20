import { afterEach } from "vitest"
import { unlockIfPreloaderLocked } from "../helpers/loadPortfolioScripts.mjs"

afterEach(() => {
    unlockIfPreloaderLocked()
})
