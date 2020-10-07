<table>
  <tr>
  <td>
    <a href="https://pathcheck.org/">
    <img
      width="80"
      height="67"
      alt="pathcheck logo"
      src="./assets/Safe_Paths_Logo.png"
    />
  </a>
  </td>
  <td>
<div style="float:left" align="center" >
  <h1>The PathCheck GAEN Solution</h1>

  <b>**https://pathcheck.org/en/technology/google-apple-exposure-notification-solution/**</b>
  
  </div>
  </td>
  </tr>
</table>
<hr />

# Table of contents

  * [Project Overview](#project-overview) 
    * [Privacy Preserving](#privacy-preserving) 
    * [Custom Builds](#custom-builds)
    * [Broad Non-Developer Community](#broad-non-developer-community)
    * [Learn More](#learn-more)
  * [Development Overview](#development-overview) 
      * [Contributing](#contributing)
      * [Developer Setup](#developer-setup)
        * [Linux/MacOS](#linux/MacOS)
        * [Windows](#windows)
        * [Environment](#environment)
      * [Running](#running)
        * [Android (Windows, Linux, macOS)](#Android-\(Windows,-Linux,-macOS\))
        * [iOS (macOS only)](#iOS-\(macOS-only\))
      * [Debugging](#debugging)
      * [Tooling](#tooling)
        * [Typescript](#typescript)
        * [Prettier](#prettier)
        * [Husky](#husky)
        * [ESLint](#eslint)
        * [Ruby](#ruby)
      * [Testing](#testing)
        * [Static Testing](#static-testing)
        * [Unit Test](#unit-test)
        * [e2e Test](#e2e-test)
        * [Manual Device Testing](#manual-device-testing)
    * [License](#license) 


# Project Overview

Help us stop COVID-19.

COVID PathCheck is a mobile app for digital contract tracing (DCT) sponsored by Path Check a nonprofit and developed by a growing global community of engineers, designers, and contributors. PathCheck is based on research originally conducted at the MIT Media Lab. 

The PathCheck Google Apple Exposure Notification (GAEN) solution is a full open source system for deploying the GAEN API. PathCheck GAEN includes a customizable mobile app and a production-ready exposure notification server based on the Google open source project.

## Privacy Preserving 

What’s truly special about PathCheck is our strong commitment to preserving the privacy of individual users. We're building an application that can help contain outbreaks of COVID-19 without forcing users to sacrifice their personal privacy.

## Custom Builds 

We welcome public health authorities and other organizations implementing digital contact tracing strategies to create custom builds for their specific needs, incorporate PathCheck features into their applications, or create downstream projects that stay linked to the PathCheck project. If intending to fork the repository and develop off of it, be aware that this comes "at your own risk" for continued maintenance.

## Broad Non-Developer Community 

One of the important aspects of the PathCheck open source project is that it's supported by a large community of volunteers in addition to the open source developer community. Spanning as diverse domains as product management, user research, cryptography, security, compliance, design, and videography more than 1,400 Path Check volunteers are working together to support the project and help drive adoption around the world.

## Learn More

[COVID PathCheck Website](https://covidsafepaths.org/)

[Apps Gone Rogue: Maintaining Personal Privacy in an Epidemic](https://drive.google.com/file/d/1nwOR4drE3YdkCkyy_HBd6giQPPhLEkRc/view?usp=sharing) - The orginal white paper.

[COVID PathCheck Slack](covidsafepaths.slack.com) - Where the community lives. 

[Path-Check/covid-safe-paths](https://github.com/Path-Check/covid-safe-paths) - PathCheck's GPS based contact tracing solution.


# Development Overview

_PathCheck_ is built on [React Native](https://reactnative.dev/docs/getting-started)

## Contributing

Read the [contribution guidelines](CONTRIBUTING.md).

## Developer Setup

First, run `yarn install` in the root of the project. Then run the appropriate setup script for your system. This will install relevant packages, walk through Android Studio configuration, etc.

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

**Note:** Members of the `Path-Check` org can complete this step by making a `.env` file based on the `example.env` file in the project and inputting their GitHub access token. Then run ` bin/set_ha.sh ${HA_LABEL}` and passing in the 2-letter ha abbreviation as the first argument (i.e. ` bin/set_ha.sh pc`). This will also setup the values for the display name of the applications and will ensure that we are working with the latest configuration.

## Running

**Note:** In some cases, these procedures can lead to the error `Failed to load bundle - Could not connect to development server`. In these cases, kill all other react-native processes and try it again.

### Android (Windows, Linux, macOS)

First, in the "android" directory run:
```
bundle
```
If you get a Ruby version error, follow the instructions [here](https://stackoverflow.com/questions/37914702/how-to-fix-your-ruby-version-is-2-3-0-but-your-gemfile-specified-2-2-5-while/37914750) to fix it.

Then, run the application:
```
yarn run-android
```
If you get a 500 local server error, run:
```
yarn start --reset-cache
``` 
If you get a `require: cannot load such file -- dotenv (LoadError)` error, run:
```
gem install dotenv
```
Linting checks are running automatically on CI, to run those checks locally before pushing your code do:
```
yarn lint:android
```
**Testing:**
- To use the EN APIs on Android the Google account on your Android device must be approved. Reach out to the PatchCheck contacts at Google to get added to the list.
- To provide dianogisis keys to the API the applicationId should be whitelisted, you can skip that verification step by checking `Settings > Google > COVID-19 Exposure Notifications >  Debug mode > Bypass app signature check`
- Device storage can be cleared by long-pressing on the app icon in the simulator, clicking "App info", then "Storage", and lastly, "Clear Storage".

### iOS (macOS only)

First, install the pod files:

```
yarn install:pod
```

Then, run the application:

```
yarn run-ios
```

**Note:** Members of the `Path-Check` org should update the environment variables of the release build corresponding with the health authority, for this we need to execute the script `bin/set_ha.sh ${HA_LABEL}` where HA_LABEL is the corresponding health authority label. This will setup the values for the display name of the applications and will ensure that we are working with the latest configuration.

## Debugging

[react-native-debugger](https://github.com/jhen0409/react-native-debugger) is recommended. This tool will provide visibility of the JSX hierarchy, breakpoint usage, monitoring of network calls, and other common debugging tasks.

## Tooling

### TypeScript

This project is using
[typescript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html).

Run the complier with:
```
yarn tsc
```

Note that for React-Native projects, TypeScript complication is handled by the
metro-bundler build process and there is no need to emit js code into a bundle
as one would do in a web context, hence the inclusion of the `--noEmit` flag.

### Prettier

This project is using [prettier](https://prettier.io/docs/en/install.html).

We have a local prettierrc file, please make sure your development environment
is set to use the project's prettierrc.

### Husky

This project is using [husky](https://github.com/typicode/husky) to automate
running validation and tests locally on a pre-push git hook.

If you ever need to push code without running these scripts, you can pass the
`--no-verify` flag on `git push`.

### ESLint

This project is using [eslint](https://eslint.org/docs/user-guide/getting-started).

We have linting checks on CI, please make sure to include the checks locally in
your IDE.

### Checkstyle

This project is using [checkstyle](https://checkstyle.sourceforge.io/) to run linting checks for Java files (Android).

We are using [Google's checkstyle](https://github.com/checkstyle/checkstyle/blob/checkstyle-8.35/src/main/resources/google_checks.xml) with some minor differences.

To apply the code style to Android Studio you can follow these steps:
1. Install CheckStyle-IDEA plugin (http://plugins.jetbrains.com/plugin/1065?pr=idea), it can be found via plug-in repository (Settings|Plugins|Browse repositories).
2. Go to Settings|Editor|Code Style, choose a code style you want to import CheckStyle configuration to.
3. Click Manage...|Import.., choose "CheckStyle Configuration" and select a corresponding CheckStyle configuration file ( `/android/app/checkstyle.xml`). Click OK.

### Ktlint

This project is using [ktlint](https://github.com/jlleitschuh/ktlint-gradle) to run linting checks for Kotlin files (Android).

You can run `./gradlew ktlintformat` to automatically format all your Kotlin files.

### Ruby

We use ruby for bin scripts, cocoapods, and fastlane.
We recommended [asdf](https://asdf-vm.com/#/) as version manager for ruby.

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

## Distribution

### Android

Android APKs are automatically distributed (via AppCenter) on each commit to develop
Once a new HA is created we need to add some secrets:
- Encoded keystore file (`openssl base64 -A -in key.jks`)
- Keystore password
- Key password

# License
  [MIT License](LICENSE)
