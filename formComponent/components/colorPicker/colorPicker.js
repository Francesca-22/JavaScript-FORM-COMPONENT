import * as fade from "../modules/fade.js";
import * as colorConversion from "../modules/colorConversion.js";

// setta width ed height del tag canvas e lancia la funzione per creare il colore
function setCanvas(inputTag, canvasWrapper, canvasCircleWrapper, canvas, brightnessRange, writeColorBox) {
    if (inputTag.offsetWidth < parseInt(canvasWrapper.getAttribute('data-width'))) {
        if (inputTag.offsetWidth <= parseFloat(getComputedStyle(canvasWrapper).minWidth)) {
            canvasWrapper.style.width = parseFloat(getComputedStyle(canvasWrapper).minWidth) + 'px'
        } else {
            canvasWrapper.style.width = inputTag.offsetWidth + 'px'
        }
    } else {
        canvasWrapper.style.width = canvasWrapper.getAttribute('data-width')
    }

    let canvasWrapperWidth = parseFloat(getComputedStyle(canvasWrapper).width)
    let brightnessRangeHeight = parseFloat(getComputedStyle(brightnessRange).height)
    let writeColorBoxHeight = parseFloat(getComputedStyle(writeColorBox).height)

    canvasCircleWrapper.style.width = canvasWrapperWidth - 10 - 2 + 'px'
    canvasCircleWrapper.style.height = canvasWrapperWidth - 10 - 2 + 'px'
    canvas.setAttribute('width', canvasWrapperWidth - 10)
    canvas.setAttribute('height', canvasWrapperWidth - 10)
    brightnessRange.style.top = canvasWrapperWidth - 10 - 2 + 25 + 'px'
    writeColorBox.style.top = canvasWrapperWidth - 10 - 2 + 25 + brightnessRangeHeight + 20 + 'px'
    canvasWrapper.style.height = canvasWrapperWidth - 10 - 2 + 25 + brightnessRangeHeight + 20 + writeColorBoxHeight + 25 + 'px'
    setCanvasPosition(inputTag, canvasWrapper)
    drawColors(canvas)
}

function setCanvasPosition(inputTag, canvasWrapper) {
    if (parseFloat(getComputedStyle(canvasWrapper).width) > inputTag.offsetWidth) {
        if (getOffset(inputTag).left > getOffset(inputTag).right) {
            canvasWrapper.style.left = '-' + (parseFloat(getComputedStyle(canvasWrapper).width) - inputTag.offsetWidth) + 'px'
        } else {
            canvasWrapper.style.left = '0px'
        }
    } else {
        canvasWrapper.style.left = '0px'
    }
}

function getOffset(elem) {
    var box = elem.getBoundingClientRect();
    var left = window.pageXOffset !== undefined ? window.pageXOffset : 
        (document.documentElement || document.body.parentNode || document.body).scrollLeft;
    var top = window.pageYOffset !== undefined ? window.pageYOffset : 
        (document.documentElement || document.body.parentNode || document.body).scrollTop;
    return { left: box.left + left, top: box.top + top, right: document.body.clientWidth - (box.left + left + elem.offsetWidth) };
}

// crea tag canvas passato lo spettro dei colori da chiari a scuri
function drawColors(canvas) {
    const context = canvas.getContext('2d');
    const { width, height } = canvas;

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);

    context.beginPath();

    //Colors - horizontal gradient
    context.arc((width / 2), (width / 2), (width / 2), 0, 2 * Math.PI);

    const gradientH = context.createConicGradient(0, (width / 2), (width / 2));
    gradientH.addColorStop(0, "rgb(255, 0, 0)"); // red
    gradientH.addColorStop(1 / 6, "rgb(255, 255, 0)"); // yellow
    gradientH.addColorStop(2 / 6, "rgb(0, 255, 0)"); // green
    gradientH.addColorStop(3 / 6, "rgb(0, 255, 255)");
    gradientH.addColorStop(4 / 6, "rgb(0, 0, 255)"); // blue
    gradientH.addColorStop(5 / 6, "rgb(255, 0, 255)");
    gradientH.addColorStop(1, "rgb(255, 0, 0)"); // red
    context.fillStyle = gradientH
    context.fill()

    const gradientV = context.createRadialGradient((width / 2), (width / 2), 8, (width / 2), (width / 2), (width / 2));
    gradientV.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradientV.addColorStop(0.05, 'rgba(255, 255, 255, 1)');
    gradientV.addColorStop(.9, 'rgba(255, 255, 255, 0)');

    context.fillStyle = gradientV;
    context.fill()
}

// filtro per scurire i colori o schiarire
function setColorDarkenRange(canvasWrapper, canvas, darkenRange) {
    const context = canvas.getContext('2d');
    drawColors(canvas, canvasWrapper)
    context.save();
    if (darkenRange.value > 0) {
        context.globalCompositeOperation = "multiply";
        context.fillStyle = "black";
        context.globalAlpha = darkenRange.value / 100;
        context.fill();
    }
    context.restore();
}

// return picked color
function returnPickedColor(eventOffsetX, eventOffsetY, canvas) {
    var canvasContext = canvas.getContext('2d', { willReadFrequently: true })
    var imgData = canvasContext.getImageData(eventOffsetX, eventOffsetY, 1, 1);
    var rgba = imgData.data;
    var hex = colorConversion.RGBToHex(rgba)
    let color = hex
    return color
}

// vedi colore selezionato e setta value
function setPickedColorAsValue(inputColor, pickedColorBox, pickedColor, inputWriteColorHex, inputWriteColorRgb, inputWriteColorHsl) {
    inputColor.value = pickedColor
    pickedColorBox.style.backgroundColor = inputColor.value
    setWriteColorBox(inputColor, inputWriteColorHex, inputWriteColorRgb, inputWriteColorHsl)
}


// prova
function getPositionFromColor(ctx, color, circlePicker, canvasCircleWrapper) {
    var w = ctx.canvas.width,
        h = ctx.canvas.height,
        data = ctx.getImageData(0, 0, w, h), /// get image data
        buffer = data.data,                  /// and its pixel buffer
        len = buffer.length,                 /// cache length
        x, y = 0, p, px;                     /// for iterating

    /// iterating x/y instead of forward to get position the easy way
    for(;y < h; y++) {

        /// common value for all x
        p = y * 4 * w;

        for(x = 0; x < w; x++) {

            /// next pixel (skipping 4 bytes as each pixel is RGBA bytes)
            px = p + x * 4;

            /// if red component match check the others
            if (buffer[px] === color[0]) {

                if (buffer[px + 1] === color[1] &&
                    buffer[px + 2] === color[2]) {

                    moveCirclePickerToInputColor(x,y,circlePicker, canvasCircleWrapper)

                    return [x, y];
                }
            }
        }
    }
    return null;
}

function findColor(inputRange, colorValue, colorPickerCanvas, colorPickerCircle, colorPickerWrapper, canvasCircleWrapper) {
    if (colorValue !== '#ffffff' && colorValue !== '#000000') {
        var colorValueRgba = colorConversion.hexToRGB(colorValue)
        for (let i = 0; i < 101; i++) {
            inputRange.value = i
            setColorDarkenRange(colorPickerWrapper, colorPickerCanvas, inputRange)
            const pos = getPositionFromColor(colorPickerCanvas.getContext('2d', { willReadFrequently: true }), colorValueRgba, colorPickerCircle, canvasCircleWrapper)
            if (pos !== null) {
                break;
            }
            if (i === 100 && pos === null) {
                inputRange.value = 0
                setColorDarkenRange(colorPickerWrapper, colorPickerCanvas, inputRange)
                setCirclePicker(canvasCircleWrapper, colorPickerCanvas, colorPickerCircle)
                break;
            }
        }
    } else if (colorValue === '#ffffff') {
        inputRange.value = 0
        setColorDarkenRange(colorPickerWrapper, colorPickerCanvas, inputRange)
        setCirclePicker(canvasCircleWrapper, colorPickerCanvas, colorPickerCircle)
    } else if (colorValue === '#000000') {
        inputRange.value = 100
        setColorDarkenRange(colorPickerWrapper, colorPickerCanvas, inputRange)
        setCirclePicker(canvasCircleWrapper, colorPickerCanvas, colorPickerCircle)
    }
}

function moveCirclePickerToInputColor(x, y, circlePicker, canvasCircleWrapper) {
    circlePicker.style.left = x - (circlePicker.offsetWidth / 2) + parseFloat(getComputedStyle(canvasCircleWrapper).marginLeft) + 'px'
    circlePicker.style.top = y - (circlePicker.offsetHeight / 2) + parseFloat(getComputedStyle(canvasCircleWrapper).marginTop) + 'px'
}

function setCirclePicker(canvasCircleWrapper, canvas, circlePicker) {
    circlePicker.style.left = (parseFloat(getComputedStyle(canvas).width) / 2) - (circlePicker.offsetWidth / 2) + parseFloat(getComputedStyle(canvasCircleWrapper).marginLeft) + 'px'
    circlePicker.style.top = (parseFloat(getComputedStyle(canvas).height) / 2) - (circlePicker.offsetHeight / 2) + parseFloat(getComputedStyle(canvasCircleWrapper).marginTop) + 'px'
}

function moveCirclePicker(event, canvasCircleWrapper, circlePicker) {
    circlePicker.style.left = event.clientX - canvasCircleWrapper.getBoundingClientRect().left - (circlePicker.offsetWidth / 2) + parseFloat(getComputedStyle(canvasCircleWrapper).marginLeft) + 'px'
    circlePicker.style.top = event.clientY - canvasCircleWrapper.getBoundingClientRect().top - (circlePicker.offsetHeight / 2) + parseFloat(getComputedStyle(canvasCircleWrapper).marginTop) + 'px'
}

// apre il color picker
function openColorPickerWrapper(inputTagId, documentShadowRoot) {
    let colorPickerWrapperActive = documentShadowRoot.querySelector('.color-picker-wrapper-active')
    let activeColorPickerWrapper = documentShadowRoot.querySelector(`#color-picker-wrapper-${inputTagId}`)

    if (colorPickerWrapperActive !== null) {
        fade.fadeOut(colorPickerWrapperActive, 20)
        colorPickerWrapperActive.classList.remove('color-picker-wrapper-active')
    }

    fade.fadeIn(activeColorPickerWrapper, 20)
    activeColorPickerWrapper.classList.add('color-picker-wrapper-active')
}

function closeColorPickerWrapper(inputTag, inputTagId, documentShadowRoot) {
    let currentActiveColorPickerWrapper = documentShadowRoot.querySelector(`#color-picker-wrapper-${inputTagId}`)
    fade.fadeOut(currentActiveColorPickerWrapper, 20)
    currentActiveColorPickerWrapper.classList.remove('color-picker-wrapper-active')
    inputTag.dispatchEvent(new Event('blur', { bubbles: true }));
}

// color format labels
function setWriteColorBox(inputColor, inputWriteColorHex, inputWriteColorRgb, inputWriteColorHsl) {
    inputWriteColorHex.value = inputColor.value
    inputWriteColorRgb.value = colorConversion.hexToRGB(inputColor.value)
    inputWriteColorHsl.value = colorConversion.RGBToHSL(colorConversion.hexToRGB(inputColor.value))
}

function allColorFormatInputsAndLabelsRemoveActive(colorFormatLabels, colorFormatInputs) {
    colorFormatLabels.forEach(label => {
        if (label.classList.contains('color-picker-write-color-label-active')) {
            label.classList.remove('color-picker-write-color-label-active')
        }
    });
    colorFormatInputs.forEach(input => {
        if (input.classList.contains('color-picker-write-color-input-active')) {
            input.classList.remove('color-picker-write-color-input-active')
        }
    });
}

function stopInputWriteColor(e, inputWriteColorId) {
    if (inputWriteColorId.includes('HEX')) {
        e.composedPath()[0].value = e.composedPath()[0].value.replace(/[^a-fA-F0-9#]/g, '')
    }
    if (inputWriteColorId.includes('RGB')) {
        e.composedPath()[0].value = e.composedPath()[0].value.replace(/[^0-9,]/g, '')
    }
    if (inputWriteColorId.includes('HSL')) {
        e.composedPath()[0].value = e.composedPath()[0].value.replace(/[^0-9,%]/g, '')
    }
}
// FINE TOOLS



// per ogni input color
export function startColorPicker (documentShadowRoot, allInputColorInsideForm) {
    // crea il contenitore con il color picker
    allInputColorInsideForm.forEach(inputColor => {
        let inputColorId = inputColor.id
        let pickedColorBox = documentShadowRoot.querySelector(`[data-color-selected-for=${inputColorId}]`)
        let inputFeedbackContainer = documentShadowRoot.querySelector(`#invalid-feedback-${inputColorId}`)

        const colorPickerWrapper = document.createElement('div')
        colorPickerWrapper.setAttribute(`${inputColor.getAttribute('data-attibute-to-add-for-color-picker-label-wrapper')}`, `${inputColorId}`)
        colorPickerWrapper.classList.add('color-picker-wrapper')
        colorPickerWrapper.setAttribute('id', `color-picker-wrapper-${inputColorId}`)
        colorPickerWrapper.setAttribute('data-width', '230px')
        const colorPickerCanvasCircleWrapper = document.createElement('div')
        colorPickerCanvasCircleWrapper.classList.add('color-picker-canvas-circle-wrapper')
        const colorPickerCanvas = document.createElement('canvas')
        colorPickerCanvas.classList.add('color-picker-canvas')
        const colorPickerCircle = document.createElement('div')
        colorPickerCircle.classList.add('color-picker-circle')
        const colorPickerDarkenInputRange = document.createElement('input')
        colorPickerDarkenInputRange.setAttribute('tabindex', '-1')
        colorPickerDarkenInputRange.setAttribute('type', 'range')
        colorPickerDarkenInputRange.setAttribute('min', '0')
        colorPickerDarkenInputRange.setAttribute('max', '100')
        colorPickerDarkenInputRange.setAttribute('step', '1')
        colorPickerDarkenInputRange.setAttribute('value', '0')
        colorPickerDarkenInputRange.classList.add('color-picker-darken-input-range')
        const colorPickerWriteColorFormBox = document.createElement('form')
        colorPickerWriteColorFormBox.setAttribute('action','javascript:;')
        colorPickerWriteColorFormBox.setAttribute('novalidate','')
        colorPickerWriteColorFormBox.setAttribute('autocomplete','off')
        colorPickerWriteColorFormBox.setAttribute('spellcheck','false')
        colorPickerWriteColorFormBox.classList.add('color-picker-write-color-box')
        const colorPickerWriteColorHexLabel = document.createElement('label')
        colorPickerWriteColorHexLabel.setAttribute('for', `HEX-${inputColorId}`)
        colorPickerWriteColorHexLabel.classList.add('color-picker-write-color-label')
        colorPickerWriteColorHexLabel.classList.add('color-picker-write-color-label-active')
        colorPickerWriteColorHexLabel.innerText = 'HEX'
        const colorPickerWriteColorRgbLabel = document.createElement('label')
        colorPickerWriteColorRgbLabel.setAttribute('for', `RGB-${inputColorId}`)
        colorPickerWriteColorRgbLabel.classList.add('color-picker-write-color-label')
        colorPickerWriteColorRgbLabel.innerText = 'RGB'
        const colorPickerWriteColorHslLabel = document.createElement('label')
        colorPickerWriteColorHslLabel.setAttribute('for', `HSL-${inputColorId}`)
        colorPickerWriteColorHslLabel.classList.add('color-picker-write-color-label')
        colorPickerWriteColorHslLabel.innerText = 'HSL'
        const colorPickerWriteColorHexInput = document.createElement('input')
        colorPickerWriteColorHexInput.setAttribute('tabindex', '-1')
        colorPickerWriteColorHexInput.setAttribute('id', `HEX-${inputColorId}`)
        colorPickerWriteColorHexInput.setAttribute('type', `text`)
        colorPickerWriteColorHexInput.classList.add('color-picker-write-color-input')
        colorPickerWriteColorHexInput.classList.add('color-picker-write-color-input-active')
        colorPickerWriteColorHexInput.maxLength = 7
        const colorPickerWriteColorRgbInput = document.createElement('input')
        colorPickerWriteColorRgbInput.setAttribute('tabindex', '-1')
        colorPickerWriteColorRgbInput.setAttribute('id', `RGB-${inputColorId}`)
        colorPickerWriteColorRgbInput.setAttribute('type', `text`)
        colorPickerWriteColorRgbInput.classList.add('color-picker-write-color-input')
        colorPickerWriteColorRgbInput.maxLength = 11
        const colorPickerWriteColorHslInput = document.createElement('input')
        colorPickerWriteColorHslInput.setAttribute('tabindex', '-1')
        colorPickerWriteColorHslInput.setAttribute('id', `HSL-${inputColorId}`)
        colorPickerWriteColorHslInput.setAttribute('type', `text`)
        colorPickerWriteColorHslInput.classList.add('color-picker-write-color-input')
        colorPickerWriteColorHslInput.maxLength = 13
        const colorPickerWriteColorButton = document.createElement('button')
        colorPickerWriteColorButton.setAttribute('tabindex', '-1')
        colorPickerWriteColorButton.classList.add('color-picker-write-color-button')
        colorPickerWriteColorButton.setAttribute('type','submit')
        colorPickerWriteColorButton.setAttribute('data-for', `HEX-${inputColorId}`)
        const colorPickerCloseDoneButton = document.createElement('button')
        colorPickerCloseDoneButton.setAttribute('tabindex', '-1')
        colorPickerCloseDoneButton.classList.add('color-picker-close-done-button')
        colorPickerCloseDoneButton.setAttribute('type','button')

        inputFeedbackContainer.after(colorPickerWrapper)
        
        colorPickerWrapper.appendChild(colorPickerCanvasCircleWrapper)
        colorPickerCanvasCircleWrapper.appendChild(colorPickerCanvas)
        colorPickerWrapper.appendChild(colorPickerCircle)
        colorPickerWrapper.appendChild(colorPickerDarkenInputRange)
        colorPickerWrapper.appendChild(colorPickerWriteColorFormBox)
        colorPickerWriteColorFormBox.appendChild(colorPickerWriteColorHexLabel)
        colorPickerWriteColorFormBox.appendChild(colorPickerWriteColorRgbLabel)
        colorPickerWriteColorFormBox.appendChild(colorPickerWriteColorHslLabel)
        colorPickerWriteColorFormBox.appendChild(colorPickerWriteColorHexInput)
        colorPickerWriteColorFormBox.appendChild(colorPickerWriteColorRgbInput)
        colorPickerWriteColorFormBox.appendChild(colorPickerWriteColorHslInput)
        colorPickerWriteColorFormBox.appendChild(colorPickerWriteColorButton)
        colorPickerWrapper.appendChild(colorPickerCloseDoneButton)


        // SET ALL ON LOAD (SET ALSO THE RETURNED PHP COLOR VALUE FROM PREVIOUS FORM SUBMIT)
        window.addEventListener('load', () => {
            setCanvas(inputColor, colorPickerWrapper, colorPickerCanvasCircleWrapper, colorPickerCanvas, colorPickerDarkenInputRange, colorPickerWriteColorFormBox)
            findColor(colorPickerDarkenInputRange, inputColor.value, colorPickerCanvas, colorPickerCircle, colorPickerWrapper, colorPickerCanvasCircleWrapper)
            setPickedColorAsValue(inputColor, pickedColorBox, inputColor.value, colorPickerWriteColorHexInput, colorPickerWriteColorRgbInput, colorPickerWriteColorHslInput)
        })


        // RESIZE EVENT: CLOSE COLOR PICKER ON NO-TOUCH VERSION, ADJUST ON TOUCH VERSION (ELSE VIRTUAL KEYBOARD CAUSE ERROR)
        var isColorPickedResized = false

        window.addEventListener('resize', () => {
            if (window.matchMedia("(any-pointer: coarse)").matches) {
                setCanvas(inputColor, colorPickerWrapper, colorPickerCanvasCircleWrapper, colorPickerCanvas, colorPickerDarkenInputRange, colorPickerWriteColorFormBox)
                findColor(colorPickerDarkenInputRange, inputColor.value, colorPickerCanvas, colorPickerCircle, colorPickerWrapper, colorPickerCanvasCircleWrapper)
            } else {
                if (colorPickerWrapper.classList.contains('color-picker-wrapper-active')) {
                    closeColorPickerWrapper(inputColor, inputColorId, documentShadowRoot)
                    isColorPickedResized = true
                }
            }
        })

        // OPEN COLOR PICKER ON CLICK ON INPUT COLOR
        inputColor.addEventListener('click', () => {
            if (!colorPickerWrapper.classList.contains('color-picker-wrapper-active')) {
                if (isColorPickedResized === true) {
                    openColorPickerWrapper(inputColorId, documentShadowRoot)
                    setCanvas(inputColor, colorPickerWrapper, colorPickerCanvasCircleWrapper, colorPickerCanvas, colorPickerDarkenInputRange, colorPickerWriteColorFormBox)
                    findColor(colorPickerDarkenInputRange, inputColor.value, colorPickerCanvas, colorPickerCircle, colorPickerWrapper, colorPickerCanvasCircleWrapper)
                    isColorPickedResized = false
                } else {
                    setCanvasPosition(inputColor, colorPickerWrapper)
                    openColorPickerWrapper(inputColorId, documentShadowRoot)
                    setColorDarkenRange(colorPickerWrapper, colorPickerCanvas, colorPickerDarkenInputRange)
                    if (inputColor.value === '#ffffff') {
                        setCirclePicker(colorPickerCanvasCircleWrapper, colorPickerCanvas, colorPickerCircle)
                    }
                }
            }
        })


        // CLOSE COLOR PICKER ON CLICK OUT OR ON CLICK ON BUTTON DONE
        window.addEventListener('click', (e) => {
            if (colorPickerWrapper.classList.contains('color-picker-wrapper-active')) {
                let noCloseColorPickerInputAndParents = Array.from(documentShadowRoot.querySelectorAll(`[data-no-close-color-picker-for=${inputColorId}]`))
                let colorPickerWrapperChildren = Array.from(colorPickerWrapper.children).concat(Array.from(colorPickerCanvasCircleWrapper.children)).concat(Array.from(colorPickerWriteColorFormBox.children))
                if (e.composedPath()[0] !== colorPickerWrapper && !colorPickerWrapperChildren.includes(e.composedPath()[0]) && !noCloseColorPickerInputAndParents.includes(e.composedPath()[0]) || e.composedPath()[0] === colorPickerCloseDoneButton ) {
                    closeColorPickerWrapper(inputColor, inputColorId, documentShadowRoot)
                }
            }
        })



        // PICK COLOR ON DRAG COLOR PICKER CIRCLE OR ON CLICK ON COLOR PICKER CANVAS
        var isDownOnCanvas = false

        // start drag
        function startDragOnCanvas(event, offsetX, offsetY) {
            if (colorPickerCanvas.getContext('2d').isPointInPath(offsetX, offsetY)) {
                let pickedColorClick = returnPickedColor(offsetX, offsetY, colorPickerCanvas)
                setPickedColorAsValue(inputColor, pickedColorBox, pickedColorClick, colorPickerWriteColorHexInput, colorPickerWriteColorRgbInput, colorPickerWriteColorHslInput)
                moveCirclePicker(event, colorPickerCanvasCircleWrapper, colorPickerCircle)
                isDownOnCanvas = true
            }
        }

        colorPickerCanvasCircleWrapper.addEventListener('mousedown', (e) => {
            startDragOnCanvas(e, e.offsetX, e.offsetY)
        })
        colorPickerCanvasCircleWrapper.addEventListener('touchstart', (e) => {
            e.preventDefault()
            startDragOnCanvas(e.touches[0], e.touches[0].clientX - colorPickerCanvas.getBoundingClientRect().left, e.touches[0].clientY - colorPickerCanvas.getBoundingClientRect().top)
        })

        // move drag
        function dragOnCanvas(event, offsetX, offsetY) {
            // scroll problem
            if (colorPickerCanvas.getContext('2d').isPointInPath(offsetX, offsetY)) {
                if (isDownOnCanvas === true) {
                    let pickedColorMove = returnPickedColor(offsetX, offsetY, colorPickerCanvas)
                    setPickedColorAsValue(inputColor, pickedColorBox, pickedColorMove, colorPickerWriteColorHexInput, colorPickerWriteColorRgbInput, colorPickerWriteColorHslInput)
                    moveCirclePicker(event, colorPickerCanvasCircleWrapper, colorPickerCircle)
                } else {
                    return;
                }
            } else {
                return;
            }
        }

        colorPickerCanvasCircleWrapper.addEventListener('mousemove', (e) => {
            dragOnCanvas(e, e.offsetX, e.offsetY)
        })

        colorPickerCanvasCircleWrapper.addEventListener('touchmove', (e) => {
            e.preventDefault()
            dragOnCanvas(e.touches[0], e.touches[0].clientX - colorPickerCanvas.getBoundingClientRect().left, e.touches[0].clientY - colorPickerCanvas.getBoundingClientRect().top)
        })

        // end drag
        function endDragOnCanvas() {
            if (isDownOnCanvas === true) {
                isDownOnCanvas = false
            }
        }

        window.addEventListener('mouseup', () => {
            endDragOnCanvas()
        })

        window.addEventListener('touchend', () => {
            endDragOnCanvas()
        })


        // SET RANGE FOR DARKEN PICKED COLOR
        colorPickerDarkenInputRange.addEventListener('input', () => {
            setColorDarkenRange(colorPickerWrapper, colorPickerCanvas, colorPickerDarkenInputRange)
            let colorPickerCircleOffsetX = parseFloat(getComputedStyle(colorPickerCircle).left) + ((colorPickerCircle.offsetWidth / 2))
            let colorPickerCircleOffsetY = parseFloat(getComputedStyle(colorPickerCircle).top) + ((colorPickerCircle.offsetHeight / 2))
            let pickedColorRange = returnPickedColor(colorPickerCircleOffsetX, colorPickerCircleOffsetY, colorPickerCanvas)
            setPickedColorAsValue(inputColor, pickedColorBox, pickedColorRange, colorPickerWriteColorHexInput, colorPickerWriteColorRgbInput, colorPickerWriteColorHslInput)
        })



        // SET A FORM TO SEND AND SEARCH ALSO IN THE DARKEN RANGE COLORS (IF FOUND, YOU WILL SEE AS PICKED COLOR IN CANVAS AND IT WILL SET AS INPUT COLOR VALUE) A COLOR WRITE BY USER WITH ONLY FORMAT HEX, RGB OR HSL (NO OPACITY) IN THEIR CORRISPONDENTING FIELDS
        colorPickerWriteColorFormBox.addEventListener('submit', () => {
            let colorPickerWriteColorInput = colorPickerWriteColorFormBox.querySelector(`#${colorPickerWriteColorButton.getAttribute('data-for')}`)
            let colorPickerWriteColorInputId = colorPickerWriteColorInput.id
            let colorPickerWriteColorInputValue = colorPickerWriteColorInput.value
            if (colorPickerWriteColorInputId.includes('HEX')) {
                if (colorPickerWriteColorInputValue.match(/^#[a-fA-F0-9]{6}$/)) {
                    findColor(colorPickerDarkenInputRange, colorPickerWriteColorInputValue, colorPickerCanvas, colorPickerCircle, colorPickerWrapper, colorPickerCanvasCircleWrapper)
                    setPickedColorAsValue(inputColor, pickedColorBox, colorPickerWriteColorInputValue, colorPickerWriteColorHexInput, colorPickerWriteColorRgbInput, colorPickerWriteColorHslInput)
                }
            }
            if (colorPickerWriteColorInputId.includes('RGB')) {
                if (colorPickerWriteColorInputValue.match(/^[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$/) && colorConversion.isRGBColor(colorPickerWriteColorInputValue.split(','))) {
                    var colorPickerWriteColorInputValueToHex = colorConversion.RGBToHex(colorPickerWriteColorInputValue.split(','))
                    findColor(colorPickerDarkenInputRange, colorPickerWriteColorInputValueToHex, colorPickerCanvas, colorPickerCircle, colorPickerWrapper, colorPickerCanvasCircleWrapper)
                    setPickedColorAsValue(inputColor, pickedColorBox, colorPickerWriteColorInputValueToHex, colorPickerWriteColorHexInput, colorPickerWriteColorRgbInput, colorPickerWriteColorHslInput)
                }
            }
            if (colorPickerWriteColorInputId.includes('HSL')) {
                if (colorPickerWriteColorInputValue.match(/^[0-9]{1,3},[0-9]{1,3}%,[0-9]{1,3}%$/) && colorConversion.isHSLColor(colorPickerWriteColorInputValue.split(','))) {
                    var colorPickerWriteColorInputValueToHex = colorConversion.RGBToHex(colorConversion.HSLToRGB(colorPickerWriteColorInputValue.split(',')));
                    findColor(colorPickerDarkenInputRange, colorPickerWriteColorInputValueToHex, colorPickerCanvas, colorPickerCircle, colorPickerWrapper, colorPickerCanvasCircleWrapper)
                    setPickedColorAsValue(inputColor, pickedColorBox, colorPickerWriteColorInputValueToHex, colorPickerWriteColorHexInput, colorPickerWriteColorRgbInput, colorPickerWriteColorHslInput)
                }
            }
        })

        //label
        const colorPickerWriteColorBoxLabels = colorPickerWriteColorFormBox.querySelectorAll('label')
        const colorPickerWriteColorBoxInputs = colorPickerWriteColorFormBox.querySelectorAll('input')

        colorPickerWriteColorBoxLabels.forEach(label => {
            label.addEventListener('click', () => {
                let itsInputWriteColor = colorPickerWriteColorFormBox.querySelector(`#${label.getAttribute('for')}`)
                allColorFormatInputsAndLabelsRemoveActive(colorPickerWriteColorBoxLabels, colorPickerWriteColorBoxInputs)
                label.classList.add('color-picker-write-color-label-active')
                itsInputWriteColor.classList.add('color-picker-write-color-input-active')
                colorPickerWriteColorButton.setAttribute('data-for', `${label.getAttribute('for')}`)
            })
        });


        // input
        colorPickerWriteColorBoxInputs.forEach(inputWriteColor => {

            let colorPickerWriteColorInputId = inputWriteColor.getAttribute('id')

            inputWriteColor.addEventListener('paste', e => e.preventDefault())

            inputWriteColor.addEventListener('input', (e) => {
                stopInputWriteColor(e, colorPickerWriteColorInputId)
            })

        });

    });
}
