function format(command, value = null) {
    document.execCommand(command, false, value);
}

document.getElementById('editor').addEventListener('input', function() {
});


function changeTextSize(size) {
    let fontSize;
    switch (size) {
        case 'small': fontSize = '1'; break; // Smallest size
        case 'medium': fontSize = '3'; break; // Medium size
        case 'large': fontSize = '5'; break; // Larger size
        // Map more sizes as needed
        default: fontSize = '3'; // Default size
    }

    document.execCommand("fontSize", false, fontSize);
}

function convertHtmlToUnityRichText(htmlContent) {
    let unityRichText = htmlContent;

    // Convert basic tags: bold, italic, underline, and line breaks
    unityRichText = unityRichText.replace(/<b>(.*?)<\/b>/gi, "<b>$1</b>");
    unityRichText = unityRichText.replace(/<i>(.*?)<\/i>/gi, "<i>$1</i>");
    unityRichText = unityRichText.replace(/<u>(.*?)<\/u>/gi, "<u>$1</u>");
    unityRichText = unityRichText.replace(/<br>/gi, "\n");

    // Convert RGB font color to HEX
    unityRichText = unityRichText.replace(
        /<span style="color: rgb\((\d+), (\d+), (\d+)\);?">(.*?)<\/span>/gi,
        (match, p1, p2, p3, p4) => {
            let hexColor = rgbToHex(parseInt(p1), parseInt(p2), parseInt(p3));
            return `<color=#${hexColor}>${p4}</color>`;
        }
    );
    return unityRichText;
}

function rgbToHex(r, g, b) {
    return ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}



document.getElementById('foreColorButton').addEventListener('click', function() {
    document.getElementById('foreColorPicker').click();
});

document.getElementById('foreColorPicker').addEventListener('change', function() {
    format('foreColor', this.value);
});

document.getElementById('bgColorButton').addEventListener('click', function() {
    document.getElementById('bgColorPicker').click();
});

document.getElementById('bgColorPicker').addEventListener('change', function() {
    format('backColor', this.value);
});

document.getElementById('editor').addEventListener('input', function() {
    document.getElementById('output').value = convertHtmlToUnityRichText(this.innerHTML);
});

document.getElementById('editor').addEventListener('input', function() {
    document.getElementById('preview').innerHTML = this.innerHTML;
});