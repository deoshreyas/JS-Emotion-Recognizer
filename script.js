// Load elements
var imageUpload = document.getElementById("imgUpload");
var inputLabel = document.getElementById("imgLabel");
var predictions = document.getElementById("predictions");

// Load models
Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(start);

// Main function
function start() {
    const container = document.createElement('div');
    container.style.position = 'relative';
    document.body.append(container);
    // When user uploads image
    imageUpload.addEventListener('change', async () => {
        predictions.style.display = "none";
        // Get the image and display it
        const image = await faceapi.bufferToImage(imageUpload.files[0]);
        container.append(image);
        // Create canvas and resize it (to hold boxes)
        const canvas = faceapi.createCanvasFromMedia(image);
        container.append(canvas);
        const displaySize= {width:image.width, height:image.height}; 
        // Match both the image and the canvas
        faceapi.matchDimensions(canvas, displaySize);
        document.body.append(image);
        // The algorithm runs and detects all faces 
        const detections = await faceapi.detectAllFaces(image)
            .withFaceLandmarks().withFaceDescriptors().withFaceExpressions();
        const resizedDetections= faceapi.resizeResults(detections, displaySize);
        // For each detected face, draw boxes with predictions on the canvas (over the image)
        resizedDetections.forEach(detection => {
            faceapi.draw.drawDetections(canvas, detection);
            faceapi.draw.drawFaceExpressions(canvas, detection);
        });
    });
}