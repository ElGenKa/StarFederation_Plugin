// ==UserScript==
// @name         StarFederation SF UI Example script 2
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

$(document).ready(function () {
    if ($("#main-login").length == 0 && $("#divMenu").length > 0) {
        setTimeout(() => {
            sfui.pushPlugin({
                code: 'example_f_script_1',
                group: 'planet',
                type: 'bool',
                title: 'Добавить в заголовок окна планеты её ID',
                wndCondition: 'WndPlanet',
                callback: () => {
                    addPlanetID();
                },
                callbackCondition: () => {
                    return true;
                },
            })
        }, 100);


        setTimeout(() => {
            sfui.pushPlugin({
                code: 'example_f_script_2',
                group: 'planet',
                type: 'bool',
                title: 'В орбитальном доке убрать картинки кораблей',
                wndCondition: 'WndPlanet',
                callback: () => {
                    removeImgShips();
                },
                callbackCondition: () => {
                    // Проверка какой таб открыт
                    let isCall = false;
                    if (getWindow('WndPlanet').activetab === 'main-orbitaldock')
                        isCall = true;
                    return isCall;
                },
            })
        }, 100);
    }
});

const addPlanetID = () => {
    console.log('1111');
    let planetID = $('#WndPlanet_planets').find('[name="planetid"]').val();
    planetID = planetID.split(',')[0];
    let newPlanetTitle = getWindow('WndPlanet').win.getText() + " ID: " + planetID;
    getWindow('WndPlanet').win.setText(newPlanetTitle);
}

const removeImgShips = () => {
    console.log('2222');
    let shipsContainer = $('#WndPlanet_od_projects_content_cover');
    shipsContainer.find('img[height="128px"]').remove();
}