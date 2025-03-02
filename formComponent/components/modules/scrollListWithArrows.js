/**
 * @param {keydownEvent} e
 * @param {HTMLElement} listbox tag che contiene la lista
 * @param {HTMLInputElement} inputTag (o inputDatalist non datalistTag)
 * @param {HTMLInputElement|null} inputSearchInList mettere input tag di ricerca solo per select-prefix altrimenti se datalist mettere null
 * @param {Document|CustomElement.shadowRoot} documentShadowRoot document o my-form.shadowRoot
 * @param {string} listboxType tipologia della lista mettere 'selectPrefix' or 'datalist'
 * @event keydown se: freccia su o freccia giù, evento messo sul contenitore inputUtilityContainer anche per datalist
 * @returns permette di scorrere la lista (dalla barra di input fino all'ultima voce e viceversa) con le freccie up e down e per select-prefix anche passando sulla barra di ricerca nella lista
 */
export function changeFocusResultItem(e, listbox, inputTag, inputSearchInList, documentShadowRoot, listboxType) {
    // se tasti freccia su o giù
    if (e.keyCode === 38 || e.keyCode === 40) {

        // creazione di un array con prima solo il tag input e poi unendovi tutti i risultati della livesearch
        let focusableItemsArray = [inputTag]

        // aggiunta della barra di ricerca, SOLO PER SELECT PREFIX
        if (listboxType === 'selectPrefix' && inputSearchInList !== null) {
            focusableItemsArray.push(inputSearchInList)
        }

        // tutti i risultati della livesearch
        let livesearchResultItems = listbox.children
        Array.from(livesearchResultItems).forEach(livesearchResulItem => {
            livesearchResulItem.setAttribute('tabindex', '-1')
            if (listboxType === 'selectPrefix') {
                if (!livesearchResulItem.classList.contains('select-prefix-option-hide')) {
                    focusableItemsArray.push(livesearchResulItem)
                }                
            }
            if (listboxType === 'datalist') {
                if (!livesearchResulItem.classList.contains('datalist-option-hide')) {
                    focusableItemsArray.push(livesearchResulItem)
                }
            }
        });
        
        // [index] nell'array dell'elemento in focus adesso
        let arrayFocusIndex = focusableItemsArray.indexOf(documentShadowRoot.activeElement)

        // array[index] dell'elemento da mettere in focus
        let nextArrayFocusIndex = 0

        // SELECT PREFIX
        if (listboxType === 'selectPrefix') {
            let activeItemIndex = focusableItemsArray.indexOf(listbox.querySelector('.select-prefix-option-active'))

            if (arrayFocusIndex === 0 && activeItemIndex !== -1 && listbox.scrollHeight !== listbox.clientHeight) {
                if (e.keyCode === 38) {
                    // se freccia su
                    e.preventDefault()
                    nextArrayFocusIndex = activeItemIndex - 1;
                    if (activeItemIndex - 1 >= 0) {
                        nextArrayFocusIndex = activeItemIndex - 1
                    } else {
                        nextArrayFocusIndex = 0
                    }
                    // elemento precedente in focus, fino alla barra di input
                    focusableItemsArray[nextArrayFocusIndex].focus()
                }
                else if (e.keyCode === 40) {
                    // se freccia giù
                    e.preventDefault()
                    if (activeItemIndex + 1 < focusableItemsArray.length) {
                        nextArrayFocusIndex = activeItemIndex + 1
                    } else {
                        nextArrayFocusIndex = focusableItemsArray.length - 1
                    }
                    // elemento successivo in focus, fino all'ultimo comune della lista
                    focusableItemsArray[nextArrayFocusIndex].focus()
                }
            } else {
                if (e.keyCode === 38) {
                    // se freccia su
                    e.preventDefault()
                    nextArrayFocusIndex = arrayFocusIndex - 1;
                    if (arrayFocusIndex - 1 >= 0) {
                        nextArrayFocusIndex = arrayFocusIndex - 1
                    } else {
                        nextArrayFocusIndex = 0
                    }
                    // elemento precedente in focus, fino alla barra di input
                    focusableItemsArray[nextArrayFocusIndex].focus()
                }
                else if (e.keyCode === 40) {
                    // se freccia giù
                    e.preventDefault()
                    if (arrayFocusIndex + 1 < focusableItemsArray.length) {
                        nextArrayFocusIndex = arrayFocusIndex + 1
                    } else {
                        nextArrayFocusIndex = focusableItemsArray.length - 1
                    }
                    // elemento successivo in focus, fino all'ultimo comune della lista
                    focusableItemsArray[nextArrayFocusIndex].focus()
                }
            }
        }

        // DATALIST
        if (listboxType === 'datalist') {
            if (e.keyCode === 38) {
                // se freccia su
                e.preventDefault()
                nextArrayFocusIndex = arrayFocusIndex - 1;
                if (arrayFocusIndex - 1 >= 0) {
                    nextArrayFocusIndex = arrayFocusIndex - 1
                } else {
                    nextArrayFocusIndex = 0
                }
                // elemento precedente in focus, fino alla barra di input
                focusableItemsArray[nextArrayFocusIndex].focus()
            }
            else if (e.keyCode === 40) {
                // se freccia giù
                e.preventDefault()
                if (arrayFocusIndex + 1 < focusableItemsArray.length) {
                    nextArrayFocusIndex = arrayFocusIndex + 1
                } else {
                    nextArrayFocusIndex = focusableItemsArray.length - 1
                }
                // elemento successivo in focus, fino all'ultimo comune della lista
                focusableItemsArray[nextArrayFocusIndex].focus()
            }
        }
    }
}
