function simpleDecider(rules, { defaultResult = null } = {}) {
    return subject => {
        for (const { rule, result } of rules) {
            if (Object.keys(rule).every(key => subject[key] === rule[key])) return result;
        }
        if (defaultResult !== null) return defaultResult;
        throw new Error("No matching rule found.");
    };
}

module.exports = { simpleDecider };