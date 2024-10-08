// /rules/defaultRules.js

// Export an array of rules
module.exports = [
    { rule: { hasAccess: [false, undefined, null] }, result: "Access Denied" },
    { rule: { hasAccess: true, isAdmin: true, isManager: true }, result: "Admin and Manager Access Granted" },
    { rule: { hasAccess: true, isAdmin: true }, result: "Admin Access Granted" },
    { rule: { hasAccess: true, isManager: true }, result: "Manager Access Granted" },
    { rule: { hasAccess: true }, result: "User Access Granted" }
];
