/**
 * @typedef {Object.<string, Object.<string, string>>} Lockit
 */

class LocalizationSystem {

    /** @type {string} */ language;
    /** @type {string} */ lockit;

    /** @type {Object.<string, string>} */ #currentLanguage;

    /**
     * @param {string} language 
     * @param {Lockit} lockit 
     */
    constructor(language, lockit) {

        this.language = language;
        this.lockit = lockit;

        this.#currentLanguage = lockit[language];
    }

    localize(key) {

        if (!this.#currentLanguage) {

            console.error(`[LOCALIZATION SYSTEM] Language '${this.language}' is not supported.`)
            return;
        }

        return this.#currentLanguage[key] ? this.#currentLanguage[key] : `!!!${key}!!!`;
    }
}