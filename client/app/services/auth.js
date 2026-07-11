import fetching from "../middlewares/fetching.js";

const url = "http://localhost:3000/api/v1/auth";

const authServices = {
  login: async (data) => {
    try {
      const { email, password } = data;
      const res = await fetching(`${url}/login`, "POST", { email, password });
      return res;
    } catch (error) {
      return {
        success: false,
        error: "Network error occurred",
        details: error.message,
      };
    }
  },

  register: async (data) => {
    try {
      const { name, username, email, password } = data;
      const res = await fetching(`${url}/register`, "POST", {
        name,
        username,
        email,
        password,
      });
      return res;
    } catch (error) {
      return {
        success: false,
        error: "Network error occurred",
        details: error.message,
      };
    }
  },

  refresh: async () => {
    try {
      const res = await fetch(`${url}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: "Network error occurred",
        details: error.message,
      };
    }
  },

  logout: async () => {
    try {
      const res = await fetch(`${url}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: "Network error occurred",
        details: error.message,
      };
    }
  },
};

export default authServices;
