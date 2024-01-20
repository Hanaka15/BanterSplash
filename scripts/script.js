$(document).ready(function() {
    const $textInput = $('#textInput');
    const $colorInputsContainer = $('#colorInputs');
    const $output = $('#output');
    const $textAreaOutput = $('#textAreaOutput');

    function createColorInput(value) {
        return $('<input>').addClass('colorInput form-control form-control-color')
                           .attr('type', 'color')
                           .val(value);
    }

    function createRemoveButton() {
        return $('<button>')
            .addClass('removeColor btn btn-danger btn-sm')
            .html('<i class="fas fa-times"></i>')
            .on('click', function() {
                $(this).closest('.colorInputContainer').remove();
                updateOutputAndResize();
            });
    }

    function addColorInputToContainer(colorValue) {
        const $colorInput = createColorInput(colorValue);
        const $removeButton = createRemoveButton();
        const $colorInputContainer = $('<div>').addClass('colorInputContainer position-relative d-inline-block me-2 mb-2')
                                               .append($colorInput)
                                               .append($removeButton);
        $colorInputsContainer.append($colorInputContainer);
        
        $colorInputContainer.trigger('colorCreated');
    }

    function autoResizeDiv() {
        const $outputDiv = $('#textAreaOutput');
        $outputDiv.css('height', 'auto');
        const newHeight = $outputDiv[0].scrollHeight;
        $outputDiv.css('height', newHeight + 'px');
    }

    function updateOutputAndResize() {
        const text = $textInput.val();
        const colors = getColors();
        const colorOutput = colors.length > 0 ? applyColorsToText(text, colors) : { html: text, text: text };

        $output.html(colorOutput.html);
        $textAreaOutput.text(colorOutput.text);
        autoResizeDiv();
    }

    function getColors() {
        return $('.colorInput').map((_, el) => $(el).val()).get();
    }

    function applyColorsToText(text, colors) {
        const nonSpaceLength = text.replace(/\s/g, '').length;
        const colorScale = chroma.scale(colors).mode('lch').colors(nonSpaceLength);
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

        return { html: htmlOutput, text: textOutput };
    }

    $colorInputsContainer.on('input', '.colorInput', function() {
        updateOutputAndResize();
        $(this).trigger('colorValueChanged');
    });

    $colorInputsContainer.on('colorCreated', '.colorInputContainer', function() {
        updateOutputAndResize();
    });

    $textInput.on('input', function() {
        updateOutputAndResize();
        $(this).trigger('textChanged');
    });

    $('#addColor').on('click', () => addColorInputToContainer('#ffffff'));
    
    addColorInputToContainer('#ff0000');
    addColorInputToContainer('#0000ff');

    autoResizeDiv();

    function initializeDarkModeToggle() {
        const $darkModeToggle = $('#darkModeToggle');
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (prefersDarkScheme) {
            toggleDarkMode(true);
            $darkModeToggle.prop('checked', true);
        }

        $darkModeToggle.on('change', () => {
            toggleDarkMode($darkModeToggle.is(':checked'));
        });
    }

    function toggleDarkMode(isDark) {
        $('body').toggleClass('bg-dark text-white', isDark);
    }

    initializeDarkModeToggle();
});
