<div align="center">
  <h1>The PathCheck GAEN Solution</h1>

  <a href="https://pathcheck.org/">
    <img
      width="80"
      height="67"
      alt="pathcheck logo"
      src="./assets/Safe_Paths_Logo.png"
    />
  </a>
  
  <b>**https://pathcheck.org/en/technology/google-apple-exposure-notification-solution/**</b>
</div>

<hr />

# Project Overview

Help us stop COVID-19.

COVID PathCheck is a mobile app for digital contract tracing (DCT) sponsored by Path Check a nonprofit and developed by a growing global community of engineers, designers, and contributors. PathCheck is based on research originally conducted at the MIT Media Lab. 

The PathCheck Google Apple Exposure Notification (GAEN) solution is a full open source system for deploying the GAEN API. PathCheck GAEN includes a customizable mobile app and a production-ready exposure notification server based on the Google open source project.

## Privacy Preserving 

What’s truly special about PathCheck is our strong commitment to preserving the privacy of individual users. We're building an application that can help contain outbreaks of COVID-19 without forcing users to sacrifice their personal privacy.

### Custom Builds 

We welcome public health authorities and other organizations implementing digital contact tracing strategies to create custom builds for their specific needs, incorporate PathCheck features into their applications, or create downstream projects that stay linked to the PathCheck project. If intending to fork the repository and develop off of it, be aware that this comes "at your own risk" for continued maintenance.

### GAEN Instances

The rules for GAEN require that each public health authority release their own application. The goal with the PathCheck Project is to support this deployment strategy. 

## Broad Non-Developer Community 

One of the important aspects of the PathCheck open source project is that it's supported by a large community of volunteers in addition to the open source developer community. Spanning as diverse domains as product management, user research, cryptography, security, compliance, design, and videography more than 1,400 Path Check volunteers are working together to support the project and help drive adoption around the world.

### Learn More

[COVID PathCheck Website](https://covidsafepaths.org/)

Original White Paper: [Apps Gone Rogue: Maintaining Personal Privacy in an Epidemic](https://drive.google.com/file/d/1nwOR4drE3YdkCkyy_HBd6giQPPhLEkRc/view?usp=sharing)

[COVID PathCheck Slack](covidsafepaths.slack.com) - This is where the community lives. 


# Development Overview

![Android and iOS build on MacOS](https://github.com/Path-Check/covid-safe-paths/workflows/Android%20and%20iOS%20build%20on%20MacOS/badge.svg)

_PathCheck_ is built on [React Native](https://reactnative.dev/docs/getting-started) v0.61.5

## Contributing

Read the [contribution guidelines](CONTRIBUTING.md).

If you're looking for a first ticket - please check out the backlog for a bug or first story [JIRA project.](https://pathcheck.atlassian.net/secure/RapidBoard.jspa?rapidView=9&projectKey=SAF&view=planning.nodetail&selectedIssue=SAF-264&issueLimit=100)


## Developer Setup

First, run the appropriate setup script for your system. This will install relevant packages, walk through Android Studio configuration, etc.

**Note:** You will still need to [configure an Android Virtual Device (AVD)](https://developer.android.com/studio/run/managing-avds#createavd) after running the script.

#### Linux/MacOS

```
bin/dev_setup.sh
```

#### Windows

```
bin/dev_setup.bat
```

#### Environment

Populate the following 2 `.env` files with the relevant urls for your GAEN server:

```
.env    # local developer variables
.env.bt # variables used in building binaries
```

**Note:** Members of the `Path-Check` org can complete this step by running `bin/fetch_ha_env.sh` and passing in the 2-letter ha abbreviation as the first argument (i.e. `bin/fetch_ha_env.sh pc`)

## Running

**Note:** In some cases, these procedures can lead to the error `Failed to load bundle - Could not connect to development server`. In these cases, kill all other react-native processes and try it again.

#### Android (Windows, Linux, macOS)

```
yarn run-android
```

Device storage can be cleared by long-pressing on the app icon in the simulator, clicking "App info", then "Storage", and lastly, "Clear Storage".

#### iOS (macOS only)

First, install the pod files:

```
yarn install:pod ## only needs to be ran once
```

Then, run the application:

```
yarn run-ios
```

Device storage can be cleared by clicking "Hardware" on the system toolbar, and then "Erase all content and settings".

Privacy settings can be reset by going to Settings > General > Reset > Reset
Location & Privacy

### Release Builds

Generating a release build is an optional step in the development process.

- [Android instructions](https://reactnative.dev/docs/signed-apk-android)

### Debugging

[react-native-debugger](https://github.com/jhen0409/react-native-debugger) is recommended. This tool will provide visibility of the JSX hierarchy, breakpoint usage, monitoring of network calls, and other common debugging tasks.

## Tooling

#### TypeScript

This project is using
[typescript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html).

Run the complier with:
```
yarn tsc
```

Not every file *needs* to be written in TypeScript, but we are preferring to use
TypeScript in general.

Note that for React-Native projects, TypeScript complication is handled by the
metro-bundler build process and there is no need to emit js code into a bundle
as one would do in a web context, hence the inclusion of the `--noEmit` flag.

#### Prettier

This project is using [prettier](https://prettier.io/docs/en/install.html).

We have a local prettierrc file, please make sure your development environment
is set to use the project's prettierrc.

#### Husky

This project is using [husky](https://github.com/typicode/husky) to automate
running validation and tests locally on a pre-push git hook.

If you ever need to push code without running these scripts, you can pass the
`--no-verify` flag on `git push`.

#### ESLint

This project is using [eslint](https://eslint.org/docs/user-guide/getting-started).

We have linting checks on CI, please make sure to include the checks locally in
your IDE.

## Testing

Tests are ran automatically through Github actions - PRs are not able to be merged if there are tests that are failing.

### Static Testing

To run the static analysis tools:

```
yarn validate
```

### Unit Test

To run the unit tests:

```
yarn test --watch
```

[Snapshot testing](https://jestjs.io/docs/en/snapshot-testing) is used as a quick way to verify that the UI has not changed. To update the snapshots:

```
yarn update-snapshots
```

### e2e Test

e2e tests are written using [_detox_](https://github.com/wix/Detox). Screenshots of each test run are saved to `e2e/artifacts` for review.

To run the e2e tests:

```
yarn detox-setup ## only needs to be run once
yarn build:e2e:ios ## needs to be run after any code change
yarn test:e2e:iphone{11, -se, 8}
```

### Manual Device Testing

Mobile devices come in many different shapes and sizes - it is important to test your code on a variety of simulators to ensure it looks correct on all device types.

Before pushing up code, it is recommended to manually test your code on the following devices:

- Nexus 4 (smaller screen)
- iPhone 8 (smaller screen)
- Pixel 3 XL (larger screen)
- iPhone 11 (screen w/ notch)
