import * as faceapi from "./libs/faceapi/face-api.esm.js";
import { loadTexture } from "./libs/loader.js";
const THREE = window.MINDAR.FACE.THREE;

const capture = (mindarThree) => {
  const { video, renderer, scene, camera } = mindarThree;
  const renderCanvas = renderer.domElement;

  // output canvas
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = renderCanvas.width;
  canvas.height = renderCanvas.height;

  const sx = (((video.clientWidth - renderCanvas.clientWidth) / 2) * video.videoWidth) / video.clientWidth;
  const sy = (((video.clientHeight - renderCanvas.clientHeight) / 2) * video.videoHeight) / video.clientHeight;
  const sw = video.videoWidth - sx * 2;
  const sh = video.videoHeight - sy * 2;

  context.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  renderer.preserveDrawingBuffer = true;
  renderer.render(scene, camera); // empty if not run
  context.drawImage(renderCanvas, 0, 0, canvas.width, canvas.height);
  renderer.preserveDrawingBuffer = false;

  const data = canvas.toDataURL("image/png");
  return data;
};

document.addEventListener("DOMContentLoaded", () => {
  const start = async () => {
    // const optionsTinyFace = new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.3 });
    const modelPath = "./libs/faceapi/model";
    await faceapi.nets.tinyFaceDetector.load(modelPath);
    await faceapi.nets.faceLandmark68Net.load(modelPath);
    await faceapi.nets.faceExpressionNet.load(modelPath);

    // initialize MindAR
    const mindarThree = new window.MINDAR.FACE.MindARThree({
      container: document.body,
    });
    const { renderer, scene, camera } = mindarThree;
    const textures = {};
    textures["neutral"] = await loadTexture("./openmoji/aa.gif");

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // IMAGEN
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ map: textures["neutral"] });
    const plane = new THREE.Mesh(geometry, material);

    // create anchor
    const anchor = mindarThree.addAnchor(151);
    anchor.group.add(plane);

    // start AR
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    // Captura
    const previewImage = document.querySelector("#preview-image");
    const previewClose = document.querySelector("#preview-close");
    const preview = document.querySelector("#preview");
    const previewShare = document.querySelector("#preview-share");

    document.querySelector("#capture").addEventListener("click", () => {
      const data = capture(mindarThree);
      preview.style.visibility = "visible";
      previewImage.src = data;
    });

    previewClose.addEventListener("click", () => {
      preview.style.visibility = "hidden";
    });

    previewShare.addEventListener("click", () => {
      const canvas = document.createElement("canvas");
      canvas.width = previewImage.width;
      canvas.height = previewImage.height;
      const context = canvas.getContext("2d");
      context.drawImage(previewImage, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const file = new File([blob], "photo.png", { type: "image/png" });
        const files = [file];
        if (navigator.canShare && navigator.canShare({ files })) {
          navigator.share({
            files: files,
            title: "AR Photo",
          });
        } else {
          const link = document.createElement("a");
          link.download = "photo.png";
          link.href = previewImage.src;
          link.click();
        }
      });
    });


    // function emojis
    // const video = mindarThree.video;
    // const expressions = ["happy", "angry", "sad", "neutral"];
    // let lastExpression = "neutral";
    // const detect = async () => {
    //   const results = await faceapi.detectSingleFace(video, optionsTinyFace).withFaceLandmarks().withFaceExpressions();
    //   if (results && results.expressions) {
    //     let newExpression = "neutral";
    //     for (let i = 0; i < expressions.length; i++) {
    //       if (results.expressions[expressions[i]] > 0.5) {
    //         newExpression = expressions[i];
    //       }
    //     }
    //     if (newExpression !== lastExpression) {
    //       material.map = textures[newExpression];
    //       material.needsUpdate = true;
    //     }
    //     lastExpression = newExpression;
    //   }
    //   window.requestAnimationFrame(detect);
    // };
    // window.requestAnimationFrame(detect);
  };
  start();
});
