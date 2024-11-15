import Api from './api.js';

class TaskController {
    constructor(container) {
        this.container = container;
        this.api = new Api(); // Instancia de la clase Api

        // Inicializar la API de síntesis de voz en un evento de interacción, si es posible
        window.addEventListener('click', () => {
            this.initializeSpeech();
        }, { once: true });
    }

    initializeSpeech() {
        if ('speechSynthesis' in window) {
            const initSpeech = new SpeechSynthesisUtterance('');
            window.speechSynthesis.speak(initSpeech);
        }
    }

    async loadTasks() {
        const tasks = await this.api.fetchTasks(); // Usa el método fetchTasks de Api
        this.displayTasks(tasks);
        return tasks;
    }

    async createTask(task) {
        const newTask = await this.api.createTask(task); // Usa el método createTask de Api
        if (newTask) {
            this.loadTasks(); // Recargar la lista de tareas después de crear una nueva
        }
    }

    displayTasks(tasks) {
        // Ordenar las tareas por estado y fecha
        const orderedTasks = tasks.sort((a, b) => {
            const estadoOrder = {
                "En Proceso": 1,
                "Pendiente": 2,
                "Finalizada": 3
            };

            if (estadoOrder[a.estado] !== estadoOrder[b.estado]) {
                return estadoOrder[a.estado] - estadoOrder[b.estado];
            }

            const fechaA = new Date(a.fechaCreacion);
            const fechaB = new Date(b.fechaCreacion);
            return fechaB - fechaA;
        });

        this.container.innerHTML = "";
        
        orderedTasks.forEach(task => {
            let iconClass, iconHtml, taskClass;
            
            if (task.estado === "Finalizada") {
                iconClass = "check-icon";
                iconHtml = '<i class="fa-solid fa-circle-check"></i>';
                taskClass = "task completed";
            } else if (task.estado === "En Proceso") {
                iconClass = "process-icon";
                iconHtml = '<i class="fa-solid fa-circle-play"></i>';
                taskClass = "task in-process";
            } else { 
                iconClass = "play-icon";
                iconHtml = '<i class="fa-solid fa-circle-play"></i>';
                taskClass = "task";
            }
            
            const taskHtml = `
                <div class="${taskClass}">
                    <div>
                        <h3 class="task-title">${task.titulo}</h3>
                        <p class="date task-date">${task.fechaCreacion}</p>
                        <p class="date task-status">${task.estado}</p>
                    </div>
                    <button class="icon task-icon ${iconClass}" data-description="${task.descripcion}" id="button-play">
                        ${iconHtml}
                    </button>
                </div>
            `;
            
            this.container.insertAdjacentHTML("beforeend", taskHtml);
        });
        
        this.addIconClickEvents();
    }

    async updateTaskStatus(taskId, newStatus) {
        try {
            const response = await fetch(`${this.api.apiURL}/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ estado: newStatus })
            });
            if (!response.ok) throw new Error("Error al actualizar el estado");

            // Recargar las tareas después de la actualización
            this.loadTasks();
        } catch (error) {
            console.error("Error al actualizar el estado:", error);
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
            icon.addEventListener("click", () => {
                console.log("Botón de play presionado");
                const description = icon.getAttribute("data-description");
                this.speakTitle(description);
            });
        });
    }

    speakTitle(text) {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            speech.lang = "es-ES";
            window.speechSynthesis.speak(speech);
        } else {
            console.error("Speech Synthesis no está soportado en este navegador.");
        }
    }
}

export default TaskController;
