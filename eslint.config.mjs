// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // The rebuild lives in its own folder with its own toolchain; the legacy app must not lint it.
  { ignores: ['revamp-quran/**'] },
)
