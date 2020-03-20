const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { ipcRenderer } = require("electron");
const Chart = require("chart.js");
const path = require("path");

// encrypt process inputs
const hillEncrypt = document.querySelector("#hill-encrypt-btn");
const playfairEncrypt = document.querySelector("#play-fair-encrypt-btn");
const vigenereEncrypt = document.querySelector("#vigenere-encrypt-btn");
const vernamEncrypt = document.querySelector("#vernam-encrypt-btn");

// decrypt process inputs
const hillDecrypt = document.querySelector("#hill-decrypt-btn");
const playfairDecrypt = document.querySelector("#play-fair-decrypt-btn");
const vigenereDecrypt = document.querySelector("#vigenere-decrypt-btn");
const vernamDecrypt = document.querySelector("#vernam-decrypt-btn");

// section
const cipherSection = document.querySelector("#cipher-section");
const performanceSection = document.querySelector("#performance-section");

// forms
const fHill = document.querySelector("#hill-cipher-form");
const fPlayfair = document.querySelector("#play-fair-cipher-form");
const fVigenere = document.querySelector("#vigenere-cipher-form");
const fVernam = document.querySelector("#vernam-cipher-form");

// nav button
const navHillBtn = document.querySelector("#hill-cipher-btn");
const navPlayFairBtn = document.querySelector("#play-fair-cipher-btn");
const navVigenereBtn = document.querySelector("#vigenere-cipher-btn");
const navVernamBtn = document.querySelector("#vernam-cipher-btn");
const performanceBtn = document.querySelector("#performance-btn");

// performance section
const performanceAction = document.querySelector("#performance-action");

// file selectors
const hillFileEncrypt = document.querySelector("#file-he");
const hillFileDecrypt = document.querySelector("#file-hd");

const playFairFileEncrypt = document.querySelector("#file-pfe");
const playFairFileDecrypt = document.querySelector("#file-pfd");

const vigenereFileEncrypt = document.querySelector("#file-vge");
const vigenereFileDecrypt = document.querySelector("#file-vgd");

const vernamFileEncrypt = document.querySelector("#file-vre");
const vernamFileDecrypt = document.querySelector("#file-vrd");

// state of file mode
let fileModeToggle = false;

// reset all form
const resetForms = () => {
  const defaultLabelText = "Choose a file";
  fHill.reset();
  fPlayfair.reset();
  fVernam.reset();
  fVigenere.reset();

  hillELabel.textContent = defaultLabelText;
  hillDLabel.textContent = defaultLabelText;
  playFairELabel.textContent = defaultLabelText;
  playFairDLabel.textContent = defaultLabelText;
  vigenereELabel.textContent = defaultLabelText;
  vigenereDLabel.textContent = defaultLabelText;
  vernamELabel.textContent = defaultLabelText;
  vernamDLabel.textContent = defaultLabelText;
};

// hide the required inputs and show file selector for file mode
const hideInputContentForFileMode = () => {
  // hide all the plain text and result text area
  document.querySelector("#plain-text-hill").classList.add("inactive");

  document.querySelector("#cipher-text-result-hill").classList.add("inactive");

  document.querySelector("#cipher-text-decrypt-hill").classList.add("inactive");

  document.querySelector("#plain-text-result-hill").classList.add("inactive");

  document.querySelector("#plain-text-playfair").classList.add("inactive");

  document
    .querySelector("#cipher-text-result-playfair")
    .classList.add("inactive");

  document
    .querySelector("#cipher-text-decrypt-playfair")
    .classList.add("inactive");

  document
    .querySelector("#plain-text-result-playfair")
    .classList.add("inactive");

  document.querySelector("#plain-text-vigenere").classList.add("inactive");

  document
    .querySelector("#cipher-text-result-vigenere")
    .classList.add("inactive");

  document
    .querySelector("#cipher-text-decrypt-vigenere")
    .classList.add("inactive");

  document
    .querySelector("#plain-text-result-vigenere")
    .classList.add("inactive");

  document.querySelector("#plain-text-vernam").classList.add("inactive");

  document
    .querySelector("#cipher-text-result-vernam")
    .classList.add("inactive");

  document
    .querySelector("#cipher-text-decrypt-vernam")
    .classList.add("inactive");

  document.querySelector("#plain-text-result-vernam").classList.add("inactive");

  // display file selectors

  document.querySelector("#file-e-h").classList.remove("inactive");

  document.querySelector("#file-d-h").classList.remove("inactive");

  document.querySelector("#file-e-pf").classList.remove("inactive");

  document.querySelector("#file-d-pf").classList.remove("inactive");

  document.querySelector("#file-e-vg").classList.remove("inactive");

  document.querySelector("#file-d-vg").classList.remove("inactive");

  document.querySelector("#file-e-vr").classList.remove("inactive");

  document.querySelector("#file-d-vr").classList.remove("inactive");

  // display output name input
  fileOutHillEncrypt.classList.remove("inactive");
  fileOutHillDecrypt.classList.remove("inactive");
  fileOutPlayFairEncrypt.classList.remove("inactive");
  fileOutPlayFairDecrypt.classList.remove("inactive");
  fileOutVigenereEncrypt.classList.remove("inactive");
  fileOutVigenereDecrypt.classList.remove("inactive");
  fileOutVernamEncrypt.classList.remove("inactive");
  fileOutVernamDecrypt.classList.remove("inactive");
};

// hide the file selector and show input for input mode
const displayInputContentForInputMode = () => {
  // display all the plain text and result text area
  document.querySelector("#plain-text-hill").classList.remove("inactive");

  document
    .querySelector("#cipher-text-result-hill")
    .classList.remove("inactive");

  document
    .querySelector("#cipher-text-decrypt-hill")
    .classList.remove("inactive");

  document
    .querySelector("#plain-text-result-hill")
    .classList.remove("inactive");

  document.querySelector("#plain-text-playfair").classList.remove("inactive");

  document
    .querySelector("#cipher-text-result-playfair")
    .classList.remove("inactive");

  document
    .querySelector("#cipher-text-decrypt-playfair")
    .classList.remove("inactive");

  document
    .querySelector("#plain-text-result-playfair")
    .classList.remove("inactive");

  document.querySelector("#plain-text-vigenere").classList.remove("inactive");

  document
    .querySelector("#cipher-text-result-vigenere")
    .classList.remove("inactive");

  document
    .querySelector("#cipher-text-decrypt-vigenere")
    .classList.remove("inactive");

  document
    .querySelector("#plain-text-result-vigenere")
    .classList.remove("inactive");

  document.querySelector("#plain-text-vernam").classList.remove("inactive");

  document
    .querySelector("#cipher-text-result-vernam")
    .classList.remove("inactive");

  document
    .querySelector("#cipher-text-decrypt-vernam")
    .classList.remove("inactive");

  document
    .querySelector("#plain-text-result-vernam")
    .classList.remove("inactive");

  // hide file selectors
  document.querySelector("#file-e-h").classList.add("inactive");
  document.querySelector("#file-d-h").classList.add("inactive");

  document.querySelector("#file-e-pf").classList.add("inactive");
  document.querySelector("#file-d-pf").classList.add("inactive");

  document.querySelector("#file-e-vg").classList.add("inactive");
  document.querySelector("#file-d-vg").classList.add("inactive");

  document.querySelector("#file-e-vr").classList.add("inactive");
  document.querySelector("#file-d-vr").classList.add("inactive");

  // hide output name input
  // display output name input
  fileOutHillEncrypt.classList.add("inactive");
  fileOutHillDecrypt.classList.add("inactive");
  fileOutPlayFairEncrypt.classList.add("inactive");
  fileOutPlayFairDecrypt.classList.add("inactive");
  fileOutVigenereEncrypt.classList.add("inactive");
  fileOutVigenereDecrypt.classList.add("inactive");
  fileOutVernamEncrypt.classList.add("inactive");
  fileOutVernamDecrypt.classList.add("inactive");
};

// chart
const cta = document.querySelector("#cta");
const ctx = document.getElementById("myChart");
const myChart = new Chart(ctx, { type: "bar" });
let resultArr = []; // used by chart to set data-set

// cta buttons
const cpuBtn = document.querySelector("#cpu");
const memoryBtn = document.querySelector("#memory");
const timeBtn = document.querySelector("#time");

// file mode button
const fileMode = document.querySelector("#file-mode-btn");

// file label
const hillELabel = document.querySelector("#file-e-h");
const hillDLabel = document.querySelector("#file-d-h");

const playFairELabel = document.querySelector("#file-e-pf");
const playFairDLabel = document.querySelector("#file-d-pf");

const vigenereELabel = document.querySelector("#file-e-vg");
const vigenereDLabel = document.querySelector("#file-d-vg");

const vernamELabel = document.querySelector("#file-e-vr");
const vernamDLabel = document.querySelector("#file-d-vr");

// file output name input
const fileOutHillEncrypt = document.querySelector("#file-e-hout");
const fileOutHillDecrypt = document.querySelector("#file-d-hout");

const fileOutPlayFairEncrypt = document.querySelector("#file-e-pfout");
const fileOutPlayFairDecrypt = document.querySelector("#file-d-pfout");

const fileOutVigenereEncrypt = document.querySelector("#file-e-vgout");
const fileOutVigenereDecrypt = document.querySelector("#file-d-vgout");

const fileOutVernamEncrypt = document.querySelector("#file-e-vrout");
const fileOutVernamDecrypt = document.querySelector("#file-d-vrout");

// file properties
let fileNameEncrypt;
let fileNameDecrypt;
let fileEncryptDir;
let fileDecryptDir;

// section toggler
const cipherSectionVisibilityToggleOff = () => {
  cipherSection.classList.remove("active");
  cipherSection.classList.add("inactive");
};

const cipherSectionVisibilityToggleOn = () => {
  cipherSection.classList.remove("inactive");
  cipherSection.classList.add("active");
};

const performanceSectionVisibilityToggleOff = () => {
  performanceSection.classList.remove("active");
  performanceSection.classList.add("inactive");
};

const performanceSectionVisibilityToggleOn = () => {
  performanceSection.classList.remove("inactive");
  performanceSection.classList.add("active");
};

// validate file selector
const validateFileSelector = e => {
  if (e.target.files[0].type != "text/plain") {
    showAlert("Invalid File type selected. Please select .txt file");
    return false;
  }
  return true;
};

// set encrypt file state
const encryptFileState = (name, dir) => {
  dir = dir.trim();
  name = name.trim();
  fileNameEncrypt = name;

  fileEncryptDir = dir.endsWith("\\")
    ? dir.trim().slice(0, dir.lastIndexOf("\\"))
    : dir.trim();
};

// set decrypt file state
const decryptFileState = (name, dir) => {
  dir = dir.trim();
  name = name.trim();
  fileNameDecrypt = name;
  fileDecryptDir = dir.endsWith("\\")
    ? dir.trim().slice(0, dir.lastIndexOf("\\"))
    : dir.trim();
};

// spawn child process to call java program for input mode
const callJava = async function(option, key, msg, cipher, element) {
  let output;
  const childFun = async path => {
    const { stderr, stdout } = await exec(
      `java -cp "${path}" "${cipher}" "${option}" "${key}" "${msg}"`
    );

    output = stdout.split("Res: ");

    if (output[0].includes("Err: ")) {
      showAlert(output[0].replace("Err: ", ""));
      return;
    }

    if (stderr) {
      return;
    }

    output = output[1].split(" ");

    if (element) {
      element.value = output[3];
    }

    return output;
  };

  try {
    if (process.env.NODE_ENV === "development") {
      return await childFun("./src/cipher_java_class/");
    } else {
      return await childFun(`${process.resourcesPath}/extraResources/`);
    }
  } catch (e) {
    let error =
      "Something went wrong ! 😞\n" +
      e.message +
      "\n\nPlease install Java\nSet System variables path for Java executables\nAnd restart your system! 😓";

    console.log(error);
    showAlert("Something went wrong ! 😞", "error");
  }
};

// spawn child process to call java program for file mode
const callJavaFile = async (
  option,
  key,
  fileName,
  dir,
  outputFileName,
  cipher
) => {
  let output;
  const childFun = async path => {
    const { stderr, stdout } = await exec(
      `java -cp "${path}" "${cipher}" "${option}" "${key}" "${fileName}" "${outputFileName}.txt" "${dir}"`
    );

    output = stdout.split("Res: ");

    if (output[0].includes("Err: ")) {
      showAlert(output[0].replace("Err: ", ""));
      return;
    }

    if (stderr) {
      return;
    }
    output = output[1].split(" ");

    return output;
  };

  try {
    if (process.env.NODE_ENV === "development") {
      return await childFun("./src/cipher_java_class/");
    } else {
      return await childFun(`${process.resourcesPath}/extraResources/`);
    }
  } catch (e) {
    let error =
      "Something went wrong ! 😞\n" +
      e.message +
      "\n\nPlease install Java\nSet System variables path for Java executables\nAnd restart your system! 😓";

    console.log(error);
    showAlert("Something went wrong ! 😞", "error");
  }
};

// show native alert window
const showAlert = (msg, type) => {
  ipcRenderer.send("showAlert", msg, type);
};

// gerates chart
const generateChart = (hill, play, vernam, vigenere, unit, title) => {
  cta.classList.remove("inactive");

  myChart.data = {
    labels: [
      "Hill Cipher",
      "Play Fair Cipher",
      "Vernam Cipher",
      "Vigenere Cipher"
    ],
    datasets: [
      {
        label: unit,
        data: [hill, play, vernam, vigenere],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)"
        ],
        borderWidth: 2
      }
    ]
  };

  myChart.options = {
    maintainAspectRatio: true,
    title: {
      display: true,
      text: title
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };

  myChart.update();
};

// nav link events
navHillBtn.addEventListener("click", e => {
  cipherSectionVisibilityToggleOn();
  performanceSectionVisibilityToggleOff();
  resetForms();

  fHill.classList.remove("inactive");
  fHill.classList.add("active");

  fPlayfair.classList.remove("active");
  fPlayfair.classList.add("inactive");

  fVigenere.classList.remove("active");
  fVigenere.classList.add("inactive");

  fVernam.classList.remove("active");
  fVernam.classList.add("inactive");
});

navPlayFairBtn.addEventListener("click", e => {
  cipherSectionVisibilityToggleOn();
  performanceSectionVisibilityToggleOff();

  resetForms();

  fHill.classList.remove("active");
  fHill.classList.add("inactive");

  fPlayfair.classList.remove("inactive");
  fPlayfair.classList.add("active");

  fVigenere.classList.remove("active");
  fVigenere.classList.add("inactive");

  fVernam.classList.remove("active");
  fVernam.classList.add("inactive");
});

navVigenereBtn.addEventListener("click", e => {
  cipherSectionVisibilityToggleOn();
  performanceSectionVisibilityToggleOff();

  resetForms();

  fHill.classList.remove("active");
  fHill.classList.add("inactive");

  fPlayfair.classList.remove("active");
  fPlayfair.classList.add("inactive");

  fVigenere.classList.remove("inactive");
  fVigenere.classList.add("active");

  fVernam.classList.remove("active");
  fVernam.classList.add("inactive");
});

navVernamBtn.addEventListener("click", e => {
  cipherSectionVisibilityToggleOn();
  performanceSectionVisibilityToggleOff();

  resetForms();

  fHill.classList.remove("active");
  fHill.classList.add("inactive");

  fPlayfair.classList.remove("active");
  fPlayfair.classList.add("inactive");

  fVigenere.classList.remove("active");
  fVigenere.classList.add("inactive");

  fVernam.classList.remove("inactive");
  fVernam.classList.add("active");
});

performanceBtn.addEventListener("click", e => {
  cipherSectionVisibilityToggleOff();
  performanceSectionVisibilityToggleOn();
});

// hill cipher operations
hillEncrypt.addEventListener("click", async e => {
  const keyTextEncrypt = document.querySelector("#key-text-hill");
  const plainText = document.querySelector("#plain-text-hill");
  const cipherTextResult = document.querySelector("#cipher-text-result-hill");
  const outputFileName = document.querySelector("#file-e-hout");
  e.preventDefault();

  if (fileModeToggle) {
    if (
      keyTextEncrypt.value.replace(/\s+/g, "").length === 0 ||
      outputFileName.value.replace(/\s+/g, "").length === 0
    ) {
      showAlert("Key or Output File Name cannot be empty! 🤚");
      return;
    }
    console.log(fileEncryptDir);
    let result = await callJavaFile(
      3,
      keyTextEncrypt.value.replace(/\s+/g, ""),
      fileNameEncrypt,
      fileEncryptDir,
      outputFileName.value.trim(),
      "HillCipher"
    );

    if (result) {
      showAlert("Success\nFile saved at: " + fileEncryptDir);
    }
  } else {
    if (
      keyTextEncrypt.value.replace(/\s+/g, "").length === 0 ||
      plainText.value.replace(/\s+/g, "").length === 0
    ) {
      showAlert("Blank Spaces or Empty Fields are not accepted! 🤚");
      return;
    }

    callJava(
      1,
      keyTextEncrypt.value.replace(/\s+/g, ""),
      plainText.value.replace(/\s+/g, ""),
      "HillCipher",
      cipherTextResult
    );
  }
});

hillDecrypt.addEventListener("click", async e => {
  const keyTextDecrypt = document.querySelector("#key-text-decrypt-hill");
  const cipherText = document.querySelector("#cipher-text-decrypt-hill");
  const plainTextResult = document.querySelector("#plain-text-result-hill");
  const outputFileName = document.querySelector("#file-d-hout");

  e.preventDefault();
  if (fileModeToggle) {
    if (
      keyTextDecrypt.value.replace(/\s+/g, "").length === 0 ||
      outputFileName.value.replace(/\s+/g, "").length === 0
    ) {
      showAlert("Key or Output File Name cannot be empty! 🤚");
      return;
    }

    let result = await callJavaFile(
      4,
      keyTextDecrypt.value.replace(/\s+/g, ""),
      fileNameDecrypt,
      fileDecryptDir,
      outputFileName.value.trim(),
      "HillCipher"
    );

    if (result) {
      showAlert("Success \nFile save at: " + fileDecryptDir);
    }
  } else {
    if (
      keyTextDecrypt.value.replace(/\s+/g, "").length === 0 ||
      cipherText.value.replace(/\s+/g, "").length === 0
    ) {
      showAlert("Blank Spaces or Empty Fields are not accepted! 🤚");
      return;
    }

    callJava(
      2,
      keyTextDecrypt.value.replace(/\s+/g, ""),
      cipherText.value.replace(/\s+/g, ""),
      "HillCipher",
      plainTextResult
    );
  }
});

// play-fair cipher operation
playfairEncrypt.addEventListener("click", async e => {
  const keyTextEncrypt = document.querySelector("#key-text-playfair");
  const plainText = document.querySelector("#plain-text-playfair");
  const cipherTextResult = document.querySelector(
    "#cipher-text-result-playfair"
  );

  const outputFileName = document.querySelector("#file-e-pfout");

  e.preventDefault();

  if (fileModeToggle) {
    if (
      keyTextEncrypt.value.replace(/\s+/g, "").length === 0 ||
      outputFileName.value.replace(/\s+/g, "").length === 0
    ) {
      showAlert("Key or Output File Name cannot be empty! 🤚");
      return;
    }

    let result = await callJavaFile(
      3,
      keyTextEncrypt.value.replace(/\s+/g, ""),
      fileNameEncrypt,
      fileEncryptDir,
      outputFileName.value.trim(),
      "PlayFairCipher"
    );

    if (result) {
      showAlert("Success \nFile save at: " + fileEncryptDir);
    }
  } else {
    if (
      keyTextEncrypt.value.replace(/\s+/g, "").length === 0 ||
      plainText.value.replace(/\s+/g, "").length === 0
    ) {
      showAlert("Blank Spaces or Empty Fields are not accepted! 🤚");
      return;
    }

    callJava(
      1,
      keyTextEncrypt.value.replace(/\s+/g, ""),
      plainText.value.replace(/\s+/g, ""),
      "PlayFairCipher",
      cipherTextResult
    );
  }
});

playfairDecrypt.addEventListener("click", async e => {
  const keyTextDecrypt = document.querySelector("#key-text-decrypt-playfair");
  const cipherText = document.querySelector("#cipher-text-decrypt-playfair");
  const plainTextResult = document.querySelector("#plain-text-result-playfair");

  const outputFileName = document.querySelector("#file-d-pfout");

  e.preventDefault();

  if (fileModeToggle) {
    if (
      keyTextDecrypt.value.replace(/\s+/g, "").length === 0 ||
      outputFileName.value.replace(/\s+/g, "").length === 0
    ) {
      showAlert("Key or Output File Name cannot be empty! 🤚");
      return;
    }

    let result = await callJavaFile(
      4,
      keyTextDecrypt.value.replace(/\s+/g, ""),
      fileNameDecrypt,
      fileDecryptDir,
      outputFileName.value.trim(),
      "PlayFairCipher"
    );

    if (result) {
      showAlert("Success \nFile save at: " + fileDecryptDir);
    }
  } else {
    if (
      keyTextDecrypt.value.replace(/\s+/g, "").length === 0 ||
      cipherText.value.replace(/\s+/g, "").length === 0
    ) {
      showAlert("Blank Spaces or Empty Fields are not accepted! 🤚");
      return;
    }

    callJava(
      2,
      keyTextDecrypt.value.replace(/\s+/g, ""),
      cipherText.value.replace(/\s+/g, ""),
      "PlayFairCipher",
      plainTextResult
    );
  }
});

// vigenere cipher opertaion
vigenereEncrypt.addEventListener("click", async e => {
  const keyTextEncrypt = document.querySelector("#key-text-vigenere");
  const plainText = document.querySelector("#plain-text-vigenere");
  const cipherTextResult = document.querySelector(
    "#cipher-text-result-vigenere"
  );

  const outputFileName = document.querySelector("#file-e-vgout");

  e.preventDefault();

  if (fileModeToggle) {
    if (
      keyTextEncrypt.value.replace(/\s+/g, "").length === 0 ||
      outputFileName.value.replace(/\s+/g, "").length === 0
    ) {
      showAlert("Key or Output File Name cannot be empty! 🤚");
      return;
    }

    let result = await callJavaFile(
      3,
      keyTextEncrypt.value.replace(/\s+/g, ""),
      fileNameEncrypt,
      fileEncryptDir,
      outputFileName.value.trim(),
      "VigenereCipher"
    );

    if (result) {
      showAlert("Success \nFile save at: " + fileEncryptDir);
    }
  } else {
    if (
      keyTextEncrypt.value.replace(/\s+/g, "").length === 0 ||
      plainText.value.replace(/\s+/g, "").length === 0
    ) {
      showAlert("Blank Spaces or Empty Fields are not accepted! 🤚");
      return;
    }

    callJava(
      1,
      keyTextEncrypt.value.replace(/\s+/g, ""),
      plainText.value.replace(/\s+/g, ""),
      "VigenereCipher",
      cipherTextResult
    );
  }
});

vigenereDecrypt.addEventListener("click", async e => {
  const keyTextDecrypt = document.querySelector("#key-text-decrypt-vigenere");
  const cipherText = document.querySelector("#cipher-text-decrypt-vigenere");
  const plainTextResult = document.querySelector("#plain-text-result-vigenere");
  const outputFileName = document.querySelector("#file-d-vgout");

  e.preventDefault();
  if (fileModeToggle) {
    if (
      keyTextDecrypt.value.replace(/\s+/g, "").length === 0 ||
      outputFileName.value.replace(/\s+/g, "").length === 0
    ) {
      showAlert("Key or Output File Name cannot be empty! 🤚");
      return;
    }

    let result = await callJavaFile(
      4,
      keyTextDecrypt.value.replace(/\s+/g, ""),
      fileNameDecrypt,
      fileDecryptDir,
      outputFileName.value.trim(),
      "VigenereCipher"
    );

    if (result) {
      showAlert("Success \nFile save at: " + fileDecryptDir);
    }
  } else {
    if (
      keyTextDecrypt.value.replace(/\s+/g, "").length === 0 ||
      cipherText.value.replace(/\s+/g, "").length === 0
    ) {
      showAlert("Blank Spaces or Empty Fields are not accepted! 🤚");
      return;
    }

    callJava(
      2,
      keyTextDecrypt.value.replace(/\s+/g, ""),
      cipherText.value.replace(/\s+/g, ""),
      "VigenereCipher",
      plainTextResult
    );
  }
});

// vernam cipher operation
vernamEncrypt.addEventListener("click", async e => {
  const keyTextEncrypt = document.querySelector("#key-text-vernam");
  const plainText = document.querySelector("#plain-text-vernam");
  const cipherTextResult = document.querySelector("#cipher-text-result-vernam");
  const outputFileName = document.querySelector("#file-e-vrout");

  e.preventDefault();

  if (fileModeToggle) {
    if (
      keyTextEncrypt.value.replace(/\s+/g, "").length === 0 ||
      outputFileName.value.replace(/\s+/g, "").length === 0
    ) {
      showAlert("Key or Output File Name cannot be empty! 🤚");
      return;
    }

    let result = await callJavaFile(
      3,
      keyTextEncrypt.value.replace(/\s+/g, ""),
      fileNameEncrypt,
      fileEncryptDir,
      outputFileName.value.trim(),
      "VernamCipher"
    );

    if (result) {
      showAlert("Success \nFile save at: " + fileEncryptDir);
    }
  } else {
    if (
      keyTextEncrypt.value.replace(/\s+/g, "").length === 0 ||
      plainText.value.replace(/\s+/g, "").length === 0
    ) {
      showAlert("Blank Spaces or Empty Fields are not accepted! 🤚");
      return;
    }

    callJava(
      1,
      keyTextEncrypt.value.replace(/\s+/g, ""),
      plainText.value.replace(/\s+/g, ""),
      "VernamCipher",
      cipherTextResult
    );
  }
});

vernamDecrypt.addEventListener("click", async e => {
  const keyTextDecrypt = document.querySelector("#key-text-decrypt-vernam");
  const cipherText = document.querySelector("#cipher-text-decrypt-vernam");
  const plainTextResult = document.querySelector("#plain-text-result-vernam");
  const outputFileName = document.querySelector("#file-d-vrout");
  e.preventDefault();

  if (fileModeToggle) {
    if (
      keyTextDecrypt.value.replace(/\s+/g, "").length === 0 ||
      outputFileName.value.replace(/\s+/g, "").length === 0
    ) {
      showAlert("Key or Output File Name cannot be empty! 🤚");
      return;
    }

    let result = await callJavaFile(
      4,
      keyTextDecrypt.value.replace(/\s+/g, ""),
      fileNameDecrypt,
      fileDecryptDir,
      outputFileName.value.trim(),
      "VernamCipher"
    );

    if (result) {
      showAlert("Success \nFile save at: " + fileDecryptDir);
    }
  } else {
    if (
      keyTextDecrypt.value.replace(/\s+/g, "").length === 0 ||
      cipherText.value.replace(/\s+/g, "").length === 0
    ) {
      showAlert("Blank Spaces or Empty Fields are not accepted! 🤚");
      return;
    }

    callJava(
      2,
      keyTextDecrypt.value.replace(/\s+/g, ""),
      cipherText.value.replace(/\s+/g, ""),
      "VernamCipher",
      plainTextResult
    );
  }
});

// performance operation
performanceAction.addEventListener("click", async e => {
  const performanceKeyHill = document.querySelector("#performance-key-h");
  const performanceKeyPlayFair = document.querySelector("#performance-key-pf");
  const performanceKeyVernam = document.querySelector("#performance-key-ve");
  const performanceKeyVigenere = document.querySelector("#performance-key-v");
  const performanceMsg = document.querySelector("#performance-msg");

  let err = "";

  if (
    performanceKeyHill.value.replace(/\s+/g, "").length === 0 ||
    performanceKeyPlayFair.value.replace(/\s+/g, "").length === 0 ||
    performanceKeyVernam.value.replace(/\s+/g, "").length === 0 ||
    performanceKeyVigenere.value.replace(/\s+/g, "").length === 0 ||
    performanceMsg.value.replace(/\s+/g, "").length === 0
  ) {
    err += "Blank Spaces or Empty fields are not accepted\n";
  }

  // input validation
  if (
    performanceKeyHill.value.replace(/\s+/g, "").length !==
    Math.sqrt(performanceKeyHill.value.replace(/\s+/g, "").length) *
      Math.sqrt(performanceKeyHill.value.replace(/\s+/g, "").length)
  ) {
    err +=
      "HillCipher: n x n is not possible, please increase/decrease the key length\n";
  }

  if (
    performanceKeyHill.value.replace(/\s+/g, "").length >
    performanceMsg.value.replace(/\s+/g, "").length
  ) {
    err +=
      "HillCipher: Message Lenght must be greater or equal to Key Length\n";
  }
  if (performanceKeyVernam.value.length !== performanceMsg.value.length) {
    err += "VernamCipher: Message Lenght must be equal to Key Length\n";
  }

  if (err.length > 0) {
    e.preventDefault();
    showAlert(err);
    return;
  }

  resultArr[0] = await callJava(
    1,
    performanceKeyHill.value.replace(/\s+/g, ""),
    performanceMsg.value.replace(/\s+/g, ""),
    "HillCipher"
  );

  resultArr[1] = await callJava(
    1,
    performanceKeyPlayFair.value.replace(/\s+/g, ""),
    performanceMsg.value.replace(/\s+/g, ""),
    "PlayFairCipher"
  );

  resultArr[2] = await callJava(
    1,
    performanceKeyVernam.value.replace(/\s+/g, ""),
    performanceMsg.value.replace(/\s+/g, ""),
    "VernamCipher"
  );

  resultArr[3] = await callJava(
    1,
    performanceKeyVigenere.value.replace(/\s+/g, ""),
    performanceMsg.value.replace(/\s+/g, ""),
    "VigenereCipher"
  );

  cpuBtn.classList.add("btn-active");
  memoryBtn.classList.remove("btn-active");
  timeBtn.classList.remove("btn-active");

  generateChart(
    resultArr[0][2],
    resultArr[1][2],
    resultArr[2][2],
    resultArr[3][2],
    "Seconds",
    "CPU USAGE TIME"
  );
});

cpuBtn.addEventListener("click", e => {
  e.preventDefault();

  cpuBtn.classList.add("btn-active");
  timeBtn.classList.remove("btn-active");
  memoryBtn.classList.remove("btn-active");

  generateChart(
    resultArr[0][2],
    resultArr[1][2],
    resultArr[2][2],
    resultArr[3][2],
    "Seconds",
    "CPU USAGE TIME"
  );
});

memoryBtn.addEventListener("click", e => {
  e.preventDefault();

  cpuBtn.classList.remove("btn-active");
  timeBtn.classList.remove("btn-active");
  memoryBtn.classList.add("btn-active");

  generateChart(
    resultArr[0][1],
    resultArr[1][1],
    resultArr[2][1],
    resultArr[3][1],
    "MB",
    "MEMORY USAGE"
  );
});

timeBtn.addEventListener("click", e => {
  e.preventDefault();

  cpuBtn.classList.remove("btn-active");
  timeBtn.classList.add("btn-active");
  memoryBtn.classList.remove("btn-active");

  generateChart(
    resultArr[0][0],
    resultArr[1][0],
    resultArr[2][0],
    resultArr[3][0],
    "Seconds",
    "TOTAL EXECUTION TIME"
  );
});

// file operation
fileMode.addEventListener("click", e => {
  resetForms();
  if (!fileModeToggle) {
    fileMode.textContent = "INPUT MODE";
    fileModeToggle = !fileModeToggle;
    hideInputContentForFileMode();
  } else {
    fileMode.textContent = "FILE MODE";
    fileModeToggle = !fileModeToggle;
    displayInputContentForInputMode();
  }
});

hillFileEncrypt.addEventListener("change", e => {
  if (!validateFileSelector(e)) {
    return;
  }

  hillELabel.textContent = e.target.files[0].name;

  encryptFileState(
    e.target.files[0].name,
    path.parse(e.target.files[0].path).dir
  );
});

hillFileDecrypt.addEventListener("change", e => {
  if (!validateFileSelector(e)) {
    return;
  }

  hillDLabel.textContent = e.target.files[0].name;

  decryptFileState(
    e.target.files[0].name,
    path.parse(e.target.files[0].path).dir
  );
});

playFairFileEncrypt.addEventListener("change", e => {
  if (!validateFileSelector(e)) {
    return;
  }

  playFairELabel.textContent = e.target.files[0].name;

  encryptFileState(
    e.target.files[0].name,
    path.parse(e.target.files[0].path).dir
  );
});

playFairFileDecrypt.addEventListener("change", e => {
  if (!validateFileSelector(e)) {
    return;
  }

  playFairDLabel.textContent = e.target.files[0].name;

  decryptFileState(
    e.target.files[0].name,
    path.parse(e.target.files[0].path).dir
  );
});

vigenereFileEncrypt.addEventListener("change", e => {
  if (!validateFileSelector(e)) {
    return;
  }

  vigenereELabel.textContent = e.target.files[0].name;

  encryptFileState(
    e.target.files[0].name,
    path.parse(e.target.files[0].path).dir
  );
});

vigenereFileDecrypt.addEventListener("change", e => {
  if (!validateFileSelector(e)) {
    return;
  }

  vigenereDLabel.textContent = e.target.files[0].name;

  decryptFileState(
    e.target.files[0].name,
    path.parse(e.target.files[0].path).dir
  );
});

vernamFileEncrypt.addEventListener("change", e => {
  if (!validateFileSelector(e)) {
    return;
  }

  vernamELabel.textContent = e.target.files[0].name;

  encryptFileState(
    e.target.files[0].name,
    path.parse(e.target.files[0].path).dir
  );
});

vernamFileDecrypt.addEventListener("change", e => {
  if (!validateFileSelector(e)) {
    return;
  }

  vernamDLabel.textContent = e.target.files[0].name;

  decryptFileState(
    e.target.files[0].name,
    path.parse(e.target.files[0].path).dir
  );
});
