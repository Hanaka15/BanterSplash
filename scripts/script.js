// Define all variables
const textInput = $('#textInput'); // Input field for text
const colorInputsContainer = $('#colorInputs'); // Container for color inputs
const output = $('#output'); // Output container for colored text
const textAreaOutput = $('#textAreaOutput'); // Text area for output
const copyButton = $('#copyButton'); // Copy button

/**
 * Creates a color input element.
 * @param {string} value - Initial value for the color input.
 * @returns {jQuery} - The jQuery color input element.
 */
function createColorInput(value) {
  return $('<input>')
    .addClass('colorInput form-control form-control-color')
    .attr('type', 'color')
    .val(value);
}

/**
 * Creates a remove button for color input.
 * @returns {jQuery} - The jQuery remove button element.
 */
function createRemoveButton() {
  return $('<button>')
    .addClass('removeColor btn btn-danger btn-sm')
    .html('<i class="fas fa-times"></i>')
    .on('click', function() {
      $(this)
        .closest('.colorInputContainer')
        .remove();
      updateOutputAndResize();
    });
}

/**
 * Adds a color input element to the container.
 * @param {string} colorValue - Initial color value.
 */
function addColorInputToContainer(colorValue) {
  const colorInput = createColorInput(colorValue);
  const removeButton = createRemoveButton();
  const colorInputContainer = $('<div>')
    .addClass('colorInputContainer position-relative d-inline-block me-2 mb-2')
    .append(colorInput)
    .append(removeButton);
  colorInputsContainer.append(colorInputContainer);
  colorInputContainer.trigger('colorCreated');
}

/**
 * Updates the output and resizes it.
 */
function updateOutputAndResize() {
  const text = textInput.val();
  const colors = getColors();
  const colorOutput = colors.length > 0 ? applyColorsToText(text, colors) : {
    html: text,
    text: text
  };
  output.html(colorOutput.html);
  textAreaOutput.text(colorOutput.text);
  autoResizeDiv();
}

/**
 * Copies the text output to clipboard and updates the copy button text.
 */
function copyToClipboard() {
    const textToCopy = textAreaOutput.text();
    navigator.clipboard.writeText(textToCopy)
    const originalText = copyButton.text();
    copyButton.text('Copied!');
    setTimeout(() => {
        copyButton.text(originalText);
    }, 2000);
}

/**
 * Gets colors from color inputs.
 * @returns {string[]} - Array of color values.
 */
function getColors() {
  return $('.colorInput')
    .map((_, el) => $(el)
      .val())
    .get();
}

/**
 * Applies colors to the text.
 * @param {string} text - Input text.
 * @param {string[]} colors - Array of color values.
 * @returns {Object} - Object containing HTML and text with applied colors.
 */
function applyColorsToText(text, colors) {
    const nonSpaceLength = text.replace(/\s/g, '')
      .length;
    const colorScale = chroma.scale(colors)
      .mode('lch')
      .colors(nonSpaceLength);
    let htmlOutput = '';
    let textOutput = '';
    let lastColor = null;
    let colorIndex = 0;
    for (let char of text) {
      const isSpace = !char.trim();
      const currentColor = isSpace ? lastColor : colorScale[colorIndex];
      if (!isSpace) colorIndex++;
      if (currentColor !== lastColor && !isSpace) {
        textOutput += `<${currentColor}>`;
        lastColor = currentColor;
      }
      htmlOutput += `<span style="color:${currentColor}">${char}</span>`;
      textOutput += char;
    }
    if (colors.length > 0 && textOutput) {
      textOutput = `(ノಠ益ಠ)ノ${textOutput}</color>`;
    }
    return {
      html: htmlOutput,
      text: textOutput
    };
  }

/**
 * Auto resizes the output div.
 */
function autoResizeDiv() {
textAreaOutput.css('height', 'auto');
  const newHeight = textAreaOutput[0].scrollHeight;
  textAreaOutput.css('height', newHeight + 'px');
}

/**
 * Initializes dark mode toggle.
 */
function initializeDarkModeToggle() {
  const darkModeToggle = $('#darkModeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')
    .matches;
  if (prefersDarkScheme) {
    toggleDarkMode(true);
    darkModeToggle.prop('checked', true);
  }
  darkModeToggle.on('change', () => {
    toggleDarkMode(darkModeToggle.is(':checked'));
  });
}

/**
 * Toggles dark mode.
 * @param {boolean} isDark - Indicates if dark mode is enabled.
 */
function toggleDarkMode(isDark) {
  $('body')
    .toggleClass('bg-dark text-white', isDark);
}

// Add event listeners
colorInputsContainer.on('input', '.colorInput', function() {
  updateOutputAndResize();
  $(this)
    .trigger('colorValueChanged');
});
colorInputsContainer.on('colorCreated', '.colorInputContainer', function() {
  updateOutputAndResize();
});
textInput.on('input', function() {
  updateOutputAndResize();
  $(this)
    .trigger('textChanged');
});
$('#addColor').on('click', () => addColorInputToContainer('#ffffff'));
copyButton.on('click', () => copyToClipboard());

// Initialize dark mode toggle
initializeDarkModeToggle();

// Add initial color inputs
addColorInputToContainer('#ff0000');
addColorInputToContainer('#0000ff');

// Initial resize
autoResizeDiv();