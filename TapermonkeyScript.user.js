// ==UserScript==
// @name         Kinopio - All Shortcuts Custom (v1.7 - Flexible Split Card)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Нажимает различные кнопки в Kinopio. "Split Card" теперь ищет текст, начинающийся с "Split Card".
// @match        https://kinopio.club/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function findAndClick(selector, context = document) {
        const element = context.querySelector(selector);
        if (element) {
            element.click();
            console.log('Kinopio Shortcut: Clicked -', selector);
            return true;
        } else {
            console.warn('Kinopio Shortcut: Element not found -', selector);
            return false;
        }
    }

    // Модифицированная функция для клика по кнопке, содержащей span с текстом
    // buttonSelectorPrefix - для атрибутов самой кнопки
    // spanSelectorAttributes - для атрибутов самого span
    // matchType: 'exact' (по умолчанию) или 'startsWith'
    function findAndClickButtonBySpanText(text, buttonSelectorPrefix = '', spanSelectorAttributes = '', matchType = 'exact') {
        const buttons = document.querySelectorAll(`button${buttonSelectorPrefix}`);
        for (const button of buttons) {
            const span = button.querySelector(`span${spanSelectorAttributes}`);
            if (span) {
                const spanText = span.textContent.trim();
                let matched = false;
                if (matchType === 'startsWith') {
                    if (spanText.startsWith(text)) {
                        matched = true;
                    }
                } else { // 'exact'
                    if (spanText === text) {
                        matched = true;
                    }
                }

                if (matched) {
                    button.click();
                    console.log(`Kinopio Shortcut: Clicked button where span text ${matchType === 'startsWith' ? 'starts with' : 'is'} "${text}"`);
                    return true;
                }
            }
        }
        console.warn(`Kinopio Shortcut: Button with span text ${matchType === 'startsWith' ? 'starting with' : 'being'} "${text}" and attributes ${buttonSelectorPrefix} / ${spanSelectorAttributes} not found.`);
        return false;
    }


    function findAndClickListItemByName(text, listItemSelector = 'li') {
        const items = document.querySelectorAll(listItemSelector);
        for (const item of items) {
            const nameDiv = item.querySelector('div.name');
            if (nameDiv && nameDiv.textContent.trim() === text) {
                if (item.classList.contains('active')) {
                     item.click();
                     console.log(`Kinopio Shortcut: Clicked active list item with name "${text}"`);
                     return true;
                }
            }
        }
        for (const item of items) {
            const nameDiv = item.querySelector('div.name');
            if (nameDiv && nameDiv.textContent.trim() === text) {
                item.click();
                console.log(`Kinopio Shortcut: Clicked list item with name "${text}" (was not necessarily active).`);
                return true;
            }
        }
        console.warn(`Kinopio Shortcut: List item with name "${text}" not found.`);
        return false;
    }

    document.addEventListener('keydown', async (e) => {
        if (!e.altKey || e.shiftKey || e.ctrlKey) {
            return;
        }

        let actionTaken = false;

        switch (e.code) {
            case 'KeyR': // Цвет
                actionTaken = findAndClick('button[data-v-2916769c][title="Color"].change-color');
                if (!actionTaken) actionTaken = findAndClick('button[title="Color"].change-color');
                break;

            case 'KeyE': // Тэги
                actionTaken = findAndClickButtonBySpanText('Tag', '[data-v-2916769c=""][class=""]', '[data-v-2916769c=""]');
                if (!actionTaken) actionTaken = findAndClickButtonBySpanText('Tag');
                break;

            case 'KeyA': // H1
                actionTaken = findAndClick('button[data-v-2916769c=""][title="Header 1"][class=""]');
                if (!actionTaken) actionTaken = findAndClick('button[title="Header 1"]');
                break;

            case 'KeyS': // H2
                actionTaken = findAndClick('button[data-v-2916769c=""][title="Header 2"][class=""]');
                if (!actionTaken) actionTaken = findAndClick('button[title="Header 2"]');
                break;

            case 'KeyX': // Image (Изображение)
                actionTaken = findAndClick('button[title="Image"][class=""]');
                if (!actionTaken) actionTaken = findAndClick('button[title="Image"]');
                break;

            case 'KeyQ': // Checkbox (Чекбокс - вкл/выкл)
                let checkboxButtonContainer = document.querySelector('div.checkbox-button[title="Toggle Checkboxes"]');
                if (checkboxButtonContainer) {
                    const labelInside = checkboxButtonContainer.querySelector('label');
                    if (labelInside) {
                        labelInside.click();
                        console.log('Kinopio Shortcut: Clicked label inside "Toggle Checkboxes" div.');
                        actionTaken = true;
                    } else {
                        console.warn('Kinopio Shortcut: Label inside "Toggle Checkboxes" div not found.');
                    }
                } else {
                    console.warn('Kinopio Shortcut: "Toggle Checkboxes" div not found.');
                    if (!actionTaken) {
                         actionTaken = findAndClick('label[title="Add Checkboxes"]');
                    }
                }
                break;

            case 'KeyD': // Sidebar (Боковая панель)
                actionTaken = findAndClick('button[title="Sidebar"][class=""]');
                if (!actionTaken) actionTaken = findAndClick('button[title="Sidebar"]');
                break;

            case 'KeyW': // Connection Type (Тип связи)
                actionTaken = findAndClickButtonBySpanText('Type', '[class*="change-color"]');
                if (!actionTaken) {
                    actionTaken = findAndClickButtonBySpanText('Type');
                }
                break;

            case 'KeyV': // Merge (Объединить)
                actionTaken = findAndClickButtonBySpanText('Merge');
                break;

            case 'KeyG': // Split cards (Разделить карточку)
                // ИЗМЕНЕНО: ищем кнопку, где текст в span НАЧИНАЕТСЯ с "Split Card"
                actionTaken = findAndClickButtonBySpanText('Split Card', '', '', 'startsWith');
                break;

            case 'Backquote': // Spaces (Пространства)
                actionTaken = findAndClick('button.space-name-button[title="Space Details and Spaces List"]');
                break;

            // Двухэтапные сценарии:
            case 'KeyC': // Copy -> Copy Card Names
                console.log('Kinopio Shortcut: Alt+C pressed for Copy Card Names sequence.');
                let clickedCopy = findAndClickButtonBySpanText('Copy', '[class=""]');
                 if (!clickedCopy) clickedCopy = findAndClickButtonBySpanText('Copy');

                if (clickedCopy) {
                    await delay(250);
                    actionTaken = findAndClickButtonBySpanText('Copy Card Names');
                } else {
                    actionTaken = false;
                }
                break;

            case 'KeyZ': // Frame -> Garden leaves
                console.log('Kinopio Shortcut: Alt+Z pressed for Frame -> Garden Leaves sequence.');
                let clickedFrame = findAndClickButtonBySpanText('Frame', '[data-v-2916769c=""][class=""]', '[data-v-2916769c=""]');
                if (!clickedFrame) clickedFrame = findAndClickButtonBySpanText('Frame');

                if (clickedFrame) {
                    await delay(350);
                    actionTaken = findAndClickListItemByName('Garden Leaves', 'li.active');
                    if (!actionTaken) actionTaken = findAndClickListItemByName('Garden Leaves', 'li');
                } else {
                    actionTaken = false;
                }
                break;
        }

        if (actionTaken) {
            e.preventDefault();
        }
    });

    console.log('Kinopio All Shortcuts script (v1.7 - Flexible Split Card) loaded.');
})();
