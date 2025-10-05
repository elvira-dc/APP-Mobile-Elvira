import { API_CONFIG } from "@constants/api";

class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout");
      }
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}, options = {}) {
    const searchParams = new URLSearchParams(params);
    const url = searchParams.toString()
      ? `${endpoint}?${searchParams}`
      : endpoint;

    return this.request(url, {
      method: "GET",
      ...options,
    });
  }

  // POST request
  async post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : null,
      ...options,
    });
  }

  // PUT request
  async put(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : null,
      ...options,
    });
  }

  // PATCH request
  async patch(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : null,
      ...options,
    });
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: "DELETE",
      ...options,
    });
  }

  // Set authorization header
  setAuthToken(token) {
    this.authToken = token;
  }

  // Get headers with auth token
  getAuthHeaders() {
    return this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {};
  }

  // Authenticated request wrapper
  async authRequest(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;
