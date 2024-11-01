const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';
const CLEAR_COMPLETED = 'CLEAR_COMPLETED';

const addTodo = (label) => ({ type: ADD_TODO, payload: label });
const toggleTodo = (index) => ({ type: TOGGLE_TODO, payload: index });
const toggleFavorite = (index) => ({ type: TOGGLE_FAVORITE, payload: index });
const clearCompleted = () => ({ type: CLEAR_COMPLETED });

const todosReducer = (state = [], action) => {
    switch (action.type) {
        case ADD_TODO:
            return [...state, { label: action.payload, completed: false, favorite: false }];
        case TOGGLE_TODO:
            return state.map((todo, index) => 
                index === action.payload ? { ...todo, completed: !todo.completed } : todo
            );
        case TOGGLE_FAVORITE:
            return state.map((todo, index) => 
                index === action.payload ? { ...todo, favorite: !todo.favorite } : todo
            );
        case CLEAR_COMPLETED:
            return state.filter(todo => !todo.completed);
        default:
            return state;
    }
};

const { createStore } = Redux;
const store = createStore(todosReducer);

function TodoForm() {
    const form = document.createElement('form');
    form.innerHTML = `
        <input type="text" placeholder="Add a new task" required />
        <button type="submit">Add</button>
    `;
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = form.querySelector('input');
        const value = input.value.trim();
        if (value) {
            store.dispatch(addTodo(value));
            input.value = ''; 
        }
    });
    return form;
}

function ListItem(todo, index) {
    const item = document.createElement('div');
    item.className = 'todo-item';
    item.innerHTML = `
        <input type='checkbox' ${todo.completed ? 'checked' : ''} />
        <span>${todo.label}</span>
        <button class="favorite-btn">${todo.favorite ? 'Unfavorite' : 'Favorite'}</button>
    `;

    item.querySelector('input').addEventListener('change', () => {
        store.dispatch(toggleTodo(index));
    });

    item.querySelector('.favorite-btn').addEventListener('click', () => {
        store.dispatch(toggleFavorite(index));
    });

    return item;
}

function List() {
    const listContainer = document.createElement('div');
    const todos = store.getState(); 
    todos.forEach((todo, index) => {
        const item = ListItem(todo, index);
        listContainer.appendChild(item);
    });
    return listContainer;
}

function TodoFooter() {
    const footer = document.createElement('div');
    const todos = store.getState();
    const completedCount = todos.filter(todo => todo.completed).length;
    const favoriteCount = todos.filter(todo => todo.favorite).length;

    footer.innerHTML = `
        <span>${completedCount} of ${todos.length} completed</span>
        <button>Clear completed</button>
        <span>${favoriteCount} favorite(s)</span>
    `;

    footer.querySelector('button').addEventListener('click', () => {
        store.dispatch(clearCompleted());
    });

    return footer;
}

function App() {
    const appContainer = document.createElement('div');
    const title = document.createElement('h1');
    title.textContent = 'Todo List';
    appContainer.appendChild(title);

    const render = () => {
        appContainer.innerHTML = ""; 
        appContainer.appendChild(TodoForm());
        appContainer.appendChild(List());
        appContainer.appendChild(TodoFooter());
    };

    store.subscribe(render);
    render(); 

    return appContainer;
}

const root = document.getElementById("root");
root.appendChild(App());
