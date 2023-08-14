// ==UserScript==
// @name         StarFederation UI MOD
// @version      2.4d
// @description  Улучшение игрового интерфейса и расширение функционала
// @author       ElGen & woodser ( Discord: Ninada_O_o & woodser )
// @match        *://*.starfederation.ru/*
// @match        *://*.star-federation.com/*
// @match        *://*.starfederation.space/*
// @match        *://*.starfederation.online/*
// @match        *://*.звезднаяфедерация.рф/*
// @match        *://*.xn--80aaeibdcblcr8c2b0c9a1ki.xn--p1ai*
// ==/UserScript==

// Иконки для смарт кнопок и полетных листов
let sficons = [];
// Синоним функции
let log = console.log;
// !DON'T USE THAT! ---------------------
// Если открыть ангар планеты и выполнить данный скрипт
// Все корабли, находящиеся в ангаре добавятся в очередь разборки
async function fDestroy() {
  let projects = [];
  const selector = `span[style^=';color:#425dc1;cursor:pointer;text-shadow:1px 1px 2px black']`;
  Array.from(
    getWindow('WndBuilding').win.querySelectorAll(selector)
  ).forEach((element) => {
    let id = e.onclick.toString().split('id=')[1].split("')")[0];
    let shipsInProjects = sfapi.parseIntExt(element.parentElement.nextElementSibling.innerText);
    projects.push({
      id,
      shipsInProjects
    });
  });

  for (let index in projects) {
    const queryURL = `/?m=windows&w=WndPlanet&a=destroyship&dest=WndPlanet_main-orbitaldock&sid=${projects[index].id}&size=${projects[index].shipsInProjects}`;
    await sfapi.fetch(queryURL)
    await sfapi.timeout(200);
  }
}

// ---------------------------------------

// объявляем все объекты скрипта
let sfui = {};
sfui.cacheData = {};
let sfcommands = {};
let sfdata = {};
let empireShow = {};
let sfapi = {};
let sfui_playerInfo = {}
let sfui_isMobile = false;

// Языковые пакеты
let sfui_language = {
  TEXT_MISSILE_PENETRATION: {
    ru: 'Пробитие отклонения ракет',
    en: 'Missile deflection penetration'
  },
  LOADING: {
    ru: 'Загрузка',
    en: 'Loading'
  },
  PLANET: {
    ru: 'Планета',
    en: 'Planet'
  },
  FLEET: {
    ru: 'Флот',
    en: 'Fleet'
  },
  FLEET_NUM: {
    ru: '№ флота',
    en: 'Fleet №'
  },
  TECH: {
    ru: 'Технологии',
    en: 'Science'
  },
  AUTOMATION: {
    ru: 'Автоматизация',
    en: ''
  },
  BATTLES: {
    ru: 'Боевое',
    en: 'Battle'
  },
  MAP: {
    ru: 'Карта',
    en: 'Map'
  },
  REG_DATE: {
    ru: 'Дата регистрации',
    en: 'Registration Date'
  },
  CHOSE_COMMAND_SHEET: {
    en: 'Choose Command Sheet',
    ru: 'Выбрать командный лист'
  },
  PRICE_RATES: {
    en: 'Price rates',
    ru: 'Цена ставок'
  },
  PRICE_RATES_ALL: {
    en: 'The price of all bids on the page',
    ru: 'Цена всех ставок на странице'
  },
  CAN_BE_SOLD: {
    en: 'Can be sold on',
    ru: 'Можно продать на'
  },
  MAX_LVL: {
    en: 'Max level',
    ru: 'Максимальный уровень'
  },
  MAX_LVL_TECH: {
    en: 'Max available level',
    ru: 'Макс. доступный уровень'
  },
  ADD_CMD_FLY: {
    en: 'Add \"Flight\" command',
    ru: 'Добавить команду полет'
  },
  ADD_CMD_JUMP: {
    en: 'Add \"Space Jump\" Command',
    ru: 'Добавить команду прыжок'
  },
  ADD_CMD_UNLOAD_ALL: {
    en: 'Add the command `flight, unload everything`',
    ru: 'Добавить команду полет выгрузить все'
  },
  ADD_CMD_UNLOAD_ALL_NO_FUEL: {
    en: 'Add the command `flight, unload everything except fuel`',
    ru: 'Добавить команду полет выгрузить все кроме топлива'
  },
  ADD_CMD_FLY_UNLOAD: {
    ru: 'Добавить команду полет выгрузить',
    en: 'Add the command `flight, unload`'
  },
  INFO_SUMMARY: {
    en: 'Info Summary',
    ru: 'Информационная сводка'
  },
  BUILD: {
    en: 'Build',
    ru: 'Построить'
  },
  PLANETARY_PLATFORMS: {
    en: 'Planetary Platforms',
    ru: 'Планетарные площадки'
  },
  ORBITAL_PLATFORMS: {
    en: 'Orbital Sites',
    ru: 'Орбитальные площадки'
  },
  POPULATION: {
    en: 'Population',
    ru: 'Население'
  },
  AMMOUNT_BUILD_SHIPS: {
    en: 'How many ships will the resource last',
    ru: 'На какое кол-во кораблей хватит ресурса'
  },
  TRLN: {
    en: 'Trln',
    ru: 'трлн'
  },
  RES_TIME_REMAIN: {
    en: 'Enough resources for',
    ru: 'Ресурса хватит еще на'
  },
  DAY_SHORT: {
    en: 'd',
    ru: 'д'
  },
  HOUR_SHORT: {
    en: 'h',
    ru: 'ч'
  },
  MIN_SHORT: {
    en: 'm',
    ru: 'м'
  },
  YEAR_SHORT: {
    en: 'y',
    ru: 'лет'
  },
  FLEET_FREE_SPACE: {
    en: 'Available Hold space',
    ru: 'Свободно в трюме'
  },
  //FLEET_FREE_SPACE_IN_SETTINGS: { en: 'Available Hold space', ru: 'Свободно в трюме' },
  DELIVER_TO_PLANETS: {
    en: 'Deliver to the planets',
    ru: 'Развезти по планетам'
  },
  SELECT_COLONY: {
    en: 'Select Colony',
    ru: "Выбрать колонию"
  },
  UNLOAD: {
    en: 'Unload',
    ru: 'Выгрузить'
  },
  LOAD: {
    en: 'Load',
    ru: 'Загрузить'
  },
  UNLOAD_NO_FUETL: {
    en: 'Unload everything except fuel',
    ru: 'Выгрузить все кроме топлива'
  },
  UNLOAD_ALL: {
    en: 'Unload all',
    ru: 'Выгрузить все'
  },
  FROM_WINDOW: {
    en: 'From window',
    ru: 'Из окна'
  },
  FROM_LIST: {
    en: 'From list',
    ru: 'Из списка'
  },
  PLANET_LIST_FROM_STRING: {
    en: 'Load planets list from string',
    ru: 'Загрузить планеты из строки'
  },
  PLANETS_LIST: {
    en: 'Planets list',
    ru: 'Список планет'
  },
  REMOVE_ALL: {
    en: 'Remove all',
    ru: 'Убрать все'
  },
  SELECT_ALL: {
    en: 'Select all',
    ru: 'Выбрать все'
  },
  SHIPING_ALL: {
    en: 'Will be shipped to every planet',
    ru: 'Будет развезено на каждую планету'
  },
  FROM_ORGANIZER: {
    en: 'From organizer',
    ru: 'Из органайзера'
  },
  LOADING_STATION: {
    en: 'loading station',
    ru: 'Станция погрузки'
  },
  FLEET_HOLD: {
    en: 'Fleet hold',
    ru: 'Трюм флота'
  },
  LOT_SIZE: {
    en: 'Lot size',
    ru: 'Размер партии'
  },
  LOT_AT: {
    en: 'Lots at a time',
    ru: 'Партий за раз'
  },
  LAUNCH: {
    en: 'Launch',
    ru: 'Запуск'
  },
  FREE: {
    en: 'free',
    ru: 'свободно'
  },
  SET_MAX_TECH: {
    en: 'Installation of maximum technologies',
    ru: 'Установка максимальных технологий'
  },
  SORT_TECHS: {
    en: 'Sort studied technologies by time',
    ru: 'Сортировать изучаемые технологии по времени'
  },
  MANY_BUILDINGS: {
    en: 'Add to the tooltip when building how many buildings will fit',
    ru: 'Добавить в подсказку при стройке сколько построек влезет'
  },
  MANY_SHIPS: {
    en: 'Add to the tooltip when building ships for how long the resource will last',
    ru: 'Добавить в подсказку при постройке кораблей на сколько хватит ресурса'
  },
  EXT_BTNS_ON_FLEET: {
    en: 'Add fleetName_Span management buttons to colony selection window',
    ru: 'Добавить кнопки управления флотом в окно выбора колонии'
  },
  EXT_BTNS_ON_EMPIRE_OVERVIEW: {
    en: 'Add fleetName_Span management buttons in the empire overview window',
    ru: 'Добавить кнопки управления флотом в окне обзора империи'
  },
  ARCH_CENTER: {
    en: 'Archaeological Center',
    ru: 'Археологический центр'
  },
  SWITCH_ARCH_CENTERS: {
    en: 'Switching the work of arch centers',
    ru: 'Переключение работы арх центров'
  },
  COMBAT_MESH: {
    ru: 'Боевая сетка',
    en: 'Combat mesh'
  },
  ENOUGH_RES: {
    en: 'Add a tooltip when hovering over resources with time for how many resources are enough',
    ru: 'Добавить подсказку при наведении на ресурсы с временем на сколько хватит ресурсов'
  },
  CALC_FLEET_SPACE: {
    en: 'Calculate how much resources take up in the fleetName_Span storage when loading',
    ru: 'Подсчитывать сколько занимают ресурсы в хранилище флота при погрузке'
  },
  SET_MAX_LVL_BUILDS: {
    en: 'Set max levels to upgrade buildings on the planet',
    ru: 'Устанавливать максимальные уровни для улучшения построек на планете'
  },
  ADD_BTN_DROP_ALL_NO_FUEL: {
    en: 'Add button in fleetName_Span management "unload everything but fuel"',
    ru: 'Добавить кнопку в управлении флотом "выгрузить все кроме топлива"'
  },
  USE_CUSTOM_BG: {
    ru: 'Использовать кастомный фон',
    en: 'Use custom background'
  },
  LINK_BG: {
    ru: 'Ссылка на фон',
    en: 'Link to background'
  },
  OPT_NEW_MSG_WIN: {
    en: 'Optimize new messages window',
    ru: 'Оптимизировать окошко новых сообщений'
  },
  DISPLAY_FLEET_NUM: {
    en: 'Display open fleetName_Span number',
    ru: 'Отображать № открытого флота'
  },
  PLANET_TRANSFER: {
    ru: 'Функция развоза по планетам',
    en: 'Planet delivery function'
  },
  AUTO_CALC_CREDIT_SALE: {
    ru: 'Функция автоматического подсчета кредитов для продажи',
    en: 'Function of automatic calculation of credits for sale'
  },
  SHRINKING_TC_ROWS: {
    ru: 'Функция ужима строк в ТЦ',
    en: 'The function of shrinking rows in the shopping center'
  },
  SHRINKING_SS_ROWS: {
    en: 'Line truncation feature in star system view',
    ru: 'Функция урезания строк в просмотре системы'
  },
  ADD_FAV_BTN_BOTTOM: {
    en: 'Add favorite button',
    ru: 'Добавить кнопку избранного'
  },
  ADD_CALC_BTN_BOTTOM: {
    en: 'Add calculator button',
    ru: 'Добавить кнопку калькулятора'
  },
  CALC_TITLE_WINDOW: {
    en: 'Calculator',
    ru: 'Калькулятор'
  },
  CALC_BTN_PROCENT: {
    en: 'Procent',
    ru: 'Процент'
  },
  CALC_BTN_EXPONENTIATE: {
    en: 'Exponentiate',
    ru: 'Возвести в степень'
  },
  CALC_BTN_SQUARE_ROOT: {
    en: 'Square root',
    ru: 'Квадратный корень'
  },
  CALC_BTN_SAVE_MEMORY: {
    en: 'Save memory',
    ru: 'Записать в память'
  },
  CALC_BTN_LOAD_FROM_MEMORY: {
    en: 'Load from memory',
    ru: 'Загрузить из памяти'
  },
  CALC_BTN_CLEAR_MEMORY: {
    en: 'Clear memory',
    ru: 'Очистить память'
  },
  CALC_BTN_DELETE: {
    en: 'Delete',
    ru: 'Удалить'
  },
  CALC_TEXT_HERE_OLD_VALUE: {
    en: 'Here is the previous result',
    ru: 'Здесь будет прошлый результат'
  },
  CALC_BTN_CLEAR: {
    en: 'Clear',
    ru: 'Очистить'
  },
  CALC_BTN_HISTORY: {
    en: 'History',
    ru: 'История'
  },
  TC_ALL_PRICES: {
    en: 'The price of all bets on the page in the SC',
    ru: 'Цена всех ставок на странице в ТЦ'
  },
  ADS_LINKS: {
    en: 'Make links in ads clickable',
    ru: 'Делать ссылки в объявлениях кликабельными'
  },
  ADS_LINKS_IN_SC: {
    en: 'Make links in ads in the trading window clickable',
    ru: 'Делать ссылки в объявлениях в окне торговых операций кликабельными'
  },
  CALC_SC_PROD_TIME: {
    en: 'Calculate the time for the production of modules',
    ru: 'Считать время для производства модулей'
  },
  QUEST_ADD_BTN_LOAD: {
    en: 'The button for loading materials in the task "Deliver materials to the Federation"',
    ru: 'Кнопка погрузки материалов в задании "Доставить Федерации материалы"'
  },
  UD_CULTURAL_SET: {
    en: 'Cultural set',
    ru: "Культурный сет"
  },
  UD_SCI_SET: {
    en: 'Science set',
    ru: 'Научный сет'
  },
  UD_PROD_SET: {
    en: 'Production set',
    ru: "Производственный сет"
  },
  UD_SAVE_SET: {
    en: 'Set for savings',
    ru: "Сет на экономию"
  },
  UD_SPEED_SET: {
    en: 'Set for speed',
    ru: "Сет на скорость"
  },
  UD_DIG_SET: {
    en: 'Set for a dig',
    ru: "Сет на копку"
  },
  UD_RADAR_SET: {
    en: 'Set to radar',
    ru: "Сет на радар"
  },
  UD_ARCH_SET: {
    en: 'Archaeological Set',
    ru: "Археологический сет"
  },
  UD_HYPERTRAP_SET: {
    en: 'Set against hypertraps',
    ru: "Сет против гиперловушек"
  },
  UD_GRAVITY_SET: {
    en: 'Set against gravity traps',
    ru: "Сет против гравитационных ловушек"
  },
  UD_RECYCLING_SET: {
    en: 'Set for recycling',
    ru: "Сет на утилизацию"
  },
  UD_WAREHOUSE_SET: {
    en: 'Warehouse set',
    ru: "Складской сет"
  },
  UD_PROTECTION_SET: {
    en: 'Protection Set',
    ru: "Защитный сет"
  },
  UD_BATTLE_SET: {
    en: 'Battle Set',
    ru: 'Боевой сет'
  },
  UD_TRANSDUCER_SET: {
    en: 'Transducer set',
    ru: "Сет преобразователя"
  },
  UD_INVISIBLE_SET: {
    en: 'Invisible',
    ru: 'Невидимка'
  },
  NUM_OF_FIRST_PROJECT: {
    en: 'No. of the first project',
    ru: '№ первого проекта'
  },
  NUM_OF_SECOND_PROJECT: {
    en: 'No. of the second project',
    ru: '№ второго проекта'
  },
  NUM_OF_MODULES: {
    en: 'Number of modules',
    ru: 'Кол-во модулей'
  },
  NEW_MODULES: {
    en: 'New modules',
    ru: 'Новые модули'
  },
  GET_PROJECT: {
    en: 'Load project',
    ru: 'Загрузить проект'
  },
  COPY_PROJ_AS_IMAGE: {
    en: 'Copy project as an image.',
    ru: 'Копировать скриншот проекта в буфер'
  },
  SAVE_TO_ORGANIZER: {
    en: 'Save to organizer',
    ru: 'Сохранить в органайзер'
  },
  SHORT_STR_LVL: {
    en: 'lv',
    ru: 'ур'
  },
  BTN_TEXT_BUTTON: {
    en: 'Button',
    ru: 'Кнопка'
  },
  BTN_TEXT_SAVE: {
    en: 'Save',
    ru: 'Сохранить'
  },
  HINT: {
    en: 'Hint',
    ru: 'Подсказка'
  },
  FLIGHT_NUMBER: {
    en: 'Flight sheet number',
    ru: '№ полетного листа'
  },
  SMART_FLY_SETTINGS: {
    en: 'Flight smart button settings',
    ru: 'Настройки смарт кнопки полетника'
  },
  SMART_FLEETS_SETTINGS: {
    en: 'Fleet smart button settings',
    ru: 'Настройки смарт кнопки флота'
  },
  DETAIL_FLEET_INFO: {
    en: 'Detailed information',
    ru: "Развернутая информация"
  },
  TEXT_DURABILITY: {
    en: 'Durability',
    ru: 'Живучесть'
  },
  TEXT_SIGNATURE: {
    en: 'Signature',
    ru: 'Сигнатура'
  },
  TEXT_BR: {
    en: 'Combat Rating',
    ru: 'Боевой рейтинг'
  },
  TEXT_BR_EX: {
    en: 'Fleet  Battle Rating',
    ru: 'Боевой рейтинг'
  },
  TEXT_MISSLE_DEF: {
    en: 'Missile deflection (%)',
    ru: 'Отклонение ракет (%)'
  },
  TEXT_SEND_MSG: {
    ru: 'Отправить сообщение',
    en: 'Send Message'
  },
  TEXT_FAVORITE: {
    en: 'Favorite',
    ru: 'Избранное'
  },
  TEXT_SAVE_COMMAND: {
    ru: 'Сохранить команду',
    en: 'Save Command'
  },
  APPLY_CMD_ON_ENTER: {
    ru: 'Применять команду в полетном листе на Enter (должно быть активно поле для ввода)',
    en: 'Apply the command in the flight sheet to Enter (the input field must be active)'
  },
  ALLOW_RESIZE_BATTLE_WND_ANOTHER: {
    en: "Allow resizing the battle window (viewing someone else's battle)",
    ru: 'Разрешить изменять размер окна сражения (просмотр чужого боя)'
  },
  ALLOW_RESIZE_SELECT_TARGET_WND: {
    en: 'Allow resizing the window for selecting targets for shooting',
    ru: 'Разрешить изменять размер окна выбора целей для стрельбы'
  },
  ALLOW_RESIZE_BATTLE_WINDOW: {
    en: 'Allow resizing the battle window (your)',
    ru: 'Разрешить изменять размер окна сражения (вашего)'
  },
  ALLOW_RESIZE_CHAT_WND: {
    en: 'Allow chat window resizing',
    ru: 'Разрешить изменять размер окна чата'
  },
  ALLOW_RESIZE_DESIGN_WND: {
    en: 'Allow ship design window to be resized',
    ru: 'Разрешить изменять размер окна проектирования корабля'
  },
  ALLOW_RESIZE_FLEET_WND: {
    ru: 'Разрешить изменять размер окна флота',
    en: 'Allow resizing the float window'
  },
  DISPLAY_MAP_GATE: {
    ru: 'Отображать ближайшие врата на карте при правом клике',
    en: 'Display nearest gates on map on right click'
  },
  SORT_UD_SETS_FLEET: {
    ru: 'Сортировать сеты уд в просмотре флота',
    en: 'Sort AD sets in fleetName_Span view'
  },
  SORT_UD_SETS_PLANET: {
    ru: 'Сортировать сеты уд в просмотре планеты',
    en: 'Sort AD sets in planet view'
  },
  SORT_UD_SETS_TRADE_FEDERATION: {
    ru: 'Сортировать УД в окне покупки у федерации',
    en: 'Sort AD in buy from federation window'
  },
  PLANET_ANIM_PRODUCTION: {
    ru: 'Анимация расхода/производства на складе',
    en: 'Animation of consumption/production in the warehouse'
  },
  MASS_SELECTED_ASTRO_FIELDS: {
    en: 'In the search window for asteroid fields, count the mass of the selected fields',
    ru: 'В окне поиска астероидных полей считать массу выбранных полей'
  },
  ADD_COMBAT_MASH: {
    en: 'Add Combat Mesh to Combat Viewer',
    ru: 'Добавить боевую сетку в окне просмотра боя'
  },
  ADD_LOAD_BUTTON_IN_DESIGN: {
    en: 'Add a "load" button in the design window',
    ru: 'Добавить кнопку "погрузить" в окне проектирования'
  },
  REMOVE_DISABLING_TABS: {
    en: 'Remove disabling tabs on elements',
    ru: 'Убрать отключение табуляции на элементах (переключение меж. элементами на tab)'
  },
  ANC_DEVICES: {
    en: 'Ancient Devices',
    ru: 'Устройства древних'
  },
  CALC_DEVIATION: {
    en: 'Calculate Deviation',
    ru: 'Рассчитать отклонение'
  },
  EXP_FLEET_VIEW: {
    en: 'Fleet view window functionality extension',
    ru: 'Расширение функциональности окна просмотра флота'
  },
  FLEET_SHORTCAST_FLYS: {
    en: 'Enable smart-fly-lists - a quick access to flight lists in the fleetName_Span management window',
    ru: 'Включить смарт-полётники - быстрый доступ к полетным листам в окне управления флотом'
  },
  FLEET_SHORTCAST_FLEETS: {
    en: 'Enable smart-fleets - a quick access to fleets in the fleetName_Span management window\'s header',
    ru: 'Включить смарт-флоты - быстрый доступ к флотам из заголовка окна управления флотом'
  },
  SAVE_PROJECT_AS_IMAGE: {
    en: 'Button to save ship project as an image',
    ru: 'Кнопка для сохранения ПОЛНОГО скриншота открытого проекта в буфер обмена'
  },
  DIFF_CHECKER: {
    en: 'Comparison of 2 ship projects',
    ru: 'Сравнивалка 2-х проектов кораблей'
  },
  COMP_TWO_PROJECTS: {
    en: 'Compare projects',
    ru: 'Сравнить проекты'
  },
  SHOW_FLEET_BR_IN_FLEETS: {
    en: 'Display fleetName_Span BR in fleetName_Span list',
    ru: 'Отображать БР флота в списке флотов'
  },
  DO_NOT_UNLOAD_POP: {
    ru: 'Не выгружать население при выгрузке без топлива',
    en: 'Do not unload population when unloading without fuel'
  },
  SETTINGS_SFUI: {
    en: 'Settings SF UI V',
    ru: 'Настройки SF UI V'
  },
  FEATURE_HINT: {
    en: 'Feature hint',
    ru: 'Подсказка по функции'
  },
  ACTIVATE_ALL: {
    en: 'Activate all',
    ru: 'Активировать все'
  },
  ACTIVATE_ALL_SETTINGS: {
    en: 'Activate all settings',
    ru: 'Активировать все настройки'
  },
  RUN_SCRIPT: {
    ru: 'Полетели',
    en: 'Flew'
  },
  RUN_WITH_CUR_SETTINGS: {
    en: 'Run with current settings',
    ru: 'Запуск с текущими настройками'
  },
  SCRIPT_SETTINGS: {
    en: 'Script settings',
    ru: 'Настройки скрипта'
  },
  PLANET_TRANSFER_EMPIRE_SHOW: {
    en: 'Transfer resources from "Empire show" - builds',
    ru: 'Развоз ресурсов из просмотра империи (постройки)'
  },
  DELIVER_TO_PLANETS: {
    en: 'Deliver to the planets',
    ru: 'Развезти по планетам'
  }
}

//Заголовки запросов
const headerData = {
  "accept": "*/*",
  "x-requested-with": "XMLHttpRequest"
};

//Описание кодов сортировки
const codeSortPlugins = {
  planet: {
    en: "Planet",
    ru: "Планета"
  },
  fleetName_Span: {
    en: 'Fleet',
    ru: "Флот"
  },
  tech: {
    en: 'Technologies',
    ru: "Технологии"
  },
  automation: {
    en: 'Automation',
    ru: "Автоматизация"
  },
  battle: {
    en: 'Battle',
    ru: "Боевое"
  },
  map: {
    en: 'Map',
    ru: 'Карта'
  },
  another: {
    en: 'Another',
    ru: "Другое"
  },
  bottom_panel: {
    en: 'Bottom panel',
    ru: 'Нижняя панель'
  },
  left_panel: {
    en: 'Left panel',
    ru: 'Левая панель'
  },
  top_panel: {
    en: 'Top panel',
    ru: 'Верхняя панель'
  },
}

sfapi.fetch = (url, options = {}) => {
  let basicOptions = {
    "headers": {
      "accept": "*/*",
      "accept-language": "ru,en;q=0.9",
      "content-type": "application/x-www-form-urlencoded",
      "x-requested-with": "XMLHttpRequest"
    },
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  }
  for (let optionIndex in options) {
    basicOptions[optionIndex] = options[optionIndex];
  }
  return fetch(url, basicOptions);
}


const TRLN = 1_000_000_000_000;

sfapi.parseIntExt = (valueStr) => {
  if (typeof valueStr === 'number')
    return valueStr;
  if (typeof valueStr !== 'string')
    throw 'sfapi.parseIntExt: invalid argument type';

  let value = valueStr.replaceAll(' ', '').split(sfui_language.TRLN);
  const isTrlnFound = value.length > 1;
  value = value[0];

  if (isTrlnFound)
    return Math.trunc(parseFloat(value) * sfui_language.TRLN);

  return parseInt(value);
}
sfapi.parseFloatExt = (valueStr) => {
  if (typeof valueStr === 'number')
    return valueStr;
  if (typeof valueStr !== 'string')
    throw 'sfapi.parseFloatExt: invalid argument type';

  let value = valueStr.replaceAll(' ', '').split(sfui_language.TRLN);
  const isTrlnFound = value.length > 1;
  value = parseFloat(value[0]);

  return isTrlnFound ? value * sfui_language.TRLN : value;
}
// Convert normal value to in-game format (converts to TRLN format is necessary)
sfapi.toGameValueStr = (value) => {
  if (typeof value !== 'number')
    throw 'sfapi.toGameValueStr: invalid argument type';

  if (value < TRLN)
    return sfapi.tlsRu2(value);

  const valueParts = (value / TRLN).toFixed(3).split('.');
  return `${sfapi.tlsRu2(valueParts[0])}.${valueParts[1]}`;
}
// Оборачиваем число в span, согласно игровому дизайну
sfapi.wrapToGameValue = (value) => {
  if (typeof value !== 'number')
    throw 'sfapi.wrapToGameValue: invalid argument type';

  if (value === 0)
    return '0';

  const locValue = sfapi.tlsRu2(value);
  if (value < TRLN)
    return `<span data-hint="${locValue}" class="v-norm">${locValue}</span>`;

  const valueParts = sfapi.toGameValueStr(value).split('.');
  return `<span data-hint="${locValue}" class="v-norm">${valueParts[0]}.</span>\
    <span data-hint="${locValue}" class="v-norm-dec">${valueParts[1]}\
    <span data-hint="${locValue}" class="v-norm"> ${sfui_language.TRLN}</span></span>`;
}
sfui.sumAndWrapGameInts = (value1, value2) => {
  const newValue = sfapi.parseIntExt(value1) + sfapi.parseIntExt(value2);
  return sfapi.wrapToGameValue(newValue);
}

// toLocaleString - форматирует число согласно текущему языковому формату пользователя
sfapi.tls = (object) => {
  if (sfui_playerInfo.language === 'en')
    return sfapi.tlsEn(object);

  return sfapi.tlsRu2(object);
}
// Использует неразрывной пробел между разрядами
sfapi.tlsRu = (object) => {
  return object.toLocaleString('ru');
}
// Использует обычный пробел между разрядами
sfapi.tlsRu2 = (object) => {
  return object.toLocaleString('ru').replaceAll(' ', ' ');
}
// Использует запятую между разрядами
sfapi.tlsEn = (object) => {
  return object.toLocaleString('en-US');
}
// Использует апостроф между разрядами (стандарт Швейцарии)
sfapi.tlsCh = (object) => {
  return object.toLocaleString('de-CH');
}

// Перевод часов в годы/дни/часы/минуты
// By woodser
function sfui_formatTimeFromHours(totalTime, usedYears = true) {
  if (typeof totalTime != "number")
    return '';
  let days = Math.trunc(totalTime / 24);
  totalTime %= 24;
  let years = Math.trunc(days / 365);
  days %= 365;
  let hours = Math.trunc(totalTime);
  totalTime %= 1;
  let minutes = Math.trunc(totalTime * 60);
  if (minutes < 1 && hours < 1 && days < 1)
    return '';
  let yearsText = (usedYears) ? (years < 1 ? '' : years + `${sfui_language.YEAR_SHORT} `) : '';
  let daysText = days < 1 ? '' : days + `${sfui_language.DAY_SHORT} `;
  let hoursText = hours < 1 ? '' : hours + `${sfui_language.HOUR_SHORT} `;
  let minsText = minutes < 1 ? '' : minutes + sfui_language.MIN_SHORT;
  return yearsText + daysText + hoursText + minsText;
}

// Функция преобразования RGB в HEX цвет
sfapi.rgb2hex = (rgb) => {
  rgb = rgb.split(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  let red = (parseInt(rgb[1], 10).toString(16));
  let green = (parseInt(rgb[2], 10).toString(16));
  let blue = (parseInt(rgb[3], 10).toString(16));
  if (red.length === 1) red = "0" + red;
  if (green.length === 1) green = "0" + green;
  if (blue.length === 1) blue = "0" + blue;
  return "#" + red + g + b;
};

//Функция создания задержек в асинхронных функциях
sfapi.timeout = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const timeout = sfapi.timeout;

sfui.plugins = [];
sfui.settings = {};

// Для изменения настроек "на ходу" через консоль
// sfui.settings.setMaxTech = false;
// ^^^ Пример ^^^

// Загружаем настройки из localstorage
function sfui_loadSettings() {
  let settingsData = localStorage.getItem('sfui_settings_' + sfui_playerInfo.name);
  if (settingsData) {
    settingsData = JSON.parse(settingsData);
    for (let keySetting in settingsData) {
      sfui.settings[keySetting] = settingsData[keySetting];
    }
  } else {
    localStorage.setItem('sfui_settings_' + sfui_playerInfo.name, JSON.stringify(sfui.settings));
  }
}

// выводим настройки в окно (ставим чекбоксы, заполняем поля)
function sfui_printSettings() {
  for (const setting in sfui.settings) {
    if (typeof sfui.settings[setting] === 'boolean') {
      if (sfui.settings[setting]) {
        let select = $(`span[data-settingscode="${setting}"]`)
        select.addClass('inputCheckBoxChecked');
        select.children('input').prop('checked', true);
      }
    } else if (typeof sfui.settings[setting] === 'string') {
      $(`input[data-settingscode="${setting}"]`).val(sfui.settings[setting]);
    }
  }
}

// Сохраняем настройки
function sfui_saveSettings() {
  //sfui.settings.anotherBG = $('#anotherBG').val();
  localStorage.setItem('sfui_settings_' + sfui_playerInfo.name, JSON.stringify(sfui.settings));
}

//Функция инициализации скрипта
function sfui_Init() {
  sfui_saveSettings();
  dhxWins.window('SFUI_win').close();
  //Проверяем, если открыта главная страница, то ничего не делаем и если существует боковое меню добавляем точку входа в скрипт
  if ($("#main-login").length != 0 || $("#divMenu").length < 1)
    return;

  if (typeof userScripts.install != 'function') {
    alert('Ошибка! userScripts.install не найден, инициализировать скрипт невозможно!');
    return;
  }

  userScripts.install({ 'wnd_end_load': sfui.endPoint });
  sfui.plugins.forEach(plugin => { // исполняем модули которые должны быть выполнены при запуске
    try {
      if (plugin.wndCondition === 'OnLoadScript' && plugin.callbackCondition())
        plugin.callback();
    } catch (e) {
      console.error(e);
    }
  })
}

// Акивация всех функций скрипта
sfui.enableAllFunctions = () => {
  $('.sfui_checkbox_settings').each((index, element) => {
    if (element.dataset.settingscode !== 'usedAnotgerBG') {
      $(element).children('input').prop('checked', true);
      $(element).addClass('inputCheckBoxChecked');
      sfui.settings[element.dataset.settingscode] = true;
    }
  });
}

sfui.randomInt = (min, max) => {
  return Math.floor((Math.random() * (max - min)) + min);
}

sfui.random = (min, max) => {
  return (Math.random() * (max - min)) + min;
}

// Функция отображения подсказки по функции
sfui.showHelpWindow = (code) => {
  let plugin = sfui.plugins.filter(elementPlugin => elementPlugin.code === code)[0];
  let html = `
  <div class="textbox-d h-100 w-100" style="overflow-y: auto;">
    <div class="controlbox-d center">
      <a href="${plugin.help.img}" target="_blank" style="display: contents;">
        <img style="max-width: calc(100% - 10px); margin: 7px 0;" src="${plugin.help.img}">
      </a>
    </div>
    <div class="controlbox-d" style="margin-top: 3px;">
      <p style="padding: 10px; margin: 0; text-align: justify;">${plugin.help.text}</p>
    </div>
  </div>
  `;
  sfui.CreateWindow('SFUI_win_' + code + "_" + sfui.randomInt(0, 10000), 600, 500, plugin.title, 'flat/i-settings-16.png', html, false, true);
}

function sfui_preparePlugins() {
  sfui.plugins.forEach((scriptPlugin, index) => {
    if (typeof scriptPlugin.isAllowMobile === "undefined")
      sfui.plugins[index].isAllowMobile = true;

    if (scriptPlugin.sort)
      sfui.plugins[index].sort = sfui.plugins[index].sort.toLowerCase().replaceAll(' ', '');
    else
      sfui.plugins[index].sort = 'another';

    if (!codeSortPlugins[sfui.plugins[index].sort])
      sfui.plugins[index].sort = 'another';
  });
}

function sfui_isDrawSetting(scriptPlugin) {
  let isDraw = false;
  if (sfui_isMobile) {
    if (scriptPlugin.isAllowMobile) {
      isDraw = true;
    }
  } else {
    isDraw = true;
  }
  return isDraw;
}

function sfui_disableSetting(scriptPlugin) {
  if (scriptPlugin.type === 'bool')
    sfui.settings[scriptPlugin.code] = false;
  else
    sfui.settings[scriptPlugin.code] = null;
}

function sfui_getTitlePlugin(plugin) {
  let title = plugin.title;
  if (typeof title === 'object')
    title = title[sfui_playerInfo.language];
  return title;
}

// Открытие окна настроек
function sfui_openPreWindow() {

  let html = `<div class='sfui-main-window'>
  <div class='titlebox w-100 text14'>
    <span>${sfui_language.SETTINGS_SFUI}${GM_info.script.version}</span>
  </div>
  `;
  html += "<div style='height: 425px; overflow: auto;' class='w-100'>"
  let htmlHelp = '';
  let colorRow = '';

  // Пердварительно перебираем все модули скрипта, дабы установить правильные значения
  sfui_preparePlugins();

  // Выводим все настройки согласно сортировочному списку
  for (let keySort in codeSortPlugins) {
    html += `
    <div class='titlebox w-100 text14' style='height: 25px;'>
     <span>${codeSortPlugins[keySort][sfui_playerInfo.language]}</span>
    </div>
    `
    sfui.plugins.forEach(scriptPlugin => {
      if (keySort === scriptPlugin.sort) {
        let isDraw = sfui_isDrawSetting(scriptPlugin);
        if (!isDraw)
          sfui_disableSetting(scriptPlugin);

        htmlHelp = '';
        if (scriptPlugin.help) {
          htmlHelp = `<button tabindex="-1" class="image_btn noselect m2" type="button" data-hint="${sfui_language.FEATURE_HINT}" style="width:16px;height:16px;" onclick="sound_click(2); sfui.showHelpWindow('${scriptPlugin.code}')"><img width=16 height=16 class="noselect" id="btn_WndHelp_img" border="0" src="/images/icons/i_help_24.png"></button>`
        } else {
          htmlHelp = `<div class='m2' style='width: 16px'></div>`
        }
        colorRow = '';
        if (scriptPlugin.isDisabled) {
          colorRow = ';color: red;';
        }
        if (scriptPlugin.type.toLowerCase() === 'bool') {
          html += `
        <div class='controlbox-d ${(!isDraw) ? 'shaddow5' : ''}' style='display: flex;flex-wrap: wrap;padding: 3px;'>
          ${htmlHelp}
          <span style='margin-top: 3px; margin-bottom: 3px;' data-settingscode='${(isDraw) ? scriptPlugin.code : ''}' class="inputCheckBox ${(isDraw) ? 'sfui_checkbox_settings' : ''}" onmousedown=" ${(!isDraw) ? '' : 'sfui.checkboxCustomAction(this)'}">
            <input name="" type="checkbox">
          </span>
        <span style="padding-top: 3px; padding-left: 7px; ${colorRow}" class="">${sfui_getTitlePlugin(scriptPlugin)}</span></div>
        `;
        } else if (scriptPlugin.type.toLowerCase() === 'string') {
          html += `
        <div class='controlbox-d' style='padding: 3px;'>
        ${htmlHelp}
          <span style='${colorRow}' class="">${sfui_getTitlePlugin(scriptPlugin)}: </span>
          <input type='text' data-settingscode='${scriptPlugin.code}' oninput='sfui.updateSettingString(this)' id='${scriptPlugin.code}' class='inputText' style='margin-top: 3px;padding: 3px;width: 440px;margin-bottom: 3px;'>
        </div>`;
        }
      }
    })
  }
  html += "</div>";
  html += `<div class='textbox-d w-100 controls-center-col-top' style='margin-bottom: 5px; flex-flow: row; justify-content: space-between;'><button class='text_btn noselect' onclick='sfui_Init()' data-hint='${sfui_language.RUN_WITH_CUR_SETTINGS}' style='font-size:13px;height:24px;width:125px; margin-top: 5px; margin-left: 10px;'>${sfui_language.RUN_SCRIPT}!</button><button class='text_btn noselect' onclick='sfui.enableAllFunctions()' data-hint='${sfui_language.ACTIVATE_ALL_SETTINGS}' style='font-size:13px;height:24px;width:125px;margin-top: 5px; margin-right: 10px;'>${sfui_language.ACTIVATE_ALL}!</button></div>`;
  html += `</div>`;
  sfui.CreateWindow('SFUI_win', 600, 545, sfui_language.SCRIPT_SETTINGS, 'flat/i-settings-16.png', html, false, true);
}

sfui.updateSettingString = (owner) => {
  let setting = owner.dataset.settingscode;
  sfui.settings[setting] = owner.value;
}

// Обработчик чекбоксов
sfui.checkboxCustomAction = function (owner) {
  owner = $(owner);
  let childrenInput = $(owner).children('input');
  let setting = owner.data('settingscode');
  if (childrenInput.prop('checked') === true) {
    childrenInput.prop('checked', false);
    owner.removeClass('inputCheckBoxChecked');
    sfui.settings[setting] = false;
  } else {
    childrenInput.prop('checked', true);
    owner.addClass('inputCheckBoxChecked');
    sfui.settings[setting] = true;
  }
}

// Добавление модуля в скрипт (извне)
sfui.pushPlugin = (plugin) => {
  if (typeof plugin.code !== 'string')
    return 0;
  if (plugin.type !== 'bool' && plugin.type !== 'string')
    return 0;
  if (typeof plugin.wndCondition !== 'string')
    return 0;
  if (typeof plugin.callback !== 'function')
    return 0;
  if (typeof plugin.callbackCondition !== 'function')
    return 0;

  sfui.plugins.push(plugin);
  return 1;
}

// Добавление настроек (из вне)
sfui.pushSettings = (code, value) => {
  if (typeof code === 'string' && value) {
    sfui.settings[code] = value;
    return 1;
  }
  return 0;
}

// sfdata.buildings sfdata.hulls sfdata.questions sfdata.productions
function sfui_installLanguage(language) {
  for (let languageKey in sfui_language) {
    sfui_language[languageKey] = sfui_language[languageKey][language];
  }
  for (let keyPlugin in sfui.plugins) {
    if (typeof sfui.plugins[keyPlugin].title?.[language] === 'string')
      sfui.plugins[keyPlugin].title = sfui.plugins[keyPlugin].title[language];
  }
  for (let keyQuest in sfdata.questions) {
    sfdata.questions[keyQuest].name = sfdata.questions[keyQuest].name[language];
  }
  for (let keyBuild in sfdata.buildings) {
    sfdata.buildings[keyBuild].name = sfdata.buildings[keyBuild].name[language];
  }
  for (let keyHull in sfdata.hulls) {
    sfdata.hulls[keyHull].name = sfdata.hulls[keyHull].name[language];
  }
  for (let keyProd in sfdata.productions) {
    sfdata.productions[keyProd].name = sfdata.productions[keyProd].name[language];
  }
  for (let keyRace in sfdata.races) {
    sfdata.races[keyRace].name = sfdata.races[keyRace].name[language];
  }
  for (let keyUD in sfdata.ud) {
    sfdata.ud[keyUD].name = sfdata.ud[keyUD].name[language];
  }
  for (let keyUDSet in sfdata.udSets) {
    sfdata.udSets[keyUDSet].name = sfdata.udSets[keyUDSet].name[language];
  }
  pushUDSets();
}

async function sfui_getIcons() {
  sficons = {
    'a_01.png': 'https://i.ibb.co/QCmTtZ1/01.png',
    'a_02.png': 'https://i.ibb.co/1vMPZDK/02.png',
    'a_03.png': 'https://i.ibb.co/BLRq0gS/03.png',
    'a_04.png': 'https://i.ibb.co/vZrHPpz/04.png',
    'a_05.png': 'https://i.ibb.co/rw1Czz3/05.png',
    'a_06.png': 'https://i.ibb.co/kX35jxC/06.png',
    'a_07.png': 'https://i.ibb.co/khG36LT/07.png',
    'a_08.png': 'https://i.ibb.co/8MYD0Q5/08.png',
    'a_09.png': 'https://i.ibb.co/5jhxCFk/09.png',
    'a_10.png': 'https://i.ibb.co/WD7tLqs/10.png',
    'a_11.png': 'https://i.ibb.co/RQCgH87/11.png',
    'a_12.png': 'https://i.ibb.co/b2pFcbX/12.png',
    'a_13.png': 'https://i.ibb.co/HVfsCrj/13.png',
    'a_14.png': 'https://i.ibb.co/djfNMXb/14.png',
    'a_15.png': 'https://i.ibb.co/GnrHXQ6/15.png',
    'a_16.png': 'https://i.ibb.co/RpDxgqr/16.png',
    'a_17.png': 'https://i.ibb.co/Lk0TydJ/17.png',
    'a_18.png': 'https://i.ibb.co/2ccw9pf/18.png'
  };
}

function sfui_clearLocalStorage() {
  // Очистка неиспользуемых полетных листов в быстром доступе
  for (let lsKey in localStorage) {
    try {
      if (lsKey.indexOf('sf_smartFlyList_') + 1) {
        let isFind = false;
        let savedData = JSON.parse(localStorage.getItem(lsKey));
        savedData.forEach(e => {
          if (e?.id) {
            isFind = true;
            return;
          }
        });

        if (!isFind)
          localStorage.removeItem(lsKey);
      }
    } catch (clearError) {
      console.error('Error clearing cache!\n' + clearError);
    }
  }
}

// Получаем инфу о юзере
async function sfui_getUserInfo() {
  // Имитируем открытие окна настроек
  await sfapi.fetch("/?m=windows&w=WndPlayerSettings");
  await timeout(200);
  // Открываем первый таб, где есть ник и язык
  let resultTab = await sfapi.fetch("/?m=windows&w=WndPlayerSettings&a=tabload&dest=WndPlayerSettings_main-main&tab=main-main");
  // Парсим и создаем временный блок с содержимым загруженного таба
  resultTab = await resultTab.text();
  let res = {
    html: resultTab
  };
  new TempDiv('tmpPlayer', res);
  // Достаем язык аккаунта
  let language = $('#tmpPlayer #WndPlayerSettings_cblang').parent().parent().find('span').first().text();
  if (language === 'Язык') {
    language = 'ru';
  } else {
    language = 'en';
  }
  // Применяем языковой пакет
  sfui_installLanguage(language);
  // Достаем имя аккаунта
  let playerName = $(`#tmpPlayer [data-hint^="${sfui_language.REG_DATE}"] span`)[0].innerText;
  await timeout(200);
  // Получаем инфу об учетной записи (раса, рейтинг, имя и т.д.), делается по нику игрока
  let result = await fetch(`/?m=api&a=player&name=${playerName}`);
  result = await result.json();
  for (let keyResult in result) {
    sfui_playerInfo[keyResult] = result[keyResult];
  }
  sfui_playerInfo.language = language;
  $('#tmpPlayer').remove();
}

function sfui_initDocumentScript() {
  document.sfui = sfui;
  document.sfcommands = sfcommands;
  document.sfdata = sfdata;
  document.timeout = timeout;
  document.empireShow = empireShow;
  document.sfui_Init = sfui_Init;
  document.sfapi = sfapi;
  document.sficons = sficons;
  document.headerData = headerData;
  document.sfui_playerInfo = sfui_playerInfo;
  document.sfui_isMobile = sfui_isMobile;
  document.sfui_language = sfui_language;
  document.sfui_formatTimeFromHours = sfui_formatTimeFromHours;
}

function sfui_initWindowScript() {
  // Добавляем скрипт в контекст окна, что бы иметь доступ к функциям на прямую, без
  // дополнительного обращения к document
  let newScript = document.createElement('script');
  newScript.innerHTML = `
  window.sfui = document.sfui;
  window.sfcommands = document.sfcommands;
  window.sfdata = document.sfdata;
  window.timeout = document.timeout;
  window.empireShow = document.empireShow;
  window.sfui_Init = document.sfui_Init;
  window.sfapi = document.sfapi;
  window.sficons = document.sficons;
  window.headerData = document.headerData;
  window.sfui_playerInfo = document.sfui_playerInfo;
  window.sfui_isMobile = document.sfui_isMobile;
  window.sfui_language = document.sfui_language;
  window.sfui_formatTimeFromHours = document.sfui_formatTimeFromHours;
  `;
  document.body.append(newScript);
}

function sfui_checkMainLoginAndDivMenu() {
  return $("#main-login").length === 0 && $("#divMenu").length > 0;
}

// Инициализируем
$(document).ready(function () {
  if (sfui_checkMainLoginAndDivMenu()) {
    // Проверям с мобилки играем или нет
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      sfui_isMobile = true;
    } else {
      sfui_isMobile = false;
    }

    // Выносим скрипт в document, это требуется для того
    // что бы вынести скрипт в общий скоп, так как скрипт выполняется в
    // изолированном от страницы "пространстве"
    sfui_initDocumentScript();
    sfui_initWindowScript();

    // Чистим localStorage
    sfui_clearLocalStorage();

    // Запускаем скрипт по готовности страницы
    setTimeout(async function tick() {
      //Немного ждем перед инициализацией, дабы точно все прогрузилось
      if (sfui_checkMainLoginAndDivMenu() && dhxWins && typeof dhxWins.window === 'function') {
        // Задержкт делаются скорее для красоты
        // Единственная опция которую надо подождать это sfui_getUserInfo
        // После её выполнения будет известен язык и применится языковой пакет
        sfui_showPreloader();
        await sfui_getIcons();
        await sfui_getUserInfo();
        await timeout(200);
        sfui_hidePreloader();
        await timeout(100);
        sfui_loadSettings();
        sfui_openPreWindow();
        sfui_printSettings();
      } else {
        // Пока не загрузятся все компоненты игры будет выполнятся функция tick (раз в секунду)
        setTimeout(tick, 1000);
      }
    }, 1000);
  }
});

// Функция отображения прелоадера скрипта
function sfui_showPreloader() {
  let preloader = document.createElement("div");
  let blockLoader = document.createElement('div');
  $(blockLoader).addClass('textcontainer-l w-100 text14 h-100');
  //$(blockLoader).css('background', 'rgba(9,14,15,0.7)');
  $(blockLoader).css('display', 'flex');
  $(blockLoader).css('justify-content', 'center');
  $(blockLoader).css('backdrop-filter', 'blur(5px)');
  $(blockLoader).attr('id', 'loader_textBlock')
  $(preloader).css('width', '300px').css('height', '30px');
  $(preloader).css('position', 'absolute');
  $(preloader).css('left', 'calc(50% - 150px)');
  $(preloader).css('top', 'calc(50% - 15px)');
  $(preloader).css('z-index', '1000000');
  $(preloader).attr('id', 'blockPreloader');
  preloader.appendChild(blockLoader);
  document.body.appendChild(preloader);

  let text = 'SFUI IS LOADING';
  let content = document.querySelector('#loader_textBlock');

  for (let i in [...text]) {
    let letter = document.createElement('span');
    letter.classList.add('loaderText');
    letter.textContent = [...text][i]
    if (letter.textContent.match(/\s/)) {
      letter.style.margin = 'auto 3px'
    }
    letter.style.animationDelay = i / 20 + 's'
    content.appendChild(letter)
  }
}

// Функция скрытия прелоадера скрипта
function sfui_hidePreloader() {
  $('#blockPreloader').hide('slow');
}

//Установка кастомного фона
sfui.setCustumBG = function () {
  if (!sfui.settings.anotherBG || !sfui.settings.usedAnotherBG)
    return;

  $("#divCover").css("background-image", 'url(' + sfui.settings.anotherBG + ')');
  $("#divCover").css("background-size", window.innerWidth + 'px ' + window.innerHeight + 'px');
}

sfui.calcsCounter = 0;
sfui.calcsWindows = [];
sfui.createNewCalcWin = () => {
  let calcID = 'wndCalc_' + sfui.calcsCounter;
  sfui.calcsCounter++;
  let wnd = dhxWins.createWindow(calcID, 10, 10, 260, 400);
  wnd.setText(sfui_language.CALC_TITLE_WINDOW);
  wnd.centerOnScreen();
  wnd.setIcon("../../../../images/icons/" + 'flat/i-organizer-16.png');
  wnd.allowMove();
  wnd.denyResize();

  wnd.calc = {};
  wnd.calc.currentValue = '0';
  wnd.calc.isNotNaN = false;
  wnd.calc.prevValue = sfui_language.CALC_TEXT_HERE_OLD_VALUE;
  wnd.calc.jumpCurrToOld = false;
  wnd.calc.currentOperation = null;
  wnd.calc.memory = '0';
  wnd.calc.history = [];
  wnd.calc.updateCurrentValue = () => {
    if (wnd.calc.isNotNaN) {
      $(wnd).find(".calcOldResult")
        .css('justify-content', 'space-between')
        .css('padding-right', '14px')
        .css('padding-left', '14px')
        .css('display', 'flex')
        .css('flex-flow', 'row-reverse');
      $(wnd).find(".calcOldResult").find('div').css('display', 'flex');
    } else {
      $(wnd).find(".calcOldResult")
        .css('justify-content', '')
        .css('padding-right', '')
        .css('padding-left', '')
        .css('display', '')
        .css('flex-flow', '');
      $(wnd).find(".calcOldResult").find('div').css('display', 'none');
    }

    $(wnd).find(".calcCurrentValue input").val(sfapi.tlsRu2(wnd.calc.currentValue));
    $(wnd).find(".calcOldResult span").text(sfapi.tlsRu2(wnd.calc.prevValue));
  }
  wnd.calc.updateInInput = () => {
    let currVal = $(wnd).find(".calcCurrentValue input").val();
    wnd.calc.currentValue = sfapi.parseFloatExt(currVal.replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '').replaceAll(',', '.').replaceAll(/[kKкКтТtT]/g, '000').replaceAll(/([A-zА-я])/gm, '')).toString();
    wnd.calc.updateCurrentValue();
  }
  wnd.calc.calculate = () => {
    if (wnd.calc.currentOperation === null)
      return 0;

    let y = sfapi.parseFloatExt(wnd.calc.currentValue);
    let x = sfapi.parseFloatExt(wnd.calc.prevValue);
    let z = 0;
    let o = wnd.calc.currentOperation;

    if (o === 'plus') {
      z = x + y;
    } else if (o === 'minus') {
      z = x - y;
    } else if (o === 'multiply') {
      z = x * y;
    } else if (o === 'divide') {
      z = x / y;
    } else if (o === 'procent') {
      z = (x / 100) * y;
    } else if (o === 'exponentiate') {
      z = Math.pow(x, y);
    }

    wnd.calc.history.push((x + " " + o + " " + y + " = " + z));

    wnd.calc.prevValue = z;
    wnd.calc.currentValue = '0';
    wnd.calc.jumpCurrToOld = false;
    wnd.calc.currentOperation = null;
    wnd.calc.isNotNaN = true;
  }
  wnd.calc.clear = () => {
    wnd.calc.currentValue = '0';
    wnd.calc.isNotNaN = false;
    wnd.calc.prevValue = sfui_language.CALC_TEXT_HERE_OLD_VALUE;
    wnd.calc.jumpCurrToOld = false;
    wnd.calc.currentOperation = null;
    wnd.calc.updateCurrentValue();
  }
  wnd.calc.showHistory = () => {
    if ($(wnd).find('.calcButtonsContainer').css('display') === 'flex') {
      $(wnd).find('.calcButtonsContainer').css('display', 'none');

      let historyHTML = '';
      if (wnd.calc.history.length > 15) {
        wnd.calc.history = wnd.calc.history.splice(-1, 15);
      }

      wnd.calc.history.forEach(historyElement => {
        historyHTML += `<div>${historyElement}</div>`;
      });

      historyHTML = historyHTML
        .replaceAll('plus', "+")
        .replaceAll('minus', "-")
        .replaceAll('multiply', "*")
        .replaceAll('divide', "/")
        .replaceAll('procent', "%")
        .replaceAll('exponentiate', "^");

      $(wnd).find('.calcHistoryContainer').css('display', 'flex').html(historyHTML);
    } else {
      $(wnd).find('.calcButtonsContainer').css('display', 'flex');
      $(wnd).find('.calcHistoryContainer').css('display', 'none');
    }
  }
  wnd.calc._jumpProcess = (isClick = false) => {
    if (wnd.calc.jumpCurrToOld) {
      if (wnd.calc.isNotNaN) {
        if (wnd.calc.currentValue.toString() !== '0') {
          wnd.calc.calculate();
        }
      } else {
        wnd.calc.isNotNaN = true;
        wnd.calc.prevValue = wnd.calc.currentValue;
        if (!isClick)
          wnd.calc.currentValue = '0';
        else
          wnd.calc.currentValue = '';
      }
      wnd.calc.jumpCurrToOld = false;
    }
  }
  wnd.calc.checkSwapValue = () => {
    wnd.calc._jumpProcess(true);
    wnd.calc.updateCurrentValue();
  }
  wnd.calc.func_btn = (funcData, title) => {
    //console.log(funcData, title);
    switch (funcData) {
      case 'calc':
        if (wnd.calc.isNotNaN) {
          wnd.calc.calculate();
        }
        break;
      case 'plus':
      case 'minus':
      case 'multiply':
      case 'divide':
      case 'procent':
      case 'exponentiate':
        if (wnd.calc.isNotNaN && wnd.calc.currentValue.toString() != '0') {
          wnd.calc.calculate();
        }
        wnd.calc.jumpCurrToOld = true;
        wnd.calc.currentOperation = funcData;
        break;
      case 'fraction':
        wnd.calc.currentValue = (1 / sfapi.parseFloatExt(wnd.calc.currentValue)).toString();
        break;
      case 'square':
        wnd.calc.currentValue = (Math.sqrt(sfapi.parseFloatExt(wnd.calc.currentValue))).toString();
        break;
      case 'ms':
        wnd.calc.memory = wnd.calc.currentValue;
        break;
      case 'mr':
        wnd.calc.currentValue = wnd.calc.memory;
        break;
      case 'mc':
        wnd.calc.memory = '0';
        break;
      case 'addPoint':
        wnd.calc.currentValue = wnd.calc.currentValue.replaceAll('.', '') + '.';
        break;
      case 'backspace':
        wnd.calc.currentValue = wnd.calc.currentValue.substring(0, wnd.calc.currentValue.length - 1);
        break;
      case 'addNumber':
        wnd.calc._jumpProcess();

        if (wnd.calc.currentValue.toString() === '0') {
          wnd.calc.currentValue = title;
        } else {
          wnd.calc.currentValue += title;
        }
        break;
    }

    wnd.calc.updateCurrentValue();
  };

  const calcBTNS = [
    {
      title: '%',
      func: 'procent',
      hint: sfui_language.CALC_BTN_PROCENT
    },
    {
      title: 'x^y',
      func: 'exponentiate',
      hint: sfui_language.CALC_BTN_EXPONENTIATE
    },
    {
      title: '1/x',
      func: 'fraction',
      hint: ''
    },
    {
      title: '√x',
      func: 'square',
      hint: sfui_language.CALC_BTN_SQUARE_ROOT
    },

    {
      title: 'MS',
      func: 'ms',
      hint: sfui_language.CALC_BTN_SAVE_MEMORY
    },
    {
      title: 'MR',
      func: 'mr',
      hint: sfui_language.CALC_BTN_LOAD_FROM_MEMORY
    },
    {
      title: 'MC',
      func: 'mc',
      hint: sfui_language.CALC_BTN_CLEAR_MEMORY
    },
    {
      title: '<',
      func: 'backspace',
      hint: sfui_language.CALC_BTN_DELETE
    },

    {
      title: '1',
      func: 'addNumber',
      hint: ''
    },
    {
      title: '2',
      func: 'addNumber',
      hint: ''
    },
    {
      title: '3',
      func: 'addNumber',
      hint: ''
    },
    {
      title: '+',
      func: 'plus',
      hint: ''
    },

    {
      title: '4',
      func: 'addNumber',
      hint: ''
    },
    {
      title: '5',
      func: 'addNumber',
      hint: ''
    },
    {
      title: '6',
      func: 'addNumber',
      hint: ''
    },
    {
      title: '-',
      func: 'minus',
      hint: ''
    },

    {
      title: '7',
      func: 'addNumber',
      hint: ''
    },
    {
      title: '8',
      func: 'addNumber',
      hint: ''
    },
    {
      title: '9',
      func: 'addNumber',
      hint: ''
    },
    {
      title: '*',
      func: 'multiply',
      hint: ''
    },

    {
      title: '.',
      func: 'addPoint',
      hint: ''
    },
    {
      title: '0',
      func: 'addNumber',
      hint: ''
    },
    {
      title: '=',
      func: 'calc',
      hint: ''
    },
    {
      title: '/',
      func: 'divide',
      hint: ''
    }
  ];

  let calcBTNSHtml = '';
  calcBTNS.forEach(buttonObject => {
    calcBTNSHtml += `
    <div class="buttoncontainer-1" style="display: flex;width: 50px;height: 32px;margin: 3px;">
        <button class="image_btn" data-hint='${buttonObject.hint}' type="button" style="color: white;width:50px;height:32px;" onclick="dhxWins.window('${calcID}').calc.func_btn('${buttonObject.func}', '${buttonObject.title}')">${buttonObject.title}</button>
    </div>
    `
  })
  wnd.attachHTMLString(
    `<div class="calcMainDiv" style="width: 100%;height: 100%;display: flex; flex-flow: column;">
    <div class="controls-center-row mt2 center controlbox-d h30 calcOldResult" style="width: 100%;">
      <span>${sfui_language.CALC_TEXT_HERE_OLD_VALUE}</span>
      <div style='display: none;'>
        <button class="image_btn noselect" onclick="dhxWins.window('${calcID}').calc.clear()" type="button" data-hint="${sfui_language.CALC_BTN_CLEAR}" style="width:18px;height:18px;">
          <img oncontextmenu="return false;" class="noselect" border="0" src="/images/icons/flat/i-close-red-12.png">
        </button>
        <button class="image_btn noselect" onclick="dhxWins.window('${calcID}').calc.showHistory()" type="button" data-hint="${sfui_language.CALC_BTN_HISTORY}" style="width:18px;height:18px;">
          <img oncontextmenu="return false;" width=12 height=12 class="noselect" border="0" src="/images/icons/flat/i-organizer-24.png">
        </button>
      </div>
    </div>
    <div class="controls-center-row mt2 center controlbox-d h30 calcCurrentValue" style="width: 100%;">
    <input autocomplete="off" type="text" onclick="dhxWins.window('${calcID}').calc.checkSwapValue()" onchange="dhxWins.window('${calcID}').calc.updateInInput()" class="inputText" style="text-align:center;height:22px;width: 93%;text-align: end;" value="0">
    </div>
    <div class="textcontainer-l mt2 center calcButtonsContainer" style="flex: 1;width: 100%;display: flex;flex-wrap: wrap; justify-content: center;">
      ${calcBTNSHtml}
    </div>
    <div class="textcontainer-l mt2 center calcHistoryContainer" style="flex: 1;width: 100%;display: none;flex-wrap: wrap;justify-content: flex-start;flex-direction: column-reverse;">
    </div>
    </div>`
  )
  return wnd;
}

function sfui_redrawBattleLogs(wnd) {
  sfui.battleLog(wnd);
}

function sfui_restoreTabulation(wnd) {
  $(wnd.win).find('[tabindex="-1"]').attr('tabindex', null);
}

function sfui_drawFlyListIDInWindow(wnd) {
  if (wnd.win.getText() !== sfui_language.CHOSE_COMMAND_SHEET)
    return;

  $('[id^="WndSelect_fleetflylist_row"]').each((i, e) => {
    let colls = $(e).find('td');
    const id = colls[4].outerHTML.split('load_flylist(')[1].split(')')[0];
    colls[1].innerHTML += `<img src="images/icons/i_copy_12.png" height="13" onclick="navigator.clipboard.writeText('${id}'); $(this).fadeOut(100).fadeIn(100);" title="ID: ${id}\nКлик, чтобы скопировать" style="margin-left: 5px;">`;
  });
}

function sfui_drawFleetIDInWindow(wnd) {
  if (sfui.settings.showIDFleet) {
    if (wnd.win.idd === 'WndFleet') {
      $(wnd.win).find('.dhtmlx_wins_title .fleetTitle').remove();
      if (sfui.settings.WndFleetSmartFleets)
        $(wnd.win).find('.dhtmlx_wins_title .controlbox')[0].innerHTML += `<span class='fleetTitle' style='color:#73c95f; margin-left: 7px; margin-top: 2px;' oncontextmenu="return copyToClipboardEvent(event,this);">${wnd.fleetid}</span>`
      else
        $(wnd.win).find('.dhtmlx_wins_title')[0].innerHTML += `<span class='fleetTitle' style='color:#73c95f; position: absolute; left: 140px; top: 1px;' oncontextmenu="return copyToClipboardEvent(event,this);">${wnd.fleetid}</span>`
    }
  }
}

function sfui_redrawNewMesagesWindow() {
  $('#divNewMessages').css('max-height', '');
  $("#WndMessages_hint_messages_form").parent().css('max-height', '')
}

function sfui_mobileOptimization() {
  Array.from($("img[src='/images/icons/i_info_12.png']")).forEach(e => {
    let hoverAttr = e.getAttribute('onmouseenter');
    e.setAttribute('onclick', hoverAttr);
  });
  Array.from($("img[src='/images/icons/flat/i-sub-info-red-12.png']")).forEach(e => {
    let hoverAttr = e.getAttribute('onmouseenter');
    e.setAttribute('onclick', hoverAttr);
  });
  Array.from($("img[src='/images/icons/flat/i-sub-info-12.png']")).forEach(e => {
    let hoverAttr = e.getAttribute('onmouseenter');
    e.setAttribute('onclick', hoverAttr);
  });
}

//точка входа в скрипт
sfui.endPoint = function (wnd) {
  // Немного ждем перед выполнением наших функций, дабы контент прогрузился, иначе не работает.
  setTimeout(function () {
    if (!wnd || !wnd.win)
      return;

    // Возвращаем в игру возможность табуляции
    if (sfui.settings.removeTabIndex)
      sfui_restoreTabulation(wnd);

    // Боевые логи
    if (sfui.settings.battleLogTable)
      sfui_redrawBattleLogs(wnd);

    // Отрисовка номеров полетных листов в окне выбора полетного листа
    sfui_drawFlyListIDInWindow(wnd);

    // Здесь выполняются все модули скрипта
    // Логика в чем: в точку входа в скрипт передается окно
    // Мы перебираем в цикле все модули, если по параметрам модуля
    // он может выполнитя (условия выполнения) то выполняем соответствующий коллбэк
    // Выполнение коллбэка обернуто в try catch для отлова ошибок
    // и если один из модулей выдаст ошибку - скрипт не прервет свое выполнение
    // и другие модули смогут выполнится
    sfui.plugins.forEach(plugin => {
      try {
        if (plugin.wndCondition !== wnd.win.idd && plugin.wndCondition !== 'AllCalls')
          return;

        if (plugin.callbackCondition() && sfui.settings[plugin.code] && !plugin.isDisabled)
          plugin.callback(wnd);
      } catch (e) {
        console.error(e);
      }
    });

    // Выводим номер флота в окне флота
    sfui_drawFleetIDInWindow(wnd);

    // Модифицируем окно новых сообщений
    //sfui_redrawNewMesagesWindow();

    // Оптимизация под мобилки
    if (sfui_isMobile)
      sfui_mobileOptimization();
  }, 5);
}

// Считаем все торговые ставки
sfui.calcTradeCount = function () {
  $("#tradesCounterLabel").remove();
  $("#tradesCounterData").remove();
  let totalPrice = 0;
  $("[id^='WndTrade_rates_row']").each((i, e) => {
    let tradePrice = sfapi.parseIntExt($($(e).find('td')[7]).text());
    let tradeAmount = sfapi.parseIntExt($($(e).find('td')[6]).text());
    let tradeMinAmount = sfapi.parseIntExt($($(e).find('td')[5]).text());
    totalPrice += tradePrice * (tradeAmount / tradeMinAmount)
  });
  $("#WndTrade_main-rates .controlbox").append(`<span id='tradesCounterLabel' class="value_label m2">${sfui_language.PRICE_RATES}</span>`);
  $("#WndTrade_main-rates .controlbox").append(`<div data-hint="${sfui_language.PRICE_RATES_ALL}" id="tradesCounterData" class="value-n text10 h18 m2" style='padding-left: 5px; padding-right: 5px;'> <span class="v-currency">${sfapi.tls(totalPrice)}</span>  <span style="color:#daa548; margin-left: 5px;"> IG</span> </div>`);
}

//Ужим строк в просмотре системы
// TODO: надо бы декомпозировать, правда вот хезе как
sfui.resizeStarRows = function () {
  try {
    let innerContainer = $(getWindow("WndStar").win).find("#WndStar_main-planets div.content_box div.controls-center-row-top");
    if (innerContainer.length > 0) {
      let newRowHTML = `<table class='data-table w-100'><tbody>`;
      let prepareDataError = false;
      innerContainer.each((i, e) => {
        if (!prepareDataError) {
          let imgContainer = e.children[0];
          let dataContainer = e.children[1];
          let orbitalNumber = sfapi.parseIntExt($(imgContainer).find('.value_bg').text());
          let fleets = $($(dataContainer).children()[2]);
          let poId = fleets.attr('id');
          if (orbitalNumber > 0) {
            let hintcontent = '';
            let event = '';
            try {
              hintcontent = $(imgContainer).find('.hintcontent')[0].outerHTML;
              event = imgContainer.innerHTML.split('show_hint(')[1].split(');')[0];
            } catch (error) {
              hintcontent = '';
              event = '';
            }

            let buttons = $(imgContainer).find('.bg-shadow-75').find('button');
            let nameAndSizeRow = $($(dataContainer).children()[0]);
            let atmoAndLive = $($(dataContainer).children()[1]);
            let btnsTmp = '';
            const btnSize = '16px';
            buttons.each((iBtn, eBtn) => {
              $(eBtn).css('width', btnSize).css('height', btnSize);
              $($(eBtn).children()[0]).css('width', btnSize).css('height', btnSize);
              btnsTmp += eBtn.outerHTML;
            });
            buttons = btnsTmp;

            let name = nameAndSizeRow.children()[0].innerHTML;
            let id = null;
            try {
              id = name.split('planetid=')[1].split("')")[0];
            } catch (error) {
              id = null;
            }

            let originalName = nameAndSizeRow.children()[0].innerText;
            let nameDataHint = $(nameAndSizeRow.children()[0]).data('hint');
            let nameColor = $($(nameAndSizeRow.children()[0]).children()[0]).css('color');
            let size = nameAndSizeRow.children()[1].innerText;
            let sizeDataHint = $(nameAndSizeRow.children()[1]).data('hint');
            let sizeColor = $($(nameAndSizeRow.children()[1]).children()[0]).css('color');
            let atmo = atmoAndLive.children()[0].innerText;
            let atmoDataHint = $(atmoAndLive.children()[0]).data('hint');
            let atmoColor = $($(atmoAndLive.children()[0]).children()[0]).css('color');
            let live = atmoAndLive.children()[1].innerHTML;

            // Памагити
            if (id)
              buttons += `<button class='image_btn noselect' data-hint="Информационная сводка" onclick="sound_click(2);{{getWindow('WndPlanet').view_report(${id});}};return cancelEvent(event);" style="cursor:pointer;height:16px;width:16px;"><img style='width: 15px;' class='noselect' src='/images/icons/flat/i-info-16.png'></button>`

            if (name && nameDataHint && nameColor && size && sizeDataHint && sizeColor && atmo && atmoDataHint && atmoColor && live) {
              newRowHTML += `<tr id='WndStar_row_${i}' data-planetid='${id}' data-orbitaNum='${orbitalNumber}' data-orbitaPos='${originalName}' style='height:24px' class='text11'>`;
              if (event) {
                newRowHTML += `<td id='WndStar_row_atmo_${i}' onmouseenter='show_hint(${event});' class='value_bg frame' style='color: ${atmoColor}' data-hint='${atmoDataHint}: ${atmo}'>${orbitalNumber}${hintcontent}</td>`;
              } else {
                newRowHTML += `<td id='WndStar_row_atmo_${i}' class='value_bg frame' style='color: ${atmoColor}' data-hint='${atmoDataHint}: ${atmo}'>${orbitalNumber}${hintcontent}</td>`;
              }
              newRowHTML += `<td id='WndStar_row_btns_${i}' class='value controls bg-shadow-75' style='display: table-cell!important;'>${buttons}</td>`;
              newRowHTML += `<td id='WndStar_row_name_${i}' class='value controls' style='color: ${nameColor}; display: table-cell!important;' data-hint='${nameDataHint}'>${name}</td>`;
              newRowHTML += `<td id='WndStar_row_size_${i}' class='value controls' style='color: ${sizeColor}; display: table-cell!important;' data-hint='${sizeDataHint}'>${size}</td>`;
              newRowHTML += `<td id='WndStar_row_alive_${i}' class='value controls' style='display: table-cell!important;'>${live}</td>`;
              newRowHTML += `</tr>`;
              if (fleets.html())
                newRowHTML += `<tr id='WndStar_row_fleets_${i}' data-orbita='${i}' data-orbitaNum='${orbitalNumber}' data-orbitaPos='${originalName}'><td colspan=5><div class='controls-left-row w-100 controls textbox-d' id='${poId}' style='flex-wrap:wrap; padding: 1px; justify-content: left;'>${fleets.html()}<div></td></tr>`;
            } else {
              prepareDataError = true;
            }
          } else if (orbitalNumber === 0) { //controls-left-row
            newRowHTML += `<tr style='height:24px' class='text11'>`;
            newRowHTML += `<td class='value_bg frame' style='color: white' data-hint=''>0</td>`;
            newRowHTML += `</tr>`;
            newRowHTML += `<tr><td colspan=5><div class='controls-left-row w-100 controls textbox-d' id='${$(dataContainer).find('.controls-left-row').attr('id')}' style='flex-wrap:wrap; padding: 1px; justify-content: left;'>${$(dataContainer).find('.controls-left-row').html()}<div></td></tr>`;
          }
        }
      });
      newRowHTML += '</tbody></table>';
      if (!prepareDataError)
        $(getWindow("WndStar").win).find("#WndStar_main-planets div.content_box").html(newRowHTML);
    }
  } catch (e) {
    console.error(e);
  }
}

//Ужим строк тц
sfui.updateTradeRow = function () {
  try {
    $('tr[id^="WndTrade_rates_row_"]')
      .css('height', '14px')
      .find('td.padding0')
      .css('height', '14px')
      .find('button.image_btn.noselect')
      .css('height', '14px')
      .find('img')
      .css('height', '14px')
  } catch (e) {
    console.error(e);
  }
}

// Подсчет продажи кредитов
sfui.updateSellCredits = function () {
  try {
    let baseSelOneCredit = 0.0000001;
    if ($('input[name="fedsellall[0-20-0-0]"]').length > 0) {
      let sellAmmount = sfapi.parseIntExt($(`#WndTrade_federation-sellresourses span:contains("${sfui_language.CAN_BE_SOLD}")`).next().text());
      if (sellAmmount > 0)
        $('input[name="fedsellall[0-20-0-0]"]').val(sellAmmount / baseSelOneCredit);
    }
  } catch (e) {
    console.error(e);
  }
}

// Устанавливаем маскимальные уровни исследований
sfui.WndScienceSetMaxTech = function () {
  $(getWindow('WndScience').win).find('.hintcontent').each((i, element) => {
    let containsMaxLvl = $(element).find(`td:contains('${sfui_language.MAX_LVL_TECH}')`);
    if (containsMaxLvl.length > 0) {
      let newMaxLvl = containsMaxLvl[0].nextElementSibling.innerText;
      newMaxLvl = sfapi.parseIntExt(newMaxLvl);
      if (newMaxLvl)
        element.previousSibling.value = newMaxLvl;
    }
  })
}

//Открытие окна просмотра планет, добавляем команды для флотов
sfui.WndSelectPlanet = function () {
  let title = $(getWindow('WndSelect').win).find(".dhtmlx_wins_title")[0].innerText;
  if (title === sfui_language.SELECT_COLONY) {
    let rows = $("[id^='WndSelect_playerplanets_row']");
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      let id = row.cells[1].innerText.replace(/\u00a0/g, "");
      let id_int = parseInt($(row.cells[1])[0].children[0].firstChild.onclick.toString().split("planetid=")[1].split("')")[0]);
      let commFly = $(`<td><div data-hint="${sfui_language.ADD_CMD_FLY}" onclick="fleet_external_comand(2,'${id}');" style="background:url(/images/icons/i_fleet_fly_12.png);cursor:pointer; width: 12px; height: 12px;background-size: contain;"></div></td>`);
      row.append(commFly[0]);
      commFly = $(`<td><div data-hint="${sfui_language.ADD_CMD_JUMP}" onclick="fleet_external_comand(19,'${id}');" style="background:url(/images/icons/i_cmd_jump_12.png);cursor:pointer;height:12px;width:12px;background-size: contain;"></div></td>`);
      row.append(commFly[0]);
      commFly = $(`<td><div data-hint="${sfui_language.ADD_CMD_UNLOAD_ALL}" onclick="fleet_external_comand(16,'${id}');" style="background:url(/images/icons/i-unloadall-16.png);cursor:pointer;height:12px;width:12px;background-size: contain;"></div></td>`);
      row.append(commFly[0]);
      commFly = $(`<td><div data-hint="${sfui_language.ADD_CMD_UNLOAD_ALL_NO_FUEL}" onclick="fleet_external_comand(17,'${id}');" style="background:url(/images/icons/i-unloadallnofuel-16.png);cursor:pointer;height:12px;width:12px;background-size: contain;"></div></td>`);
      row.append(commFly[0]);
      commFly = $(`<td><div data-hint="${sfui_language.ADD_CMD_FLY_UNLOAD}" onclick="fleet_external_comand(18,'${id}');" style="background:url(/images/icons/i-unload-16.png);cursor:pointer;height:12px;width:12px;background-size: contain;"></div></td>`);
      row.append(commFly[0]);
      commFly = $(`<span data-hint="${sfui_language.INFO_SUMMARY}" onclick="sound_click(2);{{getWindow('WndPlanet').view_report(${id_int});}};return cancelEvent(event);" style="cursor:pointer;height:12px;width:12px;"><img style='width: 12px;' src='/images/icons/flat/i-info-16.png'></span>`);
      row.cells[1].children[0].append(commFly[0]);
    }
  }
}

//Добавление кнопки выгрузки в окно управления флотом
sfui.unloadAllNoFuelFleet = function () {
  if (getWindow("WndFleet").activetab === 'main-comands') {
    //Если окно "Управление полетом"
    if ($(getWindow("WndFleet").win).find('#dropAllExtOnFleets').length === 0) {
      //Проверяем, нет ли этой кнопки (иногда окно обновляется без полной перезаписи содержимого)
      $($(getWindow("WndFleet").win).find('.controls-center-row')[1]).append(`
                <button class="image_btn noselect" id="dropAllExtOnFleets" onclick="sfcommands.dropAllExtOnFleets()" style="cursor:pointer;margin-left:5px; padding: 2px;">
                <img data-hint="${sfui_language.UNLOAD_ALL}" src="/images/icons/i-unloadall-16.png" style="height:12px;width:12px;">
                </span>`);
      $($(getWindow("WndFleet").win).find('.controls-center-row')[1]).append(`
                <button class="image_btn noselect" id="dropAllNoFuelExt" onclick="sfcommands.dropAllNoFuelExt()" style="cursor:pointer;margin-left:5px; padding: 2px;">
                <img data-hint="${sfui_language.UNLOAD_NO_FUETL}" src="/images/icons/i-unloadallnofuel-16.png" style="height:12px;width:12px;">
                </span>`);
      $($(getWindow("WndFleet").win).find('.controls-center-row')[1]).append(`
                <button class="image_btn noselect" id="dropExt" onclick="sfcommands.dropExt()" style="cursor:pointer;margin-left:5px; padding: 2px;">
                <img data-hint="${sfui_language.UNLOAD}" src="/images/icons/i-unload-16.png" style="height:12px;width:12px;">
                </span>`);
      // Добавляем кнопку
    }
  }
}

//Устанавливаем максимальные уровни для построек
sfui.setMaxLevelsBuilds = function () {
  let isBuildOpen = $($(getWindow("WndPlanet").win).find("div[tab_id='main-buildings']")[0]).hasClass('dhx_tab_element_active');
  if (isBuildOpen) {
    $(".hintcontent[id^='WndPlanet_buh_']").each(function (i, e) {
      let fe = $(e).find(`span:contains('${sfui_language.MAX_LVL}')`);
      if (fe.length > 0) {
        if (fe[0].nextElementSibling) {
          let maxLevel = fe[0].nextElementSibling.innerText;
          if (maxLevel)
            $(e).parent()[0].previousElementSibling.children[0].value = maxLevel.replaceAll(" ", '');
        }
      }
    });
  }
}

//Добавляем в хинт инфу, на сколько хватит построек
sfui.addMaxBuildsCount = function () {
  Array.from($(getWindow("WndPlanet").win).find(`button:contains('${sfui_language.BUILD}')`)).forEach((element) => {
    if (element.nextElementSibling.children[0].innerText.indexOf(sfui_language.PLANETARY_PLATFORMS) + 1 || element.nextElementSibling.children[0].innerText.indexOf(sfui_language.ORBITAL_PLATFORMS) + 1) {
      let row = element.nextElementSibling.children[0].children[0].rows[0];
      let cellUse = sfapi.parseIntExt(row.cells[2].innerText);
      let cellFree = sfapi.parseIntExt(row.cells[3].innerText);
      let cellsGo = Math.floor(cellFree / cellUse);
      row.cells[2].innerText = cellUse + " (" + cellsGo + ")";
    }
  });
}

//Добавляем в хинт инфу, на сколько хватит кораблей
sfui.addMaxShipsCount = function () {
  Array.from($(getWindow("WndPlanet").win).find(`button:contains('${sfui_language.BUILD}')`)).forEach((element) => {
    let minShips = Number.MAX_SAFE_INTEGER;
    let minShipsForNas = Number.MAX_SAFE_INTEGER;
    let elementForMaxShips = null;

    Array.from($($(element.nextElementSibling).find('tr'))).forEach((e, i) => {
      if (i === 0) {
        elementForMaxShips = $(e);
        return;
      }

      let tdr = $(e).find('td');
      let name = tdr[1].innerText;
      let need = tdr[2];
      let amount = tdr[3];
      let minTdr = Math.floor(sfapi.parseIntExt(amount.innerText) / sfapi.parseIntExt(need.innerText));
      if (name !== sfui_language.POPULATION) {
        if (minTdr < minShips)
          minShips = minTdr;
      } else if (minTdr < minShipsForNas)
        minShipsForNas = minTdr;

      $(e).append(`<td class="value text10 w60" data-hint='${sfui_language.AMMOUNT_BUILD_SHIPS}'><span>${sfapi.tls(minTdr)}</span></td>`)
    })
    if (elementForMaxShips)
      elementForMaxShips.append(`<td class="value text10 w60" data-hint='${sfui_language.AMMOUNT_BUILD_SHIPS}'><span>${sfapi.tls(minShips)} (${sfapi.tls(minShipsForNas)})</span></td>`)
  });
}

//Добавляем кнопочки в окно просмотра империи
sfui.externalCommandsInEmpire = function () {
  if (getWindow("WndPlanets").activetab === 'main-colonies') {
    let rows = $("[id^='WndPlanets_colonies_row_']");
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      let id = row.cells[1].innerText.replace(/\u00a0/g, "");
      let id_int = parseInt($(row.cells[1])[0].children[0].firstChild.onclick.toString().split("planetid=")[1].split("')")[0]);
      let commFly = $(`<span data-hint="${sfui_language.ADD_CMD_UNLOAD_ALL}" onclick="fleet_external_comand(16,'${id}');" style="cursor:pointer;height:12px;width:12px;margin-left:2px;"><img style='width: 12px;' src='/images/icons/i-unloadall-16.png'></span>`);
      row.cells[1].children[0].append(commFly[0]);
      commFly = $(`<span data-hint="${sfui_language.ADD_CMD_UNLOAD_ALL_NO_FUEL}" onclick="fleet_external_comand(17,'${id}');" style="cursor:pointer;height:12px;width:12px;margin-left:2px;"><img style='width: 12px;' src='/images/icons/i-unloadallnofuel-16.png'></span>`);
      row.cells[1].children[0].append(commFly[0]);
      commFly = $(`<span data-hint="${sfui_language.ADD_CMD_FLY_UNLOAD}" onclick="fleet_external_comand(18,'${id}');" style="cursor:pointer;height:12px;width:12px;margin-left:2px;"><img style='width: 12px;' src='/images/icons/i-unload-16.png'></span>`);
      row.cells[1].children[0].append(commFly[0]);
      commFly = $(`<span data-hint="${sfui_language.INFO_SUMMARY}" onclick="sound_click(2);{{getWindow('WndPlanet').view_report(${id_int});}};return cancelEvent(event);" style="cursor:pointer;height:12px;width:12px;margin-left:2px;"><img style='width: 12px;' src='/images/icons/flat/i-info-16.png'></span>`);
      row.cells[1].children[0].append(commFly[0]);
    }
  }
}

//Добавляем хинт на время до исчерпания ресурса
sfui.resRemainTime = function () {
  const activeTab = getWindow('WndPlanet').activetab;
  if (activeTab != "wp-materials" && activeTab != "wp-resourses")
    return;

  let rows = $("tr[id^='WndPlanet_" + activeTab + "_row_']");
  let dataRows = rows.find('.value.text12');
  for (let i = 0; i < dataRows.length; i += 3) {
    const demand = sfapi.parseIntExt(dataRows[i + 2].innerText);

    if (demand >= 0)
      continue;

    const amount = sfapi.parseIntExt(dataRows[i].innerText);
    const timeRemain = -(amount / demand);
    const hintStr = `${sfui_language.RES_TIME_REMAIN} ${sfui_formatTimeFromHours(timeRemain)}`;
    const cell_Amount_jq = dataRows.eq(i);
    const cell_Mass_jq = dataRows.eq(i + 1);
    const cell_Demand_jq = dataRows.eq(i + 2);
    cell_Amount_jq.attr('data-hint', hintStr);
    cell_Amount_jq.children('span').first().css('pointerEvents', 'none');
    cell_Mass_jq.attr('data-hint', hintStr);
    cell_Mass_jq.children('span').first().css('pointerEvents', 'none');
    cell_Demand_jq.attr('data-hint', hintStr);
    cell_Demand_jq.children('span').first().css('pointerEvents', 'none');
  }
}
//Добавляем хинт на время до исчерпания ресурса
sfui.resAnimateChange = (wnd) => {
  const activeTab = getWindow('WndPlanet').activetab;

  let rows = '';
  if (activeTab === 'wp-materials')
    rows = $(`[id^='WndPlanet_wp-materials_row_']`);
  else if (activeTab === 'wp-resourses')
    rows = $(`[id^='WndPlanet_wp-resourses_row_']`);
  else return;

  Array.from(rows).forEach((e, i) => {
    let targetValues = $(e).find('td');
    let amountData = '';
    let massData = '';
    let expenseData = '';

    const span_Demand_jq = targetValues.eq(5).find('span.v-norm');
    expenseData = span_Demand_jq.data('hint') ?? targetValues[5].innerText;

    const expenseVal = sfapi.parseFloatExt(expenseData) / 3600;
    if (!expenseVal)
      return;

    const span_Amount_jq = targetValues.eq(3).find('span.v-norm');
    if (span_Amount_jq.data('hint'))
      amountData = span_Amount_jq[0].dataset.hint ?? span_Amount_jq[1].dataset.hint
    else
      amountData = targetValues[3].innerText;

    const span_Mass_jq = targetValues.eq(4).find('span.v-norm');
    if (span_Mass_jq.data('hint'))
      massData = span_Mass_jq[0].dataset.hint ?? span_Mass_jq[1].dataset.hint;
    else
      massData = targetValues[4].innerText;

    const newAmountVal = Math.round(sfapi.parseFloatExt(amountData) + expenseVal);
    const massRate = Math.round(sfapi.parseFloatExt(massData) / sfapi.parseFloatExt(amountData));
    span_Amount_jq.html(sfapi.wrapToGameValue(newAmountVal));
    span_Amount_jq.css('pointerEvents', 'none');
    span_Mass_jq.html(sfapi.wrapToGameValue(massRate * newAmountVal));
    span_Mass_jq.css('pointerEvents', 'none');
    span_Demand_jq.css('pointerEvents', 'none');
  });
}

//Посчитываем занятый трюм флота
sfui.calcUsedStorageInFleet = function () {
  let wndFleetCmds = $("div[id^='WndFleet_cmd_']").filter(
    function (index, element) {
      if ($(element).attr('id').indexOf('prodid') + 1)
        return true;
      else
        return false;
    });
  for (let i = 0; i < wndFleetCmds.length; i++) {
    let tableCommand = $($($(wndFleetCmds[i]).parents('table')[0]).parents('form')[0]);
    let inputSize = tableCommand.find('input[name="data[size]"]');
    let resCount = sfapi.parseIntExt(inputSize.val().replaceAll(' ', '').replaceAll(/[kKкКтТtT]/g, '000'));
    inputSize[0].oninput = sfui.calcUsedStorageInFleet;
    if (resCount > 0) {
      let prodInput = tableCommand.find('input[name="data[prodid]"]');
      let prodCombo = prodInput.parents('div')[0]
      if (prodCombo._self._selOption) {
        let idProd = prodCombo._self._selOption.value;
        let weight = sfdata.productions.find(function (e) {
          if (e.id === idProd && typeof e.weight != "undefined") return true;
        });
        if (weight) {
          weight = weight.weight * resCount;
          tableCommand.find(`td:contains("${sfui_language.FLEET_FREE_SPACE}")`);
          let labelSize = tableCommand.find(`td:contains("${sfui_language.FLEET_FREE_SPACE}")`)[1].nextElementSibling;
          let freeSpaceInFleet = sfapi.parseIntExt(labelSize.innerText.split(' - ')[0].replace(/\s/g, ''));
          labelSize.innerText = freeSpaceInFleet.toLocaleString('ru') + " — " + sfapi.tls(weight);
          labelSize.innerHTML += '<br>';
          let leftSpaceInFleet = freeSpaceInFleet > weight ? freeSpaceInFleet - weight : 0;
          labelSize.style.maxWidth = '255px';
          labelSize.innerText += '~ ' + sfapi.tls(leftSpaceInFleet);
          labelSize.style.paddingLeft = labelSize.style.paddingRight = '4px';
          if (!prodCombo._self.addedHandler) {
            prodCombo._self.addedHandler = true;
            prodCombo._self.ev_onSelectionChange.addEvent(sfui.calcUsedStorageInFleet);
          }
        } else {
          let labelSize = tableCommand.find(`td:contains("${sfui_language.FLEET_FREE_SPACE}")`)[1].nextElementSibling;
          labelSize.innerText = labelSize.innerText.split(' - ')[0];
        }
      }
    }
  }
}

// Сортировка УД во флоте
sfui.udShuffleFleet = (wnd) => {
  if (wnd.win.idd === 'WndFleet' && wnd.activetab === 'main-options') {
    sfui.udShuffle(wnd, 'WndFleet');
  }
}
// Сортировка УД на планете
sfui.udShufflePlanet = (wnd) => {
  if (wnd.win.idd === 'WndPlanet' && wnd.activetab === 'co-additional') {
    sfui.udShuffle(wnd, 'WndPlanet');
  }
}
// Сортировка УД в магазине Федерации
sfui.udShuffleTrade = (wnd) => {
  if (wnd.win.idd === 'WndTrade' && wnd.activetab === 'byfederation-devices') {
    sfui.udShuffle(wnd, 'WndTrade');
  }
}
// Сама процедура сортировки
sfui.udShuffle = (wnd, targetWnd) => {
  if (targetWnd === 'WndFleet') {
    let installsUd = [];
    $('#WndFleet_fleet_device_settings_frame').find('table.w335 tr').each((i, e) => {
      let currentUDName = $(e).children()[2].innerText.replace(' *', '');
      installsUd.push(currentUDName);
      sfdata.udSets.forEach((ef, fi) => {
        if (ef.list.indexOf(currentUDName.toLowerCase()) + 1) {
          sfdata.udSets[fi].oneInstall = true;
          sfdata.udSets[fi].installs.push(currentUDName.toLowerCase());
          sfdata.udSets[fi].htmls.push(e.outerHTML);
          $(e).remove();
        }
      })
    });
    if (installsUd.length > 0) {
      sfdata.udSets.forEach((ef, fi) => {
        if (ef.oneInstall && ef.inFleet) {
          $('#WndFleet_fleet_device_settings_frame').find('table.w335').append(`<tr><td colspan=4><span style='color:#f1cb95'>${ef.name}</span></td></tr>`);
          ef.htmls.forEach((e) => {
            $('#WndFleet_fleet_device_settings_frame').find('table.w335').append(e);
          });
          ef.list.forEach((e) => {
            if (ef.installs.indexOf(e) === -1) {
              $('#WndFleet_fleet_device_settings_frame').find('table.w335').append(`<tr><td colspan=4><span class='warning v-warn'>${e}</span></td></tr>`);
            }
          });
        }
      });

      sfdata.udSets.forEach((ef, fi) => {
        sfdata.udSets[fi].oneInstall = false;
        sfdata.udSets[fi].installs = [];
        sfdata.udSets[fi].htmls = [];
      });
    }
  } else if (targetWnd === 'WndPlanet') {
    let installsUd = [];
    $('#WndPlanet_fleet_device_settings_frame').find('table.w310 tr').each((i, e) => {
      let currentUDName = $(e).children()[2].innerText.replace(' *', '');
      installsUd.push(currentUDName);
      sfdata.udSets.forEach((ef, fi) => {
        if (ef.list.indexOf(currentUDName.toLowerCase()) + 1) {
          sfdata.udSets[fi].oneInstall = true;
          sfdata.udSets[fi].installs.push(currentUDName.toLowerCase());
          sfdata.udSets[fi].htmls.push(e.outerHTML);
          $(e).remove();
        }
      })
    });
    if (installsUd.length > 0) {
      sfdata.udSets.forEach((ef, fi) => {
        if (ef.oneInstall && ef.inPlanet) {
          $('#WndPlanet_fleet_device_settings_frame').find('table.w310').append(`<tr><td colspan=4><span style='color:#f1cb95'>${ef.name}</span></td></tr>`);
          ef.htmls.forEach((e) => {
            $('#WndPlanet_fleet_device_settings_frame').find('table.w310').append(e);
          });
          ef.list.forEach((e) => {
            if (ef.installs.indexOf(e) === -1) {
              $('#WndPlanet_fleet_device_settings_frame').find('table.w310').append(`<tr><td colspan=4><span class='warning v-warn'>${e}</span></td></tr>`);
            }
          });
        }
      });

      sfdata.udSets.forEach((ef, fi) => {
        sfdata.udSets[fi].oneInstall = false;
        sfdata.udSets[fi].installs = [];
        sfdata.udSets[fi].htmls = [];
      });
    }
  } else if (targetWnd === 'WndTrade') {
    let installsUd = [];
    $('#WndTrade_federation-devices_content').find('tr[id^="WndTrade_federation-devices_row_"]').each((i, e) => {
      let currentUDName = $(e).children()[1].innerText.replace(' *', '');
      installsUd.push(currentUDName);
      sfdata.udSets.forEach((ef, fi) => {
        if (ef.list.indexOf(currentUDName.toLowerCase()) + 1) {
          sfdata.udSets[fi].oneInstall = true;
          sfdata.udSets[fi].installs.push(currentUDName.toLowerCase());
          sfdata.udSets[fi].htmls.push(e.outerHTML);
          $(e).remove();
        }
      })
    });
    if (installsUd.length > 0) {
      sfdata.udSets.forEach((ef, fi) => {
        //if (ef.oneInstall && ef.inPlanet) {
        $('#WndTrade_federation-devices_content').find('tbody').append(`<tr><td colspan=7><span style='color:#f1cb95'>${ef.name}</span></td></tr>`);
        ef.htmls.forEach((e) => {
          $('#WndTrade_federation-devices_content').find('tbody').append(e);
        });
        ef.list.forEach((e) => {
          if (ef.installs.indexOf(e) === -1) {
            $('#WndTrade_federation-devices_content').find('tbody').append(`<tr><td colspan=4><span class='warning v-warn'>${e}</span></td></tr>`);
          }
        });
        //}
      });

      sfdata.udSets.forEach((ef, fi) => {
        sfdata.udSets[fi].oneInstall = false;
        sfdata.udSets[fi].installs = [];
        sfdata.udSets[fi].htmls = [];
      });
    }
  }
}

// ------------- Все вспомогательные функции

sfcommands.dropExt = async function () {
  getWindow("WndFleet").start_load();

  await sfapi.fetch("/?m=windows&w=WndFleet&a=comandhtml&dest=WndFleet_comand_data_new&idcmd=3&icmd=new");
  await timeout(100);

  await sfapi.fetch("/?m=windows&w=WndFleet&a=addcomand&dest=WndFleet_main-comands", {
    "body": "idcmd=3&icmd=new",
    "method": "POST"
  });
  await timeout(100);

  getWindow("WndFleet").end_load();
  getWindow("WndFleet").refresh();
}

sfcommands.dropAllNoFuelExt = async function (noRefresh = false) {
  //Делаем окно серым
  if (!noRefresh)
    getWindow("WndFleet").start_load();
  // Отправляем запрос на сервер игры о выгрузке, заранее помечая топливо
  if (sfui.settings.noDropHumans) {
    await fetch("/?m=windows&w=WndFleet&a=addcomand&dest=WndFleet_main-comands", {
      "headers": {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded",
        "x-requested-with": "XMLHttpRequest"
      },
      "body": `idcmd=11&icmd=new&=true&data[72][0][0]=false&data[453][0][0]=false&data[66][0][0]=false&data[73][0][0]=false&data[25][${sfui_playerInfo.race_id}][0]=false`,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
  } else {
    await fetch("/?m=windows&w=WndFleet&a=addcomand&dest=WndFleet_main-comands", {
      "headers": {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded",
        "x-requested-with": "XMLHttpRequest"
      },
      "body": `idcmd=11&icmd=new&=true&data[72][0][0]=false&data[453][0][0]=false&data[66][0][0]=false&data[73][0][0]=false`,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
  }

  //Убераем серость и обновляем окно флота.
  if (!noRefresh) {
    getWindow("WndFleet").end_load();
    getWindow("WndFleet").refresh();
  }
  return true;
};

sfcommands.dropAllNoFuelExtOnFleets = async function (fleetID) {
  getWindow("WndFleet").urlp = `id=${fleetID}`;
  getWindow("WndFleet").start_load();
  await fetch(`?m=windows&w=WndFleet&id=${fleetID}`, {
    "headers": {
      "accept": "*/*",
      "x-requested-with": "XMLHttpRequest"
    },
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  });
  await timeout(200);
  await fetch("/?m=windows&w=WndFleet&a=addcomand&dest=WndFleet_main-comands", {
    "headers": {
      "accept": "*/*",
      "content-type": "application/x-www-form-urlencoded",
      "x-requested-with": "XMLHttpRequest"
    },
    "body": "idcmd=11&icmd=new&=true&data[72][0][0]=false&data[453][0][0]=false&data[66][0][0]=false&data[73][0][0]=false",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  });
  getWindow("WndFleet").end_load();
  getWindow("WndFleet").refresh();
  return true;
};

sfcommands.dropAllExtOnFleets = async function (fleetID) {
  if (fleetID)
    getWindow("WndFleet").urlp = `id=${fleetID}`;
  getWindow("WndFleet").start_load();
  await fetch(`?m=windows&w=WndFleet&id=${fleetID}`, {
    "headers": {
      "accept": "*/*",
      "x-requested-with": "XMLHttpRequest"
    },
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  });
  await timeout(200);
  await fetch("/?m=windows&w=WndFleet&a=addcomand&dest=WndFleet_main-comands", {
    "headers": {
      "accept": "*/*",
      "content-type": "application/x-www-form-urlencoded",
      "x-requested-with": "XMLHttpRequest"
    },
    "body": "idcmd=11&icmd=new&=true",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  });
  getWindow("WndFleet").end_load();
  getWindow("WndFleet").refresh();
  return true;
};

sfcommands.addModuleInOrganizerByData = () => {

}

sfcommands.addModuleInOrganizerByBody = async (body) => {
  let fetchResult = await fetch("?m=windows&w=WndOrganizer&a=addcalcitem&dest=WndOrganizer_componets_content", {
    "headers": {
      "accept": "*/*",
      "content-type": "application/x-www-form-urlencoded",
      "x-requested-with": "XMLHttpRequest"
    },
    "body": body,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  });
  await timeout(100);
  return await fetchResult.text();
}

//Обзор империи

empireShow.buttonClearResize = function () {
  $(`button[onclick="sound_click(2);{getWindow('WndPlanets').clear_flt_b()};cancelEvent(event);"]`).parent(0).css('width', '100px');
}

empireShow.showsUpWins = 0;
empireShow.autoTransports = function () {
  setTimeout(function () {
    $('#WndPlanetsTransportAll').remove();
    $('#WndPlanetsTransportAllFromList').remove();
    $('#WndPlanetsTransportAllUI').remove();
    $($('#WndSelect_flt_pc_form').children()[0]).append(`
    <div class="fieldLabel" id='WndPlanetsTransportAllUI' style="width: 185px;margin-top: 10px;padding-top: 2px;">${sfui_language.DELIVER_TO_PLANETS}</div>
    <button type="button" id='WndPlanetsTransportAll' onclick='sound_click(2);empireShow.transportAll();cancelEvent(event);return false;' style='padding: 4px;margin-top: 5px; width: 185px;' class='text_btn noselect'>${sfui_language.FROM_WINDOW}</button>
    <button type="button" id='WndPlanetsTransportAllFromList' onclick='sound_click(2);empireShow.transportAllFromListOpenWindow();cancelEvent(event);return false;' style='padding: 4px;margin-top: 5px; width: 185px;' class='text_btn noselect'>${sfui_language.FROM_LIST}</button>
    `);
  }, 50);
};

empireShow.autoTransportsWndPlanets = () => {
  setTimeout(function () {
    $('#transportResFromWndPlanets').remove();
    $('#WndPlanets_buildings_build_content_cover').next().append(`<button id='transportResFromWndPlanets' onclick='empireShow.transportEmpireShowParse()' class="text_btn noselect" style="margin-left: 5px;padding: 3px;"><span>${sfui_language.DELIVER_TO_PLANETS}</span></button>`);
  }, 50);
}

empireShow.transportAllPlanetsListID = [];
empireShow.transportAllPlanetsList = [];
empireShow.transportWinLastId = '';

empireShow.transportAllFromListOpenWindow = () => {
  let wnd = dhxWins.window('WndListEditr');
  if (wnd === null) {
    dhxWins.createWindow('WndListEditr', 10, 10, 300, 200);
    wnd = dhxWins.window('WndListEditr');
    wnd.setText(sfui_language.PLANET_LIST_FROM_STRING);
    wnd.denyResize();
    let listEditor = `
      <div class="textcontainer-d" style="height: 100%;">
          <textarea id='flyListText' class="inputText" style="width: 100%;height: 110px;"></textarea>
          <br>
          <div class="controlbox-d" style="margin-top: 5px;padding: 5px;">
              <button id='flyListButton' onclick="empireShow.transportAllParse()" class="text_btn noselect" style="width: 100%;padding: 3px;">${sfui_language.LOAD}</button>
          </div>
      </div>
      `;
    wnd.attachHTMLString(listEditor);
  } else {
    wnd.setText(sfui_language.PLANET_LIST_FROM_STRING);
    wnd.bringToTop();
  }
}

empireShow.transportAllParse = () => {
  let list = $('#flyListText').val();
  list = list.split("\n");
  list.forEach((e, i) => {
    list[i] = e.replaceAll(' ', '');
  });
  empireShow.transportAll(list);
}

empireShow.transportEmpireShowParse = () => {
  let list = [];
  Array.from($('#WndPlanets_buildings_build_content_cover span[oncontextmenu]')).forEach(planetElement => {
    list.push(planetElement.innerText);
  });
  empireShow.transportAll(list);
}

empireShow.transportAll = function (fromArray = []) {
  if (empireShow.transportWinLastId) {
    if (dhxWins.window(empireShow.transportWinLastId))
      dhxWins.window(empireShow.transportWinLastId).close()
  }
  let planets = [];
  let idWin = "WndDeliveryClub";
  if (fromArray.length === 0) {
    let planetsData = $("#WndSelect_divplayerplanets").find("span[style='color:#73c95f;cursor:pointer;']");
    Array.from(planetsData).forEach((i) => {
      planets.push(i.innerText);
    });
    empireShow.transportAllPlanetsList = planets;
  } else {
    planets = fromArray;
    empireShow.transportAllPlanetsList = planets;
  }
  empireShow.transportWinLastId = idWin;
  let resList = sfdata.productions.filter(e => e.type === 'resources');
  let planetsHtml = ``;
  empireShow.transportAllPlanetsList.forEach((e, i) => {
    planetsHtml += `<div class='row w-100 mx-0 textcontainer-d'>`;
    planetsHtml += `<div class='col-2 px-0'>
    <span class="inputCheckBox inputCheckBoxChecked" onmousedown="sound_click(1);checkbox_action(this)">
    <input type="checkbox" checked class='toDropValues' value='${empireShow.transportAllPlanetsList[i]}'>
    </span>
    </div>`
    planetsHtml += `<div class='col-10 px-0'>` + e + `</div>`;
    planetsHtml += `</div>`;
  });
  let html = `
    <div class="textcontainer-l" style="float:left;margin-right:10px;margin-bottom:5px;">
    <div class='controlbox-d' style='height: 34px; padding-left: 5px;'>
    <small>${sfui_language.PLANETS_LIST}</small>
    <button style='margin-top: 12px; margin-left: 7px;' class="image_btn noselect" type="button" data-hint="${sfui_language.REMOVE_ALL}" style="width:12px;height:12px;" onclick="empireShow.transportUncheckAll()"><img border="0" width='12px' height='12px' src="/images/icons/flat/i-close-red-16.png"></button>
    <button class="image_btn noselect" type="button" data-hint="${sfui_language.SELECT_ALL}" style="width:12px;height:12px;" onclick="empireShow.transportCheckAll()"><img border="0" width='12px' height='12px' src="/images/icons/flat/i-enter-1-16.png"></button>
    </div>
    <div style='overflow-y: scroll; overflow-x: hidden; padding: 3px; height: 235px; width: 254px;'>
    ${planetsHtml}
    </div>
    </div>
    `;
  html += `<div class='textcontainer-l' style='position: absolute; right: 0px; top: 0px; width: 500px; height: 455px; overflow-y: scroll; overflow-x: hidden; padding: 3px;'>`;
  html += `<div class='row w-100 mx-0 mt-0 textcontainer-l'> <div class='col-12 px-0' style=''>`
  html += `
  <div class="row">
    <div class="col-8" style="padding-right: 0;padding-top: 3px;">
      <label style="">${sfui_language.SHIPING_ALL}</label>
    </div>
    <div class="col-3" style="padding-left: 0;">
      <button type="button" class="text_btn noselect" style="font-size:12px;height:22px;width:120px;float: right;" onclick="sound_click(2); empireShow.getTransportFromOrganizer()">${sfui_language.FROM_ORGANIZER}</button>
    </div>
  </div>`;
  html += `</div> </div>`;
  resList.forEach(e => {
    html += `<div class='row w-100 mx-0 textcontainer-d' style='flex-wrap: nowrap; height:30px; margin-top: 0px; margin-bottom: 0px; padding-top: 2px;'>`;
    html += `<div class='col-1 px-0 pl-1'><img class='noselect' style='border:1px solid #93a7a2;' src='${e.ico}' width=16 height=16></div>`;
    html += "<div class='col-5 px-0 text12 left4'>" + e.name + "</div>";
    html += `<div class='col-6 px-0'><input type='Number' class='inputText transferAllRes w-100' onkeyup='empireShow.recalcMax()' onchange='' data-resid='${e.id}' data-mass='${e.weight}' value='0'></div>`;
    html += `</div>`;
  });
  html += "</div>";
  html += `<div class='textcontainer-l' style='width: 270px; height: 165px; position: absolute; top: 290px; left: 0px;'>`;
  html += `<small>Настройки флота</small><br>`;
  html += `<small style="display: inline-block; width: 40%;">№ флота</small> <input style='width: 55%;' type='Number' class='inputText transferAllResFleet' onchange='empireShow.showSelectFleet()' value='0'><br>`;
  html += `<small style="display: inline-block; width: 40%;">${sfui_language.LOADING_STATION}</small> <input style='width: 55%; margin-bottom: 10px; margin-top: 5px;' class='inputText' id='transportLoadOn'><br>`;
  html += `<small>${sfui_language.FLEET_HOLD}: <span id='transportAllFleetCargo' class='v-norm'></span></small><br>`;
  html += `<small>${sfui_language.LOT_SIZE}: <span id='transportAllNeedOne' class='v-norm'></span></small><br>`;
  html += `<small>${sfui_language.LOT_AT}: <span id='transportAllMax' class='v-norm'></span></small><br>`;
  //html += `<hr><small>${sfui_language.LAUNCH}</small><br>`
  html += `<button id="" onclick="empireShow.savePresetTransport()" style="padding: 4px;margin-top: 5px; margin-right: 5px; display: none;" class="text_btn noselect">Сохранить</button>`;
  html += `<button id="" onclick="empireShow.loadPresetTransport()" style="padding: 4px;margin-top: 5px; margin-right: 5px; display: none;" class="text_btn noselect">Загрузить</button>`;
  html += `<button style='position: absolute; bottom: 0px; right: 0px;padding: 4px;padding-right: 14px;padding-left: 14px;' id="" onclick="empireShow.runTransport()" style="padding: 4px;margin-top: 5px;" class="text_btn noselect">Запустить</button>`;
  html += `</div>`;
  let winID = sfui.CreateWindow(idWin,
    800,
    500,
    sfui_language.DELIVER_TO_PLANETS,
    'i_planets_16.png',
    html,
    false,
    true);
  empireShow.showsUpWins++;
};

empireShow.getTransportFromOrganizer = async function () {
  $($("#WndOrganizer_calc_materials_form").find('table')[0]).find('tr').each((i, e) => {
    let cell = $(e).find('td');
    let mat = cell[1].innerText;
    let matIdData = sfdata.productions.filter(e => e.name === mat);
    let matId = -1;
    if (matIdData.length > 0)
      matId = matIdData[0].id;
    let mCount = sfapi.parseIntExt(cell[2].innerText);
    if (matId != -1) {
      let target = $(`[data-resid='${matId}']`);
      target.val(mCount);
      empireShow.recalcMax();
    }
  })
}

empireShow.transportUncheckAll = async function () {
  $('.toDropValues').prop('checked', false).parent().removeClass('inputCheckBoxChecked');
}

empireShow.transportCheckAll = async function () {
  $('.toDropValues').prop('checked', true).parent().addClass('inputCheckBoxChecked');
}

empireShow.savePresetTransport = async function () {
  alert('Фича в разработке');
}

empireShow.loadPresetTransport = async function () {
  alert('Фича в разработке');
}

empireShow.runTransport = async function () {

  let newArrToDrop = [];
  Array.from($('.toDropValues')).forEach(e => {
    if (e.checked)
      newArrToDrop.push(e.value)
  });

  let win = dhxWins.window(empireShow.transportWinLastId);

  win.setText('Развоз []');

  getWindow('WndFleet').start_load();
  if (empireShow.transportMaxAll > newArrToDrop.length) {
    win.setText('Развоз [Погрузка]');
    await empireShow.loadAllToFleet(newArrToDrop.length);
    for (let iKey in newArrToDrop) {
      win.setText(`Развоз [Полет ${newArrToDrop[iKey]}]`);
      await empireShow.goTo(newArrToDrop[iKey]);
      win.setText(`Развоз [Выгрузка на ${newArrToDrop[iKey]}]`);
      await empireShow.taskCreateDrop();
      await empireShow.taskDropSave();
    }
    win.setText('Развоз [Полет домой]');
    await empireShow.goHome();
  } else {
    let newArray = [...newArrToDrop];
    let needPlanets = newArray.length;
    while (needPlanets > 0) {
      win.setText('Развоз [Погрузка]');
      await empireShow.loadAllToFleet(empireShow.transportMaxAll);
      for (let iKey = 0; iKey < empireShow.transportMaxAll; iKey++) {
        if (newArray.length > 0) {
          let goToPlanet = newArray.splice(0, 1)[0];
          win.setText(`Развоз [Полет ${goToPlanet}]`);
          await empireShow.goTo(goToPlanet);
          win.setText(`Развоз [Выгрузка на ${goToPlanet}]`);
          await empireShow.taskCreateDrop();
          await empireShow.taskDropSave();
          needPlanets -= 1;
        } else {
          needPlanets = 0;
        }
      }
    }
    win.setText('Развоз [Полет домой]');
    await empireShow.goHome();

    win.setText('Развоз [Выгрузить все]');
    await sfcommands.dropAllNoFuelExt(true);
  }
  win.setText('Развоз');
  getWindow('WndFleet').end_load();
  getWindow('WndFleet').refresh()
}

empireShow.loadAllToFleet = async function (need) {
  await empireShow.goHome();
  let arrData = [];
  Array.from($('.transferAllRes')).forEach(e => {
    if (e.value > 0) {
      arrData.push({
        id: e.dataset.resid,
        amm: e.value
      });
    }
  })
  for (let i = 0; i < arrData.length; i++) {
    if (arrData[i].id === '25') {
      await sfapi.loadToFleet(arrData[i].id, arrData[i].amm * need, sfui_playerInfo.race_id);
    } else {
      await sfapi.loadToFleet(arrData[i].id, arrData[i].amm * need);
    }
  }
  return true;
}

/**
 *
 * @param {String|Number} id
 * @param {String|Number} ammount
 * @param {String|Number} raceId
 * @param {String|Number} lvl
 * @returns
 */
sfapi.loadToFleet = async function (id, ammount, raceId = '', lvl = 0) {
  await fetch("?m=windows&w=WndFleet&a=comandhtml&dest=WndFleet_comand_data_new&idcmd=5&icmd=new", {
    "headers": {
      "accept": "*/*",
      "x-requested-with": "XMLHttpRequest"
    },
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  });
  await timeout(100);
  await fetch("?m=windows&w=WndFleet&a=addcomand&dest=WndFleet_main-comands", {
    "headers": {
      "accept": "*/*",
      "content-type": "application/x-www-form-urlencoded",
      "x-requested-with": "XMLHttpRequest"
    },
    "body": `idcmd=5&icmd=new&data[projectid]=0&data[projectid_new_value]=false&data[prodid]=${id}&data[prodid_new_value]=false&data[raceid]=${raceId}&data[raceid_new_value]=true&data[level]=${lvl}&data[size]=${ammount}&data[everyship]=true&data[stoponneed]=false`,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  });
  await timeout(100);
  return true;
}

/**
 *
 * @param {String} coord
 * @param {Boolean} stopnofound
 * @param {Boolean} auto
 * @param {Boolean} securegate
 * @returns {boolean}
 */
sfapi.goTo = async (coord, stopnofound = false, auto = true, securegate = true) => {
  let formData = new FormData();
  formData.append('idcmd', 4);
  formData.append('icmd', 'new');
  formData.append('data[dest]', coord);
  formData.append('data[dest_new_value]', false);
  formData.append('data[stopnofound]', stopnofound);
  formData.append('data[auto]', auto);
  formData.append('data[securegate]', securegate);
  try {
    await fetch("/?m=windows&w=WndFleet&a=addcomand&dest=WndFleet_main-comands", {
      "headers": headerData,
      "body": formData,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
  } catch (e) {
    console.error("Fetch error: sfapi.goTo: ", coord, stopnofound, auto, securegate);
    console.error(e);
    return false;
  }
  return true;
}

/**
 *
 * @returns {boolean}
 */
sfapi.dropAllNoFuel = async () => {
  try {
    await fetch("/?m=windows&w=WndFleet&a=addcomand&dest=WndFleet_main-comands", {
      "headers": {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded",
        "x-requested-with": "XMLHttpRequest"
      },
      "body": "idcmd=11&icmd=new&=true&data[72][0][0]=false&data[453][0][0]=false&data[66][0][0]=false&data[73][0][0]=false",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
  } catch (e) {
    console.error("Fetch error: sfapi.dropAllNoFuel");
    console.error(e);
    return false;
  }
  return true;
}

empireShow.goHome = async function () {
  await fetch(`?m=windows&w=WndFleet&a=externalcmd&dest=WndFleet_main-comands&ecmdid=2&param=${$('#transportLoadOn').val()}&fleetid=${$('.transferAllResFleet').val()}`, {
    "headers": {
      "accept": "*/*",
      "x-requested-with": "XMLHttpRequest"
    },
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  });
  await timeout(100);
  return true;
}

empireShow.goTo = async function (id) {
  await fetch(`?m=windows&w=WndFleet&a=externalcmd&dest=WndFleet_main-comands&ecmdid=2&param=${id}&fleetid=${$('.transferAllResFleet').val()}`, {
    "headers": {
      "accept": "*/*",
      "x-requested-with": "XMLHttpRequest"
    },
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  });
  await timeout(100);
  return true;
}

empireShow.taskCreateDrop = async function () {
  await fetch("?m=windows&w=WndFleet&a=comandhtml&dest=WndFleet_comand_data_new&idcmd=3&icmd=new", {
    "headers": {
      "accept": "*/*",
      "x-requested-with": "XMLHttpRequest"
    },
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  });
  await timeout(100);
  return true;
}

empireShow.taskDropSave = async function () {
  let postData = "&";
  Array.from($('.transferAllRes')).forEach(e => {
    if (e.value > 0) {
      if (e.dataset.resid === '25') {
        postData += `data[prods][${e.dataset.resid}][0][${sfui_playerInfo.race_id}]=${e.value}&`
      } else {
        postData += `data[prods][${e.dataset.resid}][0][0]=${e.value}&`
      }
    }
  })
  await fetch("?m=windows&w=WndFleet&a=addcomand&dest=WndFleet_main-comands", {
    "headers": {
      "accept": "*/*",
      "content-type": "application/x-www-form-urlencoded",
      "x-requested-with": "XMLHttpRequest"
    },
    "body": `idcmd=3&icmd=new${postData}`,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  });
  await timeout(100);
  return true;
}

empireShow.recalcMax = async function () {
  let totalMass = 0;
  Array.from($('.transferAllRes')).forEach(e => {
    if (e.value > 0) {
      totalMass += e.value * e.dataset.mass;
    }
  })
  empireShow.transportMaxOne = totalMass;
  $('#transportAllNeedOne').text(sfapi.tls(totalMass));
  if (empireShow.transportCargoSize > 0) {
    let maxCount = Math.floor(empireShow.transportCargoSize / empireShow.transportMaxOne);
    empireShow.transportMaxAll = maxCount;
    $('#transportAllMax').text(sfapi.tls(maxCount));
  }
}

empireShow.showSelectFleet = async function () {
  $('.dhx_modal_cover_dv').css("z-index",
    '99999');
  $('.dhx_modal_cover_dv').css("display",
    'block');
  try {
    let fleetId = $('.transferAllResFleet').val();
    await fetch(`?m=windows&w=WndFleet&id=${fleetId}`, {
      "headers": {
        "accept": "*/*",
        "x-requested-with": "XMLHttpRequest"
      },
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    });
    await timeout(100);

    let fleedParams = await fetch("?m=windows&w=WndFleet&a=tabload&dest=WndFleet_main-params&tab=main-params", {
      "headers": {
        "accept": "*/*",
        "x-requested-with": "XMLHttpRequest"
      },
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    });
    fleedParams = await fleedParams.text();
    let parser = new DOMParser();
    let doc = parser.parseFromString(fleedParams, "text/html");
    let fleetSpace = sfapi.parseIntExt(doc.querySelector("div[data-hint='" + sfui_language.FLEET_FREE_SPACE + "']").innerText);
    //fleedParams = sfapi.parseIntExt(fleedParams.split(sfui_language.FLEET_FREE_SPACE)[1].split("v-norm'>")[1].split('</span>')[0]);
    empireShow.transportCargoSize = fleetSpace;
    $('#transportAllFleetCargo').text(fleetSpace);
    empireShow.recalcMax();
  } catch (e) {
    alert('Не удалось получить трюм флота. Проверьте номер флота.');
    console.log(e);
    catchError(e);
    empireShow.transportCargoSize = 0;
  }

  $('.dhx_modal_cover_dv').css("z-index",
    '0');
  $('.dhx_modal_cover_dv').css("display",
    'none');
}

empireShow.transportAllTask = function () { };
empireShow.transportCargoSize = 0;
empireShow.transportMaxOne = 0;
empireShow.transportMaxAll = 0;

empireShow.disableAll = async function () {
  $('.dhx_modal_cover_dv').css("z-index",
    '99999');
  $('.dhx_modal_cover_dv').css("display",
    'block');

  let planetsData = $("#WndPlanets_buildings_build_content").find("span[style='color:#73c95f;cursor:pointer;']");
  planets = [];
  planetsIds = [];
  Array.from(planetsData).forEach((i) => {
    planets.push(i.innerText);
    planetsIds.push(i.outerHTML.split('planetid=')[1].split('&amp;tabname')[0]);
  });

  for (let key in planetsIds) {

    await fetch("?m=windows&w=WndPlanet&planetid=" + planetsIds[key], {
      "headers": {
        "accept": "*/*",
        "x-requested-with": "XMLHttpRequest"
      },
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    });

    await timeout(100);

    await fetch(`?m=windows&w=WndBuilding&pid=${planetsIds[key]}&bid=71`, {
      "headers": {
        "accept": "*/*",
        "x-requested-with": "XMLHttpRequest"
      },
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    });

    await timeout(100);

    fetch("?m=windows&w=WndBuilding&a=ba&dest=window", {
      "headers": {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded",
        "x-requested-with": "XMLHttpRequest"
      },
      "body": "ba=updatep&=100%25&data[powerp]=100&data[powerp_new_value]=false&=&data[artefact][id]=0-0-0&=%D0%92%D1%81%D0%B5&=0-0-0%2C%D0%92%D1%81%D0%B5%2C93a7a2&_new_value=false&level_min=-&level_max=-&continue_on_warehouse=false&continue_on_create=false&=%D0%A1%D0%B0%D0%BC%D1%8B%D0%B9%20%D0%BD%D0%B8%D0%B7%D0%BA%D0%B8%D0%B9%20%D1%83%D1%80%D0%BE%D0%B2%D0%B5%D0%BD%D1%8C&level_kind=1&level_kind_new_value=false&stop_on_crash=false&=",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });

    await timeout(100);

  }

  $('.dhx_modal_cover_dv').css("z-index", '0');
  $('.dhx_modal_cover_dv').css("display", 'none');
}

empireShow.enableAll = async function () {
  $('.dhx_modal_cover_dv').css("z-index", '99999');
  $('.dhx_modal_cover_dv').css("display", 'block');

  let planetsData = $("#WndPlanets_buildings_build_content").find("span[style='color:#73c95f;cursor:pointer;']");
  planets = [];
  planetsIds = [];
  Array.from(planetsData).forEach((i) => {
    planets.push(i.innerText);
    planetsIds.push(i.outerHTML.split('planetid=')[1].split('&amp;tabname')[0]);
  });

  for (let key in planetsIds) {

    await fetch("?m=windows&w=WndPlanet&planetid=" + planetsIds[key], {
      "headers": {
        "accept": "*/*",
        "x-requested-with": "XMLHttpRequest"
      },
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    });

    await timeout(100);

    await fetch(`?m=windows&w=WndBuilding&pid=${planetsIds[key]}&bid=71`, {
      "headers": {
        "accept": "*/*",
        "x-requested-with": "XMLHttpRequest"
      },
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    });

    await timeout(100);

    await fetch("?m=windows&w=WndBuilding&a=ba&dest=window", {
      "headers": {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded",
        "x-requested-with": "XMLHttpRequest"
      },
      "body": "ba=updatep&=100%25&data[powerp]=100&data[powerp_new_value]=false&=&data[artefact][id]=157-0-0&=%D0%90%D1%80%D1%82%D0%B5%D1%84%D0%B0%D0%BA%D1%82%20%D1%83%D1%80.2&=157-0-2%2C%D0%90%D1%80%D1%82%D0%B5%D1%84%D0%B0%D0%BA%D1%82%20%D1%83%D1%80.2%2C93a7a2&_new_value=false&level_min=-&level_max=-&continue_on_warehouse=true&continue_on_create=true&=%D0%A1%D0%B0%D0%BC%D1%8B%D0%B9%20%D0%BD%D0%B8%D0%B7%D0%BA%D0%B8%D0%B9%20%D1%83%D1%80%D0%BE%D0%B2%D0%B5%D0%BD%D1%8C&level_kind=1&level_kind_new_value=false&stop_on_crash=false&=",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });

    await timeout(100);
  }

  $('.dhx_modal_cover_dv').css("z-index", '0');
  $('.dhx_modal_cover_dv').css("display", 'none');
}

//Функция создания окна
sfui.winsList = [];
sfui.CreateWindow = function (id, w, h, title, icon, html, resizabel, dragabel) {
  let nameExist = false;
  let destoyed = false;
  let usedId = -1;
  for (let i = 0; i < sfui.winsList.length; i++) {
    if (sfui.winsList[i].id === id) {
      if (dhxWins.window(id) == null || typeof dhxWins.window(id) == "undefined") {
        nameExist = true;
        destoyed = true;
        usedId = i;
      } else {
        nameExist = true;
        destoyed = false;
        //console.error("sfui.createWindow -> " + id + " already in use")
        return i;
      }
    }
  }

  if (typeof w === undefined) w = 300;
  if (typeof h === undefined) h = 200;
  if (typeof resizabel === undefined) resizabel = false;
  if (typeof dragabel === undefined) dragabel = false;
  if (typeof html === "undefined") html = "--html code--";

  dhxWins.createWindow(id, 10, 10, w, h);
  let win = dhxWins.window(id);
  if (!resizabel) win.denyResize();
  if (!dragabel) win.denyMove();
  win.setText((typeof title === "undefined") ? id : title);
  win.centerOnScreen();
  win.attachHTMLString(html);
  if (typeof icon != "undefined")
    win.setIcon("../../../../images/icons/" + icon);

  let win_tmp = {
    id: id,
    window: {
      win: win,
      isOriginalWindow: false
    }
  };
  if (usedId === -1)
    sfui.winsList.push(win_tmp);
  else
    sfui.winsList[usedId] = win_tmp;
  return sfui.winsList.length - 1;
};

sfui.plugins.push({
  sort: 'planet',
  code: 'showMaxBuilds',
  type: 'bool',
  title: sfui_language.MANY_BUILDINGS,
  wndCondition: 'WndPlanet',
  callback: sfui.addMaxBuildsCount,
  callbackCondition: () => {
    return 1;
  },
  help: {
    img: 'https://i.postimg.cc/NfGs14kb/Screenshot-21.jpg',
    text: 'В подсказке при постройке будет в скобках написано, сколько зданий взелет.'
  }
}, {
  sort: 'planet',
  code: 'showMaxShipBuild',
  type: 'bool',
  title: sfui_language.MANY_SHIPS,
  wndCondition: 'WndPlanet',
  callback: sfui.addMaxShipsCount,
  callbackCondition: () => {
    return (getWindow('WndPlanet').activetab === 'main-orbitaldock');
  },
  help: {
    img: 'https://i.postimg.cc/52VvdH27/image.png',
    text: 'Подсчет кол-ва кораблей для строительства.<br>Там где время - минимальновозможное кол-во кораблей для строительства (в скобках значение с учетом населения).<br>Там где ресы и КК - на сколько кораблей хватит данного ресурса'
  }
}, {
  sort: 'planet',
  code: 'switchArchCenters',
  type: 'bool',
  title: sfui_language.SWITCH_ARCH_CENTERS,
  wndCondition: 'WndPlanets',
  callback: () => {
    $("#WndPlanetsEnableAll").remove();
    $("#WndPlanetsDisableAll").remove();
    if ($("#WndPlanets_flt_ssc_prod").children(0)[0].combo._selOption.text === sfui_language.ARCH_CENTER) {
      $('#WndPlanets_buildings_build_title').append(`<span id='WndPlanetsEnableAll' style='cursor: pointer; color: #00D000;' onclick='empireShow.enableAll()'>вкл.</span><span style='cursor: pointer; color: #FF0000;' id='WndPlanetsDisableAll' onclick='empireShow.disableAll()'>выкл.</span>`)
    } else {
      $("#WndPlanetsEnableAll").remove();
      $("#WndPlanetsDisableAll").remove();
    }
  },
  callbackCondition: () => {
    if (getWindow('WndPlanets').activetab === 'buildings-build') {
      return 1;
    }
    return 0;
  },
  help: {
    img: 'https://i.postimg.cc/s2JQSp4X/image.png',
    text: 'В обзоре империи на влкдке "постройки" если выбрать в фильтре арх. центры то будут кнопки переключения работы арх. центров.'
  }
}, {
  sort: 'planet',
  code: 'addHintToTimeResources',
  type: 'bool',
  title: sfui_language.ENOUGH_RES,
  wndCondition: 'WndPlanet',
  callback: sfui.resRemainTime,
  callbackCondition: () => {
    return 1;
  },
  help: {
    img: 'https://i.postimg.cc/G2dWJV7D/Screenshot-4.jpg',
    text: 'Если навести на кол-во у потребляемого ресурса будет подсказка с количеством времени, на которое хватит ресурса'
  }
}, {
  sort: 'planet',
  code: 'setMaxLvlBuilds',
  type: 'bool',
  title: sfui_language.SET_MAX_LVL_BUILDS,
  wndCondition: 'WndPlanet',
  callback: sfui.setMaxLevelsBuilds,
  callbackCondition: () => {
    return 1;
  },
  help: {
    img: 'https://i.postimg.cc/k533DBWf/Screenshot-7.jpg',
    text: 'Для построек на планетах будут устанавливаться максимально доступные уровни'
  }
}, {
  sort: 'planet',
  code: 'toSmallWndStarRows',
  type: 'bool',
  title: sfui_language.SHRINKING_SS_ROWS,
  wndCondition: 'WndStar',
  callback: sfui.resizeStarRows,
  callbackCondition: () => {
    return getWindow("WndStar").activetab === "main-planets";
  },
  help: {
    img: 'https://i.postimg.cc/J0gYg2qP/Screenshot-19.jpg',
    text: 'В окне просмотра системы строки будут минимизированны, вся информация сохранится, например размер планет, масса полей, атмосфера (в номере окрашивается в цвет атмосферы и при наведении будет подсказка), владелец и т.д.'
  }
}, {
  sort: 'planet',
  code: 'calcTimeModuleBuilds',
  type: 'bool',
  title: sfui_language.CALC_SC_PROD_TIME,
  wndCondition: 'WndBuilding',
  callback: () => {
    $('#WndBuilding_data .h22').each((i, e) => {
      try {
        let colsInRow = $(e).find('td');
        let colTime = colsInRow[5].innerText.split(' x ');

        let totalCount = sfapi.parseIntExt($(colsInRow[2]).find('input').val());
        let countPerCycle = sfapi.parseIntExt(colTime[0]);

        //  Если производство не запущено или остался 1 цикл, подсказка не требуется
        if (colTime.length <= 1 || totalCount === countPerCycle)
          return;

        let secondsPerCycle = sfapi.parseIntExt(colTime[1]);
        let buildPerCycle = countPerCycle * secondsPerCycle;
        let timeToBuildText = sfui_formatTimeFromHours(totalCount / buildPerCycle, false);
        colsInRow[5].innerHTML += `<br><small style='color: #00D000; font-size: 11px !important;'>${timeToBuildText}</small>`;
      } catch (e) { }
    });
  },
  callbackCondition: () => {
    return $('#WndBuilding_data [id^="WndBuilding_time_"]').length > 0;
  },
  help: {
    img: 'https://i.postimg.cc/Zqh24XhQ/Screenshot-15.jpg',
    text: 'В окне производства (конкретного здания) под мощностью будет выводится время в часах, до заверешения производства'
  }
}, {
  sort: 'planet',
  code: 'sortUDOnPlanet',
  type: 'bool',
  title: sfui_language.SORT_UD_SETS_PLANET,
  wndCondition: 'WndPlanet',
  callback: sfui.udShufflePlanet,
  callbackCondition: () => {
    return 1
  },
  help: {
    img: "https://i.postimg.cc/GmwwrMsx/Screenshot-26.jpg",
    text: "в просмотре УД (планеты или флота) они будут соритроваться по сетам, недостоющие для сета части будут помечены"
  }
}, {
  sort: 'planet',
  code: 'updateValueInStorage',
  type: 'bool',
  title: sfui_language.PLANET_ANIM_PRODUCTION,
  wndCondition: 'WndPlanet',
  callback: () => {
    clearInterval(getWindow('WndPlanet').timerUpdate);
    getWindow('WndPlanet').timerUpdate = setInterval(sfui.resAnimateChange, 3000);
  },
  callbackCondition: () => {
    return 1
  }
}, {
  sort: 'fleet',
  code: 'showIDFleet',
  type: 'bool',
  title: sfui_language.DISPLAY_FLEET_NUM,
  wndCondition: 'SettingsOnly',
  callback: () => { },
  callbackCondition: () => {
    return 1;
  }
}, {
  sort: 'fleet',
  code: 'WndFleetsBR',
  type: 'bool',
  title: sfui_language.SHOW_FLEET_BR_IN_FLEETS,
  wndCondition: 'WndFleets',
  callback: () => {
    const wnd = getWindow("WndFleets");
    if (wnd.activetab === "main-myfleets") {
      $(".battle-rate-info").remove();
      wnd.fleets.forEach(function (fleetID) {
        let battleRait = $($(`tr[rowid='${fleetID}']`).children()[7]).find(`td:contains("${sfui_language.TEXT_BR}")`)[0].nextElementSibling.innerText;
        let battleRaitHtml = `<span class='v-norm'>` + battleRait.split(".")[0].toString() + "</span>" + ((typeof battleRait.split(".")[1] != "undefined") ? "<span class='v-norm-dec'>." + battleRait.split(".")[1] + "</span>" : "");
        let html = `<div class='text11 battle-rate-info' data-hint='${sfui_language.TEXT_BR}' style='display: inline-block;'>${battleRaitHtml}</div>`;
        $($(`tr[rowid='${fleetID}']`).children()[3]).append(html);
        let orgTd = $($($(`tr[rowid='${fleetID}']`).children()[3]).children()[0]);
        orgTd.css("display", 'inline-block');
        orgTd.css("width", '100px');
      });
    }
  },
  callbackCondition: () => {
    return 1
  },
  help: {
    img: 'https://i.postimg.cc/7hbQKkg5/Screenshot-18.jpg',
    text: 'В окне просмотра флотов рядом с названием флота будет добавляться БР флота'
  }
}, {
  sort: 'fleet',
  code: 'addExternalCommandsFleets',
  type: 'bool',
  title: sfui_language.EXT_BTNS_ON_FLEET,
  wndCondition: 'WndSelect',
  callback: sfui.WndSelectPlanet,
  callbackCondition: () => {
    return 1;
  },
  help: {
    img: 'https://i.postimg.cc/dtfKPW3M/Screenshot-2.jpg',
    text: 'В окне выбора колонии будут добавлены кнопки управления флотом'
  }
}, {
  sort: 'fleet',
  code: 'addExternalCommandsFleetsInEmpire',
  type: 'bool',
  title: sfui_language.EXT_BTNS_ON_EMPIRE_OVERVIEW,
  wndCondition: 'WndPlanets',
  callback: sfui.externalCommandsInEmpire,
  callbackCondition: () => {
    return 1;
  },
  help: {
    img: 'https://i.postimg.cc/PxyB6y9R/Screenshot-3.jpg',
    text: 'Добавляет кнопки в обзоре империи для управления флотом'
  }
}, {
  sort: 'fleet',
  code: 'calcUsedStorageInFleet',
  type: 'bool',
  title: sfui_language.CALC_FLEET_SPACE,
  wndCondition: 'WndFleet',
  callback: sfui.calcUsedStorageInFleet,
  callbackCondition: () => {
    return 1;
  },
  help: {
    img: 'https://i.postimg.cc/Bn1fqxPj/Screenshot-5.jpg',
    text: 'При погрузке во время ввода кол-ва погружаемой ставки будет выводиться масса. Работает только для материалов, руды, минералов и т.д., все что имеет статичную массу.'
  }
}, {
  sort: 'fleet',
  code: 'addExternalUnloadFleet',
  type: 'bool',
  title: sfui_language.ADD_BTN_DROP_ALL_NO_FUEL,
  wndCondition: 'WndFleet',
  callback: sfui.unloadAllNoFuelFleet,
  callbackCondition: () => {
    return 1;
  },
  help: {
    img: 'https://i.postimg.cc/FKytSNZm/Screenshot-6.jpg',
    text: 'В верху управления флотом добавится третья кнопка, для выгрузки всего кроме топки'
  }
}, {
  sort: 'fleet',
  code: 'enterToSave',
  type: 'bool',
  title: sfui_language.APPLY_CMD_ON_ENTER,
  wndCondition: 'WndFleet',
  callback: () => {
    Array.from($(getWindow('WndFleet').win).find('input')).forEach(e => e.onkeyup = (event) => {
      if (event.key === 'Enter') {
        let row = $(event.target).parents('tr[id^="WndFleet_comands_row"]');
        let btnSave = row.find(`[data-hint="${sfui_language.TEXT_SAVE_COMMAND}"]`);
        if (btnSave.hasClass('shaddow3')) {
          getWindow('WndFleet').add_comand('new');
        } else {
          btnSave.click()
        }
      }
    });
  },
  callbackCondition: () => {
    if (getWindow("WndFleet").activetab === 'main-comands') {
      return 1;
    }
    return 0;
  }
}, {
  sort: 'fleet',
  code: 'allowResizeWndFleet',
  type: 'bool',
  title: sfui_language.ALLOW_RESIZE_FLEET_WND,
  isAllowMobile: false,
  wndCondition: 'WndFleet',
  callback: () => {
    let fleetWindow = getWindow('WndFleet').win;
    if (!fleetWindow)
      return;

    sfui.callResizeWndFleet();

    if (fleetWindow.checkEvent('onResizeFinish1'))
      return;

    fleetWindow.allowResize();
    let dimensions = fleetWindow.getDimension();
    fleetWindow.setMinDimension(dimensions[0], dimensions[1]);
    fleetWindow.setMaxDimension(dimensions[0], 'auto');
    fleetWindow.attachEvent('onMaximize', () => {
      fleetWindow.setPosition(fleetWindow.x, 0);
      sfui.callResizeWndFleet();
    });
    fleetWindow.attachEvent('onMinimize', sfui.callResizeWndFleet);
    fleetWindow.attachEvent('onResizeFinish', sfui.callResizeWndFleet);
    fleetWindow.attachEvent('onResizeFinish1', () => { });
  },
  callbackCondition: () => {
    return 1
  }
}, {
  sort: 'fleet',
  code: 'wndFleetsUnloadButtons',
  type: 'bool',
  title: 'Добавить кнопки выгрузки в окне флотов',
  wndCondition: 'WndFleets',
  callback: async () => {
    const wnd = getWindow("WndFleets");
    $(".dropAllNoFuelExtInFleet").remove();
    if (wnd.activetab === "main-myfleets") {
      wnd.fleets.forEach(function (fleetID) {
        let btnAppend = Array.from($($(`tr[rowid='${fleetID}']`).find('td')[5]).find('span[onclick^="fleet_external_comand"]')).at(-1);
        if (!btnAppend)
          return;

        let parent = btnAppend.parentElement;
        let newButton = btnAppend.outerHTML;
        newButton = newButton.replace(/src="(.+)" /gm, 'src="/images/icons/i-unloadall-16.png" ');
        newButton = newButton.replace(/data-hint="(.+)" src/gm, 'data-hint="Добавить компанду `Полет и выгрузить все`" src');
        newButton = newButton.replace(/onclick="fleet_external_comand\((\d+)/gm, 'onclick="fleet_external_comand(16');
        newButton = newButton.replace('<span', '<span class="dropAllNoFuelExtInFleet"');
        parent.innerHTML += newButton;

        newButton = newButton.replace(/src="(.+)" /gm, 'src="/images/icons/i-unloadallnofuel-16.png" ');
        newButton = newButton.replace(/data-hint="(.+)" src/gm, 'data-hint="Добавить компанду `Полет и выгрузить все кроме топлива`" src');
        newButton = newButton.replace(/onclick="fleet_external_comand\((\d+)/gm, 'onclick="fleet_external_comand(17');
        newButton = newButton.replace('<span', '<span class="dropAllNoFuelExtInFleet"');
        parent.innerHTML += newButton;
      });
    }
  },
  callbackCondition: () => {
    return 1
  },
  help: {
    img: 'https://i.postimg.cc/xC64GCbr/Screenshot-17.jpg',
    text: 'В окне просмотра флотов рядом командами флота добавится 2 новые команды - выгрузить все, выгрузить все кроме топлива для флота'
  }
}, {
  sort: 'fleet',
  code: 'noDropHumans',
  type: 'bool',
  title: sfui_language.DO_NOT_UNLOAD_POP,
  wndCondition: 'SettingsOnly',
  callback: () => { },
  callbackCondition: () => {
    return 1
  }
}, {
  sort: 'fleet',
  code: 'WndFleetSmartFleets',
  type: 'bool',
  title: sfui_language.FLEET_SHORTCAST_FLEETS,
  wndCondition: 'WndFleet',
  callback: () => {
    if ($(getWindow('WndFleet').win).find('.dhtmlx_wins_title').length > 0) {
      $('.smartFleetBtn').remove();
      $(getWindow('WndFleet').win).find('.dhtmlx_wins_title').html('');
      $(getWindow('WndFleet').win).find('.dhtmlx_wins_title').css('top', 4);
      $(getWindow('WndFleet').win).find('.dhtmlx_wins_title').append('<div class="controlbox controls-left-row w380" style="height: 27px;"></div>');
      //controlbox
      for (let iKey = 0; iKey < 10; iKey++) {
        $(getWindow('WndFleet').win).find('.dhtmlx_wins_title .controlbox').append(`<div class="buttoncontainer-1 m2 smartFleetBtn" style='display: inline-block;'><button tabindex="-1" data-smartbtnid='${iKey}' data-smartfleetid='-1' oncontextmenu="sfui.showSmartFleetEdit('${iKey}'); sound_click(2); return false;" class="image_btn noselect" id="btn_WndPlayerSettings" type="button" data-hint="Флот не настроен. Нажми правой кнопокй мыши чтоб открыть настройки" style="width:20px;height:20px;border:1px solid rgba(34,170,191,0.25);" onclick=""><img oncontextmenu="return false;" width=18 class="noselect" id="btn_WndPlayerSettings_img" border="0" src="/images/icons/i_arrow_up_plus_green1.png"></button></div><div class="vsep" style="float:left;width:5px;height:100%">&nbsp;</div>`)
      }
      let smartFleetsData = localStorage.getItem('sf_smartFleets');
      if (!smartFleetsData) {
        localStorage.setItem('sf_smartFleets', JSON.stringify([]));
        return;
      }

      let smartFleets = JSON.parse(smartFleetsData) ?? [];
      let smartFleetsButtons = $('.smartFleetBtn button');
      for (let iKey = 0; iKey < smartFleets.length; iKey++) {
        if (smartFleets[iKey]) {
          $(smartFleetsButtons[iKey]).data('smartfleetid', smartFleets[iKey].id);
          if (smartFleets[iKey].icon != '-1') {
            let icon = smartFleets[iKey].icon;
            $(smartFleetsButtons[iKey]).find('img').prop('src', icon);
          }
          if (smartFleets[iKey].hint) {
            $(smartFleetsButtons[iKey])[0].dataset.hint = smartFleets[iKey].hint + " - флот №" + smartFleets[iKey].id;
          } else {
            $(smartFleetsButtons[iKey])[0].dataset.hint = "Флот №" + smartFleets[iKey].id;
          }
          $($(smartFleetsButtons[iKey])[0]).attr('onclick', `sound_click(2); getWindow('WndFleet').show('id=' + ${smartFleets[iKey].id});`)
        }
      }
    }
  },
  callbackCondition: () => {
    return 1;
  },
  help: {
    img: 'https://i.postimg.cc/VLfjTpg4/image.png',
    text: 'В шапке управления флотом будут добавлены кнопки для быстрого доступа к сохранённым флотам. По нажатию ПКМ откроется настройка кнопки, иконка подтягивается автоматически (если подтянулся крестик, значит флот находится под действием нулевого поля и его не видно).'
  }
}, {
  sort: 'fleet',
  code: 'WndFleetSmartFlyLists',
  type: 'bool',
  title: sfui_language.FLEET_SHORTCAST_FLYS,
  wndCondition: 'WndFleet',
  callback: () => {
    $(getWindow('WndFleet').win).find('[id^="WndFleet_comands_topage"].text10').css('width', '10px').removeClass('w20');
    $('.WndFleetSeparatorToSmartFlyList').remove();
    $('.smartFlyBtn').remove();
    let container = $('#WndFleet_container div.controls-left-row.controlbox');
    container.append(`<div class="vsep m2 h100p WndFleetSeparatorToSmartFlyList"></div>`);
    for (let i = 0; i < 6; i++) {
      container.append(`<button oncontextmenu="sfui.showSmartFlyListEdit('${i}', 2); return false;" id='SmartFlyList_${i}u' data-hint='Загрузить командный лист (уникальный для флота). ПКМ что бы изменить. Лист будет добавлен.' type='button' class='image_btn noselect smartFlyBtn' style='width:20px;height:20px;'><img alt="" oncontextmenu="return false;" width=16 height=16 class="noselect" border="0" src="/images/icons/arrrow_dn_16.png"></button>`);
    }
    container.append(`<div class="vsep m2 h100p WndFleetSeparatorToSmartFlyList"></div>`);
    for (let i = 0; i < 3; i++) {
      container.append(`<button oncontextmenu="sfui.showSmartFlyListEdit('${i}', 1); return false;" id='SmartFlyList_${i}' data-hint='Загрузить командный лист (общие листы для всех флотов). ПКМ что бы изменить. Лист будет добавлен.' type='button' class='image_btn noselect smartFlyBtn' style='width:20px;height:20px;'><img alt="" oncontextmenu="return false;" width=16 height=16 class="noselect" border="0" src="/images/icons/arrrow_dn_16.png"></button>`);
    }

    let fleetID = getWindow('WndFleet').fleetid;
    let smartFlyListDataU = localStorage.getItem('sf_smartFlyList_' + fleetID);
    if (!smartFlyListDataU) {
      smartFlyListDataU = Array(6);
      localStorage.setItem('sf_smartFlyList_' + fleetID, JSON.stringify(smartFlyListDataU));
    } else
      smartFlyListDataU = JSON.parse(smartFlyListDataU);

    for (let i = 0; i < 6; i++) {
      if (!smartFlyListDataU[i])
        continue;
      try {
        $(`#SmartFlyList_${i}u`).on('click', async () => {
          getWindow('WndFleet').start_load();
          await fetch(`/?m=windows&w=WndFleet&a=loadflylist&dest=window&flylistid=${smartFlyListDataU[i].id}&fleetmode=2`, {
            "headers": {
              "accept": "*/*",
              "x-requested-with": "XMLHttpRequest"
            },
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
          });
          getWindow('WndFleet').end_load();
          getWindow('WndFleet').refresh();
        });
        $(`#SmartFlyList_${i}u`).attr('data-hint', smartFlyListDataU[i].hint);
        let icon;
        if (smartFlyListDataU[i].icon)
          icon = smartFlyListDataU[i].icon;
        else icon = '/images/icons/i_arrow_up_plus_green1.png';
        $(`#SmartFlyList_${i}u img`).attr('src', icon);
      } catch (e) {
        console.warn(e);
      }
    }

    let smartFlyListData = localStorage.getItem('sf_smartFlyList');
    if (!smartFlyListData) {
      localStorage.setItem('sf_smartFlyList', JSON.stringify(Array(3)));
      return;
    }

    smartFlyListData = JSON.parse(smartFlyListData);
    for (let i = 0; i < 3; i++) {
      if (!smartFlyListData[i])
        continue;
      try {
        $(`#SmartFlyList_${i}`).on('click', async () => {
          getWindow('WndFleet').start_load();
          await fetch(`/?m=windows&w=WndFleet&a=loadflylist&dest=window&flylistid=${smartFlyListData[i].id}&fleetmode=2`, {
            "headers": {
              "accept": "*/*",
              "x-requested-with": "XMLHttpRequest"
            },
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
          });
          getWindow('WndFleet').end_load();
          getWindow('WndFleet').refresh();
        });
        $(`#SmartFlyList_${i}`).attr('data-hint', smartFlyListData[i].hint)
        let icon;
        if (smartFlyListData[i].icon)
          icon = smartFlyListData[i].icon;
        else icon = '/images/icons/i_arrow_up_plus_green1.png';
        $(`#SmartFlyList_${i} img`).attr('src', icon);
      } catch (e) {
        console.warn(e);
      }
    }
  },
  callbackCondition: () => {
    if (getWindow('WndFleet').activetab === 'main-comands')
      return 1;
    return 0;
  }
}, {
  sort: 'fleet',
  code: 'WndFleetInfoExrension',
  type: 'bool',
  title: sfui_language.EXP_FLEET_VIEW,
  wndCondition: 'WndFleetInfo',
  callback: () => {
    // let fleetId = getWindow('WndFleetInfo').urlp.split("=")[1];
    // $($($("#WndFleetInfo_container tr")[1])[0].firstChild).css({
    //   'color': "d4be64", 'cursor': "pointer"
    // }).on('click', function () {
    //   navigator.clipboard.writeText(fleetId);
    // });
    //$($("#WndFleetInfo_container tr")[1])[0].firstChild.setAttribute('data-hint', "Нажмите, что бы скопировать.");
    //WndFleet.lastSelectID = parseInt($($("#WndFleetInfo_container tr")[1])[0].firstChild.innerText);
    let intBR;
    let elemBR = $($(`#WndFleetInfo_container img[data-hint^='${sfui_language.TEXT_BR_EX}']`)[0].parentElement.nextElementSibling);
    if (typeof elemBR.find("span[class='v-norm-dec']").data("hint") === "number")
      intBR = elemBR.find("span[class='v-norm-dec']").data("hint") * 2;

    if (!intBR) {
      if (elemBR.find("span[class='v-null']").length > 0)
        intBR = parseInt(elemBR.find("span[class='v-null']")[0].innerText);
      else
        intBR = sfapi.parseIntExt(elemBR.find("span[class='v-norm']")[0].innerText.split(".")[0]) * 2;
    }
    $(elemBR).append("<div style='color: orange;'>" + sfapi.tls(intBR) + "</div>").css('width', '130px').css('font-size', '11px').removeClass('w90');
    $($(`#WndFleetInfo_container img[data-hint^='${sfui_language.TEXT_DURABILITY}']`)[0].parentElement.nextElementSibling).css('width', '45px').removeClass('w80');
    getWindow("WndFleetInfo").win.allowResize();
    let targetElement = $(`#WndFleetInfo_container div:contains('${sfui_language.ANC_DEVICES}').cell_hdr`)[0];
    let item = `<div class='controls-center-row textbox no-border-top h28 w100p'>
          <span class='w-100' style="height:16px; text-align: center;">
          <small id='CalculateRocketsButton' style='cursor: pointer; color: orange;' onclick='sfui.calculateRockets()'>${sfui_language.CALC_DEVIATION}</small>
          </span></div>`;
    let p = document.createElement('div');
    p.innerHTML = item;
    targetElement.insertAdjacentElement('beforeBegin', p);
    item = `<div class='controls-center-row textbox no-border-top h28 w100p'>
          <span class='w-100' style="height:16px; text-align: center;">
         <small id='CalculateFleetButton' style='cursor: pointer; color: orange;' onclick='sfui.calculateFleetInfo()'>${sfui_language.DETAIL_FLEET_INFO}</small>
          </span></div>`;
    p = document.createElement('div');
    p.innerHTML = item;
    targetElement.insertAdjacentElement('beforeBegin', p);
  },
  callbackCondition: () => {
    return 1
  },
  help: {
    img: 'https://i.postimg.cc/wjxdjxz1/Screenshot-23.jpg',
    text: 'В окне просмотра сведений о чужом флоте выводит удвоенный БР и расчёт отклонения ракет'
  }
}, {
  sort: 'fleet',
  code: 'ShuffleUDInFleet',
  type: 'bool',
  title: sfui_language.SORT_UD_SETS_FLEET,
  wndCondition: 'WndFleet',
  callback: sfui.udShuffleFleet,
  callbackCondition: () => {
    return 1
  },
  help: {
    img: "https://i.postimg.cc/GmwwrMsx/Screenshot-26.jpg",
    text: "в просмотре УД (планеты или флота) они будут соритроваться по сетам, недостоющие для сета части будут помечены"
  }
}, {
  sort: 'tech',
  code: 'setMaxTech',
  type: 'bool',
  title: sfui_language.SET_MAX_TECH,
  wndCondition: 'WndScience',
  callback: sfui.WndScienceSetMaxTech,
  callbackCondition: () => {
    return 1;
  },
  help: {
    img: 'https://i.postimg.cc/J7PLK7Wz/Screenshot-1.jpg',
    text: 'В окне технологий будут устанавливаться максимальные уровни'
  }
}, {
  sort: 'tech',
  code: 'sortTechByTime',
  type: 'bool',
  title: sfui_language.SORT_TECHS,
  wndCondition: 'WndScience',
  callback: () => {
    const newList = $('#WndScience_science_seq_form .h24:not(:has(> td[colspan]))')
      .sort((e1, e2) => {
        let e1t = Number.MAX_SAFE_INTEGER;
        let e2t = Number.MAX_SAFE_INTEGER;

        if (e1.childNodes[5].hasAttribute('sec'))
          e1t = sfapi.parseIntExt(e1.childNodes[5].getAttribute('sec'));

        if (e2.childNodes[5].hasAttribute('sec'))
          e2t = sfapi.parseIntExt(e2.childNodes[5].getAttribute('sec'));

        return e1t - e2t;
      });
    let newHTML = "";
    newList.each((i, e) => { newHTML += e.outerHTML });
    $("#WndScience_science_seq_form .data_table.p0 tbody")[1].innerHTML = newHTML;
  },
  callbackCondition: () => {
    return 1;
  }
}, {
  sort: 'tech',
  code: 'WndProjectDiffChecker',
  type: 'bool',
  title: sfui_language.DIFF_CHECKER,
  wndCondition: 'WndShipProjects',
  callback: () => {
    $("#diffCheckerBTN").remove();
    $("#WndShipProjects_flt_form .controls-center-row").append(`
      <button tabindex="-1" id='diffCheckerBTN' class="image_btn noselect" type="button" data-hint="${sfui_language.COMP_TWO_PROJECTS}" style="width:28px;height:28px;" onclick="sound_click(2); sfui.openDiffChecker()">
      <img class="noselect" border="0" src="/images/icons/flat/i-to-angar-12.png">
      </button>`)
  },
  callbackCondition: () => {
    return 1;
  },
  help: {
    img: 'https://i.postimg.cc/NFsWjLCy/Screenshot-20.jpg',
    text: 'Позволяет сравнить 2 проекта и вывести разницу в модулях и экспоритровать её в органайзер с желаемым множетелем. Кнопка находится в окне проектов кораблей, справа от фильтра. В левую часть прописывается номер исходного проекта, в правую часть - нового. После вставки второго проекта сравнение запустится автоматически. В центральной колонке будет выведен список требуемых для модернизации модулей.'
  }
}, {
  sort: 'tech',
  code: 'saveAsImageButton',
  type: 'bool',
  title: sfui_language.SAVE_PROJECT_AS_IMAGE,
  wndCondition: 'WndShipProjectInfo',
  callback: () => {
    if (!this.inited) {
      let html2canvas_script = document.createElement('script');
      html2canvas_script.setAttribute('src', 'https://html2canvas.hertzen.com/dist/html2canvas.min.js');
      document.head.appendChild(html2canvas_script);
      this.inited = true;
    }
    $("#saveAsImgBTN").remove();
    $("#WndShipProjectInfo_project_group_form > div.controls-center-row").append(`
        <button id="saveAsImgBTN" class="image_btn noselect" type="button" data-hint="${sfui_language.COPY_PROJ_AS_IMAGE}" style="width:22px;height:22px;" onclick="sound_click(2); sfui.shipProjInfo_ProjCopyAsImg();">
          <img oncontextmenu="return false;" class="noselect" border="0" src="/images/icons/i_copy_16.png">
        </button>`);
  },
  callbackCondition: () => {
    return 1;
  },
  help: {
    img: 'https://i.postimg.cc/5tfRd25t/Save-As-Image-Help.jpg',
    text: 'Добавляет кнопку для сохранения ПОЛНОГО скриншота открытого проекта в буфер обмена'
  }
}, {
  sort: 'tech',
  code: 'addLoadModuleFromCreateShipProject',
  type: 'bool',
  title: sfui_language.ADD_LOAD_BUTTON_IN_DESIGN,
  wndCondition: 'WndSelect',
  callback: () => {
    $('.loadFromCreateProject').remove();
    $('.hintcontent[id^="WndSelect_planets_hint"]').each((i, e) => {
      let planets = [];
      $(e).find(`span[onclick]`).each((ii, ee) => {
        let planetText = ee.onclick.toString()
        let idPlanet = /planetid=(\d+)/gm.exec(planetText)[1];
        planets.push(idPlanet);
      });
      let moduleData = /Productions-(\d+):(\d+)&amp;level=(\d+)/gm.exec($($(e).parent().parent().parent().children()[0]).html());
      let idModule = moduleData[1];
      let idRace = moduleData[2];
      let moduleLevel = moduleData[3];
      $(e).find('.h18').each((ii, ee) => {
        let moduleCount = sfapi.parseIntExt($($(e).find('.value.text11.w60')[ii]).text());
        $(ee).append(`<td class="loadFromCreateProject"><button onclick="sound_click(2);fleet_external_comand(10,'${planets[ii]}:${idModule}-${idRace}-${moduleLevel}-${moduleCount}');return cancelEvent(event);" class="image_btn noselect" style="width:16px;height:16px;"><img src="/images/icons/i-load-12.png" style="width: 14px; height: 14px"></button></td>`)
      });
    });
  },
  callbackCondition: () => {
    return 1;
  },
  help: {
    img: 'https://i.postimg.cc/YC5v7sJ8/Screenshot-22.jpg',
    text: 'При выборе модуля, на подсказке о кол-ве модулей на планетах будет кнопка "погрузить все" для открытого флота'
  }
}, {
  sort: 'tech',
  code: 'allowResizeWndShipProject',
  type: 'bool',
  title: sfui_language.ALLOW_RESIZE_DESIGN_WND,
  isAllowMobile: false,
  wndCondition: 'WndShipProject',
  callback: () => {
    let projectWindow = getWindow('WndShipProject').win;
    if (!projectWindow)
      return;

    sfui.callResizeWndShipProject();

    if (projectWindow.checkEvent('onResizeFinish1'))
      return;

    projectWindow.allowResize();
    let dimensions = projectWindow.getDimension();
    projectWindow.setMinDimension(dimensions[0], dimensions[1]);
    projectWindow.setMaxDimension(dimensions[0], 'auto');
    projectWindow.attachEvent('onMaximize', () => {
      projectWindow.setPosition(projectWindow.x, 0);
      sfui.callResizeWndShipProject();
    });
    projectWindow.attachEvent('onMinimize', sfui.callResizeWndShipProject);
    projectWindow.attachEvent('onResizeFinish', sfui.callResizeWndShipProject);
    projectWindow.attachEvent('onResizeFinish1', () => { });
  },
  callbackCondition: () => {
    return 1
  }
}, {
  sort: 'automation',
  code: 'autoTransports',
  type: 'bool',
  title: sfui_language.PLANET_TRANSFER,
  wndCondition: 'WndSelect',
  callback: empireShow.autoTransports,
  callbackCondition: () => {
    if (getWindow('WndSelect').win.getText() === sfui_language.SELECT_COLONY) {
      return 1;
    }
    return 0;
  },
  help: {
    img: 'https://i.postimg.cc/cC6k6hmW/Screenshot-28.jpg',
    text: 'Функция формирующая полетный лист на выбранные планеты для развора ресомата'
  }
}, {
  sort: 'automation',
  code: 'autoTransportsInEmpireShow',
  type: 'bool',
  title: sfui_language.PLANET_TRANSFER_EMPIRE_SHOW,
  wndCondition: 'WndPlanets',
  callback: empireShow.autoTransportsWndPlanets,
  callbackCondition: () => {
    if (getWindow('WndPlanets').activetab === 'buildings-build') {
      return 1;
    }
    return 0;
  },
  // help: {
  //   img: 'https://i.postimg.cc/cC6k6hmW/Screenshot-28.jpg',
  //   text: 'Функция формирующая полетный лист на выбранные планеты для развора ресомата'
  // }
}, {
  sort: 'automation',
  code: 'addLoadMaterialsInQuest',
  type: 'bool',
  title: sfui_language.QUEST_ADD_BTN_LOAD,
  wndCondition: 'WndQuestStart',
  callback: async () => {
    let wndData = $('#WndQuestStart_container').text();
    if (wndData.indexOf('Федерации срочно требуется:') + 1) {
      let fToLoadQ = async () => {
        getWindow('WndFleet').start_load();
        let materialText = $('#WndQuestStart_container [style="color:#93a7a2"]').text();
        let materialIdData = sfdata.productions.filter(e => e.name === materialText);
        let materialId = -1;
        if (materialIdData) {
          materialId = materialIdData[0].id;
        }
        let materialCount = -1;
        if (materialId) { // TODO!
          materialCount = sfapi.parseIntExt(wndData.split('в количестве ')[1].split('шт.')[0]);
        }
        if (materialId >= 0 && materialCount >= 0) {
          await sfapi.loadToFleet(materialId, materialCount);
          getWindow('WndFleet').end_load();
          getWindow('WndFleet').refresh();
        }
      }
      let html = `<button id='loadToFleetQuest' tabindex="-1" oncontextmenu="return false;" class="image_btn noselect" type="button" data-hint="Погрузить" style="width:20px;height:20px;"><img oncontextmenu="return false;" class="noselect" border="0" src="/images/icons/i_buy_12.png"></button>`
      $('#WndQuestStart_container [style="color:#93a7a2"]').append(html);
      $('#loadToFleetQuest')[0].onclick = () => {
        sound_click(2);
        fToLoadQ();
      }
    }
  },
  callbackCondition: () => {
    return 1;
  },
  help: {
    img: 'https://i.postimg.cc/JnrFBJ0c/Screenshot-16.jpg',
    text: 'В задании "Доставить федерации материалы" добавится кнопка для погрузки материала во флот'
  }
}, {
  sort: 'battle',
  code: 'battleLogTable',
  type: 'bool',
  title: sfui_language.ADD_COMBAT_MASH,
  wndCondition: 'SettingsOnly',
  callback: () => { },
  callbackCondition: () => {
    return 1
  },
  help: {
    img: 'https://i.postimg.cc/Bn71z1zD/Screenshot-27.jpg',
    text: 'В просмотре боя будет отрисовываться специальная сетка, отображащая корабли на позициях и другую информацию'
  }
}, {
  sort: 'battle',
  code: 'allowResizeWndBattle',
  type: 'bool',
  title: sfui_language.ALLOW_RESIZE_BATTLE_WINDOW,
  isAllowMobile: false,
  wndCondition: 'WndBattle',
  callback: () => {
    let battleWindow = getWindow('WndBattle').win;
    if (!battleWindow)
      return;

    sfui.callResizeWndBattle();

    if (battleWindow.checkEvent('onResizeFinish1'))
      return;

    battleWindow.allowResize();
    let dimensions = battleWindow.getDimension();
    battleWindow.setMinDimension(dimensions[0], dimensions[1]);
    battleWindow.setMaxDimension(dimensions[0], 'auto');
    battleWindow.attachEvent('onMaximize', () => {
      battleWindow.setPosition(battleWindow.x, 0);
      sfui.callResizeWndBattle();
    });
    battleWindow.attachEvent('onMinimize', sfui.callResizeWndBattle);
    battleWindow.attachEvent('onResizeFinish', sfui.callResizeWndBattle);
    battleWindow.attachEvent('onResizeFinish1', () => { });
  },
  callbackCondition: () => {
    return 1
  }
}, {
  sort: 'battle',
  code: 'allowResizeWndControlBattle',
  type: 'bool',
  title: sfui_language.ALLOW_RESIZE_SELECT_TARGET_WND,
  isAllowMobile: false,
  wndCondition: 'WndControlBattle',
  callback: () => {
    let controlBattleWindow = getWindow('WndControlBattle').win;
    if (!controlBattleWindow)
      return;

    sfui.callResizeWndControlBattle();

    if (controlBattleWindow.checkEvent('onResizeFinish1'))
      return;

    controlBattleWindow.allowResize();
    let dimensions = controlBattleWindow.getDimension();
    controlBattleWindow.setMinDimension(dimensions[0], dimensions[1]);
    controlBattleWindow.setMaxDimension(614, 'auto');
    controlBattleWindow.attachEvent('onMaximize', () => {
      controlBattleWindow.setPosition(controlBattleWindow.x, 0);
      sfui.callResizeWndControlBattle();
    });
    controlBattleWindow.attachEvent('onMinimize', sfui.callResizeWndControlBattle);
    controlBattleWindow.attachEvent('onResizeFinish', sfui.callResizeWndControlBattle);
    controlBattleWindow.attachEvent('onResizeFinish1', () => { });
  },
  callbackCondition: () => {
    return 1
  }
}, {
  sort: 'battle',
  code: 'allowResizeWndBattleLogs',
  type: 'bool',
  title: sfui_language.ALLOW_RESIZE_BATTLE_WND_ANOTHER,
  isAllowMobile: false,
  wndCondition: 'WndBattleLogs',
  callback: () => {
    let battleLogsWindow = getWindow('WndBattleLogs').win;
    if (!battleLogsWindow)
      return;

    sfui.callResizeWndBattleLogs();

    if (battleLogsWindow.checkEvent('onResizeFinish1'))
      return;

    battleLogsWindow.allowResize();
    let dimensions = battleLogsWindow.getDimension();
    battleLogsWindow.setMinDimension(dimensions[0], dimensions[1]);
    battleLogsWindow.setMaxDimension(dimensions[0], 'auto');
    battleLogsWindow.attachEvent('onMaximize', () => {
      battleLogsWindow.setPosition(battleLogsWindow.x, 0);
      sfui.callResizeWndBattleLogs();
    });
    battleLogsWindow.attachEvent('onMinimize', sfui.callResizeWndBattleLogs);
    battleLogsWindow.attachEvent('onResizeFinish', sfui.callResizeWndBattleLogs);
    battleLogsWindow.attachEvent('onResizeFinish1', () => { });
  },
  callbackCondition: () => {
    return 1
  }
}, {
  sort: 'another',
  code: 'usedAnotherBG',
  type: 'bool',
  title: sfui_language.USE_CUSTOM_BG,
  wndCondition: 'OnLoadScript',
  callback: sfui.setCustumBG,
  callbackCondition: () => {
    return 1;
  }
}, {
  sort: 'another',
  code: 'anotherBG',
  type: 'string',
  title: sfui_language.LINK_BG,
  wndCondition: 'SettingsOnly',
  callback: () => { },
  callbackCondition: () => {
    return 1;
  }
}, {
  sort: 'another',
  code: 'removeMaxHeightWndNewMessage',
  type: 'bool',
  title: sfui_language.OPT_NEW_MSG_WIN,
  wndCondition: 'OnLoadScript',
  callback: () => {
    //console.log($("#WndMessages_hint_messages_form")[0]);
    setTimeout(function tickMessWnd() {
      if ($("#divNewMessages").length === 0) {
        setTimeout(tickMessWnd, 100);
      } else {
        $("#divNewMessages")[0].addEventListener("DOMSubtreeModified", () => {
          if (!$("#divNewMessages").data('refresh')) {
            $("#divNewMessages").data('refresh', 'await');
            setTimeout(() => {
              sfui_redrawNewMesagesWindow();
              setTimeout(() => {
                $("#divNewMessages").data('refresh', null);
              }, 25);
            }, 1);
          }
        });
        sfui_redrawNewMesagesWindow();
      }
    }, 100);
  },
  callbackCondition: () => {
    return 1;
  }
}, {
  sort: 'tc',
  code: 'calcSellIG',
  type: 'bool',
  title: sfui_language.AUTO_CALC_CREDIT_SALE,
  wndCondition: 'WndTrade',
  callback: sfui.updateSellCredits,
  callbackCondition: () => {
    return getWindow('WndTrade').activetab === "federation-sellresourses";
  },
  help: {
    img: 'https://i.postimg.cc/mZdvCdQc/Screenshot-10.jpg',
    text: 'У меня 0 (все продал хе-хе), но по факту там автоматически будет выставляться сумма кредитов для продажи (сумма чтоб полностью обнулить доступную продажу)'
  }
}, {
  sort: 'tc',
  code: 'toSmallTradeRows',
  type: 'bool',
  title: sfui_language.SHRINKING_TC_ROWS,
  wndCondition: 'WndTrade',
  callback: sfui.updateTradeRow,
  callbackCondition: () => {
    return getWindow('WndTrade').activetab === "main-rates";
  },
  help: {
    img: 'https://i.postimg.cc/mrNqDVLg/Screenshot-11.jpg',
    text: 'Уменьшает высоту строк торговых стравок, таким образом все ставки умещаются на странице без скролла'
  }
}, {
  sort: 'tc',
  code: 'calcTradeCount',
  type: 'bool',
  title: sfui_language.TC_ALL_PRICES,
  wndCondition: 'WndTrade',
  callback: sfui.calcTradeCount,
  callbackCondition: () => {
    return getWindow('WndTrade').activetab === "main-rates";
  },
  help: {
    img: 'https://i.postimg.cc/gkQ1Bntm/Screenshot-13.jpg',
    text: 'Сумма всех ставок будет подсчитываться и выводится в отдельном окошке. Приблуда для оценивания продаж всего что выставленно.'
  }
}, {
  sort: 'another',
  code: 'adLinksParse',
  type: 'bool',
  title: sfui_language.ADS_LINKS,
  wndCondition: 'WndAdversting',
  callback: () => {
    setTimeout(() => {
      let note = $('#WndAdversting_note');
      let htmlCode = note.html().replace(/(http[s]?:\/\/[^ <]+?)([.,]*?[ <])/g, "<a href='$1' target='_blank' style='color:#eee;'>$1</a>$2");
      note.html(htmlCode);
    }, 100);
  },
  callbackCondition: () => {
    return 1;
  }
}, {
  sort: 'another',
  code: 'wndTradeParseLink',
  type: 'bool',
  title: sfui_language.ADS_LINKS_IN_SC,
  wndCondition: 'WndTrade',
  callback: () => {
    setTimeout(() => {
      let ad = $('#WndTrade_adversting_content');
      let htmlCode = ad.html().replace(/(http[s]?:\/\/[^ <]+?)([.,]*?[ <])/g, "<a href='$1' target='_blank' style='color:#eee;'>$1</a>$2");
      ad.html(htmlCode);
    }, 100);
  },
  callbackCondition: () => {
    return getWindow('WndTrade').activetab === "main-adversting";
  },
  help: {
    img: 'https://i.postimg.cc/6pZFstFR/Screenshot-14.jpg',
    text: 'Ссылки будут кликабельными и открывать ссылку в новой вкадке барузера'
  }
}, {
  sort: 'another',
  code: 'wndSearchCalcSelectedMass',
  type: 'bool',
  title: sfui_language.MASS_SELECTED_ASTRO_FIELDS,
  wndCondition: 'WndSearchMap',
  help: {
    img: "https://i.postimg.cc/nLqLpjzC/Screenshot-25.jpg",
    text: "При выборе полей будет отображатся масса выбранных полей (окно поиска астероидных полей)"
  },
  callback: () => {
    $('#WndSearchMap_planets_totalselectmasslabel').remove();
    $('#WndSearchMap_planets_totalselectmass').remove();
    $('#WndSearchMap_planets_totalpages').parent().append(`<span id='WndSearchMap_planets_totalselectmasslabel' class="value_label m2">Масса выбраных полей</span><div data-hint="Масса выбраных полей" id="WndSearchMap_planets_totalselectmass" class="value-n text10 h18 m2" style='padding: 3px;'>0</div>`);
    $('#WndSearchMap_planets_form div.controls-left-row span.mr4 span.inputCheckBox').parent().attr('onclick', `sfui.WndSearchCalcSelectedMass()`);
    $(getWindow('WndSearchMap').win).find(`.inputCheckBox`).on('click', sfui.WndSearchCalcSelectedMass);
  },
  callbackCondition: () => {
    return 1
  }
}, {
  sort: 'another',
  code: 'shuffleUDInTrade',
  type: 'bool',
  title: sfui_language.SORT_UD_SETS_TRADE_FEDERATION,
  wndCondition: 'WndTrade',
  callback: sfui.udShuffleTrade,
  callbackCondition: () => {
    return 1
  }
}, {
  sort: 'another',
  code: 'allowResizeWndPlayersChat',
  type: 'bool',
  title: sfui_language.ALLOW_RESIZE_CHAT_WND,
  isAllowMobile: false,
  wndCondition: 'WndPlayersChat',
  callback: () => {
    let chatWindow = getWindow('WndPlayersChat').win;
    if (!chatWindow)
      return;

    sfui.callResizeWndPlayersChat();

    if (chatWindow.checkEvent('onResizeFinish1'))
      return;

    chatWindow.allowResize();
    let dimensions = chatWindow.getDimension();
    chatWindow.setMinDimension(dimensions[0], dimensions[1]);
    chatWindow.setMaxDimension(950, 'auto');
    chatWindow.attachEvent('onMaximize', () => {
      chatWindow.setPosition(chatWindow.x, 0);
      sfui.callResizeWndPlayersChat();
    });
    chatWindow.attachEvent('onMinimize', sfui.callResizeWndPlayersChat);
    chatWindow.attachEvent('onResizeFinish', sfui.callResizeWndPlayersChat);
    chatWindow.attachEvent('onResizeFinish1', () => { });
  },
  callbackCondition: () => {
    return 1
  }
}, {
  sort: 'another',
  code: 'findGGInMap',
  type: 'bool',
  title: sfui_language.DISPLAY_MAP_GATE,
  wndCondition: 'WndStarMapB',
  help: {
    img: "https://i.postimg.cc/FF3YN6YT/Screenshot-24.jpg",
    text: 'При нажатии правой кнопке на карте будет отображен ближайшие гипер врата'
  },
  callback: () => {
    $('#WndStarMapB_map').mousedown(function (e) {
      setTimeout(() => {
        if (e.button === 2) {
          let minDistance = 999999;
          let minName = 'Undefined!'
          let posClick = $('#WndStarMapB_rm_menu_coord').text();
          let x = sfapi.parseIntExt(posClick.split('-')[0]);
          let y = sfapi.parseIntExt(posClick.split('-')[1]);
          for (let key in getWindow('WndStarMapB').map.stars) {
            let eMap = getWindow('WndStarMapB').map.stars[key];
            if (eMap.isgg) {
              let oX = sfapi.parseIntExt(eMap.x);
              let oY = sfapi.parseIntExt(eMap.y);
              let distance = Math.sqrt(Math.pow(oX - x, 2) + Math.pow(oY - y, 2));
              if (minDistance > distance) {
                minDistance = distance;
                minName = eMap.id;
              }
            }
          }
          if ($('#ggFindInfo').length === 0) {
            $('#divPopupMenu').css('height', '80px')
            $('#divPopupMenu div.controls-center-col-top').append('<div id="ggFindInfo" class="textcontainer center" style="width: 100%; height: 20px; padding-left: 0px; padding-right: 0px">123</div>')
            if (999999 > minDistance) {
              $("#ggFindInfo").html(`<span style="font-size: 9px">${minDistance.toFixed(2)}св. ${minName}</span>`)
            } else {
              $("#ggFindInfo").html(`<span style="font-size: 9px">---</span>`)
            }
          }
        }
      }, 200)
    });
  },
  callbackCondition: () => {
    return 1
  }
}, {
  sort: 'another',
  code: 'removeTabIndex',
  type: 'bool',
  title: sfui_language.REMOVE_DISABLING_TABS,
  wndCondition: 'SettingsOnly',
  callback: () => { },
  callbackCondition: () => {
    return 1
  }
}, {
  sort: 'bottom_panel',
  code: 'addFavoriteBottonInBottom',
  type: 'bool',
  title: sfui_language.ADD_FAV_BTN_BOTTOM,
  wndCondition: 'OnLoadScript',
  callback: () => {
    let htmlBtn = `
      <div class='buttoncontainer-1 m2'>
      <button tabindex="-1" oncontextmenu="return false;" class="image_btn noselect m2" type="button" data-hint="${sfui_language.TEXT_FAVORITE}" style="width:32px;height:32px;"
        onclick="
          sound_click(2);
          getWindow('WndSpaceFavorites').show();
          return cancelEvent(event);
      ">
        <img oncontextmenu="return false;" class="noselect" border="0" src="/images/icons/i-space-favorite-24.png">
      </button>
      </div>
      `
    $("#divBottom .controls").last().children().first().before(htmlBtn);
  },
  callbackCondition: () => {
    return 1;
  }
}, {
  sort: 'bottom_panel',
  code: 'addCalcBottonInBottom',
  type: 'bool',
  title: sfui_language.ADD_CALC_BTN_BOTTOM,
  wndCondition: 'OnLoadScript',
  callback: () => {
    let htmlBtn = `
      <div class='buttoncontainer-1 m2'>
      <button tabindex="-1" oncontextmenu="return false;" class="image_btn noselect m2" type="button" data-hint="${sfui_language.CALC_TITLE_WINDOW}" style="width:32px;height:32px;"
        onclick="
          sound_click(2);
          sfui.createNewCalcWin();
          return cancelEvent(event);
      ">
        <img oncontextmenu="return false;" class="noselect" border="0" src="/images/icons/flat/i-organizer-24.png">
      </button>
      </div>
      `
    $("#divBottom .controls").last().children().first().before(htmlBtn);
  },
  callbackCondition: () => {
    return 1;
  }
});

sfui.callResizeWndBattle = () => {
  let battleWnd = $(getWindow('WndBattle').win);
  battleWnd.find('#WndBattle_battle').css('height', 'calc(100% - 30px)');
  battleWnd.find('#WndBattle_battle').children().eq(1).css('height', 'calc(100% - 30px)');
  battleWnd.find('#WndBattle_cicle_log_content_cover').css('height', 'calc(100% - 30px)');
  battleWnd.find('.controls-left-row.controlbox').css('top', '').css('bottom', '1px');
  battleWnd.find('.textcontainer').first().css('width', '210px').css('height', 'calc(100% - 31px)').children().first().css('inset', '4px -4px 2px');

  let battleControl = $("#WndBattle_battlecontrol");
  if (battleControl.length > 0) {
    battleControl.css('bottom', '17px').css('top', '');
    battleWnd.find('#WndBattle_cicle_log_content_cover').css('height', 'calc(100% - 240px)');
  }
}

sfui.callResizeWndControlBattle = () => {
  try {
    if ($('#WndControlBattle_battlecontrolbuttons').length < 1)
      return;

    getWindow('WndControlBattle').win.allowResize();
    $('#WndControlBattle_battlecontrolbuttons').css('top', '').css('bottom', '0px');
    $('#WndControlBattle_battlecontrol').css('height', 'calc(100% - 60px)');
    $('#WndControlBattle_battlecontrol').children().first().css('height', '100%');
  } catch (e) {
    console.error(e);
  }
}

sfui.callResizeWndBattleLogs = () => {
  $(getWindow('WndBattleLogs').win).find('#WndBattleLogs_battle').css('height', 'calc(100% - 30px)');
  $($(getWindow('WndBattleLogs').win).find('#WndBattleLogs_battle').children()[1]).css('height', 'calc(100% - 30px)');
  $(getWindow('WndBattleLogs').win).find('#WndBattleLogs_cicle_log_content_cover').css('height', 'calc(100% - 30px)');
  $(getWindow('WndBattleLogs').win).find('.controls-left-row.controlbox').css('top', '').css('bottom', '1px');
  $($(getWindow('WndBattleLogs').win).find('.textcontainer')[0]).css('height', 'calc(100% - 30px)');
  $("#WndBattleLogs_battles").css('height', 'calc(100% - 32px)')
}

sfui.callResizeWndPlayersChat = () => {
  $('#WndPlayersChat_chat').css('width', '100%').css('height', '100%');
  $(getWindow('WndPlayersChat').win).find('.dhx_tablist_zone').css('width', '100%');
  $(getWindow('WndPlayersChat').win).find('.dhxcont_global_content_area.dhxcont_tabbar_dhx_web[style^="z-index: 1"]').css('width', '100%').css('height', 'calc(100% - 2px)');
  $(getWindow('WndPlayersChat').win).find('.dhxcont_global_content_area.dhxcont_tabbar_dhx_web').css('width', '100%').css('height', 'calc(100% - 2px)').css('box-sizing', 'border-box');
  $(getWindow('WndPlayersChat').win).find('.dhx_tabcontent_zone').css('width', '100%').css('height', 'calc(100% - 29px)');
  $(getWindow('WndPlayersChat').win).find('[ida="dhxMainCont"]').css('width', '100%').css('height', '100%');

  $("#WndPlayersChat_message_text").parent().css('top', '').css('bottom', '-1px').css('width', 'calc(100% - 34px)');
  $("#WndPlayersChat_message_text").css('width', '100%');
  $(getWindow('WndPlayersChat').win).find(`button[data-hint="${sfui_language.TEXT_SEND_MSG}"]`).parent().css('top', '').css('bottom', '-1px').css('left', '').css('right', '4px');

  $(getWindow('WndPlayersChat').win).find('[id^="WndPlayersChat_main"]').each((i, e) => {
    let target = $($(e).children()[0]);
    if (target.html() != '') {
      target.css('width', 'calc(100% - 4px)').css('height', 'calc(100% - 60px)');
      target.find('table').css('width', '100%');
    }
  });

  $(getWindow('WndPlayersChat').win).find('.controls-left-row.controlbox').css('top', '').css('bottom', '32px').css('width', 'calc(100% - 4px)');
}

sfui.callResizeWndShipProject = () => {
  $('#WndShipProject_project_create').css('top', '').css('bottom', '1px');
  $("#WndShipProject_project").css('height', 'calc(100% - 126px)');
  let projectItems = $("#WndShipProject_project_items");
  projectItems.css('height', '100%');
  projectItems.find('.dhxcont_acc_dhx_web').parent().css('height', 'calc(100% - 132px)');
  projectItems.find('.dhxcont_acc_dhx_web').css('height', 'calc(100% - 34px)');
  projectItems.find('.dhxcont_acc_dhx_web').find('div[ida="dhxMainCont"]').css('height', '100%');
}

sfui.callResizeWndFleet = () => {
  let targetMain = $('#WndFleet_container');
  targetMain.find('#WndFleet_controls.dhx_tabbar_zone_top').css('height', 'calc(100% - 36px)');
  let tabContentZone = targetMain.find('.dhx_tabcontent_zone').first().css('height', 'calc(100% - 29px)');
  targetMain.find('[ida="dhxMainCont"]').css('height', '100%');

  switch (getWindow('WndFleet').activetab) {
    case 'main-comands':
      tabContentZone.find('[tab_id="main-comands"]').css('height', 'calc(100% - 6px)');
      tabContentZone.find('[id="WndFleet_main-comands"]').css('height', '100%').css('box-sizing', 'border-box');
      tabContentZone.find('[id="WndFleet_resume"]').css('top', '').css('bottom', '-4px');
      let offsetTopResume = $('#WndFleet_resume')[0].offsetTop;
      if (tabContentZone.find('[id="WndFleet_main-comands"] div.controls-left-row.controlbox').length > 0) {
        tabContentZone.find('[id="WndFleet_comands_content_cover"]').css('height', offsetTopResume - 60);
        tabContentZone.find('[id="WndFleet_main-comands"] div.controls-left-row.controlbox').css('top', offsetTopResume - 31);
      } else {
        tabContentZone.find('#WndFleet_comands').css('height', offsetTopResume - 60);
      }
      break;
    case 'main-hold':
      tabContentZone.find('[tab_id="main-hold"]').css('height', 'calc(100% - 6px)');
      tabContentZone.find('#WndFleet_main-hold').css('height', '100%');
      tabContentZone.find('#WndFleet_holdtab').css('height', 'calc(100% - 32px)');
      $('#WndFleet_container div.controlbox.controls-center-row').last().css('top', '').css('bottom', '2px');
      $('#WndFleet_container div.textcontainer-l').first().css('height', 'calc(100% - 2px)');
      if ($('#WndFleet_container button:contains("Загрузить во флот")').attr('disabled')) {
        $('#WndFleet_container div.textcontainer-l').eq(1).css('height', 'calc(100% - 60px)');
        $("#WndFleet_fleetholdform .textbox-d").removeClass('h438').css('height', 'calc(100% - 100px)');
        $("#WndFleet_fleet_hold").css('height', '50%').css('overflow', 'auto');
      } else {
        $('#WndFleet_container div.textcontainer-l').eq(1).css('height', 'calc(100% - 240px)');
        $('#WndFleet_container #WndFleet_stock_content_cover').css('height', 'calc(100% - 30px)');
        $('#WndFleet_container div.textbox-d.po').css('height', 'calc(100% - 310px)');
        $('#WndFleet_container div.textbox-d.po').find('div.controls-left-row.controlbox').css('top', '').css('bottom', '0px');
      }
      break;
    case 'main-settings':
      tabContentZone.find('[tab_id="main-settings"]').css('height', 'calc(100% - 10px)');
      let conteinerLeft = $("#WndFleet_main-settings").find('.textcontainer-l').first().css('height', '100%').find('div.textbox-d.pt0.w410.h420.scrlYa.mt2').css('cssText', 'height: calc(100% - 110px)!important;');
      targetMain.find('.controlbox.controls-center-row').last().css('top', '').css('bottom', '0');
      $('#WndFleet_fleet_groups').css('cssText', 'height: calc(100% - 430px)!important');
      targetMain.find('.textcontainer-l.controls-center-col-top').css('height', '100%');
      break;
    case 'main-options':
      tabContentZone.find('[tab_id="main-options"]').css('height', 'calc(100% - 6px)');
      $("#WndFleet_battle_tactic_form").css('height', 'calc(100% - 30px)')
      $("#WndFleet_battle_tactic_frame.controls-center-col").css('height', '100%');
      let textContainer = $('#WndFleet_main-options .textcontainer-l');
      textContainer.eq(0).css('height', 'calc(100% - 134px)');
      textContainer.eq(0).find('.textbox-d').removeClass('h190').css('height', 'calc(100% - 180px)');
      textContainer.eq(1).css('top', '').css('bottom', '2px');
      textContainer.eq(2).css('height', 'calc(100% - 2px)');
      let topCol = $("#WndFleet_fleet_device_settings_frame .controls-center-col-top");
      topCol.first().css('height', 'calc(100% - 69px)');
      topCol.first().find('.textbox-d').css('height', 'calc(100% - 100px)').removeClass('h320');
      break;
    case 'main-params':
      tabContentZone.find('[tab_id="main-params"]').css('height', 'calc(100% - 6px)');
      tabContentZone.find('#WndFleet_main-params').css('height', 'calc(100% - 2px)').find('div.w405.scrlYa.controls-center-col-top.textbox-d').css('height', 'calc(100% - 236px)')
      break;
    case 'main-damage':
      tabContentZone.find('[tab_id="main-damage"]').css('height', 'calc(100% - 6px)');
      tabContentZone.find('#WndFleet_main-damage').css('height', 'calc(100% - 2px)');
      tabContentZone.find('#WndFleet_dships').css('height', 'calc(100% - 62px)');
      tabContentZone.find('#WndFleet_dfooter').css('top', '').css('bottom', '-2px');
      break;
    default:
      retun;
  }
}

sfui.WndSearchCalcSelectedMass = () => {
  let totalMass = 0;
  $('span.inputCheckBox.checkbox_planet_check.inputCheckBoxChecked').parent().parent().find('td.value.text11.center').each((i, e) => {
    totalMass += sfapi.parseIntExt(e.innerText)
  });
  $('#WndSearchMap_planets_totalselectmass').text(sfapi.tls(totalMass));
}

class fleetData {
  constructor(name, id, count, nodeElement) {
    this.name = name;
    this.id = id;
    this.count = count;
    this.nodeElement = nodeElement;
  }
}

let allTempBlocks = [];

class TempDiv {
  constructor(id, res, inTable = false) {
    this.res = res;
    let obj = $("#" + id);
    if (obj.length > 0) {
      delete obj[0].linkToObject;
      obj.remove();
    }
    let tmpContainer = document.createElement('div');
    tmpContainer.id = id;
    tmpContainer.linkToObject = this;
    if (inTable === true)
      tmpContainer.innerHTML = "<table>" + res.html + "</table>";
    else
      tmpContainer.innerHTML = res.html;
    tmpContainer.style.display = "none";
    (document.body || document.documentElement).appendChild(tmpContainer);
    this.dom = tmpContainer;
    allTempBlocks.push(this);
  }

  del() {
    delete this;
  }
}

sfui.calculateRockets = function () {
  let findingTR = $("#WndFleetInfo_container tr[class='h24'] .cell_hdr.left4.text12");
  let ships = [];
  $("#CalculateRocketsButton").text(sfui_language.LOADING);
  let defPenetration = localStorage.getItem("r_penetration") || 100;
  let penetration = prompt(sfui_language.TEXT_MISSILE_PENETRATION + ":", defPenetration);

  let prsModifaer = 1;
  let container = $("#WndFleetInfo_container");
  if (container.text().toLowerCase().indexOf(getUdNameByID(465)) + 1) {
    prsModifaer = 1.25;
    //Фазовый деструктор
    //Протонный дефлектор
    if (
      container.text().toLowerCase().indexOf(getUdNameByID(467)) + 1 &&
      container.text().toLowerCase().indexOf(getUdNameByID(466)) + 1
    ) {
      prsModifaer = 1.5;
    }
  }

  localStorage.setItem("r_penetration", penetration);
  for (let i = 0; i < findingTR.length; i++) {
    try {
      let name = findingTR[i].innerText;
      if (name.indexOf(" - ") + 1) {
        name = name.split(" - ")[0];
      }
      let id = findingTR[i].innerHTML.split(".show('")[1].split("')")[0].replace("&amp;", "&");
      let count = sfapi.parseIntExt(findingTR[i].nextElementSibling.innerText);
      let ship = new fleetData(name, id, count, findingTR[i]);
      ships.push(ship);
    } catch (e) {
      console.error(e);
    }
  }
  if (ships.length > 0) {
    let fScan = async function () {
      for (let j = 0; j < ships.length; j++) {
        let response = await fetch('?m=windows&w=WndShipProjectInfo&' + ships[j].id + '&epayaction=none&saleaction=none,none', {
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        let dataProject = await response.text();
        dataProject = dataProject.split("-->")[1];
        let res = {
          html: dataProject
        };
        new TempDiv(ships[j].name, res);
        let trRocketLoss = $("#" + ships[j].name).find(`td.label.text11.center:contains('${sfui_language.TEXT_MISSLE_DEF}')`);
        if (trRocketLoss.length > 0) {
          trRocketLoss = trRocketLoss[0].nextElementSibling.innerText.replaceAll(" ", '');
          if (trRocketLoss.indexOf('.') + 1)
            trRocketLoss = trRocketLoss.split(".")[0];
          trRocketLoss = sfapi.parseIntExt(trRocketLoss) * prsModifaer;
          let trRocketLossAll = ships[j].count * trRocketLoss;
          let penetrationShips = Math.ceil(trRocketLoss / penetration) * ships[j].count;
          $(ships[j].nodeElement).find("span")[0].innerHTML = ships[j].name + " - " + "<label style='color:orange;'>" + trRocketLoss + " (" + trRocketLossAll + " <= " + penetrationShips + " )</label>";
          await setTimeout(() => {
            return 1
          }, 250);
        } else {
          $(ships[j].nodeElement).find("span")[0].innerText = ships[j].name + " - нет ПРС";
        }
      }
      $("#CalculateRocketsButton").text("Рассчитать отклонение");
    };
    fScan();
  }
};

sfui.switchModules = function (elm) {
  if (elm.nextElementSibling.style.display === "none") {
    elm.nextElementSibling.style.display = "table-row";
  } else {
    elm.nextElementSibling.style.display = "none";
  }
};

sfui.calculateFleetInfo = function () {
  let findingTR = $("#WndFleetInfo_container tr[class='h24'] .cell_hdr.left4.text12");
  let ships = [];
  $("#CalculateFleetButton").text(sfui_language.LOADING);
  if (dhxWins.window("CalculateFleetButton") != null) dhxWins.window("CalculateFleetButton").close();
  dhxWins.createWindow("CalculateFleetButton", 300, 100, 1200, 600);
  let windowCalc = dhxWins.window("CalculateFleetButton");
  windowCalc.setText("Развернутая информация о флоте");

  let prsModifaer = 1;
  if ($("#WndFleetInfo_container").text().toLowerCase().indexOf(getUdNameByID(465)) + 1) {
    prsModifaer = 1.25;
    //Фазовый деструктор
    //Протонный дефлектор
    if ($("#WndFleetInfo_container").text().toLowerCase().indexOf(getUdNameByID(467)) + 1 && $("#WndFleetInfo_container").text().toLowerCase().indexOf(getUdNameByID(466)) + 1) {
      prsModifaer = 1.5;
    }
  }

  let buildHtml = `
  <div style='overflow: auto; width: 100%; height: 100%'><table style='width: 100%'>
  <input type='checkbox' data-target='showPRS' checked onclick='WndFleet.swichTableInfoInCalculateFleet(this)'>ПРС
  <input type='checkbox' data-target='showBR' checked onclick='WndFleet.swichTableInfoInCalculateFleet(this)'>БР
  <input type='checkbox' data-target='showSig' checked onclick='WndFleet.swichTableInfoInCalculateFleet(this)'>Сигнатуру
  <input type='checkbox' data-target='showHP' checked onclick='WndFleet.swichTableInfoInCalculateFleet(this)'>Живучесть
  <input type='checkbox' data-target='showWeaponLaser' checked onclick='WndFleet.swichTableInfoInCalculateFleet(this)'>Лазеры
  <input type='checkbox' data-target='showWeaponRPU' checked onclick='WndFleet.swichTableInfoInCalculateFleet(this)'>РПУ
  <input type='checkbox' data-target='showWeaponGun' checked onclick='WndFleet.swichTableInfoInCalculateFleet(this)'>Орудия
  <input type='checkbox' data-target='showWeaponTA' checked onclick='WndFleet.swichTableInfoInCalculateFleet(this)'>наличие торпед
  <input type='checkbox' data-target='showWeaponPR' checked onclick='WndFleet.swichTableInfoInCalculateFleet(this)'>наличие разрушителя
  <input type='checkbox' data-target='showWeaponsVul' checked onclick='WndFleet.swichTableInfoInCalculateFleet(this)'>ракетные уязвимости
  <input type='checkbox' data-target='showWeaponsInfo' checked onclick='WndFleet.swichTableInfoInCalculateFleet(this)'>наносимый урон


  <thead><tr class='cell_hdr' style='display: table-row; color: orange!important; font-size: 16px!important;'><td>Название</td><td>Кол-во</td><td class='showPRS'>ПРС</td><td class='showBR'>БР</td><td class='showSig'>Сигнатура</td><td class='showHP'>Живучесть</td><td class='showWeaponLaser'>Лазеры</td><td class='showWeaponRPU'>РПУ</td><td class='showWeaponGun'>Пушки</td><td class='showWeaponTA'>Торпеды</td><td class='showWeaponPR'>Разрушитель</td><td class='showWeaponsVul'>Уязвимость</td>
  <td class='showWeaponsInfo'>Урон ИЛ</td>
  <td class='showWeaponsInfo'>Урон ЛЛ</td>
  <td class='showWeaponsInfo'>Урон ТЛ</td>
  <td class='showWeaponsInfo'>Урон Плазма</td>
  <td class='showWeaponsInfo'>Урон Кинетика</td>
  <td class='showWeaponsInfo'>Урон Ион</td>
  <td class='showWeaponsInfo'>Урон Ракеты</td>
  <td class='showWeaponsInfo'>Другой урон</td></tr></thead>`;

  for (let i = 0; i < findingTR.length; i++) {
    try {
      let name = findingTR[i].innerText;
      if (name.indexOf(" - ") + 1) {
        name = name.split(" - ")[0];
      }
      let id = findingTR[i].innerHTML.split(".show('")[1].split("')")[0].replace("&amp;", "&");
      let count = sfapi.parseIntExt(findingTR[i].nextElementSibling.innerText);
      let ship = new fleetData(name, id, count, findingTR[i]);
      ships.push(ship);
    } catch (e) {
      console.error(e);
    }
  }

  if (ships.length > 0) {
    let fScan = async function () {
      for (let j = 0; j < ships.length; j++) {
        buildHtml += `<tr onclick="sfui.switchModules(this)" class='cell_hdr' style='display: table-row; cursor: pointer;'>`;
        buildHtml += `<td>` + ships[j].name + `</td>`;
        buildHtml += "<td>" + ships[j].count + "</td>";
        let response = await fetch('?m=windows&w=WndShipProjectInfo&' + ships[j].id + '&epayaction=none&saleaction=none,none', {
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        let dataProject = await response.text();
        dataProject = dataProject.split("-->")[1];
        let res = {
          html: dataProject
        };
        new TempDiv(ships[j].name, res);

        let trRocketLoss = $("#" + ships[j].name).find(`td.label.text11.center:contains('${sfui_language.TEXT_MISSLE_DEF}')`);
        if (trRocketLoss.length > 0) {
          trRocketLoss = trRocketLoss[0].nextElementSibling.innerText.replaceAll(" ", '');
          if (trRocketLoss.indexOf('.') + 1)
            trRocketLoss = trRocketLoss.split(".")[0];
          trRocketLoss = sfapi.parseIntExt(trRocketLoss) * prsModifaer;
        } else {
          trRocketLoss = 0;
        }

        buildHtml += "<td class='showPRS'>" + trRocketLoss + "</td>";

        let trBR = $("#" + ships[j].name).find(`td.value_label.text10:contains('${sfui_language.TEXT_BR}')`);
        let br = "Неизвестно";
        if (trBR.length > 0) {
          br = trBR[0].nextElementSibling.innerText;
          br = br.replaceAll(".", ',');
        }
        buildHtml += "<td class='showBR'>" + br + "</td>";

        let trSig = $("#" + ships[j].name).find(`td.value_label.text10:contains('${sfui_language.TEXT_SIGNATURE}')`);
        let signature = "Неизвестно";
        if (trSig.length > 0) {
          signature = trSig[0].nextElementSibling.innerText;
        }
        buildHtml += "<td class='showSig'>" + signature + "</td>";

        let trHP = $("#" + ships[j].name).find(`td.value_label.text11:contains('${sfui_language.TEXT_DURABILITY}')`);
        let health = "Неизвестно";
        if (trHP.length > 0) {
          health = trHP[0].nextElementSibling.innerText;
        }
        buildHtml += "<td class='showHP'>" + health + "</td>";

        let weapons = {
          ll: false,
          tl: false,
          il: false,
          rpu1: false,
          rpu2: false,
          rpu3: false,
          po: false,
          ko: false,
          io: false,
          ta: false,
          pr: false
        };

        let armor = {
          sp: false,
          ap: false,
          tp: false,
          kb: false,
          nn: false,
          fb: false,
          ed: false
        };
        //getProdById(127).name
        let buildHtml_t = "";
        buildHtml_t += `<tr style='display: none;'><td colspan=12>`;
        let trModules = $("#" + ships[j].name).find("img[width='62px']");
        if (trModules.length > 0) {
          for (let iModule = 0; iModule < trModules.length; iModule++) {
            let srcM = trModules[iModule].src;
            let hint = trModules[iModule].dataset.hint;
            if (hint.indexOf(getProdById(127).name) + 1) weapons.ll = true;
            if (hint.indexOf(getProdById(163).name) + 1) weapons.tl = true;
            if (hint.indexOf(getProdById(475).name) + 1) weapons.il = true;
            if (hint.indexOf(getProdById(183).name) + 1) weapons.rpu1 = true;
            if (hint.indexOf(getProdById(192).name) + 1) weapons.rpu2 = true;
            if (hint.indexOf(getProdById(199).name) + 1) weapons.rpu3 = true;
            if (hint.indexOf(getProdById(460).name) + 1) weapons.ta = true;
            if (hint.indexOf(getProdById(187).name) + 1) weapons.ko = true;
            if (hint.indexOf(getProdById(193).name) + 1) weapons.io = true;
            if (hint.indexOf(getProdById(142).name) + 1) weapons.po = true;
            if (hint.indexOf(getProdById(201).name) + 1) weapons.pr = true;
            if (hint.indexOf(getProdById(164).name) + 1) armor.sp = true;
            if (hint.indexOf(getProdById(171).name) + 1) armor.ap = true;
            if (hint.indexOf(getProdById(165).name) + 1) armor.tp = true;
            if (hint.indexOf(getProdById(172).name) + 1) armor.kb = true;
            if (hint.indexOf(getProdById(194).name) + 1) armor.nn = true;
            if (hint.indexOf(getProdById(200).name) + 1) armor.fb = true;
            if (hint.indexOf(getProdById(261).name) + 1) armor.ed = true;
            if (hint.indexOf(getProdById(179).name) + 1) armor.mshield = true;
            if (hint.indexOf(getProdById(188).name) + 1) armor.gshield = true;
            if (hint.indexOf(getProdById(195).name) + 1) armor.nshield = true;
            let oncli = trModules[iModule].onclick.toString().replace("function onclick(event) {", '').replace("}", "");
            buildHtml_t += `<img src='${srcM}' data-hint='${hint}' onclick='${oncli}' width='16px' height='16px' class='noselect'>`;
            if (iModule % 50 === 0 && iModule > 0) buildHtml_t += "<br>";
          }
        }
        buildHtml_t += "</td></tr>";

        buildHtml += "<td class='showWeaponLaser'>";
        if (weapons.ll) buildHtml += "ЛЛ ";
        if (weapons.tl) buildHtml += "ТЛ ";
        if (weapons.il) buildHtml += "ИЛ ";
        buildHtml += "</td>";

        buildHtml += "<td class='showWeaponRPU'>";
        if (weapons.rpu1) buildHtml += "X1 ";
        if (weapons.rpu2) buildHtml += "X2 ";
        if (weapons.rpu3) buildHtml += "X3 ";
        buildHtml += "</td>";

        buildHtml += "<td class='showWeaponGun'>";
        if (weapons.po) buildHtml += "Плазма ";
        if (weapons.ko) buildHtml += "Кинет. ";
        if (weapons.io) buildHtml += "Ионное ";
        buildHtml += "</td>";

        buildHtml += "<td class='showWeaponTA'>";
        if (weapons.ta) buildHtml += "Да";
        else buildHtml += "Нет";
        buildHtml += "</td>";

        buildHtml += "<td class='showWeaponPR'>";
        if (weapons.pr) buildHtml += "Да";
        else buildHtml += "Нет";
        buildHtml += "</td>";

        buildHtml += "<td class='showWeaponsVul'>";
        let isSign = signature;
        if (signature === 'Неизвестно') isSign = 999999;
        else isSign = sfapi.parseIntExt(isSign);

        if (armor.sp && isSign >= 5000) {
          buildHtml += "Стрела-X1<br>";
        }

        if (armor.ap && isSign >= 10000) {
          buildHtml += "Молния-X1<br>";
        }

        if ((armor.tp || armor.kb) && isSign >= 15000) {
          buildHtml += "Ураган-X1<br>";
        }

        if (armor.mshield && isSign >= 20000) {
          buildHtml += "Шторм-X2<br>";
        }

        if (armor.gshield && isSign >= 30000) {
          buildHtml += "Смерч-X2<br>";
        }

        if (armor.nshield && isSign >= 40000) {
          buildHtml += "Игла-X2<br>";
        }
        if (armor.nn && isSign >= 50000) buildHtml += "Валькирия-Х3<br>";
        if (armor.fb && isSign >= 100000) buildHtml += "Гарпия-Х3<br>";
        if (armor.ed && isSign >= 150000) buildHtml += "Горгона-Х3<br>";
        buildHtml += "</td>";

        let weaponTable = $("#" + ships[j].name).find("td.label.text11.center:contains('Дист.')");
        if (weaponTable.length > 0) {
          let weaponData = weaponTable.parent().nextAll();
          let weapons = [];
          let weaponTypes = {
            il: 0,
            ll: 0,
            tl: 0,
            po: 0,
            ko: 0,
            io: 0,
            rpu1: 0,
            rpu2: 0,
            rpu3: 0,
            ta: 0,
            pr: 0
          }
          weaponData.each((i, j) => {
            let cells = j.cells;
            if (typeof weapons[cells[3].innerText] === "undefined") {
              weapons[cells[3].innerText] = {
                distance: cells[0].innerText,
                damage: parseInt(cells[3].innerText.replaceAll(" ", "").split(".")[0]),
                signature: sfapi.parseIntExt(cells[1].innerText),
                weaponRange: 0,
                weaponType: undefined
              };
            } else {
              weapons[cells[3].innerText].weaponRange += 1;
            }
          });
          for (let weaponIndex in weapons) {
            if (weapons[weaponIndex].signature === 0 && weapons[weaponIndex].weaponRange === 1) weapons[weaponIndex].weaponType = "il";
            else {
              if (weapons[weaponIndex].weaponRange === 2) weapons[weaponIndex].weaponType = "ll";
              if (weapons[weaponIndex].weaponRange === 3) weapons[weaponIndex].weaponType = "tl";
              if (weapons[weaponIndex].weaponRange === 4) weapons[weaponIndex].weaponType = "po";
              if (weapons[weaponIndex].weaponRange === 5) weapons[weaponIndex].weaponType = "ko";
              if (weapons[weaponIndex].weaponRange === 6 && weapons[weaponIndex].distance === "7") weapons[weaponIndex].weaponType = "io";
              if (weapons[weaponIndex].weaponRange === 6 && weapons[weaponIndex].distance === "14") weapons[weaponIndex].weaponType = "rpu1";
              if (weapons[weaponIndex].weaponRange === 8 && weapons[weaponIndex].signature > 0) weapons[weaponIndex].weaponType = "rpu2";
              if (weapons[weaponIndex].weaponRange === 10) weapons[weaponIndex].weaponType = "rpu3";
              if (weapons[weaponIndex].weaponRange === 5 && weapons[weaponIndex].signature > 250000) weapons[weaponIndex].weaponType = "ta";
              if (weapons[weaponIndex].weaponRange === 8 && weapons[weaponIndex].signature === 0) weapons[weaponIndex].weaponType = "pr";
            }

          }
          for (let wt in weaponTypes) {
            for (let wt_d in weapons) {
              if (wt === weapons[wt_d].weaponType) weaponTypes[wt] += weapons[wt_d].damage;
            }
          }

          let ilString = "";
          let llString = "";
          let tlString = "";
          let or1String = "";
          let or2String = "";
          let or3String = "";
          let rString = "";
          let oString = "";
          for (let wt in weaponTypes) {
            if (wt === "il" && weaponTypes[wt] > 0) ilString += `${weaponTypes[wt]}<br>`;
            if (wt === "ll" && weaponTypes[wt] > 0) llString += `${weaponTypes[wt]}<br>`;
            if (wt === "tl" && weaponTypes[wt] > 0) tlString += `${weaponTypes[wt]}<br>`;

            if (wt === "po" && weaponTypes[wt] > 0) or1String += `${weaponTypes[wt]}<br>`;
            if (wt === "ko" && weaponTypes[wt] > 0) or2String += `${weaponTypes[wt]}<br>`;
            if (wt === "io" && weaponTypes[wt] > 0) or3String += `${weaponTypes[wt]}<br>`;

            if (wt === "rpu1" && weaponTypes[wt] > 0) rString += `РПУ-Х1: ${weaponTypes[wt]}<br>`;
            if (wt === "rpu2" && weaponTypes[wt] > 0) rString += `РПУ-Х2: ${weaponTypes[wt]}<br>`;
            if (wt === "rpu3" && weaponTypes[wt] > 0) rString += `РПУ-Х3: ${weaponTypes[wt]}<br>`;

            if (wt === "ta" && weaponTypes[wt] > 0) oString += `Торпеды: ${weaponTypes[wt]}<br>`;
            if (wt === "pr" && weaponTypes[wt] > 0) oString += `Руха: ${weaponTypes[wt]}<br>`;
          }

          buildHtml += `
                  <td class='showWeaponsInfo'>${ilString}</td>
                  <td class='showWeaponsInfo'>${llString}</td>
                  <td class='showWeaponsInfo'>${tlString}</td>
                  <td class='showWeaponsInfo'>${or1String}</td>
                  <td class='showWeaponsInfo'>${or2String}</td>
                  <td class='showWeaponsInfo'>${or3String}</td>
                  <td class='showWeaponsInfo'>${rString}</td>
                  <td class='showWeaponsInfo'>${oString}</td>`;
          //;
        } else {
          buildHtml += "<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>";
        }

        buildHtml += "</tr>";
        buildHtml += buildHtml_t;

        windowCalc.attachHTMLString(buildHtml + "</div></table>");

        await setTimeout(() => {
          return 1
        }, 250);
      }

      buildHtml += `</div></table>`;
      windowCalc.attachHTMLString(buildHtml);

      $("#CalculateFleetButton").text(sfui_language.DETAIL_FLEET_INFO);
    };
    fScan();
  }
}

sfui.showSmartFleetEdit = (id) => {
  let savedSmartFleetId = '';
  let savedSmartFleetHint = '';
  let savedSmartFleetIcon = '';
  if (id !== -1) {
    let smartFleetsData = localStorage.getItem('sf_smartFleets');
    if (smartFleetsData) {
      let smartFleets = JSON.parse(smartFleetsData);
      savedSmartFleetId = smartFleets?.[id]?.id ?? '';
      savedSmartFleetHint = smartFleets?.[id]?.hint ?? '';
      savedSmartFleetIcon = smartFleets?.[id]?.icon ?? '';
    }
  }

  document.lastSelectedIcon = savedSmartFleetIcon;

  const selIconExtStyle = 'style="border: 1px solid blue;"';
  let selIconProcessed = false;
  let iconsRow = ``;
  iconsRow += '<div class="textbox-d" style="width: 100%; overflow: scroll; overflow-x: unset; max-height: 66px;">';
  for (let iIcon in sficons) {
    let iconNeedDecor = !selIconProcessed && (sficons[iIcon] === savedSmartFleetIcon);
    iconsRow += `<div class='selectIconInSmartFleet' style='width: 16px; display: inline-block; margin: 1px; cursor: pointer;' data-code='${iIcon}'>
    <img data-code='${iIcon}' width=16 height=16 src='${sficons[iIcon]}' ${iconNeedDecor ? selIconExtStyle : ''}>
    </div>`;
    selIconProcessed = selIconProcessed || iconNeedDecor;
  }
  iconsRow += '</div>';

  let html = `
  <div class="titlebox mb2 h28 text14"><span class="title text14">${sfui_language.SMART_FLEETS_SETTINGS}</span></div>
  <div class="textbox-d">
  <div class="controls-center-row controlbox-d p0 h34 mt2">
  <span class="value_label text12">${sfui_language.FLEET_NUM}</span>
  <input autocomplete="off" type="text" class="inputText" style="text-align:center;height:22px;width:100px;" id="smartEdit_id_${id}" value="${savedSmartFleetId}">
  </div>
  <div class="controls-center-row controlbox-d p0 h34 mt2">
  <span class="value_label text12">${sfui_language.HINT}</span>
  <input autocomplete="off" type="text" class="inputText" style="text-align:center;height:22px;width:200px;" id="smartEdit_hint_${id}" value="${savedSmartFleetHint}">
  </div>
  ${iconsRow}
  <button type="button" data-id='${id}' data class="text_btn noselect" style="font-size:14px;height:22px;width:100%;" onclick="sound_click(2); sfui.saveSmartFleet(this); ">${sfui_language.BTN_TEXT_SAVE}</button>
  </div>
  `;

  sfui.CreateWindow('SFUI_win_editSmart_ID' + id, 300, 250, 'Кнопка [' + id + ']', 'flat/i-settings-16.png', html, false, true);

  $(".selectIconInSmartFleet").on('click', (e) => {
    $('.selectIconInSmartFleet img').css('border', '');

    if (document.lastSelectedIcon === e.target.currentSrc)
      document.lastSelectedIcon = '';
    else {
      document.lastSelectedIcon = e.target.currentSrc;
      $(e.target).css('border', '1px solid blue');
    }
  });
}

sfui.saveSmartFleet = async (eventClick) => {
  eventClick = $(eventClick);
  let id = eventClick.data('id');
  let smartFleetsData = localStorage.getItem('sf_smartFleets');
  let smartFleets = JSON.parse(smartFleetsData);

  let fleetId = $(`#smartEdit_id_${id}`).val();
  if (fleetId) {
    smartFleets[id] = {};
    smartFleets[id].id = fleetId;
    smartFleets[id].hint = $(`#smartEdit_hint_${id}`).val();

    let fetchRes = await fetch(`?m=windows&w=WndFleetInfo&fleetid=${fleetId}`, {
      "headers": {
        "accept": "*/*",
        "x-requested-with": "XMLHttpRequest"
      },
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    });

    fetchRes = await fetchRes.text();

    let regExFetch = /wnd\.setIcon\('(.+)'\)/gm;
    let execRes = regExFetch.exec(fetchRes);
    if (execRes)
      smartFleets[id].icon = document.lastSelectedIcon ? document.lastSelectedIcon : execRes[1];
    else
      smartFleets[id] = undefined;
  } else smartFleets[id] = undefined;

  localStorage.setItem('sf_smartFleets', JSON.stringify(smartFleets));
  sfui.winsList.filter(e => e.id === 'SFUI_win_editSmart_ID' + id)[0].window.win.close();
  getWindow('WndFleet').refresh();
}

sfui.showSmartFlyListEdit = (id, type) => {
  let savedSmartFlyListId = '';
  let savedSmartFlyListHint = '';
  let savedSmartFlyListIcon = '';
  if (id !== -1) {
    let fleetID = getWindow('WndFleet').fleetid;
    let storageStr = `sf_smartFlyList${type === 1 ? '' : '_' + fleetID}`;
    let SmartFlyListsData = localStorage.getItem(storageStr);
    if (SmartFlyListsData) {
      let SmartFlyLists = JSON.parse(SmartFlyListsData);
      savedSmartFlyListId = SmartFlyLists?.[id]?.id ?? '';
      savedSmartFlyListHint = SmartFlyLists?.[id]?.hint ?? '';
      savedSmartFlyListIcon = SmartFlyLists?.[id]?.icon ?? '';
    }
  }

  document.lastSelectedIcon = savedSmartFlyListIcon;

  const selIconExtStyle = 'style="border: 1px solid blue;"';
  let selIconProcessed = false;
  let iconsRow = ``;
  iconsRow += '<div class="textbox-d" style="width: 100%; overflow: scroll; overflow-x: unset; max-height: 66px;">';
  for (let iIcon in sficons) {
    let iconNeedDecor = !selIconProcessed && (sficons[iIcon] === savedSmartFlyListIcon);
    iconsRow += `<div class='selectIconInSmartFlyList' style='width: 16px; display: inline-block; margin: 1px; cursor: pointer;' data-code='${iIcon}'>
    <img data-code='${iIcon}' width=16 height=16 src='${sficons[iIcon]}' ${iconNeedDecor ? selIconExtStyle : ''}>
    </div>`
    selIconProcessed = selIconProcessed || iconNeedDecor;
  }
  iconsRow += '</div>';

  let html = `
  <div class="titlebox mb2 h28 text14"><span class="title text14">${sfui_language.SMART_FLY_SETTINGS}</span></div>
  <div class="textbox-d">
  <div class="controls-center-row controlbox-d p0 h34 mt2">
  <span class="value_label text12">${sfui_language.FLIGHT_NUMBER}</span>
  <input autocomplete="off" type="text" class="inputText" style="text-align:center;height:22px;width:100px;" id="smartFlyEdit_id_${id}" value="${savedSmartFlyListId}">
  </div>
  <div class="controls-center-row controlbox-d p0 h34 mt2">
  <span class="value_label text12">${sfui_language.HINT}</span>
  <input autocomplete="off" type="text" class="inputText" style="text-align:center;height:22px;width:200px;" id="smartFlyEdit_hint_${id}" value="${savedSmartFlyListHint}">
  </div>
  ${iconsRow}
  <button type="button" data-id='${id}' data class="text_btn noselect" style="font-size:14px;height:22px;width:100%;" onclick="sound_click(2); sfui.saveSmartFlyList(this, ${type}); ">${sfui_language.BTN_TEXT_SAVE}</button>
  </div>
  `;

  sfui.CreateWindow('SFUI_win_editSmartFly_ID' + id, 300, 250, `${sfui_language.BTN_TEXT_BUTTON} [` + id + "]", 'flat/i-settings-16.png', html, false, true);

  $(".selectIconInSmartFlyList").on('click', (e) => {
    $('.selectIconInSmartFlyList img').css('border', '');

    if (document.lastSelectedIcon === e.target.currentSrc)
      document.lastSelectedIcon = '';
    else {
      document.lastSelectedIcon = e.target.currentSrc;
      $(e.target).css('border', '1px solid blue');
    }
  });
}

sfui.saveSmartFlyList = async (eventClick, type) => {
  eventClick = $(eventClick);
  let id = eventClick.data('id');
  let fleetID = getWindow('WndFleet').fleetid;
  let smartFlyListsData = null;
  if (type === 1) {
    smartFlyListsData = localStorage.getItem('sf_smartFlyList');
  } else {
    smartFlyListsData = localStorage.getItem('sf_smartFlyList_' + fleetID);
  }
  smartFlyListsData = JSON.parse(smartFlyListsData);

  let newFlyListID = $('#smartFlyEdit_id_' + id).val();
  if (newFlyListID) {
    smartFlyListsData[id] = {};
    smartFlyListsData[id].id = newFlyListID;
    smartFlyListsData[id].hint = $('#smartFlyEdit_hint_' + id).val();
    ;
    smartFlyListsData[id].icon = document.lastSelectedIcon;
  } else
    smartFlyListsData[id] = undefined;

  smartFlyListsData = JSON.stringify(smartFlyListsData);
  if (type === 1)
    localStorage.setItem('sf_smartFlyList', smartFlyListsData);
  else
    localStorage.setItem('sf_smartFlyList_' + fleetID, smartFlyListsData);

  sfui.winsList.filter(e => e.id === 'SFUI_win_editSmartFly_ID' + id)[0].window.win.close();
  getWindow('WndFleet').refresh();
}

sfui.getShipProjectData = async (id) => {
  let data = await fetch(`?m=windows&w=WndShipProjectInfo&id=${id}`, {
    "headers": {
      "accept": "*/*",
      "x-requested-with": "XMLHttpRequest"
    },
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  });
  return await data.text();
}

sfui.getShipProjectDataAndPasteToBox = async (boxId) => {
  let box;
  let id = -1;
  if (boxId === 1) {
    box = $("#projectOneData");
    id = $("#projectOneID").val();
  } else {
    box = $("#projectTwoData");
    id = $("#projectTwoID").val();
  }
  let projectData = await sfui.getShipProjectData(id);
  box.html(projectData);

  let wrapper = box.find('.textcontainer-l');
  wrapper.css('width', '493px').css('top', '0').css('height', '558px');
  $(box.children()[0]).remove();
  $(wrapper.find('table')[1]).remove();
  $(wrapper.children().children('table')[1]).width('auto');
  $(wrapper.children().children('table')[2]).width('auto');

  sfui.diffCheckProjects();
}

sfui.differQueryList = [];

sfui.diffCheckProjects = () => {
  if ($("#projectOneData").find('.textcontainer-l').length > 0 && $("#projectTwoData").find('.textcontainer-l').length > 0) {
    let cModules1 = $("#projectOneData .noselect[style^='width:62px;height:62px;']");
    let cModules2 = $("#projectTwoData .noselect[style^='width:62px;height:62px;']");

    $("#oneProjectModulesCount").text(cModules1.length);
    $("#twoProjectModulesCount").text(cModules2.length);

    //TODO: надо бы оптимизировать
    let moulesOne = {};
    let moulesTwo = {};
    cModules1.each((i, e) => {
      let eModule = $($(e).find('img')[0]);
      let moduleTitle = eModule.data('hint').replaceAll("<br>", '');
      let moduleName = moduleTitle.split(` ${sfui_language.SHORT_STR_LVL}`)[0];
      let moduleLvl = sfapi.parseIntExt(moduleTitle.split(` ${sfui_language.SHORT_STR_LVL}.`)[1].split(' - ')[0]);
      let moduleID = sfdata.productions.filter(e => e.name === moduleName)[0].id;
      let moduleRace = moduleTitle.split("(")[1].split(")")[0];
      if (!moulesOne['m' + moduleID]) {
        moulesOne['m' + moduleID] = {};
        moulesOne['m' + moduleID].lvls = {};
        moulesOne['m' + moduleID].id = moduleID;
        moulesOne['m' + moduleID].name = moduleName;
        moulesOne['m' + moduleID].race = sfdata.races.filter(e => e.name === moduleRace)[0];
      }
      if (!moulesOne['m' + moduleID].lvls['l' + moduleLvl]) {
        moulesOne['m' + moduleID].lvls['l' + moduleLvl] = {};
        moulesOne['m' + moduleID].lvls['l' + moduleLvl].count = 0;
      }
      moulesOne['m' + moduleID].lvls['l' + moduleLvl].count += 1;
    });

    cModules2.each((i, e) => {
      let eModule = $($(e).find('img')[0]);
      let moduleTitle = eModule.data('hint').replaceAll("<br>", '');
      let moduleName = moduleTitle.split(` ${sfui_language.SHORT_STR_LVL}`)[0];
      let moduleLvl = sfapi.parseIntExt(moduleTitle.split(` ${sfui_language.SHORT_STR_LVL}.`)[1].split(' - ')[0]);
      let moduleID = sfdata.productions.filter(e => e.name === moduleName)[0].id;
      let moduleRace = moduleTitle.split("(")[1].split(")")[0];
      if (!moulesTwo['m' + moduleID]) {
        moulesTwo['m' + moduleID] = {};
        moulesTwo['m' + moduleID].lvls = {};
        moulesTwo['m' + moduleID].id = moduleID;
        moulesTwo['m' + moduleID].name = moduleName;
        moulesTwo['m' + moduleID].race = sfdata.races.filter(e => e.name === moduleRace)[0];
      }
      if (!moulesTwo['m' + moduleID].lvls['l' + moduleLvl]) {
        moulesTwo['m' + moduleID].lvls['l' + moduleLvl] = {};
        moulesTwo['m' + moduleID].lvls['l' + moduleLvl].count = 0;
      }
      moulesTwo['m' + moduleID].lvls['l' + moduleLvl].count += 1;
    });

    let needModeles = {};
    let backModules = {};
    for (let keyModule in moulesTwo) {
      if (moulesOne[keyModule]) {
        for (let keyLvl in moulesTwo[keyModule].lvls) {
          if (moulesOne[keyModule].lvls[keyLvl]) {
            if (moulesOne[keyModule].lvls[keyLvl].count !== moulesTwo[keyModule].lvls[keyLvl].count) {
              let tempModuleCount = moulesTwo[keyModule].lvls[keyLvl].count - moulesOne[keyModule].lvls[keyLvl].count;
              if (tempModuleCount < 0) {
                if (!backModules[keyModule])
                  backModules[keyModule] = {}
                backModules[keyModule].id = keyModule;
                backModules[keyModule].name = moulesTwo[keyModule].name;
                backModules[keyModule].race = moulesTwo[keyModule].race;
                if (!backModules[keyModule].lvls)
                  backModules[keyModule].lvls = {}
                if (!backModules[keyModule].lvls[keyLvl])
                  backModules[keyModule].lvls[keyLvl] = {}
                backModules[keyModule].lvls[keyLvl].count = 0
                backModules[keyModule].lvls[keyLvl].count += (tempModuleCount * -1);
              } else {
                if (!needModeles[keyModule])
                  needModeles[keyModule] = {}
                needModeles[keyModule].id = keyModule;
                needModeles[keyModule].name = moulesTwo[keyModule].name;
                needModeles[keyModule].race = moulesTwo[keyModule].race;
                if (!needModeles[keyModule].lvls)
                  needModeles[keyModule].lvls = {}
                if (!needModeles[keyModule].lvls[keyLvl])
                  needModeles[keyModule].lvls[keyLvl] = {}
                needModeles[keyModule].lvls[keyLvl].count = 0
                needModeles[keyModule].lvls[keyLvl].count += tempModuleCount;
              }
            }
          } else {
            if (!needModeles[keyModule])
              needModeles[keyModule] = {}
            needModeles[keyModule].id = keyModule;
            needModeles[keyModule].name = moulesTwo[keyModule].name;
            needModeles[keyModule].race = moulesTwo[keyModule].race;
            if (!needModeles[keyModule].lvls)
              needModeles[keyModule].lvls = {}
            if (!needModeles[keyModule].lvls[keyLvl])
              needModeles[keyModule].lvls[keyLvl] = {}
            needModeles[keyModule].lvls[keyLvl].count = 0

            needModeles[keyModule].lvls[keyLvl].count = moulesTwo[keyModule].lvls[keyLvl].count;
          }
        }
      } else {
        if (!needModeles[keyModule])
          needModeles[keyModule] = {}
        needModeles[keyModule] = moulesTwo[keyModule];
      }
    }

    let html = ``;
    let queries = [];
    for (let keyModule in needModeles) {
      let moduleID = keyModule.replace('m', '');
      for (let keyLvl in needModeles[keyModule].lvls) {
        let lvl = keyLvl.replace("l", "");
        html += `<div class='textcontainer-d' style=''>
        <div class="noselect" style="display: inline-block;width:12px;height:12px;border:1px solid ${needModeles[keyModule].race.color};background:${needModeles[keyModule].race.color};"><img oncontextmenu="return false" class="noselect" style="cursor:pointer;opacity:0.75;filter:alpha(opacity=75);" data-hint="" width="12px" height="12px" src="/images/productions/${moduleID}-16.png" onclick="sound_click(1);getWindow(&quot;WndHelp&quot;).show(&quot;id=Productions-${moduleID}:9&amp;level=${lvl}&quot;);"></div>
        <span style='font-size: 11px!important'><span style='color:${needModeles[keyModule].race.color}'>${needModeles[keyModule].name} ${sfapi.tlsCh(Number(lvl))}</span> x<span style='color:#73c95f'>${needModeles[keyModule].lvls[keyLvl].count}</span></span></div>`;
        queries.push(`&prodtype=1&prodtype_new_value=false&raceid=${needModeles[keyModule].race.id}&raceid_new_value=false&prodid=${moduleID}&prodid_new_value=false&level=${lvl}&size=${needModeles[keyModule].lvls[keyLvl].count}`);
      }
    }
    $("#diffModulesListNeed").html(html);
    sfui.differQueryList = queries;
  }
}

sfui.addToOrganizerByDiffer = async () => {
  if (!getWindow('WndOrganizer').isshow()) {
    getWindow('WndOrganizer').show();
  }
  getWindow('WndOrganizer').start_load();
  let multy = parseInt($('#differMultyplay').val())
  if (!multy || multy < 0)
    multy = 1;
  for (let key in sfui.differQueryList) {
    let size = parseInt(sfui.differQueryList[key].split('size=')[1]) * multy;
    await sfcommands.addModuleInOrganizerByBody(sfui.differQueryList[key].replace(/size=(\d+)/gm, `size=${size}`));
  }
  getWindow('WndOrganizer').end_load();
  getWindow('WndOrganizer').refresh();
}

sfui.convertDOMElemToCanvas = async (elem) => {
  return await html2canvas(elem, {
    logging: false,
    allowTaint: true,
    backgroundColor: '#0E1819',
    ignoreElements: function (element) {
      if (element.contains(elem) || elem.contains(element) ||
        elem === element || element.nodeName === 'HEAD' ||
        element.nodeName === 'STYLE' || element.nodeName === 'META' ||
        element.nodeName === 'LINK')
        return false;
      else
        return true;
    }
  }).then(canvas => canvas);
}
sfui.saveDOMElemToClipboardAsImage = async (elem) => {
  const imgDataURL = (await sfui.convertDOMElemToCanvas(elem)).toDataURL();
  const imgData = await fetch(imgDataURL);
  let blob = await imgData.blob();
  await navigator.clipboard.write([new ClipboardItem({
    [blob.type]: blob
  })]);
}
//  Argument 'side' should be True for the left-side project and False - for the right-side.
sfui.diffChecker_ProjCopyAsImg = async (side) => {
  let diffCheckerWnd = $(dhxWins.window("WndDiffChecker"));
  let projElemIdString = `#project${side ? 'One' : 'Two'}Data`;
  let projContainer = diffCheckerWnd.find(projElemIdString).children('div').children('div');
  if (projContainer.length < 1)
    return;
  await sfui.saveDOMElemToClipboardAsImage(projContainer[0]);
}
sfui.shipProjInfo_ProjCopyAsImg = async () => {
  let diffCheckerWnd = $(dhxWins.window("WndShipProjectInfo"));
  let projContainer = diffCheckerWnd.find('.textcontainer-l').children('div');
  if (projContainer.length < 1)
    return;
  let descrZone = $(projContainer.children('table')[1]);
  let separator = $(projContainer.children('div.sep')[1]);
  descrZone.hide();
  separator.hide();
  await sfui.saveDOMElemToClipboardAsImage(projContainer[0]);
  descrZone.show();
  separator.show();
}

sfui.openDiffChecker = () => {
  html = `
  <div id='projectOne' class="textbox-d h-100" style="width: 505px;display: inline-block;">
    <div class='controlbox-d controls-center-row' style='width: 100%; padding: 4px;'>
      <span class="value_label mr4">${sfui_language.NUM_OF_FIRST_PROJECT}</span>
      <input autocomplete="off" type="text" class="inputText" style="height:26px;width:100px;" value="" id="projectOneID">
      <button class="image_btn noselect" type="button" data-hint="${sfui_language.GET_PROJECT}" style="width:28px;height:28px;" onclick="sound_click(2); sfui.getShipProjectDataAndPasteToBox(1)"><img oncontextmenu="return false;" class="noselect" border="0" src="/images/icons/flat/i-enter-1-16.png"></button>
      <button class="image_btn noselect" type="button" data-hint="${sfui_language.COPY_PROJ_AS_IMAGE}" style="width:28px;height:28px;" onclick="sound_click(2); sfui.diffChecker_ProjCopyAsImg(true);"><img oncontextmenu="return false;" class="noselect" border="0" src="/images/icons/i_copy_16.png"></button>
    </div>
    <div id='projectOneData' style='position: relative;'>
    </div>
  </div>
  <div id='projectDiff' class="textbox-d h-100" style="width: 268px;display: inline-block;">
    <div class="controls-center cell_hdr h24 w-100">Результат сравнения</div>
    <div class="textbox-d w-100" style='height: 540px; overflow-y: auto; margin-bottom: 5px;'>
      <span>${sfui_language.NUM_OF_MODULES}:</span> <span id='oneProjectModulesCount'></span> / <span id='twoProjectModulesCount'></span><br>
      <span>${sfui_language.NEW_MODULES}:</span><br>
      <div id='diffModulesListNeed'></div>
      <!--<span>Вернется на склад:</span><br>
      <div id='diffModulesListBack'></div>-->
    </div>
    <button type="button" class="text_btn noselect" style="font-size:12px;height:22px;width:185px;" onclick="sound_click(2); sfui.addToOrganizerByDiffer();">${sfui_language.SAVE_TO_ORGANIZER}</button> X <input autocomplete="off" id='differMultyplay' type="text" class="inputText" style="text-align:center;height:22px;width:55px;" name="size" value="1">
  </div>
  <div id='projectTwo' class="textbox-d h-100" style="width: 505px;display: inline-block;">
    <div class='controlbox-d controls-center-row' style='width: 100%; padding: 4px;'>
      <span class="value_label mr4">${sfui_language.NUM_OF_SECOND_PROJECT}</span>
      <input autocomplete="off" type="text" class="inputText" style="height:26px;width:100px;" value="" id="projectTwoID">
      <button class="image_btn noselect" type="button" data-hint="${sfui_language.GET_PROJECT}" style="width:28px;height:28px;" onclick="sound_click(2); sfui.getShipProjectDataAndPasteToBox(2)"><img oncontextmenu="return false;" class="noselect" border="0" src="/images/icons/flat/i-enter-1-16.png"></button>
      <button class="image_btn noselect" type="button" data-hint="${sfui_language.COPY_PROJ_AS_IMAGE}" style="width:28px;height:28px;" onclick="sound_click(2); sfui.diffChecker_ProjCopyAsImg(false);"><img oncontextmenu="return false;" class="noselect" border="0" src="/images/icons/i_copy_16.png"></button>
    </div>
    <div id='projectTwoData' style='position: relative;'>
    </div>
  </div>
  `

  let winID = sfui.CreateWindow('WndDiffChecker',
    1300,
    650,
    'Сравнить 2 проекта',
    'i_planets_16.png',
    html,
    false,
    true);
}

// Игровые данные, некоторые рецепты.
sfdata.races = [
  {
    name: {
      ru: "Гелионы",
      en: 'Helion'
    },
    id: "1",
    color: "#e8980d"
  },
  {
    name: {
      ru: "Тормали",
      en: 'Thormal'
    },
    id: "2",
    color: "#425dc1"
  },
  {
    name: {
      ru: "Мруны",
      en: 'Maroon'
    },
    id: "3",
    color: "#9d73f1"
  },
  {
    name: {
      ru: "Зекты",
      en: 'Zect'
    },
    id: "4",
    color: "#fdf986"
  },
  {
    name: {
      ru: "Велиды",
      en: 'Velid'
    },
    id: "5",
    color: "#07a7db"
  },
  {
    name: {
      ru: "Гларги",
      en: 'Glarg'
    },
    id: "6",
    color: "#9fef6a"
  },
  {
    name: {
      ru: "Астоксы",
      en: 'Astox'
    },
    id: "7",
    color: "#ef463e"
  },
  {
    name: {
      ru: "Федерация",
      en: 'Federation'
    },
    id: "8",
    color: "#e8980d"
  },
  {
    name: {
      ru: "Борги",
      en: 'Borg'
    },
    id: "9",
    color: "#505050"
  },
]
// Продукция
const getProdById = (id) => sfdata.productions.filter(e => e.id === id.toString())[0];
sfdata.productions = [
  {
    "name": {
      en: 'Population',
      ru: "Население"
    },
    "id": "25",
    "weight": 0,
    "type": "resources",
    "ico": "/images/productions/25-16.png"
  },
  {
    "name": {
      "ru": "Железная руда",
      "en": "Iron ore"
    },
    "id": "1",
    "weight": 1,
    "type": "resources",
    "ico": "/images/productions/1-16.png"
  },
  {
    "name": {
      "ru": "Полиэлементная руда",
      "en": "Polyelement Ore"
    },
    "id": "2",
    "weight": 1,
    "type": "resources",
    "ico": "/images/productions/2-16.png"
  },
  {
    "name": {
      "ru": "Полиорганическая руда",
      "en": "Polyorganic Ore"
    },
    "id": "3",
    "weight": 1,
    "type": "resources",
    "ico": "/images/productions/3-16.png"
  },
  {
    "name": {
      "ru": "Уран",
      "en": "Uranium"
    },
    "id": "4",
    "weight": 2,
    "type": "resources",
    "ico": "/images/productions/4-16.png"
  },
  {
    "name": {
      "ru": "Митрацит",
      "en": "Mytracitum"
    },
    "id": "5",
    "weight": 2,
    "type": "resources",
    "ico": "/images/productions/5-16.png"
  },
  {
    "name": {
      "ru": "Иридиум",
      "en": "Iridium"
    },
    "id": "6",
    "weight": 2,
    "type": "resources",
    "ico": "/images/productions/6-16.png"
  },
  {
    "name": {
      "ru": "Крокит",
      "en": "Crockit"
    },
    "id": "7",
    "weight": 3,
    "type": "resources",
    "ico": "/images/productions/7-16.png"
  },
  {
    "name": {
      "ru": "Брадий",
      "en": "Bradium"
    },
    "id": "8",
    "weight": 10,
    "type": "resources",
    "ico": "/images/productions/8-16.png"
  },
  {
    "name": {
      "ru": "Титанит",
      "en": "Titanitum"
    },
    "id": "9",
    "weight": 20,
    "type": "resources",
    "ico": "/images/productions/9-16.png"
  },
  {
    "name": {
      "ru": "Ноксикум",
      "en": "Noxicum"
    },
    "id": "10",
    "weight": 50,
    "type": "resources",
    "ico": "/images/productions/10-16.png"
  },
  {
    "name": {
      "ru": "Изидрит",
      "en": "Izidritum"
    },
    "id": "11",
    "weight": 50,
    "type": "resources",
    "ico": "/images/productions/11-16.png"
  },
  {
    "name": {
      "ru": "Сероний",
      "en": "Seronium"
    },
    "id": "12",
    "weight": 50,
    "type": "resources",
    "ico": "/images/productions/12-16.png"
  },
  {
    "name": {
      "ru": "Зукрит",
      "en": "Zukritum"
    },
    "id": "13",
    "weight": 50,
    "type": "resources",
    "ico": "/images/productions/13-16.png"
  },
  {
    "name": {
      "ru": "Миланокс",
      "en": "Milanoxium"
    },
    "id": "14",
    "weight": 50,
    "type": "resources",
    "ico": "/images/productions/14-16.png"
  },
  {
    "name": {
      "ru": "Орекс",
      "en": "Orexium"
    },
    "id": "15",
    "weight": 50,
    "type": "resources",
    "ico": "/images/productions/15-16.png"
  },
  {
    "name": {
      "ru": "Заброзин",
      "en": "Zabrosium"
    },
    "id": "16",
    "weight": 50,
    "type": "resources",
    "ico": "/images/productions/16-16.png"
  },
  {
    "name": {
      "ru": "Квантиум",
      "en": "Quantium"
    },
    "id": "17",
    "weight": 100,
    "type": "resources",
    "ico": "/images/productions/17-16.png"
  },
  {
    "name": {
      "ru": "Левиум",
      "en": "Levium"
    },
    "id": "18",
    "weight": 100,
    "type": "resources",
    "ico": "/images/productions/18-16.png"
  },
  {
    "name": {
      "ru": "Гелий-3",
      "en": "Helium-3"
    },
    "id": "19",
    "weight": 1,
    "type": "resources",
    "ico": "/images/productions/19-16.png"
  },
  {
    "name": {
      "ru": "Темная материя",
      "en": "Dark Matter"
    },
    "id": "451",
    "weight": 150,
    "type": "resources",
    "ico": "/images/productions/451-16.png"
  },
  {
    "name": {
      "ru": "Металлопрокат",
      "en": "Metal-roll"
    },
    "id": "29",
    "weight": 2,
    "reciple": [

      {
        "id": 1,
        "amount": 2
      },

      {
        "id": 2,
        "amount": 1
      }],
    "type": "resources",
    "ico": "/images/productions/29-16.png"
  },
  {
    "name": {
      "ru": "Строительные материалы",
      "en": "Construction Materials"
    },
    "id": "30",
    "weight": 1,
    "reciple": [

      {
        "id": 1,
        "amount": 1
      },

      {
        "id": 2,
        "amount": 2
      },

      {
        "id": 3,
        "amount": 1
      }],
    "type": "resources",
    "ico": "/images/productions/30-16.png"
  },
  {
    "name": {
      "ru": "Железобетон",
      "en": "Reinforced Concrete"
    },
    "id": "31",
    "weight": 3,
    "reciple": [

      {
        "id": 1,
        "amount": 2
      },

      {
        "id": 2,
        "amount": 2
      }],
    "type": "resources",
    "ico": "/images/productions/31-16.png"
  },
  {
    "name": {
      "ru": "Электронные компоненты",
      "en": "Electronic Components"
    },
    "id": "32",
    "weight": 1,
    "reciple": [

      {
        "id": 1,
        "amount": 1
      },

      {
        "id": 2,
        "amount": 1
      },

      {
        "id": 7,
        "amount": 1
      }],
    "type": "resources",
    "ico": "/images/productions/32-16.png"
  },
  {
    "name": {
      "ru": "Алюминий",
      "en": "Aluminum"
    },
    "id": "46",
    "weight": 1,
    "reciple": [

      {
        "id": 1,
        "amount": 1
      },

      {
        "id": 2,
        "amount": 2
      },

      {
        "id": 6,
        "amount": 1
      }],
    "type": "resources",
    "ico": "/images/productions/46-16.png"
  },
  {
    "name": {
      "ru": "Сталь",
      "en": "Steel"
    },
    "id": "47",
    "weight": 2,
    "reciple": [

      {
        "id": 1,
        "amount": 2
      },

      {
        "id": 2,
        "amount": 1
      },

      {
        "id": 5,
        "amount": 1
      }],
    "type": "resources",
    "ico": "/images/productions/47-16.png"
  },
  {
    "name": {
      "ru": "Титановый сплав",
      "en": "Titanium Alloy"
    },
    "id": "48",
    "weight": 4,
    "reciple": [

      {
        "id": 1,
        "amount": 1
      },

      {
        "id": 2,
        "amount": 1
      },

      {
        "id": 9,
        "amount": 1
      }],
    "type": "resources",
    "ico": "/images/productions/48-16.png"
  },
  {
    "name": {
      "ru": "Нановолокно",
      "en": "Nanofibre"
    },
    "id": "49",
    "weight": 1,
    "reciple": [

      {
        "id": 1,
        "amount": 1
      },

      {
        "id": 2,
        "amount": 1
      },

      {
        "id": 8,
        "amount": 1
      }],
    "type": "resources",
    "ico": "/images/productions/49-16.png"
  },
  {
    "name": {
      "ru": "Полимеры",
      "en": "Polymers"
    },
    "id": "50",
    "weight": 1,
    "reciple": [

      {
        "id": 3,
        "amount": 2
      },

      {
        "id": 2,
        "amount": 1
      }],
    "type": "resources",
    "ico": "/images/productions/50-16.png"
  },
  {
    "name": {
      "ru": "Композиты",
      "en": "Composites"
    },
    "id": "51",
    "weight": 1,
    "reciple": [

      {
        "id": 3,
        "amount": 2
      },

      {
        "id": 2,
        "amount": 1
      },

      {
        "id": 1,
        "amount": 1
      },

      {
        "id": 5,
        "amount": 1
      },

      {
        "id": 6,
        "amount": 1
      }],
    "type": "resources",
    "ico": "/images/productions/51-16.png"
  },
  {
    "name": {
      "ru": "Ядерное топливо",
      "en": "Nuclear Fuel"
    },
    "id": "66",
    "weight": 1,
    "reciple": [

      {
        "id": 4,
        "amount": 2
      },

      {
        "id": 2,
        "amount": 1
      }],
    "type": "resources",
    "ico": "/images/productions/66-16.png"
  },
  {
    "name": {
      "ru": "Термоядерное топливо",
      "en": "Thermonuclear Fuel"
    },
    "id": "72",
    "weight": 1,
    "reciple": [

      {
        "id": 8,
        "amount": 1
      },

      {
        "id": 2,
        "amount": 1
      },

      {
        "id": 19,
        "amount": 1
      }],
    "type": "resources",
    "ico": "/images/productions/72-16.png"
  },
  {
    "name": {
      "ru": "Органическое топливо",
      "en": "Organic Fuel"
    },
    "id": "73",
    "weight": 1,
    "reciple": [

      {
        "id": 2,
        "amount": 2
      },

      {
        "id": 3,
        "amount": 1
      }],
    "type": "resources",
    "ico": "/images/productions/73-16.png"
  },
  {
    "name": {
      "ru": "Гравитационное топливо",
      "en": "Gravitational fuel"
    },
    "id": "453",
    "weight": 1,
    "reciple": [

      {
        "id": 451,
        "amount": 1
      },

      {
        "id": 18,
        "amount": 1
      },

      {
        "id": 2,
        "amount": 2
      }],
    "type": "resources",
    "ico": "/images/productions/453-16.png"
  },
  {
    "name": {
      "ru": "Реактивный двигатель",
      "en": "Jet Engine"
    },
    "id": "70",
    "buildOn": "26",
    "type": "module"
  },
  {
    "name": {
      "ru": "Электромагнитный парус",
      "en": "Electromagnetic Sail"
    },
    "id": "125",
    "buildOn": "26",
    "type": "module"
  },
  {
    "name": {
      "ru": "Ядерный двигатель",
      "en": "Nuclear Engine"
    },
    "id": "131",
    "buildOn": "26",
    "type": "module"
  },
  {
    "name": {
      "ru": "Гравитационный двигатель",
      "en": "Gravity Engine"
    },
    "id": "133",
    "buildOn": "26",
    "type": "module"
  },
  {
    "name": {
      "ru": "Фотонный двигатель",
      "en": "Photon Engine"
    },
    "id": "134",
    "buildOn": "26",
    "type": "module"
  },
  {
    "name": {
      "ru": "Гипер двигатель",
      "en": "Hyper Engine"
    },
    "id": "154",
    "buildOn": "26",
    "type": "module"
  },
  {
    "name": {
      "ru": "Малый двигательный отсек",
      "en": "Small Engine Bay"
    },
    "id": "264",
    "buildOn": "26",
    "type": "module"
  },
  {
    "name": {
      "ru": "Двигательный отсек",
      "en": "Engine Bay"
    },
    "id": "265",
    "buildOn": "26",
    "type": "module"
  },
  {
    "name": {
      "ru": "Джамп двигатель",
      "en": "Jump Thruster"
    },
    "id": "455",
    "buildOn": "26",
    "type": "module"
  },
  {
    "name": {
      "ru": "Легкий лазер",
      "en": "Light Laser"
    },
    "id": "127",
    "buildOn": "74",
    "type": "module"
  },
  {
    "name": {
      "ru": "Плазменное орудие",
      "en": "Plasma Gun"
    },
    "id": "142",
    "buildOn": "74",
    "type": "module"
  },
  {
    "name": {
      "ru": "Тяжелый лазер",
      "en": "Heavy Laser"
    },
    "id": "163",
    "buildOn": "74",
    "type": "module"
  },
  {
    "name": {
      "ru": "РПУ-X1",
      "en": "MPC-X1"
    },
    "id": "183",
    "buildOn": "82",
    "type": "module"
  },
  {
    "name": {
      "ru": "Кинетическая пушка",
      "en": "Kinetic Cannon"
    },
    "id": "187",
    "buildOn": "74",
    "type": "module"
  },
  {
    "name": {
      "ru": "РПУ-X2",
      "en": "MPC-X2"
    },
    "id": "192",
    "buildOn": "82",
    "type": "module"
  },
  {
    "name": {
      "ru": "Ионная пушка",
      "en": "Ion Cannon"
    },
    "id": "193",
    "buildOn": "74",
    "type": "module"
  },
  {
    "name": {
      "ru": "РПУ-X3",
      "en": "MPC-X3"
    },
    "id": "199",
    "buildOn": "82",
    "type": "module"
  },
  {
    "name": {
      "ru": "Планетарный разрушитель",
      "en": "Planetary Destroyer"
    },
    "id": "201",
    "buildOn": "74",
    "type": "module"
  },
  {
    "name": {
      "ru": "Устройство бомбометания",
      "en": "Bombing Device"
    },
    "id": "206",
    "buildOn": "82",
    "type": "module"
  },
  {
    "name": {
      "ru": "Лазерная турель",
      "en": "Laser Turret"
    },
    "id": "255",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Орудийная башня",
      "en": "Gun Tower"
    },
    "id": "256",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Ракетная турель",
      "en": "Missile Turret"
    },
    "id": "257",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Торпедный аппарат",
      "en": "Torpedo Launcher"
    },
    "id": "460",
    "buildOn": "82",
    "type": "module"
  },
  {
    "name": {
      "ru": "Инерционный лазер",
      "en": "Inertial Laser"
    },
    "id": "475",
    "buildOn": "74",
    "type": "module"
  },
  {
    "name": {
      "ru": "Стальная пластина",
      "en": "Steel Plate"
    },
    "id": "164",
    "buildOn": "75",
    "type": "module"
  },
  {
    "name": {
      "ru": "Титановая пластина",
      "en": "Titanium Plate"
    },
    "id": "165",
    "buildOn": "75",
    "type": "module"
  },
  {
    "name": {
      "ru": "Антилазерное покрытие",
      "en": "Anti-laser Coating"
    },
    "id": "171",
    "buildOn": "75",
    "type": "module"
  },
  {
    "name": {
      "ru": "Композитная броня",
      "en": "Composite Armor"
    },
    "id": "172",
    "buildOn": "75",
    "type": "module"
  },
  {
    "name": {
      "ru": "Магнитный щит",
      "en": "Magnetic Shield"
    },
    "id": "179",
    "buildOn": "81",
    "type": "module"
  },
  {
    "name": {
      "ru": "Гравитационный щит",
      "en": "Gravity Shield"
    },
    "id": "188",
    "buildOn": "81",
    "type": "module"
  },
  {
    "name": {
      "ru": "Нанопластина",
      "en": "Nanoplate"
    },
    "id": "194",
    "buildOn": "75",
    "type": "module"
  },
  {
    "name": {
      "ru": "Нейтронный щит",
      "en": "Neutron Shield"
    },
    "id": "195",
    "buildOn": "81",
    "type": "module"
  },
  {
    "name": {
      "ru": "Фибробетон",
      "en": "Fiberconcrete"
    },
    "id": "200",
    "buildOn": "75",
    "type": "module"
  },
  {
    "name": {
      "ru": "Щитовая платформа",
      "en": "Panel Platform"
    },
    "id": "260",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Энергетический дефлектор",
      "en": "Energy Deflector"
    },
    "id": "261",
    "buildOn": "81",
    "type": "module"
  },
  {
    "name": {
      "ru": "Химический реактор",
      "en": "Chemical Reactor"
    },
    "id": "77",
    "buildOn": "37",
    "type": "module"
  },
  {
    "name": {
      "ru": "Преобразователь излучения",
      "en": "Radiation Converter"
    },
    "id": "126",
    "buildOn": "37",
    "type": "module"
  },
  {
    "name": {
      "ru": "Ядерный реактор",
      "en": "Nuclear Reactor"
    },
    "id": "132",
    "buildOn": "37",
    "type": "module"
  },
  {
    "name": {
      "ru": "Термоядерный реактор",
      "en": "Thermonuclear Reactor"
    },
    "id": "135",
    "buildOn": "37",
    "type": "module"
  },
  {
    "name": {
      "ru": "Малый реакторный отсек",
      "en": "Small Reactor Bay"
    },
    "id": "269",
    "buildOn": "37",
    "type": "module"
  },
  {
    "name": {
      "ru": "Большой реакторный отсек",
      "en": "Large Reactor Bay"
    },
    "id": "270",
    "buildOn": "37",
    "type": "module"
  },
  {
    "name": {
      "ru": "Реакторный отсек",
      "en": "Reactor Bay"
    },
    "id": "271",
    "buildOn": "37",
    "type": "module"
  },
  {
    "name": {
      "ru": "Гравитационный реактор",
      "en": "Gravity reactor"
    },
    "id": "454",
    "buildOn": "37",
    "type": "module"
  },
  {
    "name": {
      "ru": "Модуль геологоразведки",
      "en": "Exploration Module"
    },
    "id": "136",
    "buildOn": "60",
    "type": "module"
  },
  {
    "name": {
      "ru": "Буровая установка МД-1",
      "en": "Drilling rig MD-1"
    },
    "id": "139",
    "buildOn": "60",
    "type": "module"
  },
  {
    "name": {
      "ru": "Буровая установка МД-2",
      "en": "Drilling rig MD-2"
    },
    "id": "140",
    "buildOn": "60",
    "type": "module"
  },
  {
    "name": {
      "ru": "Лазерный бур",
      "en": "Laser Drill"
    },
    "id": "141",
    "buildOn": "60",
    "type": "module"
  },
  {
    "name": {
      "ru": "Плазменный бур",
      "en": "Plasma Drill"
    },
    "id": "143",
    "buildOn": "60",
    "type": "module"
  },
  {
    "name": {
      "ru": "Буровая платформа МД-1",
      "en": "Drilling Platform MD-1"
    },
    "id": "266",
    "buildOn": "60",
    "type": "module"
  },
  {
    "name": {
      "ru": "Буровая платформа МД-2",
      "en": "Drilling Platform MD-2"
    },
    "id": "267",
    "buildOn": "60",
    "type": "module"
  },
  {
    "name": {
      "ru": "Тяжелая буровая платформа",
      "en": "Heavy Drilling Platform"
    },
    "id": "268",
    "buildOn": "60",
    "type": "module"
  },
  {
    "name": {
      "ru": "Астросканер",
      "en": "AstroScanner"
    },
    "id": "130",
    "buildOn": "70",
    "type": "module"
  },
  {
    "name": {
      "ru": "Археологический модуль",
      "en": "Archaeological Module"
    },
    "id": "159",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Корабельный радар",
      "en": "Spaceship Radar"
    },
    "id": "161",
    "buildOn": "70",
    "type": "module"
  },
  {
    "name": {
      "ru": "Радио-оптическая маскировка",
      "en": "Radio-optical Masking"
    },
    "id": "162",
    "buildOn": "70",
    "type": "module"
  },
  {
    "name": {
      "ru": "Абордажный модуль",
      "en": "Boarding Module"
    },
    "id": "177",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Нейтронная маскировка",
      "en": "Neutron Masking"
    },
    "id": "178",
    "buildOn": "70",
    "type": "module"
  },
  {
    "name": {
      "ru": "Нейтронный модулятор",
      "en": "Neutron Modulator"
    },
    "id": "479",
    "buildOn": "70",
    "type": "module"
  },
  {
    "name": {
      "ru": "Погрузочный модуль",
      "en": "Loading Module"
    },
    "id": "129",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Жилой отсек",
      "en": "Residential Bay"
    },
    "id": "144",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Строительный модуль",
      "en": "Construction Module"
    },
    "id": "145",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Малый грузовой отсек",
      "en": "Small Cargo Bay"
    },
    "id": "150",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Грузовой отсек",
      "en": "Cargo Bay"
    },
    "id": "151",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Большой грузовой отсек",
      "en": "Large Cargo Bay"
    },
    "id": "152",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Гравитационный вычислитель",
      "en": "Gravity Computer"
    },
    "id": "155",
    "buildOn": "70",
    "type": "module"
  },
  {
    "name": {
      "ru": "Бортовой компьютер",
      "en": "On-board Computer"
    },
    "id": "156",
    "buildOn": "70",
    "type": "module"
  },
  {
    "name": {
      "ru": "Корабельный ангар",
      "en": "Spaceship Hangar"
    },
    "id": "173",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Большой корабельный ангар",
      "en": "Large Spaceship Hangar"
    },
    "id": "174",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Сборщик обломков",
      "en": "Fragments Collector Module"
    },
    "id": "175",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Противоракетная система",
      "en": "Missile Defense System"
    },
    "id": "184",
    "buildOn": "70",
    "type": "module"
  },
  {
    "name": {
      "ru": "Постановщик гравитационных помех",
      "en": "Gravity Jammer"
    },
    "id": "186",
    "buildOn": "70",
    "type": "module"
  },
  {
    "name": {
      "ru": "Восстановитель щитов",
      "en": "Shield Restorer"
    },
    "id": "221",
    "buildOn": "81",
    "type": "module"
  },
  {
    "name": {
      "ru": "Командный модуль",
      "en": "Command Module"
    },
    "id": "226",
    "buildOn": "70",
    "type": "module"
  },
  {
    "name": {
      "ru": "Ремонтный модуль",
      "en": "Repair Module"
    },
    "id": "253",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Грузовая платформа",
      "en": "Cargo Platform"
    },
    "id": "258",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Отсек управления",
      "en": "Control Bay"
    },
    "id": "259",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Погрузочная платформа",
      "en": "Loading Platform"
    },
    "id": "262",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Абордажная платформа",
      "en": "Boarding Platform"
    },
    "id": "263",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Отсек вооружения",
      "en": "Weapons Bay"
    },
    "id": "272",
    "buildOn": "70",
    "type": "module"
  },
  {
    "name": {
      "ru": "Гиперпространственная ловушка",
      "en": "Hyperspace Trap"
    },
    "id": "288",
    "buildOn": "70",
    "type": "module"
  },
  {
    "name": {
      "ru": "Массагенератор",
      "en": "Mass Generator"
    },
    "id": "480",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Рабочий отсек",
      "en": "Operating Bay"
    },
    "id": "482",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Минный шлюз",
      "en": "Mine lock"
    },
    "id": "495",
    "buildOn": "59",
    "type": "module"
  },
  {
    "name": {
      "ru": "Стрела-X1",
      "en": "Arrow-X1"
    },
    "id": "180",
    "buildOn": "83",
    "type": "module"
  },
  {
    "name": {
      "ru": "Молния-X1",
      "en": "Lightning-X1"
    },
    "id": "181",
    "buildOn": "83",
    "type": "module"
  },
  {
    "name": {
      "ru": "Ураган-X1",
      "en": "Hurricane-X1"
    },
    "id": "182",
    "buildOn": "83",
    "type": "module"
  },
  {
    "name": {
      "ru": "Шторм-X2",
      "en": "Storm-X2"
    },
    "id": "189",
    "buildOn": "83",
    "type": "module"
  },
  {
    "name": {
      "ru": "Смерч-X2",
      "en": "Tornado-X2"
    },
    "id": "190",
    "buildOn": "83",
    "type": "module"
  },
  {
    "name": {
      "ru": "Игла-X2",
      "en": "Quill-X2"
    },
    "id": "191",
    "buildOn": "83",
    "type": "module"
  },
  {
    "name": {
      "ru": "Валькирия-X3",
      "en": "Valkyrie-X3"
    },
    "id": "196",
    "buildOn": "83",
    "type": "module"
  },
  {
    "name": {
      "ru": "Гарпия-X3",
      "en": "Harp-X3"
    },
    "id": "197",
    "buildOn": "83",
    "type": "module"
  },
  {
    "name": {
      "ru": "Горгона-X3",
      "en": "Gorgon-X3"
    },
    "id": "198",
    "buildOn": "83",
    "type": "module"
  },
  {
    "name": {
      "ru": "Нейтронная бомба",
      "en": "Neutron Bomb"
    },
    "id": "203",
    "buildOn": "83",
    "type": "module"
  },
  {
    "name": {
      "ru": "Бункерная бомба",
      "en": "Bunker Bomb"
    },
    "id": "204",
    "buildOn": "83",
    "type": "module"
  },
  {
    "name": {
      "ru": "Термоядерная бомба",
      "en": "Thermonuclear Bomb"
    },
    "id": "205",
    "buildOn": "83",
    "type": "module"
  },
  {
    "name": {
      "ru": "Термоядерная торпеда",
      "en": "Thermonuclear Torpedo"
    },
    "id": "457",
    "buildOn": "83",
    "type": "module"
  },
  {
    "name": {
      "ru": "Протонная торпеда",
      "en": "Proton Torpedo"
    },
    "id": "458",
    "buildOn": "83",
    "type": "module"
  },
  {
    "name": {
      "ru": "Гравитационная торпеда",
      "en": "Gravity Torpedo"
    },
    "id": "459",
    "buildOn": "83",
    "type": "module"
  },
  {
    "name": {
      "ru": "Термоядерная мина",
      "en": "Thermonuclear mine"
    },
    "id": "493",
    "buildOn": "83",
    "type": "module"
  },
  {
    "name": {
      "ru": "Тахионная мина",
      "en": "Tachyon mine"
    },
    "id": "498",
    "buildOn": "83",
    "type": "module"
  },
  {
    "name": {
      "ru": "Гравитационная мина",
      "en": "Gravity mine"
    },
    "id": "499",
    "buildOn": "83",
    "type": "module"
  }];
//Задания
sfdata.questions = [
  {
    "id": "78",
    "name": {
      "ru": "Археологическая экспедиция",
      "en": "Archaeological expedition"
    },
    "icon": "/images/quests/78-32.png",
    "color": "#fcc141"
  },
  {
    "id": "61",
    "name": {
      "ru": "Взять на абордаж транспорт Боргов",
      "en": "Aboard Borg spacecraft"
    },
    "icon": "/images/quests/61-32.png",
    "color": "#3e1edf"
  },
  {
    "id": "48",
    "name": {
      "ru": "Геологоразведка",
      "en": "Geological Exploration"
    },
    "icon": "/images/quests/48-32.png",
    "color": "#285b9a"
  },
  {
    "id": "50",
    "name": {
      "ru": "Дозаправка флота Федерации",
      "en": "Refill Federation Fleet"
    },
    "icon": "/images/quests/50-32.png",
    "color": "#285b9a"
  },
  {
    "id": "55",
    "name": {
      "ru": "Доставить Федерации компоненты КК",
      "en": "Deliver SC components to the Federation"
    },
    "icon": "/images/quests/53-32.png",
    "color": "#f7b03a"
  },
  {
    "id": "54",
    "name": {
      "ru": "Доставить Федерации материалы",
      "en": "Deliver Materials to Feds"
    },
    "icon": "/images/quests/53-32.png",
    "color": "#f7b03a"
  },
  {
    "id": "37",
    "name": {
      "ru": "Исследование галактики",
      "en": "Galaxy Exploration"
    },
    "icon": "/images/quests/37-32.png",
    "color": "#285b9a"
  },
  {
    "id": "75",
    "name": {
      "ru": "Монтажные работы",
      "en": "Installation works"
    },
    "icon": "/images/quests/75-32.png",
    "color": "#87d887"
  },
  {
    "id": "53",
    "name": {
      "ru": "Перевезти товар Федерации",
      "en": "Transport Federation Goods"
    },
    "icon": "/images/quests/53-32.png",
    "color": "#f7b03a"
  },
  {
    "id": "52",
    "name": {
      "ru": "Переместить флот Федерации",
      "en": "Relocate Federation Fleet"
    },
    "icon": "/images/quests/52-32.png",
    "color": "#ff4200"
  },
  {
    "id": "77",
    "name": {
      "ru": "Построить космобазу",
      "en": "Build spacebase"
    },
    "icon": "/images/quests/77-32.png",
    "color": "#87d887"
  },
  {
    "id": "76",
    "name": {
      "ru": "Ремонтные работы",
      "en": "Repair works"
    },
    "icon": "/images/quests/76-32.png",
    "color": "#d97e6f"
  },
  {
    "id": "51",
    "name": {
      "ru": "Уничтожить военный патруль Боргов",
      "en": "Destroy Borg Military Patrool"
    },
    "icon": "/images/quests/51-32.png",
    "color": "#ff4200"
  },
  {
    "id": "67",
    "name": {
      "ru": "Уничтожить военный флот Боргов",
      "en": "Destroy Borg Military Fleet"
    },
    "icon": "/images/quests/66-32.png",
    "color": "#ff4200"
  },
  {
    "id": "68",
    "name": {
      "ru": "Уничтожить генератор аномалий Боргов",
      "en": "Destroy Borg Anomaly Generator"
    },
    "icon": "/images/quests/61-32.png",
    "color": "#3e1edf"
  },
  {
    "id": "58",
    "name": {
      "ru": "Уничтожить истребители Боргов",
      "en": "Destroy Borg Airfighters"
    },
    "icon": "/images/quests/58-32.png",
    "color": "#ff4200"
  },
  {
    "id": "57",
    "name": {
      "ru": "Уничтожить Космобазу",
      "en": "Destroy Spacebase"
    },
    "icon": "/images/quests/57-32.png",
    "color": "#ff4200"
  },
  {
    "id": "60",
    "name": {
      "ru": "Уничтожить крейсера Боргов",
      "en": "Destroy Borg Cruisers"
    },
    "icon": "/images/quests/60-32.png",
    "color": "#ff4200"
  },
  {
    "id": "66",
    "name": {
      "ru": "Уничтожить линкоры Боргов",
      "en": "Destroy Borg Battleships"
    },
    "icon": "/images/quests/66-32.png",
    "color": "#ff4200"
  },
  {
    "id": "59",
    "name": {
      "ru": "Уничтожить фрегаты Боргов",
      "en": "Destroy Borg Frigates"
    },
    "icon": "/images/quests/59-32.png",
    "color": "#ff4200"
  }];

//Постройки
sfdata.buildings = [{
  "name": {
    "ru": "Орбитальная база",
    "en": "Orbital Base"
  },
  "id": "7",
  "orbita": true
}, {
  "name": {
    "ru": "Жилой модуль",
    "en": "Residential Module"
  },
  "id": "31",
  "orbita": true
}, {
  "name": {
    "ru": "Орбитальный склад",
    "en": "Orbital Warehouse"
  },
  "id": "63",
  "orbita": true
}, {
  "name": {
    "ru": "Гиперврата",
    "en": "Hypergates"
  },
  "id": "68",
  "orbita": true
}, {
  "name": {
    "ru": "Орбитальная обсерватория",
    "en": "Orbital Observatory"
  },
  "id": "69",
  "orbita": true
}, {
  "name": {
    "ru": "Радарная станция",
    "en": "Radar Station"
  },
  "id": "72",
  "orbita": true
}, {
  "name": {
    "ru": "Генератор поля маскировки",
    "en": "Masking Field Generator"
  },
  "id": "73",
  "orbita": true
}, {
  "name": {
    "ru": "Орбитальное казино",
    "en": "Orbital Casino"
  },
  "id": "85",
  "orbita": true
}, {
  "name": {
    "ru": "Школа командиров",
    "en": "Commander School"
  },
  "id": "88",
  "orbita": true
}, {
  "name": {
    "ru": "Служба спасения командиров",
    "en": "Rescue Service"
  },
  "id": "89",
  "orbita": true
}, {
  "name": {
    "ru": "Логистический центр",
    "en": "Logistics Center"
  },
  "id": "97",
  "orbita": true
}, {
  "name": {
    "ru": "Фазовый усилитель",
    "en": "Phase Amp"
  },
  "id": "98",
  "orbita": true
}, {
  "name": {
    "ru": "Детектор аномалий",
    "en": "Anomaly Detector"
  },
  "id": "100",
  "orbita": true
}, {
  "name": {
    "ru": "Орбитальная СЭС",
    "en": "Orbital PSS"
  },
  "id": "30",
  "orbita": true
}, {
  "name": {
    "ru": "Орбитальный термоядерный реактор",
    "en": "Orbital Thermonuclear Reactor"
  },
  "id": "67",
  "orbita": true
}, {
  "name": {
    "ru": "Орбитальный гравитационный реактор",
    "en": "Orbital Gravity Reactor"
  },
  "id": "107",
  "orbita": true
}, {
  "name": {
    "ru": "Боевая платформа",
    "en": "Combat Platform"
  },
  "id": "84",
  "orbita": true
}, {
  "name": {
    "ru": "Дефлекторная станция",
    "en": "Deflector Station"
  },
  "id": "103",
  "orbita": true
}, {
  "name": {
    "ru": "Центр обороны",
    "en": "Defense Center"
  },
  "id": "104",
  "orbita": true
}, {
  "name": {
    "ru": "Лазерная боевая платформа",
    "en": "Laser Combat Platform"
  },
  "id": "112",
  "orbita": true
}, {
  "name": {
    "ru": "Орудийная боевая платформа",
    "en": "Gun Combat Platform"
  },
  "id": "113",
  "orbita": true
}, {
  "name": {
    "ru": "Ракетная боевая платформа",
    "en": "Missile Combat Platform"
  },
  "id": "114",
  "orbita": true
}, {
  "name": {
    "ru": "Тяжелая боевая платформа",
    "en": "Heavy Combat Platform"
  },
  "id": "115",
  "orbita": true
}, {
  "name": {
    "ru": "Орбитальный ангар",
    "en": "Orbital Hangar"
  },
  "id": "55",
  "orbita": true
}, {
  "name": {
    "ru": "Орбитальный док",
    "en": "Orbital Dock"
  },
  "id": "56",
  "orbita": true
}, {
  "name": {
    "ru": "Командный центр",
    "en": "Command Center"
  },
  "id": "58",
  "orbita": true
}, {
  "name": {
    "ru": "Ремонтные мастерские",
    "en": "Repair Shops"
  },
  "id": "80",
  "orbita": true
}, {
  "name": {
    "ru": "Торговый центр",
    "en": "Trade Center"
  },
  "id": "64",
  "orbita": true
}, {
  "name": {
    "ru": "Торговый склад",
    "en": "Trade Warehouse"
  },
  "id": "65",
  "orbita": true
}, {
  "name": {
    "ru": "Навигационный центр",
    "en": "Navigation Center"
  },
  "id": "96",
  "orbita": true
}, {
  "name": {
    "ru": "Обогатитель изотопов гелия",
    "en": "Helium Isotope Enricher"
  },
  "id": "29",
  "orbita": true
}, {
  "name": {
    "ru": "Экстрактор темной материи",
    "en": "Dark Matter Extractor"
  },
  "id": "105",
  "orbita": true
}, {
  "name": {
    "ru": "Аванпост",
    "en": "Outpost"
  },
  "id": "118",
  "orbita": true
}, {
  "name": {
    "ru": "Цитадель",
    "en": "Citadel"
  },
  "id": "119",
  "orbita": true
}, {
  "name": {
    "ru": "Космический причал",
    "en": "Space Pier"
  },
  "id": "108",
  "orbita": true
}, {
  "name": {
    "ru": "Торговая станция",
    "en": "Trade Station"
  },
  "id": "102",
  "orbita": true
}, {
  "name": {
    "ru": "Преобразователь материи",
    "en": "Matter Converter"
  },
  "id": "101",
  "orbita": true
}, {
  "name": {
    "ru": "Гравитационный накопитель",
    "en": "Gravity Accumulator"
  },
  "id": "106",
  "orbita": true
}, {
  "name": {
    "ru": "Центр переработки",
    "en": "Processing Center"
  },
  "id": "116",
  "orbita": true
}, {
  "name": {
    "ru": "Космобаза",
    "en": "Spacebase"
  },
  "id": "90",
  "orbita": true
}, {
  "name": {
    "ru": "Склад альянса",
    "en": "Alliance Warehouse"
  },
  "id": "95",
  "orbita": true
}, {
  "name": {
    "ru": "Джамп модуль",
    "en": "Jump Thruster"
  },
  "id": "110",
  "orbita": true
}, {
  "name": {
    "ru": "Алтарь",
    "en": "Altar"
  },
  "id": "120",
  "orbita": true
}, {
  "name": {
    "ru": "Научный центр",
    "en": "Science Center"
  },
  "id": "121",
  "orbita": true
}, {
  "name": {
    "ru": "Колония",
    "en": "Colony"
  },
  "id": "1",
  "orbita": false
}, {
  "name": {
    "ru": "Склад",
    "en": "Warehouse"
  },
  "id": "11",
  "orbita": false
}, {
  "name": {
    "ru": "Города",
    "en": "Cities"
  },
  "id": "12",
  "orbita": false
}, {
  "name": {
    "ru": "Центр здравоохранения",
    "en": "Health Care Center"
  },
  "id": "15",
  "orbita": false
}, {
  "name": {
    "ru": "Банк",
    "en": "Bank"
  },
  "id": "18",
  "orbita": false
}, {
  "name": {
    "ru": "Обсерватория",
    "en": "Observatory"
  },
  "id": "19",
  "orbita": false
}, {
  "name": {
    "ru": "Строительный комбинат",
    "en": "Construction Plant"
  },
  "id": "20",
  "orbita": false
}, {
  "name": {
    "ru": "Космопорт",
    "en": "Spaceport"
  },
  "id": "27",
  "orbita": false
}, {
  "name": {
    "ru": "Конгресс колоний",
    "en": "Colonies Congress"
  },
  "id": "61",
  "orbita": false
}, {
  "name": {
    "ru": "Энергетический купол",
    "en": "Power Dome"
  },
  "id": "66",
  "orbita": false
}, {
  "name": {
    "ru": "Колониальное управление",
    "en": "Colonial Administration"
  },
  "id": "76",
  "orbita": false
}, {
  "name": {
    "ru": "Развлекательный центр",
    "en": "Entertainment Center"
  },
  "id": "77",
  "orbita": false
}, {
  "name": {
    "ru": "Полицейское управление",
    "en": "Police Department"
  },
  "id": "78",
  "orbita": false
}, {
  "name": {
    "ru": "Разведывательное управление",
    "en": "Intelligence Agency"
  },
  "id": "86",
  "orbita": false
}, {
  "name": {
    "ru": "Центр контрразведки",
    "en": "Counterintelligence Center"
  },
  "id": "87",
  "orbita": false
}, {
  "name": {
    "ru": "Культурный центр",
    "en": "Cultural Center"
  },
  "id": "91",
  "orbita": false
}, {
  "name": {
    "ru": "Центр управления",
    "en": "Control Center"
  },
  "id": "92",
  "orbita": false
}, {
  "name": {
    "ru": "Центр безопасности",
    "en": "Security Center"
  },
  "id": "99",
  "orbita": false
}, {
  "name": {
    "ru": "Солнечная электростанция",
    "en": "Solar Power Plant"
  },
  "id": "2",
  "orbita": false
}, {
  "name": {
    "ru": "Тепловая электростанция",
    "en": "Thermal Power Plant"
  },
  "id": "14",
  "orbita": false
}, {
  "name": {
    "ru": "Атомная электростанция",
    "en": "Nuclear Power Plant"
  },
  "id": "21",
  "orbita": false
}, {
  "name": {
    "ru": "Термоядерная электростанция",
    "en": "Thermonuclear Power Plant"
  },
  "id": "28",
  "orbita": false
}, {
  "name": {
    "ru": "Ресурсно-сырьевая база",
    "en": "Resource Base"
  },
  "id": "3",
  "orbita": false
}, {
  "name": {
    "ru": "Горно-обогатительный комбинат",
    "en": "Mining and Processing Plant"
  },
  "id": "4",
  "orbita": false
}, {
  "name": {
    "ru": "Шахты",
    "en": "Mines"
  },
  "id": "5",
  "orbita": false
}, {
  "name": {
    "ru": "Станция геологоразведки",
    "en": "Exploration Station"
  },
  "id": "17",
  "orbita": false
}, {
  "name": {
    "ru": "Металлургический комбинат",
    "en": "Metallurgical Plant"
  },
  "id": "8",
  "orbita": false
}, {
  "name": {
    "ru": "Фабрика строительных материалов",
    "en": "Construction Materials Factory"
  },
  "id": "9",
  "orbita": false
}, {
  "name": {
    "ru": "Технологический центр",
    "en": "Tech Center"
  },
  "id": "10",
  "orbita": false
}, {
  "name": {
    "ru": "Химический завод",
    "en": "Chemical Plant"
  },
  "id": "13",
  "orbita": false
}, {
  "name": {
    "ru": "Топливный завод",
    "en": "Fuel Plant"
  },
  "id": "22",
  "orbita": false
}, {
  "name": {
    "ru": "Фабрика двигателей КК",
    "en": "Engine Factory (SC)"
  },
  "id": "26",
  "orbita": false
}, {
  "name": {
    "ru": "Завод энергетических реакторов",
    "en": "Power Reactor Plant"
  },
  "id": "37",
  "orbita": false
}, {
  "name": {
    "ru": "Индустриальный комплекс",
    "en": "Industrial Complex"
  },
  "id": "59",
  "orbita": false
}, {
  "name": {
    "ru": "Фабрика буровых установок",
    "en": "Drilling Rig Factory"
  },
  "id": "60",
  "orbita": false
}, {
  "name": {
    "ru": "Фабрика утилизации",
    "en": "Recycling Factory"
  },
  "id": "62",
  "orbita": false
}, {
  "name": {
    "ru": "Завод точных приборов",
    "en": "Precision Instrument Plant"
  },
  "id": "70",
  "orbita": false
}, {
  "name": {
    "ru": "Оружейный завод",
    "en": "Armoury"
  },
  "id": "74",
  "orbita": false
}, {
  "name": {
    "ru": "Литейный завод",
    "en": "Foundry"
  },
  "id": "75",
  "orbita": false
}, {
  "name": {
    "ru": "Завод энергетических щитов",
    "en": "Power Panel Plant"
  },
  "id": "81",
  "orbita": false
}, {
  "name": {
    "ru": "Завод ракетных установок",
    "en": "Missile Plant"
  },
  "id": "82",
  "orbita": false
}, {
  "name": {
    "ru": "Фабрика боеприпасов",
    "en": "Ammo Factory"
  },
  "id": "83",
  "orbita": false
}, {
  "name": {
    "ru": "Индустриальный центр Боргов",
    "en": "Borg Industrial Center"
  },
  "id": "93",
  "orbita": false
}, {
  "name": {
    "ru": "Центр стандартизации Боргов",
    "en": "Borg Standardization Center"
  },
  "id": "109",
  "orbita": false
}, {
  "name": {
    "ru": "Научная лаборатория",
    "en": "Science Laboratory"
  },
  "id": "23",
  "orbita": false
}, {
  "name": {
    "ru": "Исследовательский центр",
    "en": "Research Center"
  },
  "id": "24",
  "orbita": false
}, {
  "name": {
    "ru": "Академия наук",
    "en": "Science Academy"
  },
  "id": "25",
  "orbita": false
}, {
  "name": {
    "ru": "Конструкторское бюро",
    "en": "Design Office"
  },
  "id": "32",
  "orbita": false
}, {
  "name": {
    "ru": "Археологический центр",
    "en": "Archaeological Center"
  },
  "id": "71",
  "orbita": false
}];
// Корпуса кораблей
sfdata.hulls = [
  {
    "name": {
      "ru": "МТ-1",
      "en": "LT-1"
    },
    "id": "1"
  },
  {
    "name": {
      "ru": "МТ-2",
      "en": "LT-2"
    },
    "id": "2"
  },
  {
    "name": {
      "ru": "МТ-3",
      "en": "LT-3"
    },
    "id": "4"
  },
  {
    "name": {
      "ru": "Истребитель",
      "en": "Airfighter"
    },
    "id": "3"
  },
  {
    "name": {
      "ru": "Тяжелый истребитель",
      "en": "Heavy Fighter"
    },
    "id": "11"
  },
  {
    "name": {
      "ru": "Штурмовик",
      "en": "Strike Fighter"
    },
    "id": "12"
  },
  {
    "name": {
      "ru": "Торпедоносец",
      "en": "Torpedo Bomber"
    },
    "id": "29"
  },
  {
    "name": {
      "ru": "Т-1",
      "en": "T-1"
    },
    "id": "5"
  },
  {
    "name": {
      "ru": "Т-2",
      "en": "T-2"
    },
    "id": "6"
  },
  {
    "name": {
      "ru": "Т-3",
      "en": "T-3"
    },
    "id": "7"
  },
  {
    "name": {
      "ru": "БТ-1",
      "en": "HT-1"
    },
    "id": "8"
  },
  {
    "name": {
      "ru": "БТ-2",
      "en": "HT-2"
    },
    "id": "9"
  },
  {
    "name": {
      "ru": "БТ-3",
      "en": "HT-3"
    },
    "id": "10"
  },
  {
    "name": {
      "ru": "Носитель",
      "en": "Space Carrier"
    },
    "id": "22"
  },
  {
    "name": {
      "ru": "Гефест",
      "en": "Hephaestus"
    },
    "id": "23"
  },
  {
    "name": {
      "ru": "Меркурий",
      "en": "Mercury"
    },
    "id": "24"
  },
  {
    "name": {
      "ru": "Корвет",
      "en": "Corvette"
    },
    "id": "13"
  },
  {
    "name": {
      "ru": "Фрегат",
      "en": "Frigate"
    },
    "id": "14"
  },
  {
    "name": {
      "ru": "Эсминец",
      "en": "Destroyer"
    },
    "id": "15"
  },
  {
    "name": {
      "ru": "Призрак",
      "en": "Ghost"
    },
    "id": "27"
  },
  {
    "name": {
      "ru": "Легкий крейсер",
      "en": "Light Cruiser"
    },
    "id": "16"
  },
  {
    "name": {
      "ru": "Крейсер",
      "en": "Cruiser"
    },
    "id": "17"
  },
  {
    "name": {
      "ru": "Тяжелый крейсер",
      "en": "Heavy Cruiser"
    },
    "id": "18"
  },
  {
    "name": {
      "ru": "Рейдер",
      "en": "Raider"
    },
    "id": "30"
  },
  {
    "name": {
      "ru": "Линейный крейсер",
      "en": "Battlecruiser"
    },
    "id": "19"
  },
  {
    "name": {
      "ru": "Линкор",
      "en": "Battleship"
    },
    "id": "20"
  },
  {
    "name": {
      "ru": "Левиафан",
      "en": "Leviathan"
    },
    "id": "21"
  },
  {
    "name": {
      "ru": "Орбитальная крепость",
      "en": "Orbital Fortress"
    },
    "id": "25"
  },
  {
    "name": {
      "ru": "Флагман",
      "en": "Flagship"
    },
    "id": "26"
  }];

//Стили
let styleString = `
.loaderText{
  text-transform: uppercase;
  font-weight: 500;
  animation: .3s 0s 1 textLoader normal both running linear;
  display: block;
}

@keyframes textLoader {
  0% {
    transform: translateY(-20px) scaleX(.7);
    opacity: .0;
  }

  70% {
    transform: scaleY(.7) translateY(2px);
  }
}

.sfui-main-window{
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.sfui-main-window:after{
  content : "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity : 0.2;
  z-index: -1;
  background-image: url(https://img5.goodfon.ru/original/1280x960/b/6e/art-kosmos-prostranstvo-planety-zviozdy-nebula-space-univers.jpg);
  background-position: center;
  filter: blur(3px);
  -webkit-filter: blur(3px);
  -moz-filter: blur(3px);
  -o-filter: blur(3px);
  -ms-filter: blur(3px);
}

.w-100 {
    width: 100%;
}

.h-100{
    height: 100%;
}

.pointer{
    cursor: pointer;
}

.td-cell-200{
  display: block;
  overflow-y: auto;
  max-height: 200px;
}

.in-line-block{
    display: inline-block;
}

.cursor-pointer{
    cursor: pointer;
}

.mb-5px{
    margin-bottom: 5px !important;
}

.mx-0{
    margin-left: 0px !important;
    margin-right: 0px !important;
}

.gray-btn{
    margin: 0 5px;
    color: #888;
    cursor: pointer;
}

.warning-text{
    color: lightgoldenrodyellow;
}

small{
    font-size: 12px !important;
}

.hiden{
    display: none !important;
}

.p-0 {
    padding: 0 !important;
}

.p-1 {
    padding: 0.25rem !important;
}

.p-2 {
    padding: 0.5rem !important;
}

.p-3 {
    padding: 1rem !important;
}

.p-4 {
    padding: 1.5rem !important;
}

.p-5 {
    padding: 3rem !important;
}

.p-6 {
    padding: 4rem !important;
}

.p-7 {
    padding: 6rem !important;
}

.p-8 {
    padding: 8rem !important;
}

.p-9 {
    padding: 10rem !important;
}

.p-10 {
    padding: 12rem !important;
}

.p-11 {
    padding: 14rem !important;
}

.p-12 {
    padding: 16rem !important;
}

.px-0 {
    padding-right: 0 !important;
    padding-left: 0 !important;
}

.px-1 {
    padding-right: 0.25rem !important;
    padding-left: 0.25rem !important;
}

.px-2 {
    padding-right: 0.5rem !important;
    padding-left: 0.5rem !important;
}

.px-3 {
    padding-right: 1rem !important;
    padding-left: 1rem !important;
}

.px-4 {
    padding-right: 1.5rem !important;
    padding-left: 1.5rem !important;
}

.px-5 {
    padding-right: 3rem !important;
    padding-left: 3rem !important;
}

.px-6 {
    padding-right: 4rem !important;
    padding-left: 4rem !important;
}

.px-7 {
    padding-right: 6rem !important;
    padding-left: 6rem !important;
}

.px-8 {
    padding-right: 8rem !important;
    padding-left: 8rem !important;
}

.px-9 {
    padding-right: 10rem !important;
    padding-left: 10rem !important;
}

.px-10 {
    padding-right: 12rem !important;
    padding-left: 12rem !important;
}

.px-11 {
    padding-right: 14rem !important;
    padding-left: 14rem !important;
}

.px-12 {
    padding-right: 16rem !important;
    padding-left: 16rem !important;
}

.py-0 {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}

.py-1 {
    padding-top: 0.25rem !important;
    padding-bottom: 0.25rem !important;
}

.py-2 {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
}

.py-3 {
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
}

.py-4 {
    padding-top: 1.5rem !important;
    padding-bottom: 1.5rem !important;
}

.py-5 {
    padding-top: 3rem !important;
    padding-bottom: 3rem !important;
}

.py-6 {
    padding-top: 4rem !important;
    padding-bottom: 4rem !important;
}

.py-7 {
    padding-top: 6rem !important;
    padding-bottom: 6rem !important;
}

.py-8 {
    padding-top: 8rem !important;
    padding-bottom: 8rem !important;
}

.py-9 {
    padding-top: 10rem !important;
    padding-bottom: 10rem !important;
}

.py-10 {
    padding-top: 12rem !important;
    padding-bottom: 12rem !important;
}

.py-11 {
    padding-top: 14rem !important;
    padding-bottom: 14rem !important;
}

.py-12 {
    padding-top: 16rem !important;
    padding-bottom: 16rem !important;
}

.pt-0 {
    padding-top: 0 !important;
}

.pt-1 {
    padding-top: 0.25rem !important;
}

.pt-2 {
    padding-top: 0.5rem !important;
}

.pt-3 {
    padding-top: 1rem !important;
}

.pt-4 {
    padding-top: 1.5rem !important;
}

.pt-5 {
    padding-top: 3rem !important;
}

.pt-6 {
    padding-top: 4rem !important;
}

.pt-7 {
    padding-top: 6rem !important;
}

.pt-8 {
    padding-top: 8rem !important;
}

.pt-9 {
    padding-top: 10rem !important;
}

.pt-10 {
    padding-top: 12rem !important;
}

.pt-11 {
    padding-top: 14rem !important;
}

.pt-12 {
    padding-top: 16rem !important;
}

.pe-0 {
    padding-right: 0 !important;
}

.pe-1 {
    padding-right: 0.25rem !important;
}

.pe-2 {
    padding-right: 0.5rem !important;
}

.pe-3 {
    padding-right: 1rem !important;
}

.pe-4 {
    padding-right: 1.5rem !important;
}

.pe-5 {
    padding-right: 3rem !important;
}

.pe-6 {
    padding-right: 4rem !important;
}

.pe-7 {
    padding-right: 6rem !important;
}

.pe-8 {
    padding-right: 8rem !important;
}

.pe-9 {
    padding-right: 10rem !important;
}

.pe-10 {
    padding-right: 12rem !important;
}

.pe-11 {
    padding-right: 14rem !important;
}

.pe-12 {
    padding-right: 16rem !important;
}

.pb-0 {
    padding-bottom: 0 !important;
}

.pb-1 {
    padding-bottom: 0.25rem !important;
}

.pb-2 {
    padding-bottom: 0.5rem !important;
}

.pb-3 {
    padding-bottom: 1rem !important;
}

.pb-4 {
    padding-bottom: 1.5rem !important;
}

.pb-5 {
    padding-bottom: 3rem !important;
}

.pb-6 {
    padding-bottom: 4rem !important;
}

.pb-7 {
    padding-bottom: 6rem !important;
}

.pb-8 {
    padding-bottom: 8rem !important;
}

.pb-9 {
    padding-bottom: 10rem !important;
}

.pb-10 {
    padding-bottom: 12rem !important;
}

.pb-11 {
    padding-bottom: 14rem !important;
}

.pb-12 {
    padding-bottom: 16rem !important;
}

.ps-0 {
    padding-left: 0 !important;
}

.ps-1 {
    padding-left: 0.25rem !important;
}

.ps-2 {
    padding-left: 0.5rem !important;
}

.ps-3 {
    padding-left: 1rem !important;
}

.ps-4 {
    padding-left: 1.5rem !important;
}

.ps-5 {
    padding-left: 3rem !important;
}

.ps-6 {
    padding-left: 4rem !important;
}

.ps-7 {
    padding-left: 6rem !important;
}

.ps-8 {
    padding-left: 8rem !important;
}

.ps-9 {
    padding-left: 10rem !important;
}

.ps-10 {
    padding-left: 12rem !important;
}

.ps-11 {
    padding-left: 14rem !important;
}

.ps-12 {
    padding-left: 16rem !important;
}

/*!
 * Bootstrap Grid v4.1.3 (https://getbootstrap.com/)
 * Copyright 2011-2018 The Bootstrap Authors
 * Copyright 2011-2018 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
@-ms-viewport {
  width: device-width;
}

.row {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col {
  position: relative;
  width: 100%;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
}

.col {
  -ms-flex-preferred-size: 0;
  flex-basis: 0;
  -ms-flex-positive: 1;
  flex-grow: 1;
  max-width: 100%;
}

.col-1 {
  -ms-flex: 0 0 8.333333%;
  flex: 0 0 8.333333%;
  max-width: 8.333333%;
}

.col-2 {
  -ms-flex: 0 0 16.666667%;
  flex: 0 0 16.666667%;
  max-width: 16.666667%;
}

.col-3 {
  -ms-flex: 0 0 25%;
  flex: 0 0 25%;
  max-width: 25%;
}

.col-4 {
  -ms-flex: 0 0 33.333333%;
  flex: 0 0 33.333333%;
  max-width: 33.333333%;
}

.col-5 {
  -ms-flex: 0 0 41.666667%;
  flex: 0 0 41.666667%;
  max-width: 41.666667%;
}

.col-6 {
  -ms-flex: 0 0 50%;
  flex: 0 0 50%;
  max-width: 50%;
}

.col-7 {
  -ms-flex: 0 0 58.333333%;
  flex: 0 0 58.333333%;
  max-width: 58.333333%;
}

.col-8 {
  -ms-flex: 0 0 66.666667%;
  flex: 0 0 66.666667%;
  max-width: 66.666667%;
}

.col-9 {
  -ms-flex: 0 0 75%;
  flex: 0 0 75%;
  max-width: 75%;
}

.col-10 {
  -ms-flex: 0 0 83.333333%;
  flex: 0 0 83.333333%;
  max-width: 83.333333%;
}

.col-11 {
  -ms-flex: 0 0 91.666667%;
  flex: 0 0 91.666667%;
  max-width: 91.666667%;
}

.col-12 {
  -ms-flex: 0 0 100%;
  flex: 0 0 100%;
  max-width: 100%;
}

.d-inline {
  display: inline !important;
}

.d-inline-block {
  display: inline-block !important;
}

.d-table {
  display: table !important;
}

.d-table-row {
  display: table-row !important;
}

.d-table-cell {
  display: table-cell !important;
}

.d-inline-flex {
  display: -ms-inline-flexbox !important;
  display: inline-flex !important;
}
`;
styleString += `

.gridCell {
  box-sizing: border-box;
  width: 22px;
  height: 22px;
  line-height: 21px;
  text-align: center;
  border: 1px solid #173530;
  display: inline-block;
  transition: .3s;
}

.normalPos {
  color: rgb(35 165 185 / 80%);
}
.attackerExit {
  color: rgba(255 0 0 / 70%);
}
.defenderExit {
  color: rgba(255 255 0 / 70%);
}
.attackerExit:has(~ div.battleCell > div.battleCellContainer:hover > div.battleCellAttacker) {
  border-color: rgba(255 0 0 / 30%);
}
.defenderExit:has(~ div.battleCell > div.battleCellContainer:hover > div.battleCellDefender) {
  border-color: rgba(255 255 0 / 30%);
}

.battleCell {
  position: absolute;
}

.battleCell:before{
  content: ' ';
  width: 34px;
  height: 1px;
  background: linear-gradient(90deg, rgba(15,36,0,1) 0%, rgba(13,121,9,1) 35%, rgba(0,255,124,1) 100%);
  z-index: 999999;
  display: block;
  position: absolute;
  left: -17px;
  top: 22px;
  opacity: 0.6;
}
.battleCell:after{
  content: ' ';
  width: 34px;
  height: 1px;
  background: linear-gradient(-90deg, rgba(15,36,0,1) 0%, rgba(13,121,9,1) 35%, rgba(0,255,124,1) 100%);
  z-index: 999999;
  display: block;
  position: absolute;
  left: 17px;
  top: 22px;
  opacity: 0.6;
}

.battleCellTopData {
  position: absolute;
  opacity: 0;
  left: -50px;
  top: 0px;
  width: 120px;
  z-index: 99999;
  pointer-events: none;
  box-sizing: border-box;
  background-color: rgba(9, 14, 15, 0.85) !important;
  background: linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.2), rgba(43, 211, 237, 0.2) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.2), rgba(43, 211, 237, 0.2) 100%) no-repeat border-box, linear-gradient(to top, rgba(43, 211, 237, 0.15), rgba(43, 211, 237, 0.15) 100%) no-repeat border-box;
  background-position: top 0px left 0px, top 0px right 0px, bottom 0px left 0px, bottom 0px right 0px, top 0px left 0px, bottom 0px left 0px, top 0px left 0px;
  background-size: 4px 1px, 4px 1px, 4px 1px, 4px 1px, 100% 1px, 100% 1px, 100% 100%;
}
.battleCellBottomData {
  position: absolute;
  transition: .3s;
  opacity: 0;
  left: -50px;
  top: 0px;
  width: 120px;
  z-index: 99999;
  pointer-events: none;
  box-sizing: border-box;
  background-color: rgba(9, 14, 15, 0.85) !important;
  background: linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.2), rgba(43, 211, 237, 0.2) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.2), rgba(43, 211, 237, 0.2) 100%) no-repeat border-box, linear-gradient(to top, rgba(43, 211, 237, 0.15), rgba(43, 211, 237, 0.15) 100%) no-repeat border-box;
  background-position: top 0px left 0px, top 0px right 0px, bottom 0px left 0px, bottom 0px right 0px, top 0px left 0px, bottom 0px left 0px, top 0px left 0px;
  background-size: 4px 1px, 4px 1px, 4px 1px, 4px 1px, 100% 1px, 100% 1px, 100% 100%;
}
.battleCellBottomData2 {
  position: absolute;
  transition: .3s;
  opacity: 0;
  left: -50px;
  top: 0px;
  width: 120px;
  z-index: 99999;
  pointer-events: none;
  box-sizing: border-box;
  background-color: rgba(9, 14, 15, 0.85) !important;
  background: linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.2), rgba(43, 211, 237, 0.2) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.2), rgba(43, 211, 237, 0.2) 100%) no-repeat border-box, linear-gradient(to top, rgba(43, 211, 237, 0.15), rgba(43, 211, 237, 0.15) 100%) no-repeat border-box;
  background-position: top 0px left 0px, top 0px right 0px, bottom 0px left 0px, bottom 0px right 0px, top 0px left 0px, bottom 0px left 0px, top 0px left 0px;
  background-size: 4px 1px, 4px 1px, 4px 1px, 4px 1px, 100% 1px, 100% 1px, 100% 100%;
}
.battleCellBottomData3 {
  position: absolute;
  transition: .3s;
  opacity: 0;
  left: -50px;
  top: 0px;
  width: 120px;
  z-index: 99999;
  pointer-events: none;
  box-sizing: border-box;
  background-color: rgba(9, 14, 15, 0.85) !important;
  background: linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.2), rgba(43, 211, 237, 0.2) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.2), rgba(43, 211, 237, 0.2) 100%) no-repeat border-box, linear-gradient(to top, rgba(43, 211, 237, 0.15), rgba(43, 211, 237, 0.15) 100%) no-repeat border-box;
  background-position: top 0px left 0px, top 0px right 0px, bottom 0px left 0px, bottom 0px right 0px, top 0px left 0px, bottom 0px left 0px, top 0px left 0px;
  background-size: 4px 1px, 4px 1px, 4px 1px, 4px 1px, 100% 1px, 100% 1px, 100% 100%;
}
.battleCellLeftData {
  position: absolute;
  transition: .3s;
  opacity: 0;
  left: -50px;
  top: 0px;
  width: 120px;
  z-index: 99999;
  pointer-events: none;
  box-sizing: border-box;
  background-color: rgba(9, 14, 15, 0.85) !important;
  background: linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.2), rgba(43, 211, 237, 0.2) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.2), rgba(43, 211, 237, 0.2) 100%) no-repeat border-box, linear-gradient(to top, rgba(43, 211, 237, 0.15), rgba(43, 211, 237, 0.15) 100%) no-repeat border-box;
  background-position: top 0px left 0px, top 0px right 0px, bottom 0px left 0px, bottom 0px right 0px, top 0px left 0px, bottom 0px left 0px, top 0px left 0px;
  background-size: 4px 1px, 4px 1px, 4px 1px, 4px 1px, 100% 1px, 100% 1px, 100% 100%;
}
.battleCellRightData {
  position: absolute;
  transition: .3s;
  opacity: 0;
  left: -50px;
  top: 0px;
  width: 120px;
  z-index: 99999;
  pointer-events: none;
  box-sizing: border-box;
  background-color: rgba(9, 14, 15, 0.85) !important;
  background: linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.5), rgba(43, 211, 237, 0.5) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.2), rgba(43, 211, 237, 0.2) 100%) no-repeat border-box, linear-gradient(to right, rgba(43, 211, 237, 0.2), rgba(43, 211, 237, 0.2) 100%) no-repeat border-box, linear-gradient(to top, rgba(43, 211, 237, 0.15), rgba(43, 211, 237, 0.15) 100%) no-repeat border-box;
  background-position: top 0px left 0px, top 0px right 0px, bottom 0px left 0px, bottom 0px right 0px, top 0px left 0px, bottom 0px left 0px, top 0px left 0px;
  background-size: 4px 1px, 4px 1px, 4px 1px, 4px 1px, 100% 1px, 100% 1px, 100% 100%;
}

.battleCellContainer {
  position: relative;
}
.battleCellContainer:hover>.battleCellTopData {
  top: 24px;
}
.battleCellContainer:hover>.battleCellLeftData {
  top: 42px;
}
.battleCellContainer:hover>.battleCellRightData {
  top: 60px;
}
.battleCellContainer:hover>.battleCellBottomData {
  top: 78px;
}
.battleCellContainer:hover>.battleCellBottomData2 {
  top: 96px;
}
.battleCellContainer:hover>.battleCellBottomData3 {
  top: 114px;
}

.battleCellContainer:hover>.rightDataCell {
  transition: .3s;
  opacity: 1;
  left: -130px;
  line-height: 17px;
  padding: 1px 0;
}
.battleCellContainer:hover>.leftDataCell {
  transition: .3s;
  opacity: 1;
  left: 36px;
  line-height: 17px;
  padding: 1px 0;
}

.battleCellShipIco {
  width: 20px;
  height: 20px;
  left: 0;
  top: 0;
}

.fleetTrail {
  pointer-events: none;
  position: absolute;
  height: 10px;
  bottom: -1px;
  background: linear-gradient(to right, rgb(4 17 18), rgb(5 60 60) 5%, rgb(17 100 100) 100%);
  opacity: 0.35;
  z-index: -2;
  transition: 0.2s linear;
}
.battleCellContainer:hover>.fleetTrail {
  height: 15px;
  z-index: -1;
  opacity: 1;
}

.battleCellAttacker {
  position: absolute;
  left: -7px;
  top: 0px;
  width: 5px;
  height: 5px;
  border-radius: 2px;
  background-color: rgba(255, 0, 0, 0.5);
}
.battleCellDefender {
  position: absolute;
  left: -7px;
  top: 0px;
  width: 5px;
  height: 5px;
  border-radius: 2px;
  background-color: rgba(255, 255, 0, 0.5);
}

.selectedBlock {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 1px;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  transition: .2s;
}
.selectedBlock._selected {
  position: absolute;
  width: 24px;
  height: 24px;
  left: -2px;
  top: -2px;
  background-color: rgba(127, 200, 127, 0.6);
  transition: .2s;
}
.selectedEnemyBlock {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 1px;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  transition: .2s;
}
.selectedEnemyBlock._selected {
  position: absolute;
  width: 24px;
  height: 24px;
  left: -2px;
  top: -2px;
  background-color: rgba(255, 0, 0, 0.3);
  transition: .2s;
}

.gridCell.moveTo {
  color: green;
  background-color: rgba(0,0,0,0.5);
  transition: .3s;
}
.gridCell.moveTo:hover {
  color: green;
  background-color: rgba(5, 36, 42, 0.5);
  transition: .3s;
}
.battleCellOwnerName {
  position: absolute;
  width: 66px;
  overflow: hidden;
  text-align: center;
  vertical-align: bottom;
  font-size: 10px;
  line-height: 13px;
}
.forContext {
  display: none;
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 999;
  width: 150px;
  background-color: black;
}
.`;

let styleElement = document.createElement('style');
styleElement.innerHTML = styleString;
document.head.appendChild(styleElement);

sfui.battleLogSettings = {
  showTrail: true, // Отображать перемещение
  showHP: true, // Отображать здоровье
  showRoleIcon: true, // Отображать индикатор атакующий/защищающийся
  raceColor: true, // Окрашивать проект в расу игрока
  showOwnerName: true,
  mergeProjects: true
}

sfui.battleLogAllowSelectFleet = false;

sfui.battleLog = (resp) => {
  if (resp.win.idd != "WndBattle" && resp.win.idd != "WndBattleLogs")
    return;

  const headerRowHeight = 22; // Высота блока класса .gridCell
  const cellWidth = 22; // // Ширина блока класса .battleCell
  const cellHeight = 22; // Высота блока класса .battleCell
  const totalWidth = cellWidth * 31;
  const ownerNameHeight = sfui.battleLogSettings.showOwnerName ? 13 : 0; // Высота блока имени владельца флота
  const rowHeight = cellHeight + ownerNameHeight + 1;
  const firstRowPosY = headerRowHeight + ownerNameHeight + 1; // От строки позиций до иконки флота (с учётом названия)

  //  Временно отключено
  sfui.battleLogAllowSelectFleet = false;

  let tableData;
  if (resp.win.idd === "WndBattle") {
    tableData = $("#WndBattle_cicle_log_content");
    // console.log('---------------------------------------------------------------------s')
    // console.log(resp.win);
    // console.log($(resp.win).find('#WndBattle_battlecontrol'));
    // console.log($(resp.win).find('#WndBattle_battlecontrol').length);
    // console.log('---------------------------------------------------------------------e')
    if (getWindow('WndControlBattle').isshow() || $(resp.win).find('#WndBattle_battlecontrol').length > 0)
      sfui.battleLogAllowSelectFleet = true;
  } else tableData = $("#WndBattleLogs_cicle_log_content");

  tableData.find('.textbox.label.center.controls.w100p').css('display', 'block').removeClass('h22').removeClass('textbox');
  let elementParent = tableData.find('.battlelog');
  let idDisplayGrid = resp.win.idd + "_grid";
  let idGridData = idDisplayGrid + "Data";
  let iddDisplayGrid = "#" + idDisplayGrid;
  let iddGridData = "#" + idGridData;
  $(iddDisplayGrid).remove();
  elementParent.css('position', 'relative');
  elementParent.before(`<div id="${idDisplayGrid}" class="w-100 textcontainer" style='min-height: 100px; position: relative; display: contents; margin-top: 15px;'><div class='textbox'>${sfui_language.COMBAT_MESH}</div><span id='battleLogSendDataCount'></span><div id='${idGridData}' class='' style='width: ${totalWidth}px; position: relative; margin: 5px auto; z-index: 10;'></div></div>`);

  for (let iCol = 0; iCol <= 30; iCol++) {
    let gridColor = 'normalPos';
    if (iCol === 0)
      gridColor = 'attackerExit';
    else if (iCol === 30)
      gridColor = 'defenderExit';

    $(iddGridData).append(`<div data-idcell='${iCol}' class='gridCell ${gridColor}' onclick='sfui.battleLogGoFleetTo(this)'>${iCol}</div>`);
  }

  const battleDataBefore = elementParent.children().eq(0).find('tr').eq(2);
  const battleDataAfter = elementParent.children().eq(2);

  const atkFleetsBefore_Table = battleDataBefore.find('.center.text12').eq(0);
  const defFleetsBefore_Table = battleDataBefore.find('.center.text12').eq(1);
  const atkFleetsAfter_Table = battleDataAfter.find('.center.text12').eq(0);
  const defFleetsAfter_Table = battleDataAfter.find('.center.text12').eq(1);

  const atkFleetsBefore_NamesSpans = atkFleetsBefore_Table.find('span[onclick*="battle_select_fleet"]');
  const defFleetsBefore_NamesSpans = defFleetsBefore_Table.find('span[onclick*="battle_select_fleet"]');
  const atkFleetsAfter_NamesSpans = atkFleetsAfter_Table.find('span[onclick*="battle_select_fleet"]');
  const defFleetsAfter_NamesSpans = defFleetsAfter_Table.find('span[onclick*="battle_select_fleet"]');

  const getShipData_From_Cell = (ship_Cell) => {
    let cell = $(ship_Cell).parent().first();
    let cellData = cell.children();

    const image = cellData.eq(0).find('img');
    const icon = image.attr('src');
    let regex_matchProjectNumber = /_select_project\(\d+,\d+,(\d+)\)/g;
    const project = regex_matchProjectNumber.exec(image.attr('onclick'))[1];
    const name = cellData.eq(1).text();
    const count = sfapi.parseIntExt(cellData.eq(2).text());
    const fullHp = parseInt(cellData.eq(3).text().split("%")[0]);
    const minHp = parseInt(cellData.eq(4).text().split("%")[0]);
    const posStrs = cellData.eq(5).text().split(' ');
    const pos1 = parseFloat(posStrs[0]);

    return {
      icon: icon,
      project: project,
      name: name,
      count: count,
      fullHp: fullHp,
      minHp: minHp,
      pos1: pos1,
      pos2: posStrs.length === 3 ? parseFloat(posStrs[2]) : pos1
    };
  };
  const getFleetData_From_NameSpan = (fleet_NameSpan) => {
    let regex_matchFleetNumber = /_select_fleet\(\d+,(\d+)\)/g;
    let fleet_NameSpan_Jq = $(fleet_NameSpan);
    const span_onclick_text = fleet_NameSpan_Jq.attr('onclick');

    const fleetNumber = Number(regex_matchFleetNumber.exec(span_onclick_text)[1] ?? 0);
    if (!fleetNumber)
      return;

    const ownerName_Span = fleet_NameSpan_Jq.parent().children('span').eq(2)[0];
    let fleetData = {
      name: fleet_NameSpan.innerText,
      number: fleetNumber,
      owner: ownerName_Span.innerText,
      color: ownerName_Span.style.color,
      ships: []
    };

    const fleetShips_Cells = $(fleet_NameSpan).parentsUntil('tbody').last().next()
      .find('.data_table_cell_even.data_table_cell_border[style="width:22px;height:22px;"]');

    fleetShips_Cells.each((i, shipPos) => {
      let shipData = getShipData_From_Cell(shipPos);
      if (shipData) {
        shipData.fleetData = fleetData;
        fleetData.ships.push(shipData);
      }
    });

    return fleetData;
  };
  const makeFleetsList = (fleets_NamesSpans) => {
    let fleetsList = [];
    fleets_NamesSpans.each((i, fleet_NameSpan) => {
      let fleetData = getFleetData_From_NameSpan(fleet_NameSpan);
      if (fleetData) fleetsList.push(fleetData);
    });
    return fleetsList;
  };
  let atkFleetsBefore = makeFleetsList(atkFleetsBefore_NamesSpans);
  let defFleetsBefore = makeFleetsList(defFleetsBefore_NamesSpans);
  let atkFleetsAfter = makeFleetsList(atkFleetsAfter_NamesSpans);
  let defFleetsAfter = makeFleetsList(defFleetsAfter_NamesSpans);

  let gridCells = [];
  let lastRowIndex = 0;
  const addShipToGrid = (shipData, battleRole) => {
    try {
      const shipPos1 = shipData.pos1;
      const shipPos2 = shipData.pos2;
      const shipIconPosX = shipPos2 * cellWidth;

      let shipRow = 0;
      while (true) {
        const nearbyShip = gridCells.find(ans => {
          if (ans.shipRow !== shipRow)
            return false;
          if (shipPos2 + 2 <= ans.shipData.pos2 - 1 || shipPos2 - 1 >= ans.shipData.pos2 + 2)
            return false;
          return true;
        });

        if (nearbyShip)
          shipRow += 1;
        else
          break;
      }

      if (lastRowIndex < shipRow)
        lastRowIndex = shipRow;

      let dataHintAlign = 'leftDataCell';
      if (shipData.pos2 > 15)
        dataHintAlign = 'rightDataCell';

      let fleetColorCSS = '';
      if (sfui.battleLogSettings.raceColor)
        fleetColorCSS = `border: 1px solid ${shipData.fleetData.color};`;

      let fleetTrailBlock = '';
      if (sfui.battleLogSettings.showTrail && shipPos2 != shipPos1) {
        const distance = Math.abs(shipPos2 - shipPos1);
        const toLeft = shipPos2 < shipPos1;
        const trailWidth = cellWidth * distance;
        const trsfCSS = toLeft ? 'transform: scale(-1, 1)' : '';
        fleetTrailBlock = `<div class='fleetTrail' style='width: ${trailWidth}px; left: ${trailWidth * (Number(toLeft) - 1)}px; ${trsfCSS}'></div>`;
      }

      let hpBlock = '';
      let fleetBorderForHpCSS = '';
      if (sfui.battleLogSettings.showHP) {
        hpBlock = `
          <div style='position: absolute; bottom: 0; left: 21px; height: ${(20 / 100 * shipData.fullHp)}px; width: 5px; background-color: #026dd3;'></div>
          <div style='position: absolute; bottom: 0; left: 27px; height: ${(20 / 100 * shipData.minHp)}px; width: 5px; background-color: #00b500;'></div>
        `;
        fleetBorderForHpCSS = 'border-right-width: 13px; border-right-color: #333;';
      }

      let roleClass = 'battleCellDefender';
      if (battleRole === 'attack')
        roleClass = 'battleCellAttacker';

      let roleIconBlock = '';
      if (sfui.battleLogSettings.showRoleIcon)
        roleIconBlock = `<div class='${roleClass}'></div>`;

      let ownerNameBlock = '';
      if (sfui.battleLogSettings.showOwnerName)
        ownerNameBlock = `<div class='battleCellOwnerName' style='left: ${shipIconPosX - 18}px; top: ${shipRow * rowHeight + firstRowPosY - ownerNameHeight - 1}; color: ${shipData.fleetData.color};'>${shipData.fleetData.owner}</div>`;

      const html = `
        <!--<div onclick='sfui.battleCellClick(this)' data-iddata='${shipData.fleetData.number}_${shipData.project}'
          data-fleetcell='${shipData.fleetData.number}' data-projectid='${shipData.project}'
          class='battleCell' style='left: ${shipIconPosX}; top: ${shipRow * rowHeight + firstRowPosY - 1}'>-->
        ${ownerNameBlock}
        <div onclick='' data-iddata='${shipData.fleetData.number}_${shipData.project}'
          data-fleetcell='${shipData.fleetData.number}' data-projectid='${shipData.project}'
          class='battleCell' style='left: ${shipIconPosX}; top: ${shipRow * rowHeight + firstRowPosY - 1}'>
          <div class='battleCellContainer' style='${fleetColorCSS} ${fleetBorderForHpCSS}'>
            <div class='selectedBlock'></div>
            ${fleetTrailBlock}
            <img src='${shipData.icon}' class='battleCellShipIco'>
            ${hpBlock}
            ${roleIconBlock}
            <!--<div class='selectedEnemyBlock' data-iddata='${shipData.fleetData.number}_${shipData.project}' onclick='sfui.battleLogSelectEnemy(this)'></div>-->
            <div class='battleCellTopData ${dataHintAlign} bcselector_name'>${shipData.name}</div>
            <div class='battleCellLeftData ${dataHintAlign} bcselector_owner'>${shipData.fleetData.owner}</div>
            <div class='battleCellRightData ${dataHintAlign} bcselector_fleetname'>${shipData.fleetData.name}</div>
            <div class='battleCellBottomData ${dataHintAlign} bcselector_count'>Кораблей: ${shipData.count}</div>
            <div class='battleCellBottomData2 ${dataHintAlign} bcselector_health'>ХП: ${shipData.fullHp}% / ${shipData.minHp}%</div>
            <div class='battleCellBottomData3 ${dataHintAlign} bcselector_position'>Позиция: ${shipPos1 != shipPos2 ? shipPos1 + ' → ' : ''}${shipData.pos2}</div>
            <div class='forContext'></div>
          </div>
        </div>
      `;

      gridCells.push({
        battleRole,
        shipRow,
        shipData,
        html,
        hasMerge: false,
        drop: false
      })
    } catch (e) {
      console.error(e);
    }
  }

  atkFleetsAfter.forEach((fleetAfter) => {
    const fleetBefore = atkFleetsBefore.find(fleetBefore => fleetBefore.number === fleetAfter.number);
    fleetAfter.ships.forEach((shipAfter) => {
      shipBefore = fleetBefore.ships.find(shipBefore => shipBefore.name === shipAfter.name);
      shipAfter.pos1 = shipBefore.pos1;
      addShipToGrid(shipAfter, 'attack');
    });
  });
  defFleetsAfter.forEach((fleetAfter) => {
    const fleetBefore = defFleetsBefore.find(fleetBefore => fleetBefore.number === fleetAfter.number);
    fleetAfter.ships.forEach((shipAfter) => {
      shipBefore = fleetBefore.ships.find(shipBefore => shipBefore.name === shipAfter.name);
      shipAfter.pos1 = shipBefore.pos1;
      addShipToGrid(shipAfter, 'deffend');
    });
  });

  for (let i = 0; i <= lastRowIndex; i++) {
    $(iddGridData).append(`
      <div style='width: 682px; border-bottom: 1px solid rgba(24,142,81,0.2); height: 23px; position: absolute; top: ${i * rowHeight + firstRowPosY - 2}px;'>
      </div>`);
  }

  gridCells.forEach(e => { $(iddGridData).append(e.html); });

  $(iddGridData).css('height', (lastRowIndex + 1) * rowHeight + 23);

  $(".gridCell").removeClass('moveTo');
  $('.selectedEnemyBlock').removeClass('_selected');
  if (sfui.battleSelectedData && sfui.battleSelectedData.nodeElement) {
    sfui.battleSelectedData.nodeElement.removeClass('_selected');
    sfui.battleSelectedData.nodeElement.find('.selectedBlock').removeClass('_selected');
    sfui.battleSelectedData = {};
  }
  sfui.allowSelectEnemy = [];
}

sfui.battleSelectedData = {};
sfui.battleLogSendingDataCount = 0;
sfui.battleLogGoFleetTo = async (event) => {
  if (sfui.battleSelectedData) {
    if (sfui.battleSelectedData.fleetid && sfui.battleSelectedData.projectid) {
      let fleetid = sfui.battleSelectedData.fleetid;
      let projectid = sfui.battleSelectedData.projectid;
      let cellTo = $(event).data('idcell');
      sfui.battleLogSendingDataCount++;
      sfui.updateSendingDataInBattleLog();
      sfapi.fetch("/?m=windows&w=WndControlBattle&a=applycomands&dest=WndControlBattle_battlecontrol", {
        "body": `bfleets[2][${fleetid}][projects][${projectid}][moveto]=${cellTo}`,
        "method": "POST",
      }).then((result) => {
        sfui.battleLogSendingDataCount -= 1;
        sfui.updateSendingDataInBattleLog();
      })
      $(".gridCell").removeClass('moveTo');
      $('.selectedEnemyBlock').removeClass('_selected');
      sfui.battleSelectedData.nodeElement.removeClass('_selected');
      sfui.battleSelectedData.nodeElement.find('.selectedBlock').removeClass('_selected');
      sfui.battleSelectedData = {};
    }
  }
};

sfui.allowSelectEnemy = [];

sfui.updateSendingDataInBattleLog = () => {
  if (sfui.battleLogSendingDataCount > 0)
    $('#battleLogSendDataCount').html(` Отправка данных. Запросов: ${sfui.battleLogSendingDataCount}`).css('color', 'red');
  else
    $('#battleLogSendDataCount').html(``);
}

//bfleets[2][8451026][projects][1452119][weapons][163][9][23500][atackto]: 2-8444109-1254364
sfui.battleLogSelectEnemy = (event) => {
  event = $(event);
  let idData = event.data('iddata')
  let idFleet = idData.split('_')[0];
  let idProject = idData.split('_')[1];
  // console.log(idFleet, idProject)
  let dataSelect = sfui.allowSelectEnemy.filter(e => (e.id[1] === idFleet && e.id[2] === idProject));
  let menuArray = [];
  dataSelect.forEach(e => {
    let filter = menuArray.filter(em => em.id === (e.wpName + e.attakName));
    if (filter.length === 0) {
      menuArray.push({
        fullData: e,
        id: e.wpName + e.attakName,
        title: e.wpName,
        methods: e.methods,
        needAmmo: e.needAmmo
      })
    }
  });
  sfui.selectedWeaponForBattleLog = menuArray;
  $('.forContext').css('display', 'none').removeAttr('id');
  let eventContext = $($(event).parents('.battleCellContainer')[0]).find('.forContext');
  eventContext.css('display', 'block');
  let generateId = 'selectweapon_' + Math.floor(Math.random() * 10000);
  // console.log(generateId);
  // console.log(eventContext);
  eventContext.attr('id', generateId);
  eventContext.html('');
  menuArray.forEach(e => {
    if (!e.needAmmo) {
      eventContext.append(`<small onclick='sfui.battleLogSendFire(this)' data-cid='${generateId}' data-id='${e.id}'>${e.title}</small><br>`)
    } else {
      eventContext.append(`<small onclick='sfui.battleLogSelectAmmo(this)' data-cid='${generateId}' data-id='${e.id}'>${e.title}</small><br>`)
    }
  })
}

sfui.selectedWeaponForBattleLog = [];

sfui.battleLogSendFire = (event) => {
  let contextMenu = $("#" + $(event).data('cid'));
  let menuId = $(event).data('id');
  let dataMenu = sfui.selectedWeaponForBattleLog.filter(e => e.id === menuId)[0];
  contextMenu.html('');
  contextMenu.css('display', 'none');
  sfui.battleLogSendingDataCount++;
  sfui.updateSendingDataInBattleLog();
  let value = dataMenu.fullData.id[0] + "-" + dataMenu.fullData.id[1] + "-" + dataMenu.fullData.id[2];
  fetch("/?m=windows&w=WndControlBattle&a=applycomands&dest=WndControlBattle_battlecontrol", {
    "headers": {
      "accept": "*/*",
      "content-type": "application/x-www-form-urlencoded",
      "x-requested-with": "XMLHttpRequest"
    },
    "body": `${dataMenu.fullData.attakName}=${value}`,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  }).then((e) => {
    sfui.battleLogSendingDataCount -= 1;
    sfui.updateSendingDataInBattleLog();
  });
}

sfui.battleLogSelectAmmo = (event) => {
  let contextMenu = $("#" + $(event).data('cid'));
}

sfui.battleCellClick = (event) => {
  if (sfui.battleLogAllowSelectFleet) {
    let myFleets = Array.from($('#WndControlBattle_comandsform').find('table')).filter(e => (e.innerHTML.indexOf('Перемещаться на позицию') + 1));
    let allowClick = false;
    let allowSelectEnemy = [];
    let fleetSpeed = 0;
    sfui.allowSelectEnemy = [];
    myFleets.forEach((e, i) => {
      if (i > 0) {
        let dataFleet = /getWindow\('WndShipProjectInfo'\)\.show\('id=(\d+)(.+)fleetid=(\d+)/gm.exec($(e).find(`div[onclick^="getWindow('WndShipProjectInfo')"]`)[0].outerHTML);
        let idProject = parseInt(dataFleet[1]);
        let idFleet = parseInt(dataFleet[3]);
        if (parseInt($(event).data('projectid')) === idProject && parseInt($(event).data('fleetcell')) === idFleet) {
          allowClick = true;
          if ($(`[id^='WndControlBattle_atackto_2_${idFleet}_${idProject}']`)) {
            Array.from($(`[id^='WndControlBattle_atackto_2_${idFleet}_${idProject}']`)).forEach(ei => {
              if (ei.id.indexOf('_cbammunition') === -1 && ei.id.indexOf('_ammunition') === -1) {
                let dataEnemies = ei.dhx_combo.optionsArr;
                if (dataEnemies.length > 1) {
                  dataEnemies.forEach((ej, i) => {
                    if (i > 0) {
                      let ammunitions = [];
                      let ammunitionName = null;
                      let needAmmo = false;
                      let wpName = $(ei).parents('td.textcontainer').prevAll()[1].innerText;
                      let nextRow = $($(ei).parents('tr')[0]).next();
                      let attakName = $($(ei).find('input')[1]).attr('name');
                      if (nextRow.html().indexOf('Боеприпас') + 1) {
                        ammunitionName = nextRow.find('input').attr('name');
                        ammunitions = nextRow.find(`div[id^='WndControlBattle_atackto_']`)[0].dhx_combo.optionsArr;
                        needAmmo = true;
                      }
                      allowSelectEnemy.push({
                        id: ej.value.split('-'),
                        ammunitions,
                        methods: [{
                          v: 0,
                          t: 'Все по всем'
                        }, {
                          v: 1,
                          t: 'Все в один'
                        }, {
                          v: 2,
                          t: 'Не стрелять'
                        }],
                        ammunitionName,
                        needAmmo,
                        wpName,
                        attakName
                      });
                      sfui.allowSelectEnemy = allowSelectEnemy;
                    }
                  })
                }
              }
            });
          }
        }
      }
    })

    if (allowClick) {
      $(event).toggleClass('_selected');
      $(event).find('.selectedBlock').toggleClass('_selected');

      if (sfui.battleSelectedData.nodeElement) {
        if (sfui.battleSelectedData.nodeElement.data('iddata') === $(event).data('iddata')) {
          sfui.battleSelectedData = {};
        } else {
          if (sfui.battleSelectedData.nodeElement) {
            sfui.battleSelectedData.nodeElement.removeClass('_selected');
            sfui.battleSelectedData.nodeElement.find('.selectedBlock').removeClass('_selected');
          }
          sfui.battleSelectedData.nodeElement = $(event);
          sfui.battleSelectedData.fleetid = $(event).data('fleetcell');
          sfui.battleSelectedData.projectid = $(event).data('projectid');
        }
      } else {
        sfui.battleSelectedData.nodeElement = $(event);
        sfui.battleSelectedData.fleetid = $(event).data('fleetcell');
        sfui.battleSelectedData.projectid = $(event).data('projectid');
      }

      if (sfui.battleSelectedData.nodeElement) {
        $(".gridCell").addClass('moveTo');
      } else {
        $(".gridCell").removeClass('moveTo');
      }

      //console.log(allowSelectEnemy);
      $('.selectedEnemyBlock').removeClass('_selected');
      if (allowSelectEnemy.length > 0 && $(".gridCell").hasClass('moveTo')) {
        allowSelectEnemy.forEach(e => {
          let fleetId = e.id[1];
          let fleetIdProject = e.id[2];
          // console.log(e);
          $(`[data-iddata="${fleetId}_${fleetIdProject}"]`).find('.selectedEnemyBlock').addClass('_selected');
        })
      }
    }
  }
}

//Устройства древних
sfdata.ud = [{
  "id": "251",
  "name": {
    "ru": "Вычислительный кластер",
    "en": "Computing Cluster"
  },
  "src": "/images/productions/251-16.png"
}, {
  "id": "245",
  "name": {
    "ru": "Генератор нулевого поля",
    "en": "Zero Field Generator"
  },
  "src": "/images/productions/245-16.png"
}, {
  "id": "450",
  "name": {
    "ru": "Генератор сингулярности",
    "en": "Singularity Generator"
  },
  "src": "/images/productions/450-16.png"
}, {
  "id": "254",
  "name": {
    "ru": "Генератор точки перехода",
    "en": "Transition Point Generator"
  },
  "src": "/images/productions/254-16.png"
}, {
  "id": "486",
  "name": {
    "ru": "Гиперпространственный анализатор",
    "en": "Hyperspace Analyzer"
  },
  "src": "/images/productions/486-16.png"
}, {
  "id": "227",
  "name": {
    "ru": "Гиперпространственный ускоритель",
    "en": "Hyperspace Accelerator"
  },
  "src": "/images/productions/227-16.png"
}, {
  "id": "483",
  "name": {
    "ru": "Гравитационный инициатор",
    "en": "Gravitational Initiator"
  },
  "src": "/images/productions/483-16.png"
}, {
  "id": "444",
  "name": {
    "ru": "Гравитационный луч",
    "en": "Gravity Beam"
  },
  "src": "/images/productions/444-16.png"
}, {
  "id": "485",
  "name": {
    "ru": "Гравитационный экран",
    "en": "Gravity Field"
  },
  "src": "/images/productions/485-16.png"
}, {
  "id": "230",
  "name": {
    "ru": "Детектор минералов",
    "en": "Mineral Detector"
  },
  "src": "/images/productions/230-16.png"
}, {
  "id": "290",
  "name": {
    "ru": "Детектор нулевого поля",
    "en": "Zero Field Detector"
  },
  "src": "/images/productions/290-16.png"
}, {
  "id": "491",
  "name": {
    "ru": "Квантовый анализатор",
    "en": "Quantum analyzer"
  },
  "src": "/images/productions/491-16.png"
}, {
  "id": "471",
  "name": {
    "ru": "Квантовый пресс",
    "en": "Quantum Press"
  },
  "src": "/images/productions/471-16.png"
}, {
  "id": "240",
  "name": {
    "ru": "Квантовый фильтр",
    "en": "Quantum Filter"
  },
  "src": "/images/productions/240-16.png"
}, {
  "id": "500",
  "name": {
    "ru": "Квантовый экран",
    "en": "Quantum Field"
  },
  "src": "/images/productions/500-16.png"
}, {
  "id": "248",
  "name": {
    "ru": "Климатический процессор",
    "en": "Climate Processor"
  },
  "src": "/images/productions/248-16.png"
}, {
  "id": "464",
  "name": {
    "ru": "Когерентный резонатор",
    "en": "Coherent Resonator"
  },
  "src": "/images/productions/464-16.png"
}, {
  "id": "225",
  "name": {
    "ru": "Командный процессор",
    "en": "Command Processor"
  },
  "src": "/images/productions/225-16.png"
}, {
  "id": "247",
  "name": {
    "ru": "Культурный артефакт",
    "en": "Cultural artifact"
  },
  "src": "/images/productions/247-16.png"
}, {
  "id": "243",
  "name": {
    "ru": "Логистический процессор",
    "en": "Logistics Processor"
  },
  "src": "/images/productions/243-16.png"
}, {
  "id": "472",
  "name": {
    "ru": "Магнитный конденсатор",
    "en": "Magnetic Condenser"
  },
  "src": "/images/productions/472-16.png"
}, {
  "id": "246",
  "name": {
    "ru": "Матрица влияния",
    "en": "Influence Matrix"
  },
  "src": "/images/productions/246-16.png"
}, {
  "id": "468",
  "name": {
    "ru": "Модулятор массы",
    "en": "Mass Modulator"
  },
  "src": "/images/productions/468-16.png"
}, {
  "id": "470",
  "name": {
    "ru": "Модулятор объема",
    "en": "Volume Modulator"
  },
  "src": "/images/productions/470-16.png"
}, {
  "id": "234",
  "name": {
    "ru": "Молекулярный преобразователь",
    "en": "Molecular Converter"
  },
  "src": "/images/productions/234-16.png"
}, {
  "id": "239",
  "name": {
    "ru": "Молекулярный фильтр",
    "en": "Molecular Filter"
  },
  "src": "/images/productions/239-16.png"
}, {
  "id": "223",
  "name": {
    "ru": "Навигационный процессор",
    "en": "Navigation Processor"
  },
  "src": "/images/productions/223-16.png"
}, {
  "id": "250",
  "name": {
    "ru": "Нейронная сеть",
    "en": "Neural Network"
  },
  "src": "/images/productions/250-16.png"
}, {
  "id": "249",
  "name": {
    "ru": "Нейронный компьютер",
    "en": "Neural Computer"
  },
  "src": "/images/productions/249-16.png"
}, {
  "id": "446",
  "name": {
    "ru": "Оптический корректор",
    "en": "Optical corrector"
  },
  "src": "/images/productions/446-16.png"
}, {
  "id": "224",
  "name": {
    "ru": "Очиститель руды",
    "en": "Ore Cleaner"
  },
  "src": "/images/productions/224-16.png"
}, {
  "id": "481",
  "name": {
    "ru": "Планетарный инициатор",
    "en": "Planetary Initiator"
  },
  "src": "/images/productions/481-16.png"
}, {
  "id": "241",
  "name": {
    "ru": "Производственный оптимизатор",
    "en": "Manufacturing Optimizer"
  },
  "src": "/images/productions/241-16.png"
}, {
  "id": "242",
  "name": {
    "ru": "Производственный процессор",
    "en": "Production Processor"
  },
  "src": "/images/productions/242-16.png"
}, {
  "id": "466",
  "name": {
    "ru": "Протонный дефлектор",
    "en": "Proton Deflector"
  },
  "src": "/images/productions/466-16.png"
}, {
  "id": "462",
  "name": {
    "ru": "Протонный диффузор",
    "en": "Proton Diffuser"
  },
  "src": "/images/productions/462-16.png"
}, {
  "id": "445",
  "name": {
    "ru": "Радиационный восстановитель",
    "en": "Radiation reducer"
  },
  "src": "/images/productions/445-16.png"
}, {
  "id": "232",
  "name": {
    "ru": "Радиационный детектор",
    "en": "Radiation Detector"
  },
  "src": "/images/productions/232-16.png"
}, {
  "id": "228",
  "name": {
    "ru": "Синхронизатор скорости",
    "en": "Speed Synchronizer"
  },
  "src": "/images/productions/228-16.png"
}, {
  "id": "235",
  "name": {
    "ru": "Спектральный анализатор",
    "en": "Spectral Analyzer"
  },
  "src": "/images/productions/235-16.png"
}, {
  "id": "497",
  "name": {
    "ru": "Тахионный детектор",
    "en": "Tachyon detector"
  },
  "src": "/images/productions/497-16.png"
}, {
  "id": "477",
  "name": {
    "ru": "Тахионный модулятор",
    "en": "Tachyon Modulator"
  },
  "src": "/images/productions/477-16.png"
}, {
  "id": "465",
  "name": {
    "ru": "Тахионный подавитель",
    "en": "Tachyon Suppressor"
  },
  "src": "/images/productions/465-16.png"
}, {
  "id": "456",
  "name": {
    "ru": "Тахионный сканер",
    "en": "Tachyon Scanner"
  },
  "src": "/images/productions/456-16.png"
}, {
  "id": "463",
  "name": {
    "ru": "Тахионный целеуказатель",
    "en": "Tachyon Target Indicator"
  },
  "src": "/images/productions/463-16.png"
}, {
  "id": "469",
  "name": {
    "ru": "Торговый процессор",
    "en": "Trade Processor"
  },
  "src": "/images/productions/469-16.png"
}, {
  "id": "231",
  "name": {
    "ru": "Уловитель частиц",
    "en": "Particle Detection Device"
  },
  "src": "/images/productions/231-16.png"
}, {
  "id": "467",
  "name": {
    "ru": "Фазовый деструктор",
    "en": "Phase Destructor"
  },
  "src": "/images/productions/467-16.png"
}, {
  "id": "443",
  "name": {
    "ru": "Фазовый ускоритель",
    "en": "Phase Accelerator"
  },
  "src": "/images/productions/443-16.png"
}, {
  "id": "252",
  "name": {
    "ru": "Хранилище данных",
    "en": "Data Warehouse"
  },
  "src": "/images/productions/252-16.png"
}, {
  "id": "473",
  "name": {
    "ru": "Энергетический конвертер",
    "en": "Power Converter"
  },
  "src": "/images/productions/473-16.png"
}];
const getUdNameByID = (id) => sfdata.ud.filter(e => e.id === id.toString())[0].name.toLowerCase();

sfdata.udSets = [];

//Это нужно выполнить после применения языкового пакета
function pushUDSets() {
  sfdata.udSets.push({
    list: [
      getUdNameByID(246), getUdNameByID(247), getUdNameByID(248)
    ],
    name: sfui_language.UD_CULTURAL_SET,
    oneInstall: false,
    installs: [],
    htmls: [],
    inPlanet: true,
    inFleet: false
  })
  sfdata.udSets.push({
    list: [
      getUdNameByID(249), getUdNameByID(250), getUdNameByID(251), getUdNameByID(252)
    ],
    name: sfui_language.UD_SCI_SET,
    oneInstall: false,
    installs: [],
    htmls: [],
    inPlanet: true,
    inFleet: false
  })
  sfdata.udSets.push({
    list: [
      getUdNameByID(242), getUdNameByID(241), getUdNameByID(243)
    ],
    name: sfui_language.UD_PROD_SET,
    oneInstall: false,
    installs: [],
    htmls: [],
    inPlanet: true,
    inFleet: false
  })
  sfdata.udSets.push({
    list: [
      getUdNameByID(224), getUdNameByID(230), getUdNameByID(239), getUdNameByID(240)
    ],
    name: sfui_language.UD_SAVE_SET,
    oneInstall: false,
    installs: [],
    htmls: [],
    inPlanet: true,
    inFleet: false
  })
  sfdata.udSets.push({
    list: [
      getUdNameByID(223), getUdNameByID(227), getUdNameByID(228), getUdNameByID(234)
    ],
    name: sfui_language.UD_SPEED_SET,
    oneInstall: false,
    installs: [],
    htmls: [],
    inPlanet: true,
    inFleet: true
  })
  sfdata.udSets.push({
    list: [
      getUdNameByID(230), getUdNameByID(235), getUdNameByID(224), getUdNameByID(231), getUdNameByID(232)
    ],
    name: sfui_language.UD_DIG_SET,
    oneInstall: false,
    installs: [],
    htmls: [],
    inPlanet: true,
    inFleet: true
  })
  sfdata.udSets.push({
    list: [
      getUdNameByID(456), getUdNameByID(497), getUdNameByID(290)
    ],
    name: sfui_language.UD_RADAR_SET,
    oneInstall: false,
    installs: [],
    htmls: [],
    inPlanet: true,
    inFleet: true
  })
  sfdata.udSets.push({
    list: [
      getUdNameByID(456), getUdNameByID(477)
    ],
    name: sfui_language.UD_ARCH_SET,
    oneInstall: false,
    installs: [],
    htmls: [],
    inPlanet: false,
    inFleet: true
  })
  sfdata.udSets.push({
    list: [
      getUdNameByID(486), getUdNameByID(245)
    ],
    name: sfui_language.UD_HYPERTRAP_SET,
    oneInstall: false,
    installs: [],
    htmls: [],
    inPlanet: false,
    inFleet: true
  })
  sfdata.udSets.push({
    list: [
      getUdNameByID(485), getUdNameByID(245)
    ],
    name: sfui_language.UD_GRAVITY_SET,
    oneInstall: false,
    installs: [],
    htmls: [],
    inPlanet: false,
    inFleet: true
  })
  sfdata.udSets.push({
    list: [
      getUdNameByID(446), getUdNameByID(445), getUdNameByID(491)
    ],
    name: sfui_language.UD_RECYCLING_SET,
    oneInstall: false,
    installs: [],
    htmls: [],
    inPlanet: true,
    inFleet: false
  })
  sfdata.udSets.push({
    list: [
      getUdNameByID(468), getUdNameByID(470), getUdNameByID(469)
    ],
    name: sfui_language.UD_WAREHOUSE_SET,
    oneInstall: false,
    installs: [],
    htmls: [],
    inPlanet: true,
    inFleet: false
  })
  sfdata.udSets.push({
    list: [
      getUdNameByID(465), getUdNameByID(466), getUdNameByID(467)
    ],
    name: sfui_language.UD_PROTECTION_SET,
    oneInstall: false,
    installs: [],
    htmls: [],
    inPlanet: true,
    inFleet: true
  })
  sfdata.udSets.push({
    list: [
      getUdNameByID(464), getUdNameByID(463), getUdNameByID(462)
    ],
    name: sfui_language.UD_BATTLE_SET,
    oneInstall: false,
    installs: [],
    htmls: [],
    inPlanet: true,
    inFleet: true
  })
  sfdata.udSets.push({
    list: [
      getUdNameByID(471), getUdNameByID(472)
    ],
    name: sfui_language.UD_TRANSDUCER_SET,
    oneInstall: false,
    installs: [],
    htmls: [],
    inPlanet: true,
    inFleet: false
  })
  sfdata.udSets.push({
    list: [
      getUdNameByID(245)
    ],
    name: sfui_language.UD_INVISIBLE_SET,
    oneInstall: false,
    installs: [],
    htmls: [],
    inPlanet: true,
    inFleet: true
  })
}

sfapi.planet = {
  getName: () => {
    return $("#WndPlanet_pp_name").text();
  },
  getStarName: () => {
    return $("#WndPlanet_pp_star").text();
  },
  getPos: () => {
    return $("#WndPlanet_pp_coord").text();
  },
  getOrbita: () => {
    return $("#WndPlanet_pp_coord").text().split(":")[1];
  },
  getSize: () => {
    return sfapi.parseIntExt($("#WndPlanet_pp_size").text());
  },
  getFreeSize: () => {
    return sfapi.parseIntExt($("#WndPlanet_pp_fsize").text());
  },
  getUsedSize: () => {
    return sfapi.parseIntExt($("#WndPlanet_pp_bsize").text());
  },
  getOrbitalSize: () => {
    return sfapi.parseIntExt($("#WndPlanet_pp_osize").text());
  },
  getFreeOrbitalSize: () => {
    return sfapi.parseIntExt($("#WndPlanet_pp_ofsize").text());
  },
  getUsedOrbitalSize: () => {
    return sfapi.parseIntExt($("#WndPlanet_pp_obsize").text());
  }
}