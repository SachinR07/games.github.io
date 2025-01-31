// script.js
document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const noTasksMessage = document.getElementById('no-tasks-message');
    const newTaskTitleInput = document.getElementById('new-task-title');
    const addTaskButton = document.getElementById('add-task');
    const timeBlocks = document.getElementById('time-blocks');
    const calendar = document.getElementById('calendar');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function renderTasks() {
        taskList.innerHTML = ''; // Clear existing tasks
        if (tasks.length === 0) {
            taskList.appendChild(noTasksMessage);
        } else {
            noTasksMessage.remove(); // Remove message if tasks exist
            tasks.forEach((task, index) => {
                const taskDiv = document.createElement('div');
                taskDiv.classList.add('task');
                taskDiv.innerHTML = `
                    <div class="task-title"><span class="math-inline">\{task\.title\}</div\></4\>
<div class\="task\-buttons"\></5\>
<button class\="edit\-task" data\-index\="</span>{index}"><i class="fas fa-edit"></i></button>
                        <button class="delete-task" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                taskList.appendChild(taskDiv);

                // Add event listeners to the buttons *after* they are created
                const editButton = taskDiv.querySelector('.edit-task');
                const deleteButton = taskDiv.querySelector('.delete-task');

                editButton.addEventListener('click', () => {
                    // Handle edit logic here (e.g., prompt for new title)
                    const newTitle = prompt("Edit Task", task.title)
                    if (newTitle !== null && newTitle.trim() !== "") {
                        tasks[index].title = newTitle.trim();
                        saveTasks();
                        renderTasks();
                    }
                });

                deleteButton.addEventListener('click', () => {
                    tasks.splice(index, 1);
                    saveTasks();
                    renderTasks();
                });
            });
        }
    }

    addTaskButton.addEventListener('click', () => {
        const taskTitle = newTaskTitleInput.value.trim();
        if (taskTitle !== '') {
            tasks.push({ title: taskTitle });
            newTaskTitleInput.value = '';
            saveTasks();
            renderTasks();
        }
    });

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }


    // Calendar rendering (using Day.js)
    function renderCalendar() {
      const today = dayjs();
      let calendarHTML = `
          <div class="calendar-header">
              <button id="prev-month"><i class="fas fa-chevron-left"></i></button>
              <span>${today.format('MMMM YYYY')}</span>
              <button id="next-month"><i class="fas fa-chevron-right"></i></button>
          </div>
          <div class="calendar-grid">`;

      const startDay = today.startOf('month');
      const endDay = today.endOf('month');
      let currentDay = startDay.clone();

      // Add day names
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      dayNames.forEach(dayName => {
        calendarHTML += `<div class="day-name">${dayName}</div>`;
      })

      while (currentDay.isBefore(endDay, 'day') || currentDay.isSame(endDay, 'day')) {
          calendarHTML += `<div class="calendar-day">${currentDay.date()}</div>`;
          currentDay = currentDay.add(1, 'day');
      }

      calendarHTML += `</div>`;
      calendar.innerHTML = calendarHTML;

      // Add event listeners for prev/next month
      document.getElementById('prev-month').addEventListener('click', () => {
        today.subtract(1, 'month'); // Subtract a month
        renderCalendar(); // Re-render the calendar
      });

      document.getElementById('next-month').addEventListener('click', () => {
        today.add(1, 'month'); // Add a month
        renderCalendar();// Re-render the calendar
      });
    }

    renderCalendar();
    renderTasks();


    // Time Blocking (basic example - enhance as needed)
    for (let i = 0; i < 7; i++) {
        const timeBlock = document.createElement('div');
        timeBlock.classList.add('time-block');
        timeBlocks.appendChild(timeBlock);
    }


    // Disable right-click
