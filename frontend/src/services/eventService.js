const API = "http://localhost:8080/api/events";

export const getEvents = async () => {
  const res = await fetch(API);
  return res.json();
};

export const createEvent = async (event) => {
  return await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event)
  });
};

export const deleteEvent = async (id) => {
  return await fetch(`${API}/${id}`, { method: "DELETE" });
};