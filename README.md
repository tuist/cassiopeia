# Cache

This repository contains a remote cache server for modern build systems

## Supported interfaces

| Interface | Supported |
| ---- | ----- |
| Gradle | Work in progress |
| [Bazel remote API](https://github.com/bazelbuild/remote-apis/blob/main/build/bazel/remote/asset/v1/remote_asset.proto) | Work in progress |

## Development

### Set up

1. Clone the project: `git@github.com:tuist/cache.git`.
2. Install dependencies: `mise install`.
3. Start the server: `mise run dev`.
4. Run the tests: `mise run test`.
