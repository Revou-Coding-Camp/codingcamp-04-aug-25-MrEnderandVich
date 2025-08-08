document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const dateInput = document.getElementById('date-input');
    const addBtn = document.getElementById('add-btn');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const taskList = document.getElementById('task-list');
    const filterSelect = document.getElementById('filter');
    const noTaskMsg = document.getElementById('no-task-msg');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const renderTasks = (filteredTasks = tasks) => {
        taskList.innerHTML = '';
        if (filteredTasks.length === 0) {
            noTaskMsg.style.display = 'block';
        } else {
            noTaskMsg.style.display = 'none';
            filteredTasks.forEach((task, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="${task.status === 'completed' ? 'completed-task' : ''}">${task.name}</td>
                    <td>${task.dueDate}</td>
                    <td>${task.status}</td>
                    <td>
                        <button class="status-btn" data-index="${index}">${task.status === 'completed' ? 'In Progress' : 'Completed'}</button>
                        <button class="delete-btn" data-index="${index}">Delete</button>
                    </td>
                `;
                taskList.appendChild(row);
            });
        }
    };

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const addTask = () => {
        const taskName = taskInput.value.trim();
        const dueDate = dateInput.value;

        if (taskName === '' || dueDate === '') {
            alert('Task and Due Date cannot be empty!');
            return;
        }

        const newTask = {
            name: taskName,
            dueDate: dueDate,
            status: 'in-progress'
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        dateInput.value = '';
    };

    const deleteTask = (index) => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    };

    const toggleStatus = (index) => {
        tasks[index].status = tasks[index].status === 'in-progress' ? 'completed' : 'in-progress';
        saveTasks();
        renderTasks();
    };

    const deleteAllTasks = () => {
        tasks = [];
        saveTasks();
        renderTasks();
    };

    const filterTasks = () => {
        const selectedFilter = filterSelect.value;
        if (selectedFilter === 'all') {
            renderTasks(tasks);
        } else {
            const filtered = tasks.filter(task => task.status === selectedFilter);
            renderTasks(filtered);
        }
    };

    // Event Listeners
    addBtn.addEventListener('click', addTask);
    deleteAllBtn.addEventListener('click', deleteAllTasks);
    filterSelect.addEventListener('change', filterTasks);

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            deleteTask(index);
        } else if (e.target.classList.contains('status-btn')) {
            const index = e.target.dataset.index;
            toggleStatus(index);
        }
    });

    // Initial render
    renderTasks();
});
