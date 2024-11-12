// Api.js

class Api {
    constructor() {
        this.apiURL = "https://6708314d8e86a8d9e42e50e1.mockapi.io/tasks";
    }

    async fetchTasks() {
        try {
            const response = await fetch(this.apiURL);
            if (!response.ok) throw new Error("Error en la solicitud");
            return await response.json();
        } catch (error) {
            console.error("Error al obtener las tareas:", error);
            return [];
        }
    }

    async createTask(task) {
        try {
            const response = await fetch(this.apiURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(task)
            });
            if (!response.ok) throw new Error("Error al crear la tarea");
            return await response.json(); // Retorna la tarea creada
        } catch (error) {
            console.error("Error al crear la tarea:", error);
            return null;
        }
    }
}

export default Api;
