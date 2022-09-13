import { Task } from '@mui/icons-material';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface TaskState {
    isLoading: boolean;
    tasks: Task[];
    error?: ErrorData;
}

export interface ErrorData{
    statusCode: number;
    message: string;
    type: string;
}

export enum Status {
    Назначенна,      
    Выполняется,          
    Приостановлена,        
    Завершена,       
}

export interface Task {
    uniqueId: number;
    name: string;
    descriptions: string;
    users: string;
    dateTimeRegister: string;
    statusTask: number;
    plannedTime: number;
    finishTime: number;
    dateTimeFinish: string;
    myTasks: Task[];
}

export interface RsponceData{
    message: string;
    data: Task[];
}

export interface RsponceEditData{
    message: string;
    currentData:  Task;
    data: Task;
}

export interface RsponceNewData{
    message: string;
    data: Task;
}

export interface ITaskEdit {
    currentTask: Task,
    task: Task
}


// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestTaskAction {
    type: 'REQUEST_TASK';
}

interface ReceiveTaskAction {
    type: 'RECEIVE_TASK';
    tasks: Task[];
}

interface ReceiveNewTaskAction {
    type: 'RECEIVE_NEW_TASK';
    task: Task;
}

interface ReceiveErrorTaskAction {
    type: 'RECEIVE_ERROR';
    error: ErrorData;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestTaskAction | ReceiveTaskAction | ReceiveNewTaskAction | ReceiveErrorTaskAction;


// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestGetTasks: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.tasks) {
            dispatch({ type: 'REQUEST_TASK' });

            await fetch(`MyTask/MyTask`)
            .then(responce => {
                return responce.ok ? responce.json() as Promise<RsponceData> : Promise.reject(responce)
            })
            .then(data => {
                dispatch({ type: 'RECEIVE_TASK', tasks: data.data  });
            })
            .catch(e=>{
                return e.json() as Promise<ErrorData>;
            })
            .then(data => {
                let error = data as ErrorData;
                if(error != undefined)
                {
                    error.type = "get"
                    dispatch({type: 'RECEIVE_ERROR',error: error});
                }
               
            })
        }
    },
    requestCreateTasks: (EditTask:ITaskEdit): AppThunkAction<KnownAction> => async (dispatch, getState) =>{
        
        await fetch(`MyTask/CreateTask`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(EditTask.task)
        })
        .then(responce => {
            return responce.ok ? responce.json() as Promise<RsponceNewData> : Promise.reject(responce)
        })
        .then(data =>{
            dispatch({ type: 'RECEIVE_NEW_TASK', task: data.data });
        })
        .catch(e=>{
            return e.json() as Promise<ErrorData>;
        })
        .then(data => {
            let error = data as ErrorData;
            if(error != undefined)
            {
                error.type = "add"
                dispatch({type: 'RECEIVE_ERROR',error: error});
            }
        })
        
    },
    requestEditTasks: (EditTask:ITaskEdit): AppThunkAction<KnownAction> => async (dispatch, getState) =>{
        await fetch(`MyTask/EditTask`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "PATCH",
            body: JSON.stringify(EditTask)
        })
        .then(responce => {
            return responce.ok ? responce.json() as Promise<RsponceData> : Promise.reject(responce)
        })
        .then(data =>{
            dispatch({ type: 'RECEIVE_TASK', tasks: data.data });
        })
        .catch(e=>{
            return e.json() as Promise<ErrorData>;
        })
        .then(data => {
            let error = data as ErrorData;
            if(error != undefined)
            {
                error.type = "edit"
                dispatch({type: 'RECEIVE_ERROR',error: error});
            }
        })

    },
    requestAddSubTask: (EditTask:ITaskEdit): AppThunkAction<KnownAction> => async (dispatch, getState) =>{

        await fetch(`MyTask/AddSubTask`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(EditTask)
        })
        .then(responce => {
            return responce.ok ? responce.json() as Promise<RsponceData> : Promise.reject(responce)
        })
        .then(data =>{
            console.log("responce data : ",data)
            console.log("responce : ",data.message)
            dispatch({ type: 'RECEIVE_TASK', tasks: data.data });
        })
        .catch(e=>{
            return e.json() as Promise<ErrorData>;
        })
        .then(data => {
            let error = data as ErrorData;
            if(error != undefined)
            {
                error.type = "addSubTask"
                dispatch({type: 'RECEIVE_ERROR',error: error});
            }
        })

        //debugger;
      
    },
    requestRemoveTask: (EditTask:ITaskEdit): AppThunkAction<KnownAction> => async (dispatch, getState) =>{

        await fetch(`MyTask/DeleteTask`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "DELETE",
            body: JSON.stringify(EditTask.currentTask)
        })
        .then(responce => {
            return responce.ok ? responce.json() as Promise<RsponceData> : Promise.reject(responce)
        })
        .then(data =>{
            dispatch({ type: 'RECEIVE_TASK',tasks: data.data });
        })
        .catch(e=>{
            return e.json() as Promise<ErrorData>;
        })
        .then(data => {
            let error = data as ErrorData;
            if(error != undefined)
            {
                error.type = "remove"
                dispatch({type: 'RECEIVE_ERROR',error: error});
            }
        })
    },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: TaskState = { tasks: [], isLoading: false };

export const reducer: Reducer<TaskState> = (state: TaskState | undefined, incomingAction: Action): TaskState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_TASK':
            return {
                tasks: state.tasks,
                isLoading: true,
                error: undefined
            };
        case 'RECEIVE_NEW_TASK':
                //debugger;
                countTasks++;
                action.task.uniqueId = countTasks;
                return {
                    tasks: [...state.tasks, action.task],
                    isLoading: false,
                    error: undefined
                };
        case 'RECEIVE_TASK':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            countTasks = 0;
            setUniqueId(action.tasks)
            
            return {
                tasks: action.tasks,
                isLoading: false,
                error: undefined
            }
        case 'RECEIVE_ERROR':
        {
            return {
                tasks: state.tasks,
                isLoading: false,
                error: action.error
            }
        }
    }

    return state;
};

let countTasks = 0;

const setUniqueId = (actionTasks: Task[]) => {
    actionTasks.map((item,index)=> {
        countTasks++;
        item.uniqueId = countTasks;
        setUniqueId(item.myTasks);
    })
}