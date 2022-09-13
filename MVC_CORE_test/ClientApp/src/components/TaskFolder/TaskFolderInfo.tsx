import { Button, List, ListItem, ListItemText } from '@mui/material';
import * as React from 'react';
import { useActions } from '../../store/hook/useActions';
import * as TaskStore from '../../store/Task';
import { useTypedSelector } from '../../store/useTypedSelector';
import { IconWrapper } from '../Three/styled';
import Three from '../Three/Three';
import {
    DataItem,
    DataItemValue,
    ListView 
} from './styled.js';

type Props = {
    selectedItem: {
        state: TaskStore.Task;
        action: (item: TaskStore.Task) => void;
    };
    handleShowAddSudTaskDialog: (type: string, node: TaskStore.Task) => void;
}


const TaskFolderInfo:  React.FC<Props> = (props: Props) => {

    const {
        selectedItem,
        handleShowAddSudTaskDialog,
    } = props;

    if(selectedItem.state.name === undefined)
    {
        return (
           <div style={{padding: '30px'}}>
             <DataItem>
                <DataItemValue>
                    Задача не выбранна
                </DataItemValue>
            </DataItem>
           </div>
        )
    }

    return (
        <div style={{padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        }}>
               <DataItem>
                <DataItemValue>
                    Наименование задачи:
                </DataItemValue>
                <DataItemValue>
                    {selectedItem.state.name}
                </DataItemValue>
               </DataItem>
               <DataItem>
                <DataItemValue>
                    Описание задачи
                </DataItemValue>
                <DataItemValue>
                    {selectedItem.state.descriptions}
                </DataItemValue>
               </DataItem>
               <DataItem>
                <DataItemValue>
                    Список исполнителей 
                </DataItemValue>
                <DataItemValue>
                        {selectedItem.state.users}
                </DataItemValue>
                </DataItem>
               <DataItem>
                <DataItemValue>
                    Дата регистрации задачи в системе
                </DataItemValue>
                <DataItemValue>
                {new Date(selectedItem.state.dateTimeRegister).toLocaleString("ru")}
                </DataItemValue>
               </DataItem>
               <DataItem>
                <DataItemValue>
                        Статус задачи
                    </DataItemValue>
                    <DataItemValue>
                        {TaskStore.Status[selectedItem.state.statusTask]}
                </DataItemValue>
               </DataItem>
               <DataItem>
                <DataItemValue>
                        Плановая трудоёмкость задачи
                    </DataItemValue>
                    <DataItemValue>
                        {selectedItem.state.plannedTime + " ч"}
                </DataItemValue>
               </DataItem>
               <DataItem>
                <DataItemValue>
                        Фактическое время выполнения
                    </DataItemValue>
                    <DataItemValue>
                        {selectedItem.state.finishTime + " ч"}
                </DataItemValue>
               </DataItem>
               <DataItem>
                <DataItemValue>
                        Дата завершения
                    </DataItemValue>
                    <DataItemValue>
                        {selectedItem.state.dateTimeFinish ? new Date(selectedItem.state.dateTimeFinish).toLocaleString("ru"): ""}
                </DataItemValue>
               </DataItem>
               {
                handleShowAddSudTaskDialog ? 
                <React.Fragment>
                     <DataItem>
                        <DataItemValue>
                        </DataItemValue>
                        <DataItemValue>
                                <Button
                                onClick={()=>{
                                    handleShowAddSudTaskDialog("remove",selectedItem.state)
                                }}
                                >
                                    Удалить
                                </Button>
                        </DataItemValue>
                    </DataItem>

                    <DataItem>
                        <DataItemValue>
                        </DataItemValue>
                        <DataItemValue>
                                <Button
                                onClick={()=>{
                                    handleShowAddSudTaskDialog("edit",selectedItem.state)
                                }}
                                >
                                    Редактировать
                                </Button>
                        </DataItemValue>
                    </DataItem>
                    <DataItem>
                        <DataItemValue>
                        </DataItemValue>
                        <DataItemValue>
                                <Button
                                onClick={()=>{
                                    handleShowAddSudTaskDialog("addSubTask",selectedItem.state)
                                }}
                                >
                                    Добавить подзадачу
                                </Button>
                        </DataItemValue>
                    </DataItem>
                    {
                        selectedItem.state.myTasks.length > 0 ?
                        <React.Fragment>
                        <DataItem>
                            <DataItemValue>
                                    Количество подзадач
                                </DataItemValue>
                                <DataItemValue>
                                    {selectedItem.state.myTasks.length}
                            </DataItemValue>
                        </DataItem>
                        <ListView>
                        {
                            selectedItem.state.myTasks.map((item,index)=>{
                                return(
                                <DataItem key={index}>
                                    <DataItemValue>
                                             Подзадача
                                    </DataItemValue>
                                    <DataItemValue>
                                        {item.name}
                                    </DataItemValue>
                                 </DataItem>
                                )
                            })
                        }
                        </ListView>
                        </React.Fragment>    
                        :
                        null
                    }
                    
                    
                </React.Fragment>
                
                :
                null
               }
        </div>
    )
}


export default TaskFolderInfo;