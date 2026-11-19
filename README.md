# Centroid Finder Frontend

Hello! This is an object tracking computer vision application that takes in a video (ideally .mp4) and tracks specific objects in the video through it's color, outputting the coordinates as a .csv file.

## Setup Instructions

You'll need the following in order to run this application:
- The backend to this project, which can be found [here.](https://github.com/DennysSaenz123/centroid-finder/tree/server)
- Apache Maven
- Git Bash or another shell

### Step 1: Create the JAR
Using your terminal, navigate to the `centroid-finder/processor` directory. Inside of `processor`, run the following command in your terminal:

```mvn clean compile package```

### Step 2: Prepare the backend
In a fresh terminal window, navigate to the `centroid-finder/server` folder. Run `npm i` to install the packages needed for the application.

Execute `npm run dev` to start the backend server. **Keep this terminal window open.**

### Step 3: Prepare the frontend
In a fresh terminal window, open the `centroid-finder-frontend` project and run `npm i` to install the packages needed for the application.

Execute `npm run dev` to start the frontend. **Keep this terminal open.**

### Step 4: Use the app!
In your web browser of choice, go to `http://localhost:5173/`.

You can upload videos by clicking on **Upload Video** in the browser. After uploading, you can click on the thumbnail of the video you'd like to process to go to the processing page.

On a video's processing page, click on the **Target Color** color swatch to select a color. Use the **Threshold** slider to select your threshold.

You can preview what your video will process through the automatically generated thumbnail on the right. A green ring will signify the location of the centroid.

Click **Process Video with These Settings** to begin processing. When the video is finished processing, click **Download CSV** to download the CSV!

The first column represents time (seconds), the second is X, and the third is Y.