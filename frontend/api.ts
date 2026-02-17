import { Category, Product, Purchase, Bill } from "./types";

const BASE_URL = "http://localhost:8000/api";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = "API request failed";
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.detail ||
        errorData.message ||
        JSON.stringify(errorData) ||
        errorMessage;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};

const getHeaders = () => ({
  "Content-Type": "application/json",
});

export const api = {
  /* ===================== CATEGORIES ===================== */
  categories: {
    list: () =>
      fetch(`${BASE_URL}/categories/`, {
        credentials: "include",
      }).then((res) => handleResponse<Category[]>(res)),

    create: (data: Pick<Category, "name">) =>
      fetch(`${BASE_URL}/categories/`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
        credentials: "include",
      }).then((res) => handleResponse<Category>(res)),

    update: (id: number, data: Partial<Category>) =>
      fetch(`${BASE_URL}/categories/${id}/`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(data),
        credentials: "include",
      }).then((res) => handleResponse<Category>(res)),

    delete: (id: number) =>
      fetch(`${BASE_URL}/categories/${id}/`, {
        method: "DELETE",
        credentials: "include",
      }).then((res) => handleResponse<void>(res)),
  },

  /* ===================== PRODUCTS ===================== */
  products: {
    list: () =>
      fetch(`${BASE_URL}/products/`, {
        credentials: "include",
      }).then((res) => handleResponse<Product[]>(res)),

    create: (data: Partial<Product>) =>
      fetch(`${BASE_URL}/products/`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
        credentials: "include",
      }).then((res) => handleResponse<Product>(res)),

    update: (id: number, data: Partial<Product>) =>
      fetch(`${BASE_URL}/products/${id}/`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(data),
        credentials: "include",
      }).then((res) => handleResponse<Product>(res)),

    deactivate: (id: number) =>
      fetch(`${BASE_URL}/products/${id}/`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ is_active: false }),
        credentials: "include",
      }).then((res) => handleResponse<Product>(res)),
  },

  /* ===================== PURCHASES ===================== */
  purchases: {
    list: () =>
      fetch(`${BASE_URL}/purchases/`, {
        credentials: "include",
      }).then((res) => handleResponse<Purchase[]>(res)),

    create: (data: Partial<Purchase>) =>
      fetch(`${BASE_URL}/purchases/`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
        credentials: "include",
      }).then((res) => handleResponse<Purchase>(res)),
  },

  /* ===================== BILLS ===================== */
  bills: {
    list: () =>
      fetch(`${BASE_URL}/bills/`, {
        credentials: "include",
      }).then((res) => handleResponse<Bill[]>(res)),

    create: (data: Partial<Bill>) =>
      fetch(`${BASE_URL}/bills/`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
        credentials: "include",
      }).then((res) => handleResponse<Bill>(res)),

    // ✅ ADDED THIS METHOD TO FIX THE ERROR
    update: (id: number, data: Partial<Bill>) =>
      fetch(`${BASE_URL}/bills/${id}/`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(data),
        credentials: "include",
      }).then((res) => handleResponse<Bill>(res)),
  },
};