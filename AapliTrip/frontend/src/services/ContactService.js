import axios from "axios";
import { API_BASE_URL } from "../Constants/APIConstants";

export const submitContact = async (contactData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/contact`, contactData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getAllContacts = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/admin/contacts`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateContactStatus = async (contactId, status) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
            `${API_BASE_URL}/admin/contacts/${contactId}/${status}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};

