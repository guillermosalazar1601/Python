const taskInput = document.querySelector('.task__input')
const taskClear = document.querySelector('.task__clear')
const taskList = document.querySelector('.task__list')
console.log('JS')
let task = [
    {
        title: 'Estudiar Javascript',
        completed: true
    },
    {
        title: 'Salir al receso',
        completed: true
    },
    {
        title: 'Realizar el reto',
        completed: false
    }
]

taskInput.addEventListener('keydown',(event) =>{
    if(event.target.value==''){
        return
    }
    if(event.key== 'Enter'){
        const newTask = {
        title: event.target.value,
        completed: false
    }
    task.push(newTask)
    renderTask(task)
    taskInput.value = ''
    }
})
function renderTask(tasks = []){
    let lista = ''
    task.forEach((task,index)=> {
        lista = lista + `<li class="flex justify-center items-center gap-4 py-1">
                    <input type="checkbox"
                    ${task.completed ? 'checked': ''}
                    onchange="checkTask(${index})"
                    >
                    <div class="w-full ${task.completed ? 'line-through text-gray-500' : ''}">
                        ${task.title}
                    </div>
                    <button class="task__clear border border-red-700 font-medium text-sm px-2 py-1 text-red-500 rounded-lg hover:text-white hover:bg-red-700 duration-300 cursor-pointer"
                    onclick="removeTask(${index})"
                    >
                        Borrar
                    </button>
                </li>`
    });
    taskList.innerHTML = lista
}

function removeTask(selectedIndex){
    const modifiedTask= task.filter((task,index) => index!== selectedIndex)
    task= modifiedTask
    renderTask(task)
}

function checkTask(selectedIndex){
    const taskSelected = {...task[selectedIndex]}
    taskSelected.completed = !taskSelected.completed
    task[selectedIndex] = taskSelected
    renderTask(task)
}

taskClear.addEventListener('click',(event)=>{
    const deletedTask= task.filter((task)=> task.completed !== true)

    task= deletedTask
    renderTask(task)
})
renderTask(task)