export const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/fake_so";
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
export const port = process.env.PORT || 8000;
export const sameSiteConfig = process.env.NODE_ENV === "prod" ? "none"  : "lax";
export const secureConfig = process.env.NODE_ENV !== undefined;
export const fallbackSecret = "fbb5e1bfb302c3f8d233bd5f85fc357e38865f2c84f28cf75d0882c3471425f2e91ae8eebcc295037d79eb97c3e218481d5428d3cfb9d0bbdbaf8fdac3f8f5ae";