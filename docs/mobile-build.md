# Android Build Instructions

## Required Tools

Before you start, you'll need...
  - `npm`

    Required for installing + running various build scripts. I'd recommend using `nvm` (Node Version Manager) https://github.com/nvm-sh/nvm

  - `JDK 8` (aka `javac`):

    **NOTE** VERSION 8 IS REQUIRED. HIGHER VERSIONS ARE NOT SUPPORTED.

    Required for installing and build the android version of the app. Note that `javac` must be available on the `PATH`, and `JAVA_HOME` should be set correctly

  - `gradle`

    Dependency manager and build tool for java. Required, but might be installed with android studio on some systems

  - `Android SDK` (aka `Android Studio`)

    Various android tools and dependencies. If you don't want to install the entire IDE, or use WSL, I recommend following the instructions here https://stackoverflow.com/a/61150826

  - various C/C++ libraries (libc++, libz, possibly more)

    Many systems will have this already preinstalled, but it's needed for some linux systems. If `npm run build-debug` fails at `:app:mergeDebugResources` (or similar for release build), this may well be your issue.



<br/> <br/>

## Building

### Before your first build
  1. Install `npm` dependencies using `npm ci` in the `cordova-app` directory

     > Do ***not*** run `npm install`. This will *update* the dependencies, and may produce a broken build

  2. Install the target android platform (android 28 as of this writing). This can either be done through the android-studio 
    sdkmanager GUI, or using the command `npm run pre:build`. Note the command line version requires `sdkmanager` 
    to be available on the path (which may or may not come installed with android-studio, depending on your system)

-------

Ensure that you've successfully compiled the game and that `Degrees of Lewdity.html` exists; use `FORCE_VERSION='' ./compile.sh` to generate it if you have pending changes.

Run `npm run build-debug` in the `cordova-app` folder. Note that this builds an unsigned debug build for testing. To build the release version use `npm run build-release`. The produced apk files will be in `platforms/android/app/build/outputs/apk`. 

Run `npm run install-debug` to easily install the debug apk on a currently running emulator or correctly hooked up android device, or `npm run install-release` for the release build.

Note that building the release version requires a key to be created. Check the discord for details on how to get the official key. For testing purposes you can run `npm run genkey-android-public-release` to generate a new key 
    
> using an unofficial key may cause install errors; see `Installing` below

<br/> <br/>

## Setting up the Emulator

An emulator is an easy way to test that the built apk works for a given version of android.

### Get the emulator image

Run `npm run pre:create-vd` (requires sdkmanager cmdline tool) or get the android 24 x86 image from the android-studio virtual device manager GUI (you can download it as part of creating a device)

### Create the emulator

Run `npm run create-vd` (requires avdmanager cmdline tool) or use the android-studio virtual device manager GUI.

If creating manually, be sure to select the correct image (see above). Additionally, be sure to select a device that supports Google Play 
(has a play icon in the GUI). For simplicity and consistency, use the 'Pixel 2', though feel free to experiment with other devices.

If you want to test against other android versions, note that the absolute minimum we can support with DoL is android-21. In addition, you'll have to find a way to update the default browser used by the device. Getting updates installed on pre-android-24 versions (and select other later android versions) is quite a bit more involved.

### **Update the emulator**
This is an important step, as without it you may be able to install and open the app in the emulator, but find it broken.

Start the emulator, and then open Google Play to update
1. Google play
2. Chrome browser

### Installing

Simply run `npm run install-debug` or `npm run install-release` to install the (already) built debug or release apk.

NOTE: If switching between release and/or debug version, it will likely be necessary to uninstall the previous version first using `npm run uninstall`.

<br/><br/>

## Common Issues

Be sure the environment variables `ANDROID_SDK_ROOT` *and* `ANDROID_HOME` are both set appropriately (the correct value varies by system). The `ANDROID_SDK_ROOT` folder should have a `build-tools` folder, along with several others, and contains the various tools that are installed by `android-studio`.

If a specific `npm run` command fails, the issue is probably an environment one (ie, one of your tools is not installed correctly). 
Most of the npm scripts are provided for convenience. Look at the `package.json` file and find the matching script and try running it directly. 
For instance, if `npm run install-debug` fails, try running `adb install platforms/android/app/build/outputs/apk/debug/app-debug.apk` instead.
