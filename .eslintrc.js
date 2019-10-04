module.exports = {
    "env": {
        "browser": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "no-tabs": "error",
        "no-mixed-spaces-and-tabs": "error",
        "no-irregular-whitespace": "error",
        "curly": "error",
        "eqeqeq": "error",
        "dot-notation": "error",
        "no-inner-declarations": "error",
        "no-alert": "error",
        "no-caller": "error",
        "no-empty-pattern": "error",
        "no-implicit-coercion": "error",
        "no-multi-spaces": "error",
        "no-redeclare": "error",
        "no-self-assign": "error",
        "no-useless-return": "error",
        "brace-style": [
            "error",
            "1tbs",
            {
                "allowSingleLine": true
            }
        ]
    }
};
