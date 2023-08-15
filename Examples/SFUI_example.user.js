// ==UserScript==
// @name         StarFederation SF UI Example script
// @version      1.0
// @description  пример аддона для основного скрипта SF UI
// @author       ElGen ( Discord: Ninada_O_o#1139 )
// @match        *://*.starfederation.ru/*
// @match        *://*.star-federation.com/*
// @match        *://*.starfederation.space/*
// @match        *://*.starfederation.online/*
// @match        *://*.звезднаяфедерация.рф/*
// @match        *://*.xn--80aaeibdcblcr8c2b0c9a1ki.xn--p1ai*
// ==/UserScript==

// Выполняем когда страница будет полностью загружена
$(document).ready(function () {
    // Проверка на то, что мы находимся в игре
    if ($("#main-login").length == 0 && $("#divMenu").length > 0) {
        // Выполняем через коткий промежуток времени
        // Что бы главный скрипт успел прогрузиться
        setTimeout(() => {
            sfui.pushPlugin({
                code: 'example_script_1', // Уникальный код скрипта, эдакое системное название
                group: 'another', // Категория скрипта
                type: 'bool', // Тип настройки текст (string) или переключатель (bool)
                title: 'Пример 1', // Заголовок настройки
                wndCondition: 'WndPlanet', // При открытии какого окна выполнится callback
                callback: () => {
                    // При открытии окна планеты будут выведены занчения кастомных настроек
                    console.log('Значение кастомной (скрытой) настройки', sfui.settings['custom_setting1'])
                    console.log('Значение кастомной настройки', sfui.settings['example_script_3'])
                }, // Выполняемая функция
                callbackCondition: () => {
                    // Дополнительное условие выполнения функции
                    // Что бы выполнился callback
                    return true;
                },
                isAllowMobile: true, // Разрешить функцию на мобильных устройствах
                help: { // Подсказка функции (значок вопроса рядом с переключателем)
                    img: "https://i.postimg.cc/FF3YN6YT/Screenshot-24.jpg",
                    text: 'Пример текста'
                },
            })

            // При нажатии кнопки "Полетели!" (которая запускает основной скрипт)
            // В консоли будет выведено "Я запустился"
            sfui.pushPlugin({
                code: 'example_script_2',
                group: 'another',
                type: 'bool',
                title: 'Пример 2',
                wndCondition: 'OnLoadScript',
                callback: () => {
                    console.log('Я запустился!')
                },
                callbackCondition: () => {
                    return true;
                },
            })

            //Скрытая настройка, которая не выводится в окне настроек скрипта (стартовое окно)
            sfui.pushSettings('custom_setting1', 'Пример кастомной настройки (скрытой)');

            //А эта настройка уже доступна в окне настроек скрипта (стартовое окно)
            sfui.pushPlugin({
                code: 'example_script_3',
                group: 'another',
                type: 'string',
                title: 'Пример 3 (настройка)',
                wndCondition: 'SettingsOnly',
                callback: () => { },
                callbackCondition: () => {
                    return true;
                },
            })
        }, 100);
    }
});

/**
 * wndCondition - может иметь значение OnLoadScript - это значит, что скрипт выполнится один
 * раз после нажатия кнопки для запуска скрипта
 * Так же wndCondition может быть SettingsOnly - это значит, что скрипт ничего не выполняет и является исключительно опцией
 * 
 * isAllowMobile и help Не обязательные параметры
 */