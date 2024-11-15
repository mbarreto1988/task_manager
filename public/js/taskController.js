import Api from './api.js';
import { voiceSettings } from './voiceConfig.js'; // Importamos las configuraciones globales

class TaskController {
    constructor(container) {
        this.container = container;
        this.api = new Api();
        this.taskDialog = document.getElementById("taskDialog");
        this.taskDialogContent = document.getElementById("taskDialogContent");
    }

    async loadTasks() {
        const tasks = await this.api.fetchTasks();
        this.displayTasks(tasks);
        return tasks;
    }

    async createTask(task) {
        const newTask = await this.api.createTask(task);
        if (newTask) {
            this.loadTasks();
        }
    }

    displayTasks(tasks) {
        const orderedTasks = tasks.sort((a, b) => {
            const estadoOrder = { "En Proceso": 1, "Pendiente": 2, "Finalizada": 3 };
            if (estadoOrder[a.estado] !== estadoOrder[b.estado]) {
                return estadoOrder[a.estado] - estadoOrder[b.estado];
            }
            const fechaA = new Date(a.fechaCreacion);
            const fechaB = new Date(b.fechaCreacion);
            return fechaB - fechaA;
        });

        this.container.innerHTML = "";

        orderedTasks.forEach(task => {
            const taskHtml = `
                <div class="task ${task.estado === "Finalizada" ? "completed" : ""}" data-id="${task.id}">
                    <div>
                        <h3 class="task-title">${task.titulo}</h3>
                        <p class="date task-date">${task.fechaCreacion}</p>
                        <p class="date task-status">${task.estado}</p>
                    </div>
                    <button class="icon task-icon play-icon" data-description="${task.descripcion}">
                        <i class="fa-solid fa-circle-play"></i>
                    </button>
                </div>
            `;
            this.container.insertAdjacentHTML("beforeend", taskHtml);
        });

        this.addTaskClickEvents();
        this.addIconClickEvents();
    }

    addTaskClickEvents() {
        const tasks = this.container.querySelectorAll(".task");
        tasks.forEach(task => {
            task.addEventListener("click", async () => {
                const taskId = task.getAttribute("data-id");
                const taskData = await this.api.fetchTaskById(taskId);
                this.showTaskDialog(taskData);
            });
        });
    }

    showTaskDialog(task) {
        this.taskDialogContent.innerHTML = `
            <p><strong>Fecha de creación:</strong> ${task.fechaCreacion}</p>
            <p><strong>Título:</strong> ${task.titulo}</p>
            <p><strong>Descripción:</strong> ${task.descripcion}</p>
            ${task.estado === "Finalizada" ? `<p><strong>Fecha de conclusión:</strong> ${task.fechaConclusion || ''}</p>` : ''}
        `;
        this.taskDialog.showModal();
    }

    async updateTaskStatus(taskId, newStatus) {
        const task = await this.api.fetchTaskById(taskId);
        const updateData = { estado: newStatus };
        if (newStatus === "Finalizada") {
            updateData.fechaConclusion = new Date().toISOString();
        } else if (task.estado === "Finalizada" && newStatus !== "Finalizada") {
            updateData.fechaConclusion = "";
        }

        const response = await fetch(`${this.api.apiURL}/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateData)
        });

        if (response.ok) {
            this.loadTasks();
        } else {
            console.error("Error al actualizar el estado:", await response.text());
        }
    }

    async deleteTask(taskId) {
        try {
            const response = await fetch(`${this.api.apiURL}/${taskId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) throw new Error("Error al eliminar la tarea");
            this.loadTasks();
        } catch (error) {
            console.error("Error al eliminar la tarea:", error);
        }
    }

    addIconClickEvents() {
        const icons = this.container.querySelectorAll(".task-icon:not(.check-icon)");
        icons.forEach(icon => {
            icon.addEventListener("click", (event) => {
                event.stopPropagation();
                console.log("Botón de play presionado");
                const description = icon.getAttribute("data-description");
                this.speakTitle(description);
            });
        });
    }

    speakTitle(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const speech = new SpeechSynthesisUtterance(text);
            speech.lang = voiceSettings.lang; // Usar configuración global de idioma
            speech.rate = voiceSettings.rate; // Usar configuración global de velocidad
            speech.onstart = () => console.log("Iniciando síntesis de voz");
            speech.onend = () => console.log("Finalizó síntesis de voz");
            window.speechSynthesis.speak(speech);
        } else {
            console.error("Speech Synthesis no está soportado en este navegador.");
        }
    }
}

export default TaskController;