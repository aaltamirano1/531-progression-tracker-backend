'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/531-progression-tracker';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/531-progression-tracker-test';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';