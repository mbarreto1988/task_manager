import Api from './api.js';
import TaskController from './taskController.js';
import { initializeVoiceConfig } from './voiceConfig.js';


document.addEventListener("DOMContentLoaded", () => {
    const taskContainer = document.getElementById("api-data");
    const menuButton = document.getElementById("menuButtonId");
    const fullscreenMenu = document.getElementById("fullscreenMenu");
    const checkbox = document.getElementById("check");
    const newNoteButton = document.getElementById("newNote");
    const newNoteDialog = document.getElementById("newNoteDialog");
    const newNoteForm = document.getElementById("newNoteForm");
    const closeDialogButton = document.getElementById("closeDialogButton");
    const cancelDialogButton = document.getElementById("cancelDialogButton");
    const changeStatusButton = document.getElementById("changeStatus");
    const changeStatusDialog = document.getElementById("changeStatusDialog");
    const closeChangeStatusDialogButton = document.getElementById("closeChangeStatusDialogButton");
    const cancelChangeStatusButton = document.getElementById("cancelChangeStatusButton");
    const selectTaskDropdown = document.getElementById("selectTask");
    const changeStatusForm = document.getElementById("changeStatusForm");
    const newTaskStatus = document.getElementById("newTaskStatus");
    const deleteTaskButton = document.getElementById("deleteTask");
    const deleteTaskDialog = document.getElementById("deleteTaskDialog");
    const closeDeleteTaskDialogButton = document.getElementById("closeDeleteTaskDialogButton");
    const cancelDeleteTaskButton = document.getElementById("cancelDeleteTaskButton");
    const deleteTaskDropdown = document.getElementById("deleteTaskDropdown");
    const deleteTaskForm = document.getElementById("deleteTaskForm");
    const closeTaskDialogButton = document.getElementById("closeTaskDialogButton");
    const taskDialog = document.getElementById("taskDialog");
    const configureAppButton = document.getElementById("configureApp");
    const configureVoiceDialog = document.getElementById("configureVoiceDialog");
    const closeConfigureVoiceDialog = document.getElementById("closeConfigureVoiceDialog");


    const api = new Api();
    const taskController = new TaskController(taskContainer);


    taskController.loadTasks();
    initializeVoiceConfig();


    menuButton.addEventListener("click", () => {
        if (checkbox.checked) {
            fullscreenMenu.style.opacity = "1";
            fullscreenMenu.style.visibility = "visible";
        } else {
            fullscreenMenu.style.opacity = "0";
            fullscreenMenu.style.visibility = "hidden";
        }
    });


    fullscreenMenu.addEventListener("click", (event) => {
        if (event.target.tagName === "A") {
            checkbox.checked = false;
            fullscreenMenu.style.opacity = "0";
            fullscreenMenu.style.visibility = "hidden";
        }
    });


    newNoteButton.addEventListener("click", () => {
        newNoteDialog.showModal();
    });


    closeDialogButton.addEventListener("click", () => {
        newNoteDialog.close();
    });


    cancelDialogButton.addEventListener("click", () => {
        newNoteDialog.close();
    });


    closeChangeStatusDialogButton.addEventListener("click", () => {
        changeStatusDialog.close();
    });


    cancelChangeStatusButton.addEventListener("click", () => {
        changeStatusDialog.close();
    });


    closeDeleteTaskDialogButton.addEventListener("click", () => {
        deleteTaskDialog.close();
    });


    cancelDeleteTaskButton.addEventListener("click", () => {
        deleteTaskDialog.close();
    });


    closeTaskDialogButton.addEventListener("click", () => {
        taskDialog.close();
    });

    
    configureAppButton.addEventListener("click", () => {
        configureVoiceDialog.showModal();
    });


    closeConfigureVoiceDialog.addEventListener("click", () => {
        configureVoiceDialog.close();
    });


    newNoteForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const taskTitle = document.getElementById("taskTitle").value;
        const taskDetails = document.getElementById("taskDetails").value;
        const taskStatus = document.getElementById("taskStatus").value;
        const newTask = {
            fechaCreacion: new Date().toISOString(),
            fechaConclusion: "",
            titulo: taskTitle,
            descripcion: taskDetails,
            estado: taskStatus
        };
        await taskController.createTask(newTask);
        newNoteDialog.close();
        newNoteForm.reset();
    });


    changeStatusButton.addEventListener("click", async () => {
        const tasks = await taskController.loadTasks();
        selectTaskDropdown.innerHTML = '<option value="" disabled selected>Selecciona una tarea</option>';
        tasks.forEach(task => {
            const option = document.createElement("option");
            option.value = task.id;
            option.textContent = `${task.titulo} - ${task.estado}`;
            selectTaskDropdown.appendChild(option);
        });
        changeStatusDialog.showModal();
    });


    changeStatusForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const selectedTaskId = selectTaskDropdown.value;
        const newStatus = newTaskStatus.value;
        await taskController.updateTaskStatus(selectedTaskId, newStatus);
        changeStatusDialog.close();
    });


    deleteTaskButton.addEventListener("click", async () => {
        const tasks = await taskController.loadTasks();
        deleteTaskDropdown.innerHTML = '<option value="" disabled selected>Selecciona una tarea</option>';
        tasks.forEach(task => {
            const option = document.createElement("option");
            option.value = task.id;
            option.textContent = `${task.titulo} - ${task.estado}`;
            deleteTaskDropdown.appendChild(option);
        });
        deleteTaskDialog.showModal();
    });


    deleteTaskForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const selectedTaskId = deleteTaskDropdown.value;
        await taskController.deleteTask(selectedTaskId);
        deleteTaskDialog.close();
    });
});
