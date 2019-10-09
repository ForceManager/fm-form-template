## Form Hoi-Poi Template

Form in React with Hoi-Poi components for Android and iOS.
This nwe kind of form uses Bridge library to allow communication between the form and ForceManager.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `fm-cli start`

Runs the development enviroment with the context and brigeBackend listening for bridge calls.

### `npm run build`

Builds the app for production to the `build` folder.<br>
PUBLIC_URL constant is defined in .env file
Set PUBLIC_URL='/code/A3353D8A-DCD9-4C11-BAA5-0050ADE2389C' for development (80965-MARCHESINIUSA_DUMMY)
Set PUBLIC_URL='/code/FFE57F31-A97F-4F3C-9B0A-C40A60BFE202' for production (76967-MARCHESINIUSA)

### `fm-cli deploy`

Not working yet.

## `Manual Deploy`

Copy files to AWS fmfragments/code/{GUID}
