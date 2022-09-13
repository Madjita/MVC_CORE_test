import * as React from 'react';
import { useActions } from '../../store/hook/useActions';
import * as TaskStore from '../../store/Task';
import { useTypedSelector } from '../../store/useTypedSelector';
import Three from '../Three/Three';
import { FolderConteiner, RightDiv,LeftDiv,ErrorMessage } from './styled.js';
import TaskFolderHeader from './TaskFolderHeader';
import TaskFolderInfo from './TaskFolderInfo';

type Props = {
}


const TaskFolder:  React.FC<Props> = (props: Props) => {

    const {tasks,isLoading,error} = useTypedSelector(state => state.tasks)
    const {requestGetTasks} = useActions();

    const [selectedItem, setSelectedItem] = React.useState({
        state: new Object as TaskStore.Task,
        action: (item: TaskStore.Task) =>{
            setSelectedItem({...selectedItem, state: item})
        }
    })

    React.useEffect(()=>{
        requestGetTasks();
    },[])


   
    function initJsxError() {

        let jsxError = null;

        if(error)
        {
            switch(error.type)
            {
                case"remove":
                {
                    jsxError = (
                        <ErrorMessage>
                            Ошибка при удалении задачи. Задача не удаленна.
                        </ErrorMessage>
                    )
                    break;
                }
                case"add":
                {
                    jsxError = (
                        <ErrorMessage>
                            Ошибка при добавлении задачи. Задача не добавленна.
                        </ErrorMessage>
                    )
                    break;
                }
                case"get":
                {
                    jsxError = (
                        <ErrorMessage>
                            Ошибка при запросе задач. Задачи не загрузились.
                        </ErrorMessage>
                    )
                    break;
                }
                case"edit":
                {
                    jsxError = (
                        <ErrorMessage>
                            Ошибка при редактирование задачи. Задача не изменнена.
                        </ErrorMessage>
                    )
                    break;
                }
                case"addSubTask":
                {
                    jsxError = (
                        <ErrorMessage>
                            Ошибка при добавлении подзадачи. Подзадача не добавленна.
                        </ErrorMessage>
                    )
                    break;
                }
            }
        }
        
        return jsxError;

    }

    const [jsxError,setJsxError] = React.useState(initJsxError())

    React.useEffect(()=>{
        if(selectedItem != undefined)
        {
           console.log("check selectedItem when task update",selectedItem)

           let findSelectObjcet = (task: TaskStore.Task) => {

            if(task.uniqueId === selectedItem.state.uniqueId)
            {
                    console.log("FIND");
                    selectedItem.action(task);
                    return;
            }
            task.myTasks.map((item:TaskStore.Task)=>{
                findSelectObjcet(item);
            })
           }

           tasks.forEach(element => {
            findSelectObjcet(element);
           });
           
        }
    },[tasks])

    React.useEffect(()=>{
        if(error != undefined)
        {
            setJsxError(initJsxError());
            setTimeout( async () =>{
                await setJsxError(null);
            } , 3000);
        }
    },[error])

  

    const [showAddSudTaskDialog,setShowAddSudTaskDialog] = React.useState({
        state: false,
        type: "add",
        node: new Object as TaskStore.Task,
        action:(flag: boolean,type?: string,node?: TaskStore.Task) =>{
            showAddSudTaskDialog.state = flag
            if(type != null)
                showAddSudTaskDialog.type = type;
            if(node != null)
            {
                showAddSudTaskDialog.node = node;
            }
            setShowAddSudTaskDialog({...showAddSudTaskDialog})
        },
        
    });

    const handleShowAddSudTaskDialog = (type:string,node: TaskStore.Task) =>{
        showAddSudTaskDialog.action(!showAddSudTaskDialog.state,type,node)
    }

    const [showAddDialog,setShowAddDialog] = React.useState({
        state: false,
        type: "add",
        node: new Object as TaskStore.Task,
        action:(flag: boolean,type?:string,node?: TaskStore.Task) =>{
            showAddDialog.state = flag
            if(type != null)
            {
                showAddDialog.type = type as string
            }
            if(node != null)
            {
                showAddDialog.node = node;
            }
            setShowAddDialog({...showAddDialog})
        },
    });

    const handleOpenAddDialog = (type: string) =>{
        showAddDialog.type = type;
        showAddDialog.action(!showAddDialog.state)
    }

    React.useEffect(()=>{

        if(showAddSudTaskDialog != undefined)
        {
            console.log("showAddDialog.type =",showAddSudTaskDialog.type)
            switch(showAddSudTaskDialog.type)
            {
                case"remove":
                {
                    if(selectedItem != null)
                    {
                        selectedItem.action(new Object as TaskStore.Task);
                    }
                    break;
                }
                case"add":
                {
                    if(selectedItem != null)
                    {
                        if(tasks.length > 0)
                            selectedItem.action(tasks[tasks.length-1]);
                    }
                    break;
                }
                default:
                    break;
            }
        }
    },[tasks])
   

    return (
        <div style={{ boxShadow: '0 .25rem .75rem rgba(2, 2, 2, 0.2)'}}>
            <TaskFolderHeader handleOpenAddDialog={handleOpenAddDialog}/>
            <FolderConteiner>
                <LeftDiv>
                    <Three 
                    treeProps={tasks}
                    selectedItem={selectedItem}
                    showAddDialog={showAddDialog}
                    showAddSudTaskDialog={showAddSudTaskDialog}
                    handleShowAddSudTaskDialog={handleShowAddSudTaskDialog}
                    isLoading={isLoading}
                    />
                </LeftDiv>
                <RightDiv>
                    {jsxError}
                    <TaskFolderInfo selectedItem={selectedItem} handleShowAddSudTaskDialog={handleShowAddSudTaskDialog}/>
                </RightDiv>
            </FolderConteiner>
        </div>
       
    )
}


export default TaskFolder;