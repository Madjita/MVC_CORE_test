import { useRef, useState } from "react";
import { Node,Wrapper,Inner,TreeWrapper,NoData, NodeRow, Arrow, IconWrapper, CheckboxWrapper, ArrowFiller, NodeName } from "./styled";
import * as TaskStore from '../../store/Task';
import { Button, Checkbox } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DialogNode from "../Dialog/DialogNode";
import ThreeNode from "./ThreeNode";


type Props = {
    treeProps: TaskStore.Task[];
    selectedItem?: {
        state: TaskStore.Task;
        action: (item: TaskStore.Task) => void;
    };
    showAddDialog?: {
        state: boolean;
        type: string;
        node: TaskStore.Task;
        action: (flag: boolean, type?: string, node?: TaskStore.Task) => void;
    };
    showAddSudTaskDialog?: {
        state: boolean;
        type: string;
        node: TaskStore.Task;
        action: (flag: boolean, type?: string, node?: TaskStore.Task) => void;
    };
    handleShowAddSudTaskDialog?: (type: string, node: TaskStore.Task) => void;
    isLoading?: boolean;
}

const Three:  React.FC<Props> = (props: Props) => {

    const {
        treeProps,
        selectedItem,
        showAddDialog,
        showAddSudTaskDialog,
        handleShowAddSudTaskDialog,
        isLoading,
    } = props;

    const [ expandedNodes, setExpandedNodes ] = useState<number[]>([])
    
    const handleExpandCollapse = (e: any) => {
        !expandedNodes.includes(+e.currentTarget.id)
          ? setExpandedNodes([ ...expandedNodes, +e.currentTarget.id ])
          : setExpandedNodes(expandedNodes.filter((x) => x !== +e.currentTarget.id))
    }

    const buildTree = (_tree: TaskStore.Task[]) => {
        const mappedNodes = _tree.map((node: TaskStore.Task) =>{
            const isExpanded = expandedNodes.includes(node.uniqueId)
            const showRightIcon = node.myTasks ? (node.myTasks.length > 0 ? true : false) : false
            
            return (
                <ThreeNode
                key={node.uniqueId}
                node= {node}
                handleExpandCollapse={handleExpandCollapse}
                showAddSudTaskDialog={showAddSudTaskDialog}
                handleShowAddSudTaskDialog={handleShowAddSudTaskDialog}
                countItemTree={node.uniqueId}
                isExpanded={isExpanded}
                showRightIcon={showRightIcon}
                selectedItem={selectedItem}
                buildTree={buildTree}
                />
            )
        })

        return mappedNodes;
    }

    if(isLoading)
    {
        return <span>Loading...</span>;
    }

    return (
    <Wrapper>
      <Inner>
        <TreeWrapper>
          {treeProps.length
            ? buildTree(treeProps)
            : <NoData>Нет данных</NoData> 
          }
        </TreeWrapper>
        {showAddDialog ? <DialogNode openProps={showAddDialog} selectedItem={selectedItem}/> : null}
        {showAddSudTaskDialog ? <DialogNode openProps={showAddSudTaskDialog} selectedItem={selectedItem}/> : null}
      </Inner>
    </Wrapper>
    )
}

export default Three;