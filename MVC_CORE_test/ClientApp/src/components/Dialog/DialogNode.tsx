import * as React from 'react';
import * as TaskStore from '../../store/Task';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import { useActions } from '../../store/hook/useActions';


type Props = {
    handleAdd?: any;
    openProps: {
        state: boolean;
        action: (flag: boolean) => void;
        type: string;
        node: TaskStore.Task;
    },
    selectedItem?: {
        state: TaskStore.Task;
        action: (item: TaskStore.Task) => void;
    }
    
}



const DialogNode:  React.FC<Props> = (props: Props) => {

    const {
        openProps,
        selectedItem,
    } = props;

 
    const [newTask,setNewTask] = React.useState<TaskStore.ITaskEdit>(()=>{

        let initTaskEdit = new Object as TaskStore.ITaskEdit;

        console.log("openProps = ",openProps.node)
        if(openProps.node !=null)
        {
            initTaskEdit.currentTask = openProps.node;

            switch(openProps.type)
            {
              
                case "addSubTask":
                    initTaskEdit.task = new Object as TaskStore.Task;
                    break;
                
                case"remove":
                case "add":
                case "edit":
                    initTaskEdit.task = JSON.parse(JSON.stringify(openProps.node))
                    break;
            }
        }
        else
        {
            initTaskEdit.currentTask = new Object as TaskStore.Task;
            initTaskEdit.task = initTaskEdit.currentTask
        }
        

        return initTaskEdit;
    });

    const {
        requestCreateTasks,
        requestEditTasks,
        requestAddSubTask,
        requestRemoveTask
    } = useActions();
    
    React.useEffect(()=>{
        setNewTask(()=>{

            let initTaskEdit = new Object as TaskStore.ITaskEdit;

            if(openProps.node !=null)
            {
                initTaskEdit.currentTask = openProps.node;
    
                switch(openProps.type)
                {
                  
                    case "addSubTask":
                        initTaskEdit.task = new Object as TaskStore.Task;
                        break;
                    
                    case"remove":
                    case "add":
                    case "edit":
                        initTaskEdit.task = JSON.parse(JSON.stringify(openProps.node))
                        break;
                }
            }
            else
            {
                initTaskEdit.currentTask = new Object as TaskStore.Task;
                initTaskEdit.task = initTaskEdit.currentTask
            }
            
    
            return initTaskEdit;
        })
    },[openProps])

    const handleClose = () => {
        openProps!.action(false);
    };

    const handelKeyPress = (e: any) => {
        if(e.key === 'Enter')
        {
            handleAddClose();
        }
    }
    
    const handleAddClose =  () => {
        console.log("newTask ",newTask)
        if(newTask.task.name != '')
        {

            switch(openProps.type)
            {
              
                case "addSubTask":
                    requestAddSubTask(newTask);
                    break;
                case "add":
                    requestCreateTasks(newTask);
                    break;
                case "edit":
                    requestEditTasks(newTask);
                    break;
                case "remove":
                    requestRemoveTask(newTask);
                    break;
                default:
                    break;
            }
            
            openProps!.action(false);
        }
        else
        {
          alert("Вы ни чего не ввели")
        }
    };

    if(newTask.currentTask != null)
    {

        switch(openProps.type)
        {
            case"addSubTask":
            return (
                <Dialog open={openProps!.state} onClose={handleClose}>
                    <DialogTitle>Добавить под задачу к задаче: {newTask.currentTask.name}</DialogTitle>
                    <DialogContent>
                        <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="название"
                        type="name"
                        fullWidth
                        variant="standard"
                        value={newTask.task.name || ""}
                        inputProps={{ style: { textAlign: 'center' }}} 
                        onChange={e =>{
                            newTask.task.name = e.target.value;
                            setNewTask({...newTask})
                        }}
                        onKeyPress={handelKeyPress}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Отменить</Button>
                        <Button onClick={handleAddClose}>Добавить</Button>
                    </DialogActions>
                </Dialog>
            )
            case"remove":
            return (
                <Dialog open={openProps!.state} onClose={handleClose}>
                    <DialogTitle>Вы уверены что хотите удалить задачу: {newTask.currentTask.name}</DialogTitle>
                    <DialogActions>
                        <Button onClick={handleClose}>Нет</Button>
                        <Button onClick={handleAddClose}>Да</Button>
                    </DialogActions>
                </Dialog>
            )
            case"edit":
            return(
                <Dialog open={openProps!.state} onClose={handleClose}>
                <DialogTitle>Редактировать задачу: {newTask.currentTask.name}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="название"
                        type="name"
                        fullWidth
                        variant="standard"
                        value={newTask.task.name || ""}
                        inputProps={{ style: { textAlign: 'center' }}} 
                        onChange={e =>{
                            newTask.task.name = e.target.value;
                            setNewTask({...newTask})
                        }}
                    />
                     <TextField
                        autoFocus
                        margin="dense"
                        id="plan"
                        label="Пользователи"
                        type="name"
                        fullWidth
                        variant="standard"
                        value={newTask.task.users || ""}
                        inputProps={{ style: { textAlign: 'center' }}} 
                        onChange={e =>{
                            newTask.task.users = e.target.value;
                            setNewTask({...newTask})
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="plan"
                        label="Плановое время"
                        type="name"
                        fullWidth
                        variant="standard"
                        disabled={newTask.task.myTasks ? (newTask.task.myTasks.length > 0 ? true: false) : false}
                        value={newTask.task.plannedTime || ""}
                        inputProps={{ style: { textAlign: 'center' }}} 
                        onChange={e =>{
                            newTask.task.plannedTime = Number(e.target.value);
                            setNewTask({...newTask})
                        }}
                    />
                    <TextField
                        autoFocus
                        multiline
                        margin="dense"
                        id="descriptions"
                        label="Описание"
                        type="name"
                        fullWidth
                        variant="standard"
                        value={newTask.task.descriptions || ""}
                        inputProps={{ style: { textAlign: 'center' }}} 
                        onChange={e =>{
                            newTask.task.descriptions = e.target.value;
                            setNewTask({...newTask})
                        }}
                    />
                    <TextField
                        autoFocus
                        select
                        margin="dense"
                        id="status"
                        label="Статус"
                        type="select"
                        fullWidth
                        variant="standard"
                        value={TaskStore.Status[newTask.task.statusTask] || ""}
                        inputProps={{ style: { textAlign: 'center' }}} 
                        onChange={e =>{
                            newTask.task.statusTask = Number(TaskStore.Status[(e.target.value) as any])
                            setNewTask({...newTask})
                        }}
                    >
                            {
                                Object.values(TaskStore.Status)
                                .filter(x => Number.isNaN(Number(x)))
                                .map((item,index)=>{
                                    return (
                                        <MenuItem key={index} value={item}>
                                        {item}
                                        </MenuItem>
                                    )
                                })
                            }
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Отменить</Button>
                    <Button onClick={handleAddClose}>Редактировать</Button>
                </DialogActions>
            </Dialog>
            )
            default:
                break;

        }
    }

    return (
        <Dialog open={openProps!.state} onClose={handleClose}>
            <DialogTitle>Добавить новую задачу</DialogTitle>
            <DialogContent>
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label="название"
                type="name"
                fullWidth
                variant="standard"
                value={newTask.task.name || ""}
                inputProps={{ style: { textAlign: 'center' }}} 
                onChange={e =>{
                    newTask.task.name = e.target.value;
                    setNewTask({...newTask})
                }}
                onKeyPress={handelKeyPress}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Отменить</Button>
                <Button onClick={handleAddClose}>Добавить</Button>
            </DialogActions>
        </Dialog>
    )
}


export default DialogNode;