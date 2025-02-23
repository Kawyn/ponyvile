class Settings {

    static ON_VALUE_CHANGED = 'OnValueChanged'; // data is value name;

    /** @type {EventManager} */ static EventManager = new EventManager();

    static GetValueAsString(identifier) {

        const decodedCookie = decodeURIComponent(document.cookie);
        const cookies = decodedCookie.split(';');

        for (let cookie of cookies) {

            cookie = cookie.trim();

            if (cookie.startsWith(identifier))
                return cookie.substring(identifier.length + 1, cookie.length);
        }

        return undefined;
    }

    static SetValue(identifier, value) {

        const days = 7;
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

        const expires = 'expires=' + date.toUTCString();
        document.cookie = `${identifier}=${encodeURIComponent(value)};${expires};path=/`;

        Settings.EventManager.riseEvent(Settings.ON_VALUE_CHANGED, identifier);
    }
}