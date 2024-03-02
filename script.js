const upperCaseCheck = document.querySelector("#upperCase");
const lowerCaseCheck = document.querySelector("#lowerCase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");

const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const generateBtn = document.querySelector(".generateBtn");
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-pwdDisplay]");

// initilization valule
let password = "";
let passwordLength = 10;
let checkCount = 0;

// function bgColor() {
//     if (passwordLength < 7) {
//         document.body.style.backgroundColor = "#D1364E";
//     }
//     else if (passwordLength >= 7 && passwordLength <= 9) {
//         document.body.style.backgroundColor = "#BE4E3A";
//     } else {
//         document.body.style.backgroundColor = "#1C815A";
//     }
// }

handleSlider();
// set strength circle to gray
// set Password Length              
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "%100%";
}
setIndicator("#ccc");
function setIndicator(color) {
    // color set and strength
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

// getRandom Integer
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRndNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}
const symbols = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'

function generateSymbol() {
    const rndNum = getRndInteger(0, symbols.length);
    return symbols.charAt(rndNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (upperCaseCheck.checked) hasUpper = true;
    if (lowerCaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6
    ) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}
let copyBtn = document.querySelector("[data-copy]");
let copyMsg = document.querySelector("[data-copyMsg]");
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}
copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) {
        copyContent();
    }

});

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });
    // special case
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange)
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
})

// generate password

generateBtn.addEventListener('click', () => {
    // none of the checkbox are selected
    if (checkCount == 0) return;

    // special case
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let funcArr = [];

    if (upperCaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }
    if (lowerCaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }
    if (numbersCheck.checked) {
        funcArr.push(generateRndNumber);
    }
    if (symbolsCheck.checked) {
        funcArr.push(generateSymbol);
    }

    // addition to password
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    // remaining additions
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndx = getRndInteger(0, funcArr.length);
        password += funcArr[randIndx]();
    }

    // shuffling the password
    password = shufflePassword(Array.from(password));

    // showing password in UI
    passwordDisplay.value = password;

    // calc strenght
    calcStrength();
});

// shuffling the password
function shufflePassword(array) {
    // Fisher Yates Method -> applies on array
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = " ";
    array.forEach((el) => { str += el });
    return str;
}