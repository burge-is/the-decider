// /__tests__/simpleDecider.test.js

const { simpleDecider } = require('../simpleDecider');

// SECTION 1: Basic Matching
describe("Simplified Decision Engine - Basic Matching", () => {
    const rules = [
        { rule: { hasAccess: false }, result: "Access Denied" },
        { rule: { hasAccess: true, isAdmin: true }, result: "Admin Access Granted" },
        { rule: { hasAccess: true }, result: "User Access Granted" }
    ];

    test("Returns 'Access Denied' when hasAccess is false", () => {
        const engine = simpleDecider(rules);
        const subject = { hasAccess: false };
        expect(engine(subject)).toBe("Access Denied");
    });

    test("Returns 'Admin Access Granted' when hasAccess is true and isAdmin is true", () => {
        const engine = simpleDecider(rules);
        const subject = { hasAccess: true, isAdmin: true };
        expect(engine(subject)).toBe("Admin Access Granted");
    });

    test("Returns 'User Access Granted' when hasAccess is true without admin privileges", () => {
        const engine = simpleDecider(rules);
        const subject = { hasAccess: true };
        expect(engine(subject)).toBe("User Access Granted");
    });
});

// SECTION 2: Default Result Handling
describe("Simplified Decision Engine - Default Result Handling", () => {
    const rules = [
        { rule: { hasAccess: true, isAdmin: true }, result: "Admin Access Granted" }
    ];

    test("Returns default result when no matching rule is found", () => {
        const engine = simpleDecider(rules, { defaultResult: "Default Access" });
        const subject = { hasAccess: false };
        expect(engine(subject)).toBe("Default Access");
    });

    test("Returns default result when rule partially matches but lacks conditions", () => {
        const engine = simpleDecider(rules, { defaultResult: "Default Access" });
        const subject = { isAdmin: true }; // Missing hasAccess flag
        expect(engine(subject)).toBe("Default Access");
    });
});

// SECTION 3: Error Handling
describe("Simplified Decision Engine - Error Handling", () => {
    const rules = [
        { rule: { hasAccess: true, isAdmin: true }, result: "Admin Access Granted" }
    ];

    test("Throws an error when no match is found and no default is provided", () => {
        const engine = simpleDecider(rules);
        const subject = { hasAccess: false }; // No matching rule
        expect(() => engine(subject)).toThrow("No matching rule found.");
    });

    test("Throws an error when rule partially matches but no default is provided", () => {
        const engine = simpleDecider(rules);
        const subject = { isAdmin: true }; // Missing hasAccess flag
        expect(() => engine(subject)).toThrow("No matching rule found.");
    });
});

// SECTION 4: Multiple Rule Evaluation with Complex Comparisons
describe("Simplified Decision Engine - Multiple Rule Evaluation with Complex Comparisons", () => {
    const rules = [
        { rule: { hasAccess: false }, result: "Access Denied" },
        { rule: { hasAccess: true, isAdmin: true }, result: "Admin Access Granted" },
        { rule: { hasAccess: true, isModerator: true }, result: "Moderator Access Granted" },
        { rule: { hasAccess: true }, result: "User Access Granted" }
    ];

    test("Returns 'Access Denied' when hasAccess is false, even if other conditions match later rules", () => {
        const engine = simpleDecider(rules);
        const subject = { hasAccess: false, isAdmin: true }; // Matches first rule (hasAccess: false)
        expect(engine(subject)).toBe("Access Denied");
    });

    test("Returns 'Admin Access Granted' when both hasAccess and isAdmin are true", () => {
        const engine = simpleDecider(rules);
        const subject = { hasAccess: true, isAdmin: true };
        expect(engine(subject)).toBe("Admin Access Granted");
    });

    test("Returns 'Moderator Access Granted' when both hasAccess and isModerator are true", () => {
        const engine = simpleDecider(rules);
        const subject = { hasAccess: true, isModerator: true };
        expect(engine(subject)).toBe("Moderator Access Granted");
    });

    test("Returns 'User Access Granted' when only hasAccess is true", () => {
        const engine = simpleDecider(rules);
        const subject = { hasAccess: true };
        expect(engine(subject)).toBe("User Access Granted");
    });

    test("Returns default result when no rules match", () => {
        const engine = simpleDecider(rules, { defaultResult: "Default Access" });
        const subject = { isAdmin: true }; // Missing hasAccess flag
        expect(engine(subject)).toBe("Default Access");
    });
});

// SECTION 5: Complex Scenarios Involving Prioritization
describe("Simplified Decision Engine - Complex Scenarios Involving Prioritization", () => {
    const rules = [
        { rule: { hasAccess: false }, result: "Access Denied" },
        { rule: { hasAccess: true, isAdmin: true, isSpecialUser: true }, result: "Special Admin Access Granted" },
        { rule: { hasAccess: true, isAdmin: true }, result: "Admin Access Granted" },
        { rule: { hasAccess: true }, result: "User Access Granted" }
    ];

    test("Returns 'Access Denied' when hasAccess is false, even if other conditions match more specific rules", () => {
        const engine = simpleDecider(rules);
        const subject = { hasAccess: false, isAdmin: true, isSpecialUser: true }; // Matches first rule (hasAccess: false)
        expect(engine(subject)).toBe("Access Denied");
    });

    test("Returns 'Special Admin Access Granted' when hasAccess, isAdmin, and isSpecialUser are all true", () => {
        const engine = simpleDecider(rules);
        const subject = { hasAccess: true, isAdmin: true, isSpecialUser: true };
        expect(engine(subject)).toBe("Special Admin Access Granted");
    });

    test("Returns 'Admin Access Granted' when both hasAccess and isAdmin are true, without isSpecialUser", () => {
        const engine = simpleDecider(rules);
        const subject = { hasAccess: true, isAdmin: true };
        expect(engine(subject)).toBe("Admin Access Granted");
    });

    test("Returns 'User Access Granted' when only hasAccess is true", () => {
        const engine = simpleDecider(rules);
        const subject = { hasAccess: true };
        expect(engine(subject)).toBe("User Access Granted");
    });
});
