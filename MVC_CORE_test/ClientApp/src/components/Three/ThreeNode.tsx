import { useEffect, useRef, useState } from "react";
import { Node,Wrapper,Inner,TreeWrapper,NoData, NodeRow, Arrow, IconWrapper, CheckboxWrapper, ArrowFiller, NodeName } from "./styled";
import * as TaskStore from '../../store/Task';
import { Button, Checkbox } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DialogNode from "../Dialog/DialogNode";
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DoneIcon from '@mui/icons-material/Done';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

type Props = {
    node: TaskStore.Task;
    handleExpandCollapse: any;
    showAddSudTaskDialog: any;
    handleShowAddSudTaskDialog: any;
    countItemTree: number;
    isExpanded: boolean;
    showRightIcon: boolean;
    selectedItem?: {
        state: TaskStore.Task;
        action: (item: TaskStore.Task) => void;
    }
    buildTree: any;
}

const ThreeNode:  React.FC<Props> = (props: Props) => {

    const {
        node,
        handleExpandCollapse,
        handleShowAddSudTaskDialog,
        countItemTree,
        isExpanded,
        showRightIcon,
        selectedItem,
        buildTree,
    } = props;


    let iconInit = () =>{

        let jsxIcon = null;
        switch(node.statusTask)
        {
            case 0:
                jsxIcon = (
                    <QuestionMarkIcon/>
                )
            break;
            case 1:
                jsxIcon = (
                    <PlayArrowIcon style={{color: 'green'}}/>
                )
            break;
            case 2:
                jsxIcon = (
                    <PauseIcon style={{color: 'orange'}}/>
                )
            break;
            case 3:
                jsxIcon = (
                    <DoneIcon style={{color: 'green'}}/>
                )
            break;
            
           
        }

        return jsxIcon;
    }

    const [icon,setIcon] = useState(iconInit());


    useEffect(()=>{
        setIcon(iconInit())
    },[node.statusTask])

    return (
        <Node
          key={countItemTree}
          isExpanded={isExpanded}
          hasVerticalLine={true}
         
        >
        <NodeRow 
        
        isSelected={selectedItem ? selectedItem.state.uniqueId === node.uniqueId : false}
        >
        {
            showRightIcon ? 
            <ChevronRightIcon 
            id={countItemTree.toString()}
            onClick={handleExpandCollapse}
            style={{
                cursor: 'pointer',
                transform: `rotate(${isExpanded ? 90 : 0 }deg)`,
                transition: 'transform 0.1s linear'
            }}/>
            :
            <div style={{padding:'13px'}}>

            </div>
        }

        {/*<IconWrapper>
        {countItemTree}
        </IconWrapper>
        */}
        <IconWrapper
        onClick={()=>{
            selectedItem!.action(node)
        }}
        >
        {node.name}
        </IconWrapper>
        <IconWrapper>
            {icon}
        </IconWrapper>
        {/*<IconWrapper flexGrow={5}>
        {node.dateTimeRegister}
        </IconWrapper>
        <IconWrapper>
        {node.descriptions || "empty"}
        </IconWrapper>
        <IconWrapper >
            {node.users || "empty"}
        </IconWrapper>
        <IconWrapper>
            {node.plannedTime.toString() +" / "+ node.finishTime.toString()}
        </IconWrapper>
        <IconWrapper>
            {TaskStore.Status[node.statusTask] || "empty"}
        </IconWrapper>
        <IconWrapper>
            <Button
            onClick={()=> handleShowAddSudTaskDialog("edit",node)}
            >
                Edit Task
            </Button>
        </IconWrapper>
        <IconWrapper>
            <Button
            onClick={() => handleShowAddSudTaskDialog("addSubTask",node)}
            >
                Add subTask
            </Button>
           
        </IconWrapper>
        <IconWrapper>
            <Button
            onClick={()=> handleShowAddSudTaskDialog("remove",node)}
            >
                Remove Task
            </Button>
        </IconWrapper>*/}
        </NodeRow>

    {node.myTasks ? buildTree(node.myTasks) : null}
    </Node>
    )
}

export default ThreeNode;