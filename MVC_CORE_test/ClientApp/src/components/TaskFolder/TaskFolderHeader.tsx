import { Button } from '@mui/material';
import * as React from 'react';
import { useActions } from '../../store/hook/useActions';
import * as TaskStore from '../../store/Task';
import { useTypedSelector } from '../../store/useTypedSelector';

import { FolderHEader } from './styled.js';

type Props = {
    handleOpenAddDialog: (type: string) => void;
}


const TaskFolderHeader:  React.FC<Props> = (props: Props) => {

    const {
        handleOpenAddDialog,
    } = props;

    return (
        <FolderHEader>
        <Button
        style={{float: 'right'}}
        onClick={()=>handleOpenAddDialog("add")}
        >
            Добавить задачу
        </Button>
        </FolderHEader>
    )
}


export default TaskFolderHeader;