# Setting up Firebase Emulators and Development Environment

Note: This guide may not be perfect. If you experience any issues let us know!

1. Download firebase CLI:

```bash
npm install -g firebase-tools
```

The install location for the firebase CLI might not be automatically added to your
`PATH`. If this is the case, just make sure you find where the CLI executable was
installed and add it to your `PATH`.

2. Login to your google account that has access to the firebase project.
   This should open up a browser window for you to login and grant permissions
   to the CLI tool.

```bash
firebase login
```

3. Go to the backend directory, then go to the functions directory
   and run `npm install` and `npm run build`.

4. Go back to the backend directory, run `firebase emulators:start`. This might take
   a few seconds, especially if it's donwloading the emulators for the first time.
   Once complete, you should see a table of emulators, hosts/ports and links to the
   emulator UI. Above that, there should be a link to the main emulator UI. Click that.
   If everything is setup correctly, you should see the firebase emulator UI in your
   browser with the Authentication, Firestore, Realtime Database, Functions, Storage,
   Hosting, and Extensions Emulator with the green **On** status.

   To run `firebase emulators:start` you may need to install Java. To do this, find the 
   latest version of the Java installer through the Oracle website, run the installer, 
   and finally add Java to your path variables. You may need to do this even if you have
   Java through Eclipse.