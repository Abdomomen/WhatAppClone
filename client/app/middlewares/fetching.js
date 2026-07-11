const API_URL = "http://localhost:3000/api/v1";

let fetching = async (url, method = "GET", body = null, token) => {
  try {
    let res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: body ? JSON.stringify(body) : null,
    });

    let data = await res.json();

    if (data.success) {
      return data;
    }

    if (res.status === 401) {
      let refresh = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      let refreshData = await refresh.json();

      if (!refreshData.success) {
        return { success: false, error: "session expired" };
      }

      let newRes = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshData.accessToken}`,
        },
        credentials: "include",
        body: body ? JSON.stringify(body) : null,
      });

      let newData = await newRes.json();

      if (newData.success) {
        return { ...newData, newToken: refreshData.accessToken, success: true };
      } else {
        return { success: false, error: "session expired" };
      }
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: "Network error occurred",
      details: error.message,
    };
  }
};

export default fetching;
