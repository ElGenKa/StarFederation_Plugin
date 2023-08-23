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
  if ($("#main-login").length !== 0 || $("#divMenu").length < 1)
    return;

  setTimeout(() => {
    sfui.pushPlugins([{
      code: 'example_f_script_1',
      group: 'planet',
      type: 'bool',
      title: 'Добавить в заголовок окна планеты её ID',
      wndCondition: 'WndPlanet',
      callback: addPlanetID
    },
    {
      code: 'example_f_script_2',
      group: 'planet',
      type: 'bool',
      title: 'В орбитальном доке убрать картинки кораблей',
      wndCondition: 'WndPlanet',
      callback: removeImgShips,
      callbackCondition: wnd => wnd.activetab === 'main-orbitaldock'
    }]);
  }, 100);
});

const addPlanetID = (wnd) => {
  console.log('addPlanetID');
  let planetID = $(wnd.win).find('#WndPlanet_planets [name="planetid"]').val();
  planetID = planetID.split(',')[0];
  const newPlanetTitle = wnd.win.getText().split(' ')[0] + " ID: " + planetID;
  wnd.win.setText(newPlanetTitle);
}

const removeImgShips = (wnd) => {
  console.log('removeImgShips');
  $(wnd.container).find('#WndPlanet_od_projects_content_cover img[height="128px"]').remove();
}