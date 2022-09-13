import styled from 'styled-components'


export const FolderConteiner = styled.div`
 display: flex;
`


export const LeftDiv = styled.div`
font-size: 14px;
overflow: auto;
height: calc(100vh - (100vh/2)/3);
`


export const RightDiv = styled.div`
 width: 100%;
`

export const DataWrapper = styled.div`
  border-bottom: 1px solid #dee2e6 !important;
  box-shadow: 0 .25rem .75rem rgba(0, 0, 0, .05);
  flex-grow: ${({flexGrow}) => flexGrow ? flexGrow: '1'};
  display: flex;
  justify-content: space-around;
`

export const DataItem = styled.div`
  display: flex;
  border-bottom:  1px solid #dee2e6 !important;
`

export const DataItemValue = styled.div`
  flex: 1;
  text-align: center;
  word-wrap: anywhere;
`

export const FolderHEader = styled.div`
border-bottom: 1px solid #dee2e6 !important;
box-shadow: 0 .25rem .75rem rgba(0, 0, 0, .05);
height: 50px; 
`

export const ErrorMessage = styled.div`
background-color: red;
color: white;
`

export const ListView = styled.div`
  overflow: auto;
  height: 400px;
`