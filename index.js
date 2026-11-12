

const input = document.getElementById("input");
const output = document.getElementById("output");
let resetNext = false;
let resultIsError = false;
let history = [];
let historyIndex = -1;

function resetIfNext() {
    if (resetNext) {

        if (!resultIsError && output.innerText.length > 2) {
            input.value = output.innerText.substring(2);
        } else {
            input.value = "";
        }
        output.innerHTML = "";
        resetNext = false;
        resultIsError = false;
    }
}


try {
    if (window.sessionStorage) {
        const rawHistory = sessionStorage.getItem("history");
        if (rawHistory != null) {
            history = JSON.parse(rawHistory);
            historyIndex = history.length;
        }
    }
} catch (err) {
    console.error("Error loading history:", err);
}

for (let i = 0; i <= 9; i++) {
    document.getElementById("n" + i).addEventListener("click", () => {
        resetIfNext();
        input.value += i;
    });
}

function calc() {

    if (input.value.trim() === "") {
        return;
    }

    let result;
    try {
        result = eval(input.value.replaceAll("^", "**"));
        resultIsError = false;
    } catch (err) {
        console.error("Invalid input:", err);
        result = "invalid input";
        resultIsError = true;
    }
    output.innerText = "= " + result;
    resetNext = true;

    history.push(input.value);
    historyIndex = history.length;
    try {
        if (window.sessionStorage) {
            sessionStorage.setItem("history", JSON.stringify(history));
        }
    } catch (err) {
        console.error("Error saving history:", err);
    }
}

document.getElementById("calc").addEventListener("click", () => {
    calc();
});


window.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.repeat) {
        event.preventDefault();
        calc();
    }
});


input.addEventListener("input", () => {
    output.innerHTML = "";
    resetNext = false;
    resultIsError = false;
});

document.getElementById("prev").addEventListener("click", () => {
    output.innerHTML = "";
    resetNext = false;
    resultIsError = false;
    if (historyIndex - 1 >= 0) {
        historyIndex--;
        input.value = history[historyIndex];
    }
});

document.getElementById("next").addEventListener("click", () => {
    output.innerHTML = "";
    resetNext = false;
    resultIsError = false;
    if (historyIndex + 1 <= history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
    } else {
        historyIndex = history.length;
        input.value = "";
    }
});

document.getElementById("multiply").addEventListener("click", () => {
    resetIfNext();
    input.value += "*";
});
document.getElementById("divide").addEventListener("click", () => {
    resetIfNext();
    input.value += "/";
});
document.getElementById("plus").addEventListener("click", () => {
    resetIfNext();
    input.value += "+";
});
document.getElementById("minus").addEventListener("click", () => {
    resetIfNext();
    input.value += "-";
});


const extraButtons = {
    percent: "%",
    power: "**",
    open: "(",
    close: ")",
};
for (const [id, symbol] of Object.entries(extraButtons)) {
    document.getElementById(id).addEventListener("click", () => {
        resetIfNext();
        input.value += symbol;
    });
}

