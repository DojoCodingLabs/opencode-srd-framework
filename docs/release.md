# Release Guide

## Preconditions

- npm access to publish `@dojocoding/opencode-srd-framework`
- `NPM_TOKEN` available to GitHub Actions for automated publish
- build, test, and pack smoke all passing

## Local validation

```bash
npm install
npm test
npm run pack:smoke
```

## Versioning

- start with `0.1.0`
- use semver for future releases
- move to `1.0.0` after end-to-end validation on a clean OpenCode profile

## Publish flow

1. update `package.json` and `CHANGELOG.md`
2. commit the release changes
3. create and push a version tag such as `v0.1.0`
4. let `.github/workflows/publish.yml` build, test, smoke-check, and publish with public access

## Manual publish fallback

```bash
npm publish --access public
```
