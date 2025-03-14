import {startStatic} from './static.ts';
import {clearOverlay, monthSpan, nextButton, prevButton} from './dom.ts';
import {makeTextbox} from './makeTextbox.ts';
import {january} from './games/january';

const games = [
    january,
    makeTextbox('Coming Saturday February 15th'),
    makeTextbox('Coming Saturday March 15th'),
    makeTextbox('Coming Saturday April 19th'),
    makeTextbox('Coming Saturday May 17th'),
    makeTextbox('Coming Saturday June 21st'),
    makeTextbox('Coming Saturday July 19th'),
    makeTextbox('Coming Saturday August 16th'),
    makeTextbox('Coming Saturday September 20th'),
    makeTextbox('Coming Saturday October 18th'),
    makeTextbox('Coming Saturday November 15th'),
    makeTextbox('Coming Saturday December 20th'),
];

let monthIndex: number;
let callback: (() => void) | undefined = undefined;

function updateMonthFromHash() {
    if (location.hash === '') {
        monthIndex = 0;
        return;
    }

    const hashMonth = new Date(`${location.hash.slice(1)} 1`).getMonth();
    monthIndex = isNaN(hashMonth) || hashMonth < 0 || hashMonth > 11 ? 0 : hashMonth;
}

function getMonthString() {
    return new Date(2025, monthIndex).toLocaleString('default', {month: 'long'});
}

export function openPage(runner: () => () => void) {
    if (callback !== undefined) {
        callback();
        callback = undefined;
    }
    clearOverlay();
    startStatic(() => (callback = runner()));
}

export function loadGame() {
    monthSpan.textContent = getMonthString();

    prevButton.disabled = monthIndex === 0;
    nextButton.disabled = monthIndex === games.length - 1;

    openPage(games[monthIndex]);
}

prevButton.addEventListener('click', () => {
    --monthIndex;
    location.hash = getMonthString();
});

nextButton.addEventListener('click', () => {
    ++monthIndex;
    location.hash = getMonthString();
});

window.addEventListener('hashchange', () => {
    updateMonthFromHash();
    loadGame();
});

updateMonthFromHash();
